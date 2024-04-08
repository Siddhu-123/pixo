import React,{useState,useEffect} from 'react';
import Groupcards from './groupcards';
import axios from 'axios';
export const Cards = ({heading,type, category,address}) => {
    const [translateValue, setTranslateValue] = useState(0);
    const [num,setnum] = useState(0);
    const noright = (num) => {
        setnum(num);
    };
    const handleButtonClick1 = (buttonValue) => {
        if (window.innerWidth > 650) {
            setTranslateValue(buttonValue*0);
        }
        else{
            const newvalue1 = translateValue + buttonValue;
            if(newvalue1 <= 0){
                setTranslateValue(translateValue + buttonValue);
            }
        }
    };
    const handleButtonClick2 = (buttonValue) => {
        if (window.innerWidth > 650 && num > 6) {
            setTranslateValue(buttonValue*2);
        }
        else{
            const newvalue2 = translateValue + buttonValue;
            if(newvalue2 > -100 && num > 6){
                setTranslateValue(translateValue + buttonValue);
            }
            else if(newvalue2 > -60 && num > 4){
                setTranslateValue(translateValue + buttonValue);
            }
            else if(newvalue2 > -40 && num > 2){
                setTranslateValue(translateValue + buttonValue);
            }
        }
    };
    const [combinedData, setcombineddata] = useState([]);
    const [decide, setdecide] = useState(true);
    
    useEffect(() => {
      const fetchData = async () => {
          try {
            if(address){
              const collectionsResponse = await axios.get('http://localhost:5000/collection');
              const collectionsData = collectionsResponse.data.data;
              const addressCollectionsMap = [];
  
              collectionsData.forEach(collection => {
                  if (collection.address !== address && (category === "All" || collection.category === category)) {
                    addressCollectionsMap.push(collection);
                  }
              });
              const nftsResponse = await axios.get('http://localhost:5000/nfts');
              const nftsdata = nftsResponse.data.data;
              
              const flattenedCollections = [];
              var tempfloor = [];
              var tolvol = 0;
              var temp = {};
              addressCollectionsMap.forEach(collection => {
                temp={};
                tempfloor = [];
                collection.nfts.forEach(nft => {
                  const nft1 = nftsdata.find(item => item._id === nft);
                  if(nft1.transaction[nft1.transaction.length - 1].event !== "offer"){
                    const nftprice = nft1.transaction[nft1.transaction.length - 1].price;
                    tempfloor.push(nftprice);
                  }
                });
                temp = collection;
                if(tempfloor.length !== 0){
                    temp["floor"] = tempfloor.sort()[0];
                    tolvol = tempfloor.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                    temp["tolvol"] = Number(tolvol.toFixed(4));
                }
                flattenedCollections.push(temp);
              });
              setcombineddata(flattenedCollections);
              setdecide(true);
            }
            
          } catch (error) {
          console.error('Error fetching NFT data:', error);
          }
        };
        
        fetchData();
    }, [address,category]);
    return (
        <div className="cardsmain">
            <div className='txtcontrols'>
                <p>{heading}</p>
                <div className='controls'>
                    <div className='left' onClick={() => handleButtonClick1(25)}>{"<"}</div>
                    <div className='right' onClick={() => handleButtonClick2(-25)}>{">"}</div>
                </div>
            </div>
            
            <Groupcards type={type} address={address} decide={decide} style={{ transform: `translateX(${translateValue}%)` }} noright={noright} combinedData={combinedData}/>
        </div>
    );
}
export default Cards;