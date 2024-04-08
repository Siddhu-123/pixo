import React,{useState,useEffect} from 'react';
import axios from 'axios';
import Collections from './collections';
function Topcrea({topclick}){
  const seeall = () => {
    topclick();
  };
  const [colldata,setcolldata] = useState([]);
    useEffect(() => {
      const fetchData = async () => {
        try {
            const address = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const collResponse = await axios.get('http://localhost:5000/collection');
            const collData = collResponse.data.data;
            const nftResponse = await axios.get('http://localhost:5000/nfts');
            const nftData = nftResponse.data.data;
            const userResponse = await axios.get('http://localhost:5000/userinfo');
            const userData = userResponse.data.data;
            if(address[0].length){
                var foundCollData = collData.filter(item => item.address !== address[0]);
            }
            else{
                var foundCollData = collData;
            }
            var floor = [];
            var temp2 = 0;
            var collsdata = [];
            var temp3 = {};
            var tolvol = 0;
            foundCollData.forEach(coll => {
                floor = [];
                temp3 = {};
                coll.nfts.forEach(nft => {
                    temp2 = 0;
                    var temp = nftData.find(item => item._id === nft);
                    temp.transaction.forEach(transaction => {
                        if(transaction.event !== "offer"){
                            temp2 = transaction.price;
                        }
                    });
                    floor.push(temp2);
                });
                var username = userData.find(item => item._id === coll.address);
                temp3["id"] = coll._id;
                temp3["image"] = coll.image;
                temp3["name"] = coll.name;
                temp3["username"] = username.username;
                var temp4 = 0.000001;
                temp3["floor"] = floor.sort()[0] || temp4.toFixed(4);
                tolvol = floor.reduce((acc, curr) => acc + curr, 0);
                temp3["vol"] = tolvol.toFixed(4);
                collsdata.push(temp3);
            });
            collsdata.sort((a, b) => {
              return b.vol - a.vol;
            });
            if(collsdata.length){
                setcolldata(collsdata);
            }                
        } catch (error) {
            console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);
  return (
  <div className='topcrea'>
    <div className='text'>
      <p>Trending Collections</p>
      <p onClick={seeall}>See all{">"}</p>
    </div>
    <div className='topscroll'>
      <div className='collect'>
      {colldata.map((coll,index) => {
          return (
            <Collections key={index} imgg={coll.image} name={coll.name} username={coll.username} num={coll.floor} per={coll.vol} id={coll.id} />
          );
        })}
      </div>
    </div>
  </div>
  );
}
export default Topcrea;