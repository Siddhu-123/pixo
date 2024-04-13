import React from 'react';
import '../../../../css files/search.css';
import {Link} from 'react-router-dom';
const Nftcard = ({id,imgg,name,dis}) => {
    const discri = dis.substring(0,100);
  return(
    <div className="nftcard">
      <Link to={`/Assets/${id}`}>
        <img src={require(`../../../../image/nft/${imgg}`)}/>
      </Link>
      <div className="sidetext">
        <p>{name}</p>
        <p>{discri}</p>
      </div>
    </div>
  );
}

export default Nftcard;
