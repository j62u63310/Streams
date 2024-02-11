import React, { useState } from 'react';
import "../Style/Home.css"
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
                offline_image_url:userResponse.data.data[0].offline_image_url,
                profileImageUrl: userResponse.data.data[0].profile_image_url,
                displayName: userResponse.data.data[0].display_name,
                description: userResponse.data.data[0].description || "N/A",
                title: streamResponse.data.data[0] ? streamResponse.data.data[0].title : "N/A",
                isLive: !!streamResponse.data.data[0],
                viewerCount: streamResponse.data.data[0] ? streamResponse.data.data[0].viewer_count : null,
                thumbnail_url:  streamResponse.data.data[0] ? streamResponse.data.data[0].thumbnail_url.replace('{width}', '430').replace('{height}', '200') : null,
                gameName: streamResponse.data.data[0] ? streamResponse.data.data[0].game_name : null
            }])
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }


    return (
        <div>
            <div className="window"></div>
            <h1>Twitch 實況主</h1>
            <div className="search-container">
                <label>
                    <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)}
                           placeholder="輸入Twtich使用者名稱"/>
                </label>
                <button onClick={fetchData}>搜尋</button>
            </div>
            <div className={`card ${userData.length > 0 && userData[0].isLive ? 'live' : 'offline'}`}>
                <ul className="streams">
                    {userData.map((data, index) => (
                        <li key={index}>
                            <img className="user-info" src={data.profileImageUrl} alt="Profile"/>
                            <div className="data">
                                <p>名字: {data.displayName}</p>
                                <p>簡介: {data.description}</p>
                                <p>標題: {data.title}</p>
                                <p>是否開台: {data.isLive ? '是' : '否'}</p>
                                <p>觀看人數: {data.viewerCount !== null ? data.viewerCount : 'N/A'}</p>
                                <p>遊戲: {data.gameName !== null ? data.gameName : 'N/A'}</p>
                            </div>
                            {data.isLive ? (
                                <img className={`card-info ${userData.length > 0 && userData[0].isLive ? 'live' : 'offline'}`} src={data.thumbnail_url} alt="直播縮圖"/>
                            ) : (
                                <img className={`card-info ${userData.length > 0 && userData[0].isLive ? 'live' : 'offline'}`} src={data.offline_image_url} alt="離線圖"/>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Home;