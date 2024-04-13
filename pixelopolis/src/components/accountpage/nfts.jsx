import React,{useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

const NFTSacc = ({imgg,name,dis,address,id,decide}) => {
    const [fillColor, setFillColor] = useState('#00000000');
    const [likes,setlikes] = useState([]);
    useEffect(() => {
        const fetchNftData = async () => {
          try {
            const nftcoll = await axios.get('http://localhost:5000/nfts');
            const nftData = nftcoll.data.data;
            const nft = nftData.find(item => item._id === id);
            setlikes(nft.likes);
        } catch (error) {
          console.error('Error fetching NFT data:', error);
        }
    };
    fetchNftData();
    }, [address]);
    useEffect(() => {
        if (likes.includes(address)) {
            setFillColor('#ff0000');
        } else {
            setFillColor('#00000000');
        }
      }, [likes, address]);
    const likeinfo = {_id: id,like: address};
    const clicks = () => {
      if (fillColor === '#00000000'){
        setFillColor('#ff0000');
        likebutton();
      }
      else {
        setFillColor('#00000000');
        notlikebutton();
      }
    }
    const likebutton = async (e) => {
      try {
          await axios.post('http://localhost:5000/like', likeinfo);
      } catch (error) {
          console.error('Error updating data:', error);
      }
    };
    const notlikebutton = async (e) => {
      try {
          await axios.post('http://localhost:5000/notlike', likeinfo);
      } catch (error) {
          console.error('Error updating data:', error);
      }
    };
    var discription = dis.substring(0,70);
    return (
        <div className='cardcol'>
            <Link to={`/Assets/${id}`}>
                <div className="image">
                  <div className="peel"></div>
                  <div className="peelshadow"></div>
                  <p className='text2'>Explore NFT</p>
                  <div className="peelbarshadow"></div>
                  <img src={require(`../../image/nft/${imgg}`)} alt= "nft"/>
                </div>
            </Link>
            <div className='text'>
                <div className='favheart'>
                    <div className='name'>{name}</div>
                    {decide ? (
                      <div className="heart" onClick={clicks}>
                          <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.88659 16.6603L8.88587 16.6596C6.30104 14.3157 4.19578 12.4033 2.73088 10.6111C1.27148 8.82559 0.5 7.22062 0.5 5.5C0.5 2.68674 2.69555 0.5 5.5 0.5C7.08885 0.5 8.62206 1.24223 9.62058 2.40564L10 2.84771L10.3794 2.40564C11.3779 1.24223 12.9112 0.5 14.5 0.5C17.3045 0.5 19.5 2.68674 19.5 5.5C19.5 7.22062 18.7285 8.82559 17.2691 10.6111C15.8042 12.4033 13.699 14.3157 11.1141 16.6596L11.1134 16.6603L10 17.6738L8.88659 16.6603Z" fill={fillColor} stroke="white"/>
                          </svg>
                      </div>
                    ):(<></>)}
                </div>
                <div className='nftname'>{discription}</div>
            </div>
        </div>
    );
}
export default NFTSacc;