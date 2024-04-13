import React, { useState, useEffect } from "react";
import '../../../../css files/dashboard/settings.css';
import Wand from '../../leftsidebar/wand';
import axios from 'axios';

const Settings = ({ address }) => {
    const [num, setNum] = useState(false);
    const [userData, setUserData] = useState({
        name: "",
        username: "",
        bio: "",
        email: "",
        instagram: "",
        twitter: "",
        website: ""
    });

    const fetchData = async () => {
        try {
            const nftsResponse = await axios.get('http://localhost:5000/userinfo');
            const nftsData = nftsResponse.data.data;
            const foundUserData = nftsData.find(item => item._id === address);
            if (foundUserData) {
                setUserData(foundUserData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const [updatenoti,setupdatenoti] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/updateUserInfo', userData);
            setupdatenoti(true);
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };
    if(updatenoti){
        setTimeout(() => {
            setupdatenoti(false);
        }, 5000);
    }
    return (
        <div className="mainsettings1">
            <div className='settings'>
                <div className="heading">
                    <p>Settings</p>
                    <Wand/>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='setprofilesec'>
                        <div className="swift">
                            <p>Profile Info</p>
                            <p onClick={() => setNum(!num)}>+</p>
                        </div>
                        {num && (
                            <>
                                <div className="proname">
                                    <p>Display Name (Nickname)</p>
                                    <input type="text" name="name" placeholder='e.g."Steve Rogers"' value={userData.name} onChange={handleChange} />
                                </div>
                                <div className="proname">
                                    <p>Username</p>
                                    <input type="text" name="username" placeholder='e.g."@Steve Rogers"' value={userData.username} onChange={handleChange} />
                                </div>
                                <div className="proname">
                                    <p>Bio</p>
                                    <input type="text" name="bio" placeholder='e.g. "Im curious and creative NFT collector and creator"' value={userData.bio} onChange={handleChange} />
                                </div>
                                <div className="proname">
                                    <p>Email</p>
                                    <input type="text" name="email" placeholder='e.g. "...@gmail.com"' value={userData.email} onChange={handleChange} />
                                </div>
                                <br></br>
                                <br></br>
                                <div className="swift">
                                    <p>Social Links</p>
                                </div>
                                <span>Add your existing social links to build a stronger reputation</span>
                                <div className="proname">
                                    <p>Instagram</p>
                                    <input type="text" name="instagram" placeholder='e.g."https://www.instagram.com/madeihow/"' value={userData.instagram} onChange={handleChange} />
                                </div>
                                <div className="proname">
                                    <p>X (Twitter)</p>
                                    <input type="text" name="twitter" placeholder='e.g. "https://twitter.com/Steve"' value={userData.twitter} onChange={handleChange} />
                                </div>
                                <div className="proname">
                                    <p>Website</p>
                                    <input type="text" name="website" placeholder='e.g."https://"' value={userData.website} onChange={handleChange} />
                                </div>
                                <div className='createitem'>
                                    <button type="submit">Update</button>
                                </div>
                                {updatenoti ? (
                                    <p>Updated Successfully</p>
                                ):(<></>)}
                            </>
                        )}
                    </div>
                </form>
                <div className='setprofilesec'>
                    <p>Account</p>
                    <div className="proname">
                        <p>Danger zone</p>
                        <span>Once you delete your account, there is no going back. Please be certain.</span>
                    </div>
                    <div className='deleteacc'>
                        <button>Delete Account</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;