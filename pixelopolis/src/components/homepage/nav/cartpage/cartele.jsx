import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

const Cartele = ({imgg,name,collname,price,id,address,updated}) => {
  if(!imgg){
    var imagepath = "images.png";
  }
  else{
    var imagepath = imgg;
  }
  const cartinfo = {id: id,address: address};
  const removefromcart = async (e) => {
    try {
      const response = await axios.post('http://localhost:5001/removefromcart', cartinfo);
      if (response.data.message === 'removed') {
        updated(Math.random());
      }
    } catch (error) {
        console.error('Error updating data:', error);
    }
  };
  return(
    <div className="cartele">
      <Link to={`/Assets/${id}`}>
        <img src={require(`../../../../image/nft/${imagepath}`)} alt='nft'/>
      </Link>
      <div className="combine">
          <div className="middle">
            <p>{name}</p>
            <p>{collname}</p>
          </div>
          <div className="last">
            <div onClick={removefromcart} className='smallbuy'>
              <svg width="16" height="3" viewBox="0 0 16 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1.5H15" stroke="white" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <p>{price} ETH</p>
          </div>
      </div>
    </div>
  );
}

export default Cartele;