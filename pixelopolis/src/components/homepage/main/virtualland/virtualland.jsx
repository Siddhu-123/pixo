import React, { useState,useEffect } from "react";
import '../../../../css files/dashboard/virtualland.css';
import NFT from './nft';
import axios from 'axios';

const Virtualland = () =>{
    const [nftsdata,setnftsdata] = useState([]);
    const fetchData = async () => {
        try {
            const nftsResponse = await axios.get('http://localhost:5001/nfts');
            const nftsData = nftsResponse.data.data;
            const nfts = nftsData.sort(() => Math.random() - 0.5);
            if (nfts) {
                setnftsdata(nfts);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    return(
        <div className="mainsettings">
            <div className='virtuallandpage'>
                <div className="heading">
                    <p>Explore The World of NFT's</p>
                </div>
                <div className="imagegrid">
                    {nftsdata.map((item, index) => (
                        <NFT
                            key={index}
                            imgg={item.image}
                            id={item._id}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
export default Virtualland;