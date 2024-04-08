import React ,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

const Cardacc = ({imgg,name,floor,tolvol,id,decide}) => {
    const [fillColor, setFillColor] = useState('#00000000');
    const [likes,setlikes] = useState([]);
    const [randomNumber, setRandomNumber] = useState(null);
    const [address, setAddress] = useState("");

    const checkMetaMaskConnection = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAddress(accounts[0]);
            } catch (error) {
                console.error(error);
            }
        }
    };
    useEffect(() => {
        checkMetaMaskConnection();
    }, [randomNumber]);

    window.onload = () => setRandomNumber(Math.floor(Math.random() * 100) + 1);

    useEffect(() => {
        const fetchNftData = async () => {
          try {
            const nftcoll = await axios.get('http://localhost:5000/collection');
            const collData = nftcoll.data.data;
            const collection = collData.find(item => item._id === id);
            setlikes(collection.likes);
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
          await axios.post('http://localhost:5000/colllike', likeinfo);
      } catch (error) {
          console.error('Error updating data:', error);
      }
    };
    const notlikebutton = async (e) => {
      try {
          await axios.post('http://localhost:5000/collnotlike', likeinfo);
      } catch (error) {
          console.error('Error updating data:', error);
      }
    };
    return (
        <div className='cardcol'>
            <Link to={`/collection/${id}`}>
                <div className="image">
                    <img src={require(`../../image/coll/${imgg}`)} alt='collection'/>
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
                <div className='specs'>
                    <div className='floor'>
                        <p>Floor</p>
                        <span>{floor}ETH</span>
                    </div>
                    <div className='vol'>
                        <p>Total volume</p>
                        <span>{tolvol}ETH</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Cardacc;