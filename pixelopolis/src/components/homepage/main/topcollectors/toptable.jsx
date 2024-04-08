import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
const Cell = ({ ind, imgg, name, coll, num, followers,address }) => {
  return (
    <div className="row">
      <div className="cell1">{ind + 1}</div>
      <div className="cell2">
          <Link to={`/${address}`}>
              <img src={require(`../../../../image/user/${imgg}`)} alt={name}  style={{ width: '4rem', borderRadius: '1rem' }} />
          </Link>
          <div className='name' style={{ paddingLeft: '1rem' }}>{name}</div>
      </div>
      <div className="cell3">{coll}</div>
      <div className="cell4">{num}</div>
      <div className="cell5">{followers}</div>
    </div>
  );
}

const Toptable = () => {
    const [userdata,setuserdata] = useState([]);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const address = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const nftsResponse = await axios.get('http://localhost:5000/userinfo');
          const nftsData = nftsResponse.data.data;
          if(address){
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
            temp2["name"] = user.name;
            temp2["coll"] = user.collections.length;
            temp2["num"] = temp1;
            temp2["followers"] = user.followers.length;
            temp2["address"] = user._id;
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
        <div className="toptable">
        <h2>Top Collectors</h2>
            <div className="rowheader">
                <div className="cell1">#</div>
                <div className="cell2">Collector</div>
                <div className="cell3">Collection</div>
                <div className="cell4">Created</div>
                <div className="cell5">Followers</div>
            </div>
            <div className="rowscroll">
                <div className="rows">
                    {userdata.map((image, index) => (
                        <Cell key={index} ind={index} imgg={image.image} name={image.name} coll={image.coll} num={image.num} followers={image.followers} address={image.address}/>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Toptable;