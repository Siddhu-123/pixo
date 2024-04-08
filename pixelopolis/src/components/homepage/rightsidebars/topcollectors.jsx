import React,{useState,useEffect} from 'react';
import Collectors from './collectors';
import axios from 'axios';

function Trencoll({trendingclick}){
  const seeall = () => {
    trendingclick();
  };
  const [userdata,setuserdata] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const address = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const nftsResponse = await axios.get('http://localhost:5000/userinfo');
        const nftsData = nftsResponse.data.data;
        if(address[0]){
          var foundUserData = nftsData.filter(item => item._id !== address[0]);
        }
        else{
          var foundUserData = nftsData;
        }
        const collResponse = await axios.get('http://localhost:5000/collection');
        const collData = collResponse.data.data;
        const usersdata = [];
        foundUserData.forEach(user => {
          var temp1 = 0;
          user.collections.forEach(collections => {
            var temp = collData.find(item => item._id === collections);
            temp1=temp1 + temp.nfts.length;
          });
          var temp2 = {}
          temp2["id"] = user._id;
          temp2["image"] = user.profileimage;
          temp2["profile"] = user.name;
          temp2["name"] = user.username;
          temp2["num"] = temp1;
          usersdata.push(temp2);
        });

        usersdata.sort((a, b) => {
          return b.num - a.num;
        });

        if (usersdata) {
            setuserdata(usersdata);
        }
      } catch (error) {
          console.error('Error fetching data:', error);
      }
    };

  fetchData();
}, []);
  return (
  <div className='trencoll'>
    <div className='text'>
      <p>Top Collectors</p>
      <p onClick={seeall}>See all{">"}</p>
    </div>
    <div className='trenscroll'>
      <div className='collect'>
        {userdata.map((user,index) => {
          return (
            <Collectors key={index} imgg={user.image} profile={user.profile} name={user.name} address={user.id}/>
          );
        })}
      </div>
    </div>
  </div>
  );
}
export default Trencoll;