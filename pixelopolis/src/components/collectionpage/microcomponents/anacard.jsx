import React from 'react';
import '../../../css files/collpage.css';
import Timeago from './timeago';
import {Link} from 'react-router-dom';
const Anacard = ({id,imgg,name,time,eth,per}) => {
  return(
    <div className="anacard">
      <Link to={`/Assets/${id}`}>
        <img src={require(`../../../image/nft/${imgg}`)}/>
      </Link>
      <div className="combine">
          <div className="middle">
              <p>{name}</p>
              <Timeago timestamp={time}/>
          </div>
          <div className="last">
              <p>{eth} ETH</p>
              <p>+{per}%</p>
          </div>
      </div>
    </div>
  );
}

export default Anacard;
