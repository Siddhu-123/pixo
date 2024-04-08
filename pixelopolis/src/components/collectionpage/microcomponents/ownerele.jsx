import React from 'react';
import '../../../css files/collpage.css';
import {Link} from 'react-router-dom';
const Ownerele = ({key1,imgg,name,address,num,per}) => {
    const key = key1 + 1;
    var address1 = address.slice(0,7)+ '...' + address.slice(34,);

  return(
    <div className="ownerele">
        <div className="left">
            <p>{key}</p>
            <Link to={`/${address}`}>
              <img src={require(`../../../image/user/${imgg}`)}/>
            </Link>
              <p>{name}</p>
        </div>
        <div className="right">
            <p>{address1}</p>
            <p>{num}</p>
            <p>{per}%</p>
        </div>
    </div>
  );
}

export default Ownerele;