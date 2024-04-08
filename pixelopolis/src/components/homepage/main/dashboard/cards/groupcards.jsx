import React, { useState, useEffect } from 'react';
import Cardcol from '../../../../accountpage/cardacc';

const Groupcards = ({ style, type,noright,address,combinedData,decide}) => {
  const [collsdata, setCollsData] = useState([]);
  useEffect(() => {
    var sortedNftData = [];
    if (combinedData && combinedData.length > 0) {
      if(type == "category"){
        sortedNftData = combinedData;
      }else if(type == "high"){
        sortedNftData = combinedData.slice().sort((a, b) => {
          return b.tolvol - a.tolvol;
        });
      }else if(type == "liked"){
        sortedNftData = combinedData.slice().sort((a, b) => {
          return b.likes.length - a.likes.length;
        });
      }
      setCollsData(sortedNftData.slice(0, 8));
    }
  }, [combinedData]);
  useEffect(() => {
    if (combinedData.length){
      noright(combinedData.length);
    }
  }, [combinedData]);
  return (
    <div className='groupcards' style={style}>
      {collsdata.map((coll, index) => (
        <Cardcol key={index} imgg={coll.image} name={coll.name} floor={coll.floor} tolvol={coll.tolvol} address={address} id={coll._id} decide={decide} />
      ))}
    </div>
  );
};

export default Groupcards;