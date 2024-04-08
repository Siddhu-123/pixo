import React from 'react';
import '../../../css files/collpage.css';
const Eleslide = ({per,item}) => {
    const line1Style = {
        transform: `translateX(${per-100}%)`,
      };
  return(
    <div className="eleslide">
        <div className="text">
            <p>{per}%</p>
            <p>{item}</p>
        </div>
        <div className="slide">
            <div className="line1" style={line1Style}></div>
        </div>
    </div>
  );
}

export default Eleslide;
