import React from 'react';
import '../../../../css files/search.css';
import Follow from '../../rightsidebars/follow';
import {Link} from 'react-router-dom';
const Anacard = ({id,imgg,name,username,eth,per}) => {
  return(
    <div className="usercard">
      <Link to={`/${id}`}>
        <img src={require(`../../../../image/user/${imgg}`)}/>
      </Link>
      <div className="combine">
          <div className="middle">
              <p>{name}</p>
              <p>@{username}</p>
          </div>
          <div className="last">
            <Follow address={id}/>
          </div>
      </div>
    </div>
  );
}

export default Anacard;