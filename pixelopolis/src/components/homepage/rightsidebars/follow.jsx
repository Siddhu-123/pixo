import React,{useState,useEffect} from 'react';
import axios from 'axios';
function Follow({address}){
  const [followclick, setfollowclick] = useState(null);
  const [followers,setfollowers] = useState([]);
  const [infoarray,setinfoarray] = useState([]);
  const [myaddress,setmyaddress] = useState("");
  const fetchData = async () => {
    try {
      const myaddress = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setmyaddress(myaddress[0]);
      const userInfoResponse = await axios.get('http://localhost:5000/userinfo');
      const userInfoData = userInfoResponse.data.data;
      const infoarray = userInfoData.find(item => item._id === address);
      setinfoarray(infoarray);
      setfollowers(infoarray.followers);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
      fetchData();
  }, [address]);


  useEffect(() => {
      if (followers.includes(myaddress)) {
          setfollowclick(false);
      } else {
          setfollowclick(true);
      }
    }, [followers,address]);
  const clicked = () => {
      if(followclick) {
          setfollowclick(false);
          followbutton();
      }
      else{
          setfollowclick(true);
          unfollowbutton();
      }
  }
  const followinfo = {id: address,address: myaddress};
  const followbutton = async (e) => {
    try {
      const response = await axios.post('http://localhost:5000/follow', followinfo);
      if (response.data.message === 'success') {
          fetchData();
      }
    } catch (error) {
        console.error('Error updating data:', error);
    }
  };
  const unfollowbutton = async (e) => {
    try {
      const response = await axios.post('http://localhost:5000/unfollow', followinfo);
      if (response.data.message === 'success') {
      fetchData();
      }
    } catch (error) {
        console.error('Error updating data:', error);
    }
  };
  return (
  <div className='follow' onClick={clicked}>
        {followclick ? (
          <div className='first'>
            follow
          </div>
        ) : (
          <div className='second'>
            following
          </div>
        )}
  </div>
  );
}
export default Follow;