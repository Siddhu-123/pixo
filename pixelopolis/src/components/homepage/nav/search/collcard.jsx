import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../../css files/search.css';
import {Link} from 'react-router-dom';
const Collcard = ({id,imgg,name}) => {
  const [allcolldata, setAllCollData] = useState([]);
  const [alluserdata, setAllUserData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
    try {
        const nftsResponse = await axios.get('http://localhost:5000/nfts');
        const nftsData = nftsResponse.data.data;

        const collResponse = await axios.get('http://localhost:5000/collection');
        const collData = collResponse.data.data;
        const addressCollectionsMap = collData.find(item => item._id === id);

        var tempfloor = [];
        var tolvol = 0;
        var temp = {};

        temp = [];
        tempfloor = [];
        addressCollectionsMap.nfts.forEach(nft => {
            const nft1 = nftsData.find(item => item._id === nft);
            const nftprice = nft1.transaction[nft1.transaction.length - 1].price;
            tempfloor.push(nftprice);
            tolvol = tolvol + nftprice;
        });
        temp["floor"] = tempfloor.sort()[0] || 0;
        temp["tolvol"] = Number(tolvol.toFixed(4));
        setAllCollData(temp);

        const userResponse = await axios.get('http://localhost:5000/userinfo');
        const userData = userResponse.data.data;
        const userdata = userData.find(item => item._id === addressCollectionsMap.address);
        setAllUserData(userdata);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    };

    fetchData();
}, []);
  return(
    <div className="nftcard">
      <Link to={`/Collection/${id}`}>
        <img src={require(`../../../../image/coll/${imgg}`)}/>
      </Link>
      <div className="sidetextcoll">
        <div className="combine">
          <p>{name}</p>
          <p>@{alluserdata.username}</p>
        </div>
        <div className="combine">
          <p>floor: {allcolldata.floor} ETH</p>
          <p>Vol: {allcolldata.tolvol} ETH</p>
        </div>
      </div>
    </div>
  );
}

export default Collcard;
