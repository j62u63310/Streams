import React, { useState } from 'react';
import axios from 'axios';

function Home() {
    const [userName , setUserName] = useState([]);
    const [userData ,setUserData] = useState([]);
    const accessToken = process.env.REACT_APP_ACCESS_TOKEN;
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const fetchData = async () => {
        try {
            const streamResponse = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${userName}`,{
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Client-Id': clientId
                }
            });

            const userResponse = await axios.get(`https://api.twitch.tv/helix/users?login=${userName}`,{
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Client-Id': clientId
                }
            });
            if (streamResponse.status !== 200 || userResponse.status !== 200) throw new Error('Network response was not ok');
            setUserData([{
                profileImageUrl: userResponse.data.data[0].profile_image_url,
                displayName: userResponse.data.data[0].display_name,
                description: userResponse.data.data[0].description || "N/A",
                title: streamResponse.data.data[0] ? streamResponse.data.data[0].title : "N/A",
                isLive: !!streamResponse.data.data[0],
                viewerCount: streamResponse.data.data[0] ? streamResponse.data.data[0].viewer_count : null,
                gameName: streamResponse.data.data[0] ? streamResponse.data.data[0].game_name : null
            }])
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    return (
        <div>
            <h1>Twitch Streams</h1>
            <label>
                直播主：
                <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)}/>
            </label>
            <button onClick={fetchData}>搜尋實況主</button>
            <ul>
                {userData.map((data, index) => (
                    <li key={index}>
                        <img src={data.profileImageUrl} alt="Profile"/>
                        <div>
                            <p>名字: {data.displayName}</p>
                            <p>簡介: {data.description}</p>
                            <p>標題: {data.title}</p>
                            <p>是否開台: {data.isLive ? '是' : '否'}</p>
                            <p>觀看人數: {data.viewerCount !== null ? data.viewerCount : 'N/A'}</p>
                            <p>遊戲: {data.gameName !== null ? data.gameName : 'N/A'}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Home;