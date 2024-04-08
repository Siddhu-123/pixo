import React, {useState,useEffect} from 'react';
import "../../css files/carddetails.css";
import { useParams } from 'react-router-dom';
import Footer from '../homepage/main/dashboard/footer';
import Linegraph from './linegraph';
import Loading from '../loading';
import Timeleft from './timeleft';
import Timeago from '../collectionpage/microcomponents/timeago';
import NFTSacc from '../accountpage/nfts';
import EthereumToINR from './currency';
import Traits from './traits';
import {Link} from 'react-router-dom';
import axios from 'axios';

const CardDetails = ({address}) => {
  const { id } = useParams();
  const [nftdata,setnftdata] = useState([]);
  const [nftsdata,setnftsdata] = useState([]);
  const [allnftdata,setallnftdata] = useState([]);
  const [colldata,setcolldata] = useState(null);
  const [userdata,setuserdata] = useState(null);
  const [transactionlistnooffer,settransactionlistnooffer] = useState([]);
  const [randomNumber, setRandomNumber] = useState(null);
  const [expired,setexpired] = useState(false);
  const [likes,setlikes] = useState([]);
  const [nftaddress,setnftaddress] = useState("");
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  useEffect(() => {
  const fetchData = async () => {
    try {
      const nftsResponse = await axios.get('http://localhost:5000/nfts');
      const nftsData = nftsResponse.data.data;
      setallnftdata(nftsData);
      const nft = nftsData.find(item => item._id === id);
      setnftdata(nft);

      const nftcoll = await axios.get('http://localhost:5000/collection');
      const collData = nftcoll.data.data;
      const collection = collData.find(item => item._id === nft.collectionid);
      setcolldata(collection);

      const nftuser = await axios.get('http://localhost:5000/userinfo');
      const userData = nftuser.data.data;
      var user = userData.find(item => item._id === nft.address);
      setuserdata(user);

      const filteredNftsData = nftsData.filter(item => (item._id !== id && item.collectionid === nft.collectionid) );
      setnftsdata(filteredNftsData);
      
      const transactionlistnooffers1 = nft.transaction.filter(item => (item.event !== "offer") );

      settransactionlistnooffer(transactionlistnooffers1);
      setnftaddress(nft.address);
      
      
      setlikes(nft.likes);
      if(transactionlistnooffers1[transactionlistnooffers1.length -1]){
        const saleends = new Date(transactionlistnooffers1[transactionlistnooffers1.length -1].expirydate);
        const today = new Date();
        
        if (((saleends - today) < 0) ||( transactionlistnooffers1[transactionlistnooffers1.length -1].event === "sale")) {
          setexpired(true);
        }
      }

    } catch (error) {
      console.error('Error fetching NFT data:', error);
    }
  };
  
    fetchData();
  }, [id,randomNumber]);
  
  
  
  var str = "";
  var transaction = [];
  var transarray = [];
  var floor = [];
  var date2 = new Date();
  var nftslist=[];
  var cartlist = [];
  var viewc = 0;
  if(nftdata && colldata && userdata && transactionlistnooffer) {
    var imagepath =  require(`../../image/nft/${nftdata.image}`);
    var dis = nftdata.description;
    str = nftdata.traits;
    var collectionname = nftdata.collections;
    var collectionid = nftdata.collectionid;
    transaction = transactionlistnooffer[transactionlistnooffer.length -1];
    var month = months[transaction.expirydate.substring(6,7) -1];
    var day = transaction.expirydate.substring(8,10);
    var year = transaction.expirydate.substring(0,4);
    var time = transaction.expirydate.substring(11,16);
    var name0 = nftdata.name;
    var price = transactionlistnooffer[transactionlistnooffer.length -1].price;
    var category0 = colldata.category;
    var countlikes = likes.length;
    var username = userdata.username;
    var bio = userdata.bio;
    transarray = nftdata.transaction;
    var nftslist= colldata.nfts;
    cartlist = userdata.cart;
    viewc = nftdata.views;
  }

  for (let i = 0; i < nftslist.length; i++) {
    var nftt = allnftdata.find(item => item._id === nftslist[i]);
    floor.push(nftt.transaction[nftt.transaction.length -1].price);
  }
  const floor1 = floor.sort()[0];
  const [editlistprice,seteditlistprice] = useState(0);
  const [listforsaleprice,setlistforsaleprice] = useState(0);
  const [errorprice,seterrorprice] = useState("");
  const editlistpricechange = (e) => {
    if (e.target.value > floor1){
      seteditlistprice(e.target.value)
      seterrorprice("");
    }
    else{
      seterrorprice("enter price higher than the floor price");
    }
  };
  window.onload = () => setRandomNumber(Math.floor(Math.random() * 100) + 1);

  const listforsalepricechange = (e) => {
    if (e.target.value > floor1){
      setlistforsaleprice(e.target.value)
      seterrorprice("");
    }
    else{
      seterrorprice("enter price higher than the floor price");
    }
  };
  let listingdata = [];
  if (transaction.event === "listing"){
    listingdata.push(transaction);
  }

  let offersdata = [];

  if(transarray){
    transarray.forEach(transaction => {
      if (transaction.event === "offer"){
        offersdata.push(transaction);
      }
    });
  }


  let data11 = [];

  for (let i = 0; i < transarray.length; i++) {
    let tempObj1 = {};
    if(transarray[i].event === "listing" || transarray[i].event === "sale"){
      tempObj1["x"] = new Date(transarray[i].date);
      tempObj1["y"] = transarray[i].price;
      data11.push(tempObj1);
    }
  }

  let array1 = [];
  let array = str.split('_');
  
  for (let i = 0; i < array.length; i++) {
    let tempObj = {};
      let k = 0;
      for (let j = 0; j < array[i].length; j++) {
        if (array[i][j] === "-") {
          tempObj["title"] = array[i].substring(k, j);
          tempObj["name"] = array[i].substring(j + 1);
          array1.push(tempObj);
        }
      }
  }
  const [fillColor, setFillColor] = useState("#00000000");
  const [imgclick, setimgclick] = useState(true);
  const [listforsale, setlistforsale] = useState(true);
  const [listsalesuccess ,setlistsalesuccess] = useState("");
  const [editlisting, seteditlisting] = useState(true);
  const [editsuccess ,seteditsuccess] = useState(false);
  const [listed, setlisted] = useState(false);
  const [mine, setmine] = useState(false);
  const [changedate1, setchangedate] = useState(false);
  const [updatedate1, setupdatedate] = useState("");
  const [updatedate3, setupdatedate2] = useState("");
  const [cartbutton,setcartbutton] = useState(null);
  const [buynow, setbuynow] = useState(true);


  useEffect(() => {
    if (likes.includes(address)) {
        setFillColor('#ff0000');
    } else {
        setFillColor('#00000000');
    }
    if (cartlist.includes(id)) {
      setcartbutton(false);
    } else {
      setcartbutton(true);
    }
    if (transaction.event == "listing" && !expired) {
      setlisted(true);
    }
    if (address === nftdata.address){
      setmine(true);
    }
  }, [likes, address]);

  const fetchViewCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/nfts');
      const nftsData = response.data.data;
      const nft = nftsData.find(item => item._id === id);
      setViewCount(nft.views);
    } catch (error) {
      console.error('Error fetching view count:', error);
    }
  };
  const [viewCount, setViewCount] = useState(viewc);
  const incrementViewCount = async () => {
    try {
      setViewCount(prevCount => prevCount + 1);
      await axios.post('http://localhost:5000/updateviewcount', { views: viewCount + 1 ,_id: id});
    } catch (error) {
      console.error('Error updating view count:', error);
    }
  };

  useEffect(() => {
    fetchViewCount();
    incrementViewCount();
  }, []);

  const likeinfo = {_id: id,like: address};
  const click = () => {
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

  ///////////////////////////////////////////////////////////
  //clicking on the cart icon to add the nft to cart or to remove 

  const cartinfo = {id: id,address: address};
  const cartclick = () => {
    if (cartbutton){
      setcartbutton(false);
      addtocart();
    }
    else {
      setcartbutton(true);
      removefromcart();
    }
  }
  const addtocart = async (e) => {
    try {
        await axios.post('http://localhost:5000/addtocart', cartinfo);
    } catch (error) {
        console.error('Error updating data:', error);
    }
  };
  const removefromcart = async (e) => {
    try {
        await axios.post('http://localhost:5000/removefromcart', cartinfo);
    } catch (error) {
        console.error('Error updating data:', error);
    }
  };

//////////////////////////////////////////////////////////////

  const imageclick = () => {
    setimgclick(!imgclick);
  };
  const close = () => {
    setimgclick(!imgclick);
  };
  const buynowopen = () => {
    setbuynow(!buynow);
  };
  const buynowclose = () => {
    setbuynow(!buynow);
  };
  const editopen = () => {
    seteditlisting(!editlisting);
  };
  const editlistform = {};
  const editlistingclick = () => {
    editlistform["_id"] = id;
    editlistform["transactionid"] = transaction._id;
    editlistform["price"] = editlistprice;
    if (changedate1){
      editlistform["expirydate"] = updatedate1;
    }
    else{
      editlistform["expirydate"] = transaction.expirydate;
    }
    editlistform["date"] = date2;
    if(editlistform && editlistform.price > floor1){
      editlistingcontinue();
    }
  };

  const editlistingcontinue = async (e) => {
    try {
      await axios.post('http://localhost:5000/editlistingcontinue', editlistform);
      seteditsuccess(true);
      editcloseaftersuccess();
    } catch (error) {
        console.error('Error updating data:', error);
    }
  };

  const editcloseaftersuccess = () => {
    setTimeout(() => {
      seteditlisting(!editlisting);
    }, 5000);
  };
  const editclose = () => {
    seteditlisting(!editlisting);
  };
  const changedate = () => {
    setchangedate(!changedate1);
  };
  const updatedate = (e) => {
    setupdatedate(e.target.value);
  }
  const updatedate2 = (e) => {
    setupdatedate2(e.target.value);
  }
  const smallbuybutton = () => {
    if (listed){
      seteditlisting(!editlisting);
    }
    else{
      setlistforsale(!listforsale);
    }
  }
  const listforsaleclose = () => {
    setlistforsale(!listforsale);
  };
  const listforsaleform = {};
  const listforsaleclick = () => {
    listforsaleform["_id"] = id;
    listforsaleform["event"] = "listing";
    listforsaleform["price"] = listforsaleprice;
    listforsaleform["from"] = address;
    listforsaleform["to"] = "";
    listforsaleform["expirydate"] = updatedate3;
    listforsaleform["date"] = date2;
    if(listforsaleform && listforsaleform.price > floor1){
      listforsalecontinue();
    }
  };

  const listforsalecontinue = async (e) => {
    try {
      await axios.post('http://localhost:5000/listforsalecontinue', listforsaleform);
      setlistsalesuccess("Listing Successful");
      listsalecloseaftersuccess();
    } catch (error) {
        console.error('Error updating data:', error);
    }
  };
  const listsalecloseaftersuccess = () => {
    setlistsalesuccess("Listing Successful");
    setTimeout(() => {
      seteditlisting(!editlisting);
    }, 3000);
  };
  const removelisting = {};
  const removelistings = () => {
    removelisting["_id"] = id;
    removelisting["transactionid"] = transaction._id;
    removelisting["expirydate"] = date2;
    removelistingsform();
  }
  const removelistingsform = async (e) => {
    try {
      await axios.post('http://localhost:5000/removelistings', removelisting);
      removelistcloseaftersuccess();
    } catch (error) {
        console.error('Error updating data:', error);
    }
  };
  const removelistcloseaftersuccess = () => {
    setTimeout(() => {
      seteditlisting(!editlisting);
    }, 5000);
  };
  return (
    <>  
      { nftdata && colldata ?(<></>):
        (
          <div onClick={close} className='loading'>
            <Loading/>
          </div>
        )
      }
      { imgclick ? (<></>):
        (
          <div className='imageoverview'>
            <svg onClick={close} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="30px" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <img src={imagepath} alt= "nft"/>
          </div>
        )
      }
      {editlisting ? (<></>):
        (
          <div className='floatingcontainer'>
            <div className="scroll">
              <div className="editlist">
                <div className="top">
                  <p>Edit Listing</p>
                  <svg onClick={editclose} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="30px" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
                <div className="imageinfo">
                  <div className="imgnname">
                    <img src={imagepath} alt= "nft"/>
                    <div className="name">
                      <h3>{name0}</h3>
                      <p>expires in <Timeleft timestamp={transaction.expirydate}/></p>
                    </div>
                  </div>
                  <div className="priceinfo">
                    <p>Listing Price</p>
                    <p>{price} ETH</p>
                    <p><EthereumToINR price={price}/></p>
                  </div>
                </div>
                <div className="info">
                  <p>Set a higher price</p>
                  <span>Ensuring a strategic pricing strategy for your NFT is paramount as it establishes an upward trajectory, whereby each subsequent price surpasses the previous one. This deliberate escalation not only fosters consistent appreciation in NFT value but also cultivates favorable conditions for sustained growth within the NFT market.</span>
                </div>
                <div className="floor">
                  <p>Floor</p>
                  <span>{floor1} ETH</span>
                </div>
                <div className="priceenter">
                  <input type="text" onChange={editlistpricechange} required/>
                  <p>ETH</p>  
                </div>
                <div className="priceconv">
                  {!errorprice ? (
                    <EthereumToINR price={editlistprice}/>
                  ):(<p>{errorprice}</p>)}
                </div>
                <div className="expirydate">
                  <div className="top">
                    <p>Use previous listing expiration date</p>
                    <button type="button" onClick={changedate} className='smallbuy'>{!changedate1 ? (<p>Change</p>):(<p>Previous</p>)}</button>
                  </div>
                  <div className="date">
                    {changedate1 ? (
                      <input type="datetime-local" onChange={updatedate} required/>
                    ):(
                      <p>{month} {day}, {year} at {time}</p>
                    )}
                  </div>
                  <div className="buttons">
                    <div className='deleteacc'>
                      <button onClick={removelistings} type='button'>Cancel all listings</button>
                    </div>
                    <div className='createitem'>
                      <button onClick={editlistingclick} type="button">Continue</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
      {listforsale ? (<></>):
        (
          <div className='floatingcontainer'>
            <div className="scroll">
              <div className="editlist">
                <div className="top">
                  <p>List for sale</p>
                  <svg onClick={listforsaleclose} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="30px" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
                <div className="imageinfo">
                  <div className="imgnname">
                    <img src={imagepath} alt= "nft"/>
                    <div className="name">
                      <h3>{name0}</h3>
                      <p><Timeleft timestamp={transaction.expirydate}/></p>
                    </div>
                  </div>
                  <div className="priceinfo">
                    <p>Previous listing Price</p>
                    <p>{price} ETH</p>
                    <p><EthereumToINR price={price}/></p>
                  </div>
                </div>
                <div className="info">
                  <p>Set a higher price</p>
                  <span>Ensuring a strategic pricing strategy for your NFT is paramount as it establishes an upward trajectory, whereby each subsequent price surpasses the previous one. This deliberate escalation not only fosters consistent appreciation in NFT value but also cultivates favorable conditions for sustained growth within the NFT market.</span>
                </div>
                <div className="floor">
                  <p>Floor</p>
                  <span>{floor1} ETH</span>
                </div>
                <div className="priceenter">
                  <input type="text" onChange={listforsalepricechange} required/>
                  <p>ETH</p>
                </div>
                <div className="priceconv">
                  {!errorprice ? (
                    <EthereumToINR price={listforsaleprice}/>
                  ):(<p>{errorprice}</p>)}
                </div>
                <div className="expirydate">
                  <p className='heading'>Enter an expirydate for the nft</p>
                  <div className="date">
                      <input type="datetime-local" onChange={updatedate2} required/>
                  </div>
                  <div className="buttons">
                    <p>{listsalesuccess}</p>
                    <div className='createitem'>
                      <button onClick={listforsaleclick} type="button">Continue</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
      {buynow ? (<></>):
        (
          <div className='floatingcontainer'>
            <div className="scroll">
              <div className="editlist">
                <div className="top">
                  <p>buynow</p>
                  <svg onClick={buynowclose} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="30px" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
                <div className="imageinfo">
                  <div className="imgnname">
                    <img src={imagepath} alt= "nft"/>
                    <div className="name">
                      <h3>{name0}</h3>
                      <p><Timeleft timestamp={transaction.expirydate}/></p>
                    </div>
                  </div>
                  <div className="priceinfo">
                    <p>Previous listing Price</p>
                    <p>{price} ETH</p>
                    <p><EthereumToINR price={price}/></p>
                  </div>
                </div>
                <div className="info">
                  <p>Set a higher price</p>
                  <span>Ensuring a strategic pricing strategy for your NFT is paramount as it establishes an upward trajectory, whereby each subsequent price surpasses the previous one. This deliberate escalation not only fosters consistent appreciation in NFT value but also cultivates favorable conditions for sustained growth within the NFT market.</span>
                </div>
                <div className="floor">
                  <p>Floor</p>
                  <span>{floor1} ETH</span>
                </div>
                <div className="priceenter">
                  <input type="text" onChange={listforsalepricechange} required/>
                  <p>ETH</p>
                </div>
                <div className="priceconv">
                  {!errorprice ? (
                    <EthereumToINR price={listforsaleprice}/>
                  ):(<p>{errorprice}</p>)}
                </div>
                <div className="expirydate">
                  <p className='heading'>Enter an expirydate for the nft</p>
                  <div className="date">
                      <input type="datetime-local" onChange={updatedate2} required/>
                  </div>
                  <div className="buttons">
                    <div className='deleteacc'>
                      <button type='button'>Cancel all listings</button>
                    </div>
                    <div className='createitem'>
                      <button onClick={listforsaleclick} type="button">Continue</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
      <div className='scrollpage'>
          <div className='carddetails'>
            <div className='nftlook'>
              <div className="nftlookicons">
                <svg onClick={click} width="1.8rem" viewBox="0 0 29 26" fill={fillColor} xmlns="http://www.w3.org/2000/svg">
                <path d="M25.7567 13.8659L14.5125 25L3.26832 13.8659C2.52666 13.1444 1.94247 12.2771 1.55253 11.3187C1.16259 10.3603 0.97535 9.3316 1.0026 8.29731C1.02985 7.26302 1.271 6.24558 1.71086 5.30904C2.15073 4.37251 2.77978 3.53718 3.5584 2.85566C4.33702 2.17413 5.24835 1.66117 6.235 1.34908C7.22165 1.03699 8.26224 0.932535 9.29125 1.04228C10.3203 1.15203 11.3154 1.47361 12.214 1.98677C13.1126 2.49993 13.8952 3.19355 14.5125 4.02395C15.1325 3.19958 15.916 2.51201 16.814 2.0043C17.7119 1.49659 18.7051 1.17966 19.7312 1.07334C20.7573 0.96702 21.7943 1.07361 22.7774 1.38642C23.7604 1.69924 24.6683 2.21156 25.4442 2.89131C26.22 3.57106 26.8472 4.40361 27.2865 5.33686C27.7258 6.2701 27.9676 7.28396 27.997 8.31496C28.0263 9.34596 27.8425 10.3719 27.457 11.3286C27.0715 12.2853 26.4926 13.1522 25.7567 13.8749" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg width="1.5rem" viewBox="0 0 23 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.4231 10.6538H18.8269C19.4645 10.6538 20.0759 10.9071 20.5267 11.3579C20.9775 11.8087 21.2308 12.4202 21.2308 13.0577V24.5962C21.2308 25.2337 20.9775 25.8451 20.5267 26.2959C20.0759 26.7467 19.4645 27 18.8269 27H4.40385C3.76631 27 3.15488 26.7467 2.70407 26.2959C2.25326 25.8451 2 25.2337 2 24.5962V13.0577C2 12.4202 2.25326 11.8087 2.70407 11.3579C3.15488 10.9071 3.76631 10.6538 4.40385 10.6538H6.80769M16.4231 6.80769L11.6154 2M11.6154 2L6.80769 6.80769M11.6154 2V18.4062" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <img onClick={imageclick} src={imagepath} alt= "nft"/>
            </div>
            <div className='nftdiscription'>
              <div className='discription'>
                  <div className='dis'>
                    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 0V2H0V0H16ZM10 4V6H0V4H10ZM16 4V6H12V4H16ZM6 8V10H0V8H6ZM16 8V10H8V8H16ZM12 12V14H0V12H12Z" fill="black"/>
                    </svg>
                    <p>Discription</p>
                  </div>
                  <div className="disscroll">
                    <div className='disbody'>
                      <p>{dis}</p>
                    </div>
                  </div>
              </div>
              <div className='traits'>
                  <div className='tra'>
                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0.104757 9.19337C0.348704 10.0459 1.00575 10.7021 2.31898 12.0153L3.87446 13.5708C6.16093 15.8581 7.30332 16.9997 8.7228 16.9997C10.1431 16.9997 11.2855 15.8573 13.5711 13.5717C15.8576 11.2852 17 10.1428 17 8.72248C17 7.303 15.8576 6.15976 13.572 3.87414L12.0165 2.31866C10.7024 1.00542 10.0462 0.348382 9.1937 0.104435C8.34116 -0.140362 7.43592 0.0687355 5.62629 0.48693L4.5825 0.727477C3.05932 1.07852 2.29773 1.25447 1.77584 1.77551C1.25479 2.29741 1.07885 3.059 0.7278 4.58218L0.486403 5.62597C0.0690578 7.43645 -0.13919 8.34083 0.104757 9.19337ZM6.90382 4.48018C7.06777 4.63828 7.19856 4.82747 7.28857 5.03668C7.37859 5.2459 7.42601 5.47095 7.42807 5.6987C7.43014 5.92645 7.3868 6.15233 7.3006 6.36314C7.21439 6.57395 7.08705 6.76548 6.926 6.92653C6.76495 7.08758 6.57343 7.21492 6.36261 7.30113C6.1518 7.38733 5.92592 7.43067 5.69818 7.4286C5.47043 7.42654 5.24537 7.37911 5.03616 7.2891C4.82694 7.19909 4.63776 7.06829 4.47965 6.90435C4.16775 6.58093 3.99528 6.148 3.99936 5.6987C4.00343 5.24941 4.18372 4.81967 4.50143 4.50196C4.81914 4.18425 5.24888 4.00396 5.69818 3.99988C6.14747 3.99581 6.5804 4.16828 6.90382 4.48018ZM14.4925 8.54313L8.56045 14.4761C8.44017 14.5921 8.2791 14.6563 8.11196 14.6548C7.94481 14.6532 7.78495 14.5861 7.66681 14.4679C7.54866 14.3496 7.4817 14.1897 7.48032 14.0225C7.47895 13.8554 7.54328 13.6944 7.65946 13.5742L13.5907 7.64129C13.7103 7.5217 13.8725 7.45452 14.0416 7.45452C14.2107 7.45452 14.3729 7.5217 14.4925 7.64129C14.6121 7.76088 14.6793 7.92308 14.6793 8.09221C14.6793 8.26134 14.6121 8.42354 14.4925 8.54313Z" fill="black"/>
                    </svg>
                    <p>Traits</p>
                  </div> 
                  <div className="trascroll">
                    <div className='trabody'>
                    {array1.map((item, index) => (
                      <Traits
                          key={index}
                          title={item.title}
                          name={item.name}
                      />
                    ))}
                    </div>
                  </div>
              </div>
              <div className='about'>
                  <div className='abo'>
                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 8.5C0 6.24566 0.895533 4.08365 2.48959 2.48959C4.08365 0.895533 6.24566 0 8.5 0C10.7543 0 12.9163 0.895533 14.5104 2.48959C16.1045 4.08365 17 6.24566 17 8.5C17 10.7543 16.1045 12.9163 14.5104 14.5104C12.9163 16.1045 10.7543 17 8.5 17C6.24566 17 4.08365 16.1045 2.48959 14.5104C0.895533 12.9163 0 10.7543 0 8.5ZM8.5 1.59375C6.66835 1.59375 4.91172 2.32137 3.61654 3.61654C2.32137 4.91172 1.59375 6.66835 1.59375 8.5C1.59375 10.3317 2.32137 12.0883 3.61654 13.3835C4.91172 14.6786 6.66835 15.4062 8.5 15.4062C10.3317 15.4062 12.0883 14.6786 13.3835 13.3835C14.6786 12.0883 15.4062 10.3317 15.4062 8.5C15.4062 6.66835 14.6786 4.91172 13.3835 3.61654C12.0883 2.32137 10.3317 1.59375 8.5 1.59375ZM6.90625 8.23438C6.90625 8.02303 6.99021 7.82034 7.13965 7.6709C7.28909 7.52146 7.49178 7.4375 7.70312 7.4375H8.76562C8.97697 7.4375 9.17966 7.52146 9.3291 7.6709C9.47854 7.82034 9.5625 8.02303 9.5625 8.23438V11.1562H9.82812C10.0395 11.1562 10.2422 11.2402 10.3916 11.3896C10.541 11.5391 10.625 11.7418 10.625 11.9531C10.625 12.1645 10.541 12.3672 10.3916 12.5166C10.2422 12.666 10.0395 12.75 9.82812 12.75H7.70312C7.49178 12.75 7.28909 12.666 7.13965 12.5166C6.99021 12.3672 6.90625 12.1645 6.90625 11.9531C6.90625 11.7418 6.99021 11.5391 7.13965 11.3896C7.28909 11.2402 7.49178 11.1562 7.70312 11.1562H7.96875V9.03125H7.70312C7.49178 9.03125 7.28909 8.94729 7.13965 8.79785C6.99021 8.64841 6.90625 8.44572 6.90625 8.23438ZM8.5 6.375C8.21821 6.375 7.94796 6.26306 7.7487 6.0638C7.54944 5.86454 7.4375 5.59429 7.4375 5.3125C7.4375 5.03071 7.54944 4.76046 7.7487 4.5612C7.94796 4.36194 8.21821 4.25 8.5 4.25C8.78179 4.25 9.05204 4.36194 9.2513 4.5612C9.45056 4.76046 9.5625 5.03071 9.5625 5.3125C9.5625 5.59429 9.45056 5.86454 9.2513 6.0638C9.05204 6.26306 8.78179 6.375 8.5 6.375Z" fill="black"/>
                    </svg>
                    <p>About {username}</p>
                  </div>
                  <div className="aboscroll">
                    <div className='abobody'>
                    <p>{bio}</p>
                    </div>
                  </div>
              </div>
              <div className='details'>
                <div className='det'>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.3529 8.94118V6.11765H0V8.94118H10.3529Z" fill="black"/>
                  <path d="M10.3529 3.29412V0.470588H0V3.29412H10.3529Z" fill="black"/>
                  <path d="M10.3529 14.5882V11.7647H0V14.5882H10.3529Z" fill="black"/>
                  <path d="M16 1.88235C16 2.92195 15.1572 3.76471 14.1176 3.76471C13.0781 3.76471 12.2353 2.92195 12.2353 1.88235C12.2353 0.842758 13.0781 0 14.1176 0C15.1572 0 16 0.842758 16 1.88235Z" fill="black"/>
                  <path d="M16 7.52941C16 8.56901 15.1572 9.41176 14.1176 9.41176C13.0781 9.41176 12.2353 8.56901 12.2353 7.52941C12.2353 6.48982 13.0781 5.64706 14.1176 5.64706C15.1572 5.64706 16 6.48982 16 7.52941Z" fill="black"/>
                  <path d="M16 13.1765C16 14.2161 15.1572 15.0588 14.1176 15.0588C13.0781 15.0588 12.2353 14.2161 12.2353 13.1765C12.2353 12.1369 13.0781 11.2941 14.1176 11.2941C15.1572 11.2941 16 12.1369 16 13.1765Z" fill="black"/>
                  </svg>
                  <p>Details</p>
                </div>
                <div className='detbody'>
                  <div className="detele">
                    <p>Contract Details</p>
                    <p>{id.substring(0,30)}</p>
                  </div>
                  <div className="detele">
                    <p>Token ID</p>
                    <p>{id.substring(0,11)}</p>
                  </div>
                  <div className="detele">
                    <p>Token Standard</p>
                    <p>ERC-721</p>
                  </div>
                  <div className="detele">
                    <p>Chain</p>
                    <p>Ethereum</p>
                  </div>
                  <div className="detele">
                    <p>Last Updated</p>
                    <p><span><Timeago timestamp={transaction.date}/></span></p>
                  </div>
                  <div className="detele">
                    <p>Creator Earnings</p>
                    <p>7%</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='nftuserinfoout'>
              <div className="nftuserinfo">
                <div className='firstline'>
                  <Link to={`/collection/${collectionid}`}>
                    <p>{collectionname}</p>
                  </Link>
                  <div className='dots'>
                    <svg width="20" height="5" viewBox="0 0 20 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5 0C2.8283 -6.9185e-09 3.15339 0.0646642 3.45671 0.190301C3.76002 0.315938 4.03562 0.500087 4.26777 0.732233C4.49991 0.96438 4.68406 1.23998 4.8097 1.54329C4.93534 1.84661 5 2.1717 5 2.5C5 2.8283 4.93534 3.15339 4.8097 3.45671C4.68406 3.76002 4.49991 4.03562 4.26777 4.26777C4.03562 4.49991 3.76002 4.68406 3.45671 4.8097C3.15339 4.93534 2.8283 5 2.5 5C1.83696 5 1.20107 4.73661 0.732233 4.26777C0.263392 3.79893 0 3.16304 0 2.5C0 1.83696 0.263392 1.20107 0.732233 0.732233C1.20107 0.263392 1.83696 1.39726e-08 2.5 0ZM10 0C10.3283 -6.9185e-09 10.6534 0.0646642 10.9567 0.190301C11.26 0.315938 11.5356 0.500087 11.7678 0.732233C11.9999 0.96438 12.1841 1.23998 12.3097 1.54329C12.4353 1.84661 12.5 2.1717 12.5 2.5C12.5 2.8283 12.4353 3.15339 12.3097 3.45671C12.1841 3.76002 11.9999 4.03562 11.7678 4.26777C11.5356 4.49991 11.26 4.68406 10.9567 4.8097C10.6534 4.93534 10.3283 5 10 5C9.33696 5 8.70107 4.73661 8.23223 4.26777C7.76339 3.79893 7.5 3.16304 7.5 2.5C7.5 1.83696 7.76339 1.20107 8.23223 0.732233C8.70107 0.263392 9.33696 1.39726e-08 10 0ZM17.5 0C17.8283 -6.9185e-09 18.1534 0.0646642 18.4567 0.190301C18.76 0.315938 19.0356 0.500087 19.2678 0.732233C19.4999 0.96438 19.6841 1.23998 19.8097 1.54329C19.9353 1.84661 20 2.1717 20 2.5C20 2.8283 19.9353 3.15339 19.8097 3.45671C19.6841 3.76002 19.4999 4.03562 19.2678 4.26777C19.0356 4.49991 18.76 4.68406 18.4567 4.8097C18.1534 4.93534 17.8283 5 17.5 5C16.837 5 16.2011 4.73661 15.7322 4.26777C15.2634 3.79893 15 3.16304 15 2.5C15 1.83696 15.2634 1.20107 15.7322 0.732233C16.2011 0.263392 16.837 1.39726e-08 17.5 0Z" fill="black"/>
                    </svg>
                  </div>
                </div>
                <div className="namediv">
                  <p>{name0} #{id.substring(0,11)}</p>
                  <p>Owned by 
                  <Link to={`/${nftaddress}`}>
                    <span> {username}</span>
                  </Link>
                  </p>
                </div>
                <div className="metadata">
                  <svg width="18" height="11" viewBox="0 0 18 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.76713 0C14.0211 0 16.2551 3.45 17.1711 5.819C17.5091 6.694 17.6781 7.131 17.3801 7.565C17.0821 8 16.5551 8 15.5011 8H2.03313C0.979127 8 0.453127 8 0.154127 7.566C-0.143873 7.131 0.0251272 6.694 0.364127 5.819C1.27813 3.45 3.51313 0 8.76713 0Z" fill="black" fill-opacity="0.25"/>
                  <path d="M8.76713 11C10.9763 11 12.7671 9.20914 12.7671 7C12.7671 4.79086 10.9763 3 8.76713 3C6.55799 3 4.76713 4.79086 4.76713 7C4.76713 9.20914 6.55799 11 8.76713 11Z" fill="black"/>
                  </svg>
                  <p> {viewCount} views</p>
                  <svg width="19" height="17" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.5875 9.04121L9.50787 16L2.4282 9.04121C1.96123 8.59023 1.59341 8.04818 1.34789 7.44919C1.10237 6.8502 0.98448 6.20725 1.00164 5.56082C1.01879 4.91439 1.17063 4.27848 1.44758 3.69315C1.72453 3.10782 2.1206 2.58574 2.61084 2.15979C3.10109 1.73383 3.67489 1.41323 4.29611 1.21818C4.91733 1.02312 5.57252 0.957834 6.22042 1.02643C6.86831 1.09502 7.49488 1.29601 8.06066 1.61673C8.62645 1.93745 9.11919 2.37097 9.50787 2.88997C9.89822 2.37474 10.3915 1.94501 10.9569 1.62769C11.5223 1.31037 12.1476 1.11229 12.7937 1.04584C13.4398 0.979388 14.0927 1.046 14.7117 1.24151C15.3306 1.43703 15.9022 1.75722 16.3908 2.18207C16.8793 2.60691 17.2742 3.12726 17.5508 3.71054C17.8273 4.29382 17.9796 4.92747 17.9981 5.57185C18.0166 6.21623 17.9008 6.85745 17.6581 7.45539C17.4154 8.05333 17.0509 8.59511 16.5875 9.04683" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <p>{countlikes} favorited </p>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M14 0C12.9391 0 11.9217 0.421427 11.1716 1.17157C10.4214 1.92172 10 2.93913 10 4C10 5.06087 10.4214 6.07828 11.1716 6.82843C11.9217 7.57857 12.9391 8 14 8C15.0609 8 16.0783 7.57857 16.8284 6.82843C17.5786 6.07828 18 5.06087 18 4C18 2.93913 17.5786 1.92172 16.8284 1.17157C16.0783 0.421427 15.0609 0 14 0ZM0 14C0 12.9391 0.421427 11.9217 1.17157 11.1716C1.92172 10.4214 2.93913 10 4 10C5.06087 10 6.07828 10.4214 6.82843 11.1716C7.57857 11.9217 8 12.9391 8 14C8 15.0609 7.57857 16.0783 6.82843 16.8284C6.07828 17.5786 5.06087 18 4 18C2.93913 18 1.92172 17.5786 1.17157 16.8284C0.421427 16.0783 0 15.0609 0 14ZM0 1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0H7C7.26522 0 7.51957 0.105357 7.70711 0.292893C7.89464 0.48043 8 0.734784 8 1V6C8 6.53043 7.78929 7.03914 7.41421 7.41421C7.03914 7.78929 6.53043 8 6 8H2C1.46957 8 0.960859 7.78929 0.585786 7.41421C0.210714 7.03914 0 6.53043 0 6V1Z" fill="black"/>
                  <path d="M13.2831 10.4155L10.1271 15.6831C9.77929 16.2549 10.1865 17 10.8483 17H17.1517C17.8135 17 18.2207 16.2549 17.8729 15.6831L14.7254 10.4155C14.6504 10.2887 14.5446 10.1839 14.4182 10.1111C14.2919 10.0383 14.1493 10 14.0042 10C13.8592 10 13.7166 10.0383 13.5902 10.1111C13.4639 10.1839 13.3581 10.2887 13.2831 10.4155Z" fill="black"/>
                  </svg>
                  <p>{category0}</p>
                </div>
              </div>
            </div>
            <div className='saleinfo'>
              <div className='sale'>
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.5034 4.4V9.50425L13.107 13.1083M9.5 18C14.1946 18 18 14.1946 18 9.5C18 4.80545 14.1946 1 9.5 1C4.80545 1 1 4.80545 1 9.5C1 14.1946 4.80545 18 9.5 18Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {expired ? (<p>Sale ended</p>):(
                  <p>Sale ends by {month} {day}, {year}, {time}</p>
                )}
              </div>
              {expired ? (<></>):(
                <>
                  <p>Current Price</p>
                  <div className='sale1'>
                    <p>{price} ETH</p>
                    <EthereumToINR price={price}/>
                  </div>
                </>
              )}
              <div className='sale2'>
                {listed && !mine ? (
                  <>
                  <div className='buy'>
                    <button onClick={buynowopen}>Buy now</button>
                    {cartbutton ? (
                      <button onClick={cartclick}>
                        <svg width="1.7rem" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.04382 0.5C1.7394 0.5 1.44745 0.620932 1.23219 0.836191C1.01693 1.05145 0.895996 1.3434 0.895996 1.64783C0.895996 1.95225 1.01693 2.2442 1.23219 2.45946C1.44745 2.67472 1.7394 2.79565 2.04382 2.79565H2.60855C2.85779 2.79608 3.10012 2.87763 3.29892 3.02797C3.49771 3.17831 3.64217 3.38927 3.71046 3.62897L7.35137 16.3698C7.55729 17.0888 7.99172 17.7213 8.58896 18.1715C9.1862 18.6217 9.91378 18.8652 10.6617 18.8652H21.1505C21.8389 18.8653 22.5115 18.6591 23.0815 18.2733C23.6515 17.8874 24.0928 17.3395 24.3484 16.7004L27.7322 8.23864C27.8713 7.89045 27.923 7.51349 27.8827 7.1407C27.8425 6.76791 27.7116 6.41065 27.5014 6.10015C27.2913 5.78964 27.0082 5.53534 26.6771 5.35948C26.3459 5.18361 25.9767 5.09154 25.6018 5.0913H6.51575L5.91659 2.99767C5.71118 2.27861 5.27728 1.64596 4.68047 1.19534C4.08366 0.744732 3.35637 0.500653 2.60855 0.5H2.04382ZM11.2264 28.0478C11.6786 28.0478 12.1264 27.9587 12.5442 27.7857C12.962 27.6126 13.3416 27.359 13.6613 27.0392C13.9811 26.7195 14.2347 26.3399 14.4078 25.9221C14.5808 25.5043 14.6699 25.0565 14.6699 24.6043C14.6699 24.1521 14.5808 23.7044 14.4078 23.2866C14.2347 22.8688 13.9811 22.4892 13.6613 22.1694C13.3416 21.8497 12.962 21.596 12.5442 21.423C12.1264 21.2499 11.6786 21.1609 11.2264 21.1609C10.3132 21.1609 9.4373 21.5237 8.79152 22.1694C8.14574 22.8152 7.78295 23.6911 7.78295 24.6043C7.78295 25.5176 8.14574 26.3935 8.79152 27.0392C9.4373 27.685 10.3132 28.0478 11.2264 28.0478ZM20.409 28.0478C20.8612 28.0478 21.309 27.9587 21.7268 27.7857C22.1446 27.6126 22.5242 27.359 22.8439 27.0392C23.1637 26.7195 23.4173 26.3399 23.5904 25.9221C23.7634 25.5043 23.8525 25.0565 23.8525 24.6043C23.8525 24.1521 23.7634 23.7044 23.5904 23.2866C23.4173 22.8688 23.1637 22.4892 22.8439 22.1694C22.5242 21.8497 22.1446 21.596 21.7268 21.423C21.309 21.2499 20.8612 21.1609 20.409 21.1609C19.4958 21.1609 18.6199 21.5237 17.9741 22.1694C17.3283 22.8152 16.9656 23.6911 16.9656 24.6043C16.9656 25.5176 17.3283 26.3935 17.9741 27.0392C18.6199 27.685 19.4958 28.0478 20.409 28.0478Z" fill="#0C1E92"/>
                        </svg>
                      </button>
                    ):(<button onClick={cartclick}>
                        <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.14761 2.99994C1.84319 2.99994 1.55124 3.12087 1.33598 3.33613C1.12072 3.55139 0.999789 3.84334 0.999789 4.14777C0.999789 4.45219 1.12072 4.74414 1.33598 4.9594C1.55124 5.17466 1.84319 5.29559 2.14761 5.29559H2.71234C2.96158 5.29602 3.20391 5.37757 3.40271 5.52791C3.6015 5.67825 3.74596 5.88921 3.81425 6.12891L7.45516 18.8697C7.66108 19.5887 8.09551 20.2212 8.69275 20.6714C9.28999 21.1216 10.0176 21.3651 10.7655 21.3651H21.2543C21.9427 21.3652 22.6153 21.159 23.1853 20.7732C23.7553 20.3873 24.1966 19.8394 24.4522 19.2003L27.836 10.7386C27.9751 10.3904 28.0268 10.0134 27.9865 9.64064C27.9463 9.26785 27.8154 8.91059 27.6052 8.60009C27.3951 8.28958 27.112 8.03528 26.7809 7.85942C26.4497 7.68355 26.0805 7.59148 25.7056 7.59124H6.61954L6.02038 5.49761C5.81497 4.77855 5.38107 4.1459 4.78426 3.69528C4.18745 3.24467 3.46016 3.00059 2.71234 2.99994H2.14761ZM11.3302 30.5477C11.7824 30.5477 12.2302 30.4586 12.648 30.2856C13.0658 30.1125 13.4454 29.8589 13.7651 29.5391C14.0849 29.2194 14.3385 28.8398 14.5116 28.422C14.6846 28.0042 14.7737 27.5564 14.7737 27.1042C14.7737 26.652 14.6846 26.2043 14.5116 25.7865C14.3385 25.3687 14.0849 24.9891 13.7651 24.6693C13.4454 24.3496 13.0658 24.0959 12.648 23.9229C12.2302 23.7498 11.7824 23.6608 11.3302 23.6608C10.417 23.6608 9.54109 24.0236 8.89531 24.6693C8.24953 25.3151 7.88674 26.191 7.88674 27.1042C7.88674 28.0175 8.24953 28.8934 8.89531 29.5391C9.54109 30.1849 10.417 30.5477 11.3302 30.5477ZM20.5128 30.5477C20.965 30.5477 21.4128 30.4586 21.8306 30.2856C22.2484 30.1125 22.628 29.8589 22.9477 29.5391C23.2675 29.2194 23.5211 28.8398 23.6942 28.422C23.8672 28.0042 23.9563 27.5564 23.9563 27.1042C23.9563 26.652 23.8672 26.2043 23.6942 25.7865C23.5211 25.3687 23.2675 24.9891 22.9477 24.6693C22.628 24.3496 22.2484 24.0959 21.8306 23.9229C21.4128 23.7498 20.965 23.6608 20.5128 23.6608C19.5996 23.6608 18.7237 24.0236 18.0779 24.6693C17.4321 25.3151 17.0694 26.191 17.0694 27.1042C17.0694 28.0175 17.4321 28.8934 18.0779 29.5391C18.7237 30.1849 19.5996 30.5477 20.5128 30.5477Z" fill="#0C1E92"/>
                        <path d="M26.8698 1.41416C27.6508 0.633107 28.9171 0.633107 29.6982 1.41416C30.4792 2.1952 30.4792 3.46153 29.6982 4.24258L4.24234 29.6984C3.46129 30.4795 2.19496 30.4795 1.41391 29.6984C0.632863 28.9174 0.632863 27.651 1.41391 26.87L26.8698 1.41416Z" fill="black"/>
                        </svg>
                      </button>)}
                  </div>
                  <button className='make'>
                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0.104757 9.19337C0.348704 10.0459 1.00575 10.7021 2.31898 12.0153L3.87446 13.5708C6.16093 15.8581 7.30332 16.9997 8.7228 16.9997C10.1431 16.9997 11.2855 15.8573 13.5711 13.5717C15.8576 11.2852 17 10.1428 17 8.72248C17 7.303 15.8576 6.15976 13.572 3.87414L12.0165 2.31866C10.7024 1.00542 10.0462 0.348382 9.1937 0.104435C8.34116 -0.140362 7.43592 0.0687355 5.62629 0.48693L4.5825 0.727477C3.05932 1.07852 2.29773 1.25447 1.77584 1.77551C1.25479 2.29741 1.07885 3.059 0.7278 4.58218L0.486403 5.62597C0.0690578 7.43645 -0.13919 8.34083 0.104757 9.19337ZM6.90382 4.48018C7.06777 4.63828 7.19856 4.82747 7.28857 5.03668C7.37859 5.2459 7.42601 5.47095 7.42807 5.6987C7.43014 5.92645 7.3868 6.15233 7.3006 6.36314C7.21439 6.57395 7.08705 6.76548 6.926 6.92653C6.76495 7.08758 6.57343 7.21492 6.36261 7.30113C6.1518 7.38733 5.92592 7.43067 5.69818 7.4286C5.47043 7.42654 5.24537 7.37911 5.03616 7.2891C4.82694 7.19909 4.63776 7.06829 4.47965 6.90435C4.16775 6.58093 3.99528 6.148 3.99936 5.6987C4.00343 5.24941 4.18372 4.81967 4.50143 4.50196C4.81914 4.18425 5.24888 4.00396 5.69818 3.99988C6.14747 3.99581 6.5804 4.16828 6.90382 4.48018ZM14.4925 8.54313L8.56045 14.4761C8.44017 14.5921 8.2791 14.6563 8.11196 14.6548C7.94481 14.6532 7.78495 14.5861 7.66681 14.4679C7.54866 14.3496 7.4817 14.1897 7.48032 14.0225C7.47895 13.8554 7.54328 13.6944 7.65946 13.5742L13.5907 7.64129C13.7103 7.5217 13.8725 7.45452 14.0416 7.45452C14.2107 7.45452 14.3729 7.5217 14.4925 7.64129C14.6121 7.76088 14.6793 7.92308 14.6793 8.09221C14.6793 8.26134 14.6121 8.42354 14.4925 8.54313Z" fill="#0C1E92"/>
                    </svg>
                    <p>Make Offer</p>
                  </button>
                  </>
                ):("")}
                {(listed && mine) ? (
                  <button onClick={editopen} className='make'>
                    <p>Edit Listing</p>
                  </button>
                ):("")}
                {(!listed && mine) ? (
                <button onClick={listforsaleclose} className='make'>
                  <p>List for Sale</p>
                </button>
              ):("")}
              {(!listed && !mine) ? (
                <button className='make'>
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M0.104757 9.19337C0.348704 10.0459 1.00575 10.7021 2.31898 12.0153L3.87446 13.5708C6.16093 15.8581 7.30332 16.9997 8.7228 16.9997C10.1431 16.9997 11.2855 15.8573 13.5711 13.5717C15.8576 11.2852 17 10.1428 17 8.72248C17 7.303 15.8576 6.15976 13.572 3.87414L12.0165 2.31866C10.7024 1.00542 10.0462 0.348382 9.1937 0.104435C8.34116 -0.140362 7.43592 0.0687355 5.62629 0.48693L4.5825 0.727477C3.05932 1.07852 2.29773 1.25447 1.77584 1.77551C1.25479 2.29741 1.07885 3.059 0.7278 4.58218L0.486403 5.62597C0.0690578 7.43645 -0.13919 8.34083 0.104757 9.19337ZM6.90382 4.48018C7.06777 4.63828 7.19856 4.82747 7.28857 5.03668C7.37859 5.2459 7.42601 5.47095 7.42807 5.6987C7.43014 5.92645 7.3868 6.15233 7.3006 6.36314C7.21439 6.57395 7.08705 6.76548 6.926 6.92653C6.76495 7.08758 6.57343 7.21492 6.36261 7.30113C6.1518 7.38733 5.92592 7.43067 5.69818 7.4286C5.47043 7.42654 5.24537 7.37911 5.03616 7.2891C4.82694 7.19909 4.63776 7.06829 4.47965 6.90435C4.16775 6.58093 3.99528 6.148 3.99936 5.6987C4.00343 5.24941 4.18372 4.81967 4.50143 4.50196C4.81914 4.18425 5.24888 4.00396 5.69818 3.99988C6.14747 3.99581 6.5804 4.16828 6.90382 4.48018ZM14.4925 8.54313L8.56045 14.4761C8.44017 14.5921 8.2791 14.6563 8.11196 14.6548C7.94481 14.6532 7.78495 14.5861 7.66681 14.4679C7.54866 14.3496 7.4817 14.1897 7.48032 14.0225C7.47895 13.8554 7.54328 13.6944 7.65946 13.5742L13.5907 7.64129C13.7103 7.5217 13.8725 7.45452 14.0416 7.45452C14.2107 7.45452 14.3729 7.5217 14.4925 7.64129C14.6121 7.76088 14.6793 7.92308 14.6793 8.09221C14.6793 8.26134 14.6121 8.42354 14.4925 8.54313Z" fill="#0C1E92"/>
                  </svg>
                  <p>Make Offer</p>
                </button>
              ):("")}
              </div>
            </div>
            <div className='pricehis'>
              <div className='item'>
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.1111 0H1.88889C1.38792 0 0.907478 0.199007 0.553243 0.553243C0.199007 0.907478 0 1.38792 0 1.88889V15.1111C0 15.6121 0.199007 16.0925 0.553243 16.4468C0.907478 16.801 1.38792 17 1.88889 17H15.1111C15.6121 17 16.0925 16.801 16.4468 16.4468C16.801 16.0925 17 15.6121 17 15.1111V1.88889C17 1.38792 16.801 0.907478 16.4468 0.553243C16.0925 0.199007 15.6121 0 15.1111 0ZM15.1111 15.1111H1.88889V1.88889H15.1111V15.1111ZM5.66667 13.2222H3.77778V8.5H5.66667V13.2222ZM9.44444 13.2222H7.55556V6.61111H9.44444V13.2222ZM13.2222 13.2222H11.3333V3.77778H13.2222V13.2222Z" fill="black"/>
                </svg>
                <p>Price History</p>
              </div>
              <div className='pricebody'>
                <Linegraph data={data11}/>
              </div>
            </div>
            <div className='listings'>
              <div className='list'>
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.104757 9.19337C0.348704 10.0459 1.00575 10.7021 2.31898 12.0153L3.87446 13.5708C6.16093 15.8581 7.30332 16.9997 8.7228 16.9997C10.1431 16.9997 11.2855 15.8573 13.5711 13.5717C15.8576 11.2852 17 10.1428 17 8.72248C17 7.303 15.8576 6.15976 13.572 3.87414L12.0165 2.31866C10.7024 1.00542 10.0462 0.348382 9.1937 0.104435C8.34116 -0.140362 7.43592 0.0687355 5.62629 0.48693L4.5825 0.727477C3.05932 1.07852 2.29773 1.25447 1.77584 1.77551C1.25479 2.29741 1.07885 3.059 0.7278 4.58218L0.486403 5.62597C0.0690578 7.43645 -0.13919 8.34083 0.104757 9.19337ZM6.90382 4.48018C7.06777 4.63828 7.19856 4.82747 7.28857 5.03668C7.37859 5.2459 7.42601 5.47095 7.42807 5.6987C7.43014 5.92645 7.3868 6.15233 7.3006 6.36314C7.21439 6.57395 7.08705 6.76548 6.926 6.92653C6.76495 7.08758 6.57343 7.21492 6.36261 7.30113C6.1518 7.38733 5.92592 7.43067 5.69818 7.4286C5.47043 7.42654 5.24537 7.37911 5.03616 7.2891C4.82694 7.19909 4.63776 7.06829 4.47965 6.90435C4.16775 6.58093 3.99528 6.148 3.99936 5.6987C4.00343 5.24941 4.18372 4.81967 4.50143 4.50196C4.81914 4.18425 5.24888 4.00396 5.69818 3.99988C6.14747 3.99581 6.5804 4.16828 6.90382 4.48018ZM14.4925 8.54313L8.56045 14.4761C8.44017 14.5921 8.2791 14.6563 8.11196 14.6548C7.94481 14.6532 7.78495 14.5861 7.66681 14.4679C7.54866 14.3496 7.4817 14.1897 7.48032 14.0225C7.47895 13.8554 7.54328 13.6944 7.65946 13.5742L13.5907 7.64129C13.7103 7.5217 13.8725 7.45452 14.0416 7.45452C14.2107 7.45452 14.3729 7.5217 14.4925 7.64129C14.6121 7.76088 14.6793 7.92308 14.6793 8.09221C14.6793 8.26134 14.6121 8.42354 14.4925 8.54313Z" fill="black"/>
                </svg>
                <p>Listings</p>
              </div>
              <div className="listscroll">
                <table className='listbody'>
                  <tr>
                    <th>ETH Price</th>
                    <th>INR Price</th>
                    <th>Quantity</th>
                    <th>Expiration</th>
                    <th>from</th>
                  </tr>
                  {listingdata.map((data, index) => (
                    <tr key={index}>
                      <td>{data.price} ETH</td>
                      <td><EthereumToINR price={data.price} refresh={randomNumber}/></td>
                      <td>1</td>
                      <td><Timeleft timestamp={data.expirydate}/></td>
                      <td>{data.from.substring(0,6)+"..."+data.from.substring(36,)}</td>
                      <td>{!mine? (
                        <button className='smallbuy'>Buy</button>)
                        :(<button onClick={smallbuybutton} className='smallbuy'>edit</button>)}</td>
                    </tr>
                  ))}
                </table>
              </div>
            </div>
            <div className='offers'>
              <div className='off'>
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.9463 8.49972L16.8858 6.87602C16.9987 6.68067 17.0294 6.44847 16.9712 6.23048C16.9129 6.01249 16.7705 5.82655 16.5752 5.71356L14.9498 4.77406V2.90187C14.9498 2.67617 14.8601 2.45972 14.7005 2.30013C14.5409 2.14053 14.3245 2.05087 14.0988 2.05087H12.2274L11.2888 0.426325C11.1754 0.231376 10.9898 0.0889102 10.7722 0.0297614C10.6643 0.000500718 10.5516 -0.00704429 10.4407 0.00756371C10.3299 0.0221717 10.223 0.0586423 10.1263 0.114861L8.50092 1.05436L6.87552 0.11401C6.68007 0.00116601 6.44779 -0.0294142 6.22979 0.0289963C6.01179 0.0874068 5.82591 0.230024 5.71306 0.425474L4.77356 2.05087H2.90223C2.67653 2.05087 2.46007 2.14053 2.30048 2.30013C2.14089 2.45972 2.05123 2.67617 2.05123 2.90187V4.77321L0.42583 5.71271C0.328844 5.76849 0.243837 5.8429 0.175692 5.93164C0.107548 6.02038 0.0576096 6.12171 0.0287462 6.22981C-0.000117088 6.33791 -0.00733645 6.45064 0.00750293 6.56154C0.0223423 6.67244 0.0589478 6.77931 0.115217 6.87602L1.05472 8.49972L0.115217 10.1234C0.00287573 10.319 -0.0276042 10.551 0.0304221 10.7689C0.0884485 10.9868 0.230275 11.1729 0.424979 11.2867L2.05038 12.2262V14.0976C2.05038 14.3233 2.14004 14.5397 2.29963 14.6993C2.45922 14.8589 2.67568 14.9486 2.90137 14.9486H4.77356L5.71306 16.574C5.7884 16.7027 5.89597 16.8097 6.02519 16.8843C6.15441 16.9589 6.30082 16.9986 6.45002 16.9995C6.5981 16.9995 6.74532 16.9603 6.87637 16.8846L8.50007 15.9451L10.1255 16.8846C10.3209 16.9973 10.553 17.0278 10.7709 16.9696C10.9888 16.9114 11.1748 16.7691 11.2879 16.574L12.2266 14.9486H14.0979C14.3236 14.9486 14.5401 14.8589 14.6997 14.6993C14.8593 14.5397 14.9489 14.3233 14.9489 14.0976V12.2262L16.5743 11.2867C16.6711 11.2308 16.756 11.1563 16.824 11.0675C16.892 10.9788 16.9419 10.8775 16.9707 10.7694C16.9996 10.6614 17.0068 10.5487 16.9921 10.4379C16.9774 10.327 16.941 10.2202 16.8849 10.1234L15.9463 8.49972ZM6.37258 4.23623C6.71124 4.23634 7.03599 4.37098 7.27538 4.61053C7.51477 4.85008 7.64919 5.17491 7.64908 5.51357C7.64896 5.85223 7.51432 6.17698 7.27477 6.41637C7.03523 6.65576 6.71039 6.79018 6.37173 6.79007C6.03307 6.78995 5.70833 6.65531 5.46894 6.41577C5.22955 6.17622 5.09513 5.85138 5.09524 5.51272C5.09535 5.17406 5.22999 4.84932 5.46954 4.60993C5.70909 4.37054 6.03392 4.23612 6.37258 4.23623ZM6.62788 12.4058L5.26629 11.3854L10.3723 4.57748L11.7339 5.59782L6.62788 12.4058ZM10.6276 12.7462C10.4599 12.7461 10.2938 12.713 10.1389 12.6488C9.98404 12.5846 9.8433 12.4905 9.72477 12.3719C9.60623 12.2533 9.51222 12.1125 9.4481 11.9575C9.38398 11.8026 9.35101 11.6365 9.35107 11.4688C9.35112 11.3012 9.38421 11.1351 9.44843 10.9802C9.51265 10.8253 9.60676 10.6846 9.72537 10.566C9.84398 10.4475 9.98478 10.3535 10.1397 10.2894C10.2947 10.2253 10.4607 10.1923 10.6284 10.1923C10.9671 10.1925 11.2918 10.3271 11.5312 10.5666C11.7706 10.8062 11.905 11.131 11.9049 11.4697C11.9048 11.8083 11.7701 12.1331 11.5306 12.3725C11.2911 12.6119 10.9662 12.7463 10.6276 12.7462Z" fill="black"/>
                </svg>
                <p>Offers</p>
              </div>
              <div className="offscroll">
                <table className='offbody'>
                  <tr>
                    <th>ETH Price</th>
                    <th>INR Price</th>
                    <th>Quantity</th>
                    <th>Floor Difference</th>
                    <th>Expiration</th>
                    <th>From</th>
                  </tr>
                  {offersdata.map((data, index) => (
                    <tr key={index}>
                      <td>{data.price} ETH</td>
                      <td><EthereumToINR price={data.price}/></td>
                      <td>1</td>
                      <td></td> 
                      <td><Timeleft timestamp={data.expirydate}/></td>
                      <td>{data.to.substring(0,6)+"..."+data.to.substring(36,)}</td>
                    </tr>
                  ))}
                </table>
              </div>
            </div>
            <div className='itemactivity'>
              <div className='item'>
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.7648 1.69962C7.9895 1.67476 8.19512 1.56165 8.33642 1.38518C8.47772 1.20871 8.54314 0.98334 8.51827 0.758642C8.49341 0.533944 8.3803 0.328327 8.20383 0.187025C8.02736 0.0457223 7.80199 -0.0196911 7.57729 0.00517491C3.31389 0.476518 0 4.08873 0 8.47657C0 13.184 3.81592 17 8.52339 17C12.9095 17 16.5209 13.6869 16.9948 9.42692C17.0198 9.20223 16.9545 8.97681 16.8132 8.80026C16.672 8.62371 16.4664 8.5105 16.2417 8.48552C16.017 8.46054 15.7916 8.52584 15.6151 8.66707C15.4385 8.80829 15.3253 9.01386 15.3003 9.23856C15.104 10.9689 14.2532 12.5586 12.9223 13.6817C11.5914 14.8048 9.88132 15.3762 8.14262 15.2787C6.40392 15.1813 4.76836 14.4223 3.57131 13.1576C2.37425 11.8928 1.7064 10.218 1.70468 8.47657C1.70473 6.79944 2.32279 5.18114 3.44073 3.93096C4.55868 2.68078 6.09811 1.88639 7.7648 1.69962ZM10.8818 0.286447C10.6664 0.232096 10.4383 0.264003 10.246 0.375371C10.0538 0.486739 9.91264 0.668765 9.85263 0.882675C9.79262 1.09658 9.81851 1.32547 9.92478 1.52057C10.031 1.71568 10.2093 1.86158 10.4215 1.9272C10.6662 1.99624 10.9065 2.07891 11.1392 2.17438C11.3485 2.25994 11.5833 2.25884 11.7918 2.17133C12.0003 2.08381 12.1655 1.91705 12.2511 1.70772C12.3367 1.49839 12.3356 1.26365 12.248 1.05514C12.1605 0.846619 11.9938 0.681407 11.7844 0.595845C11.4897 0.475629 11.1883 0.372328 10.8818 0.286447ZM13.0825 2.24683C13.1583 2.16438 13.2495 2.09766 13.351 2.05048C13.4525 2.00329 13.5623 1.97656 13.6741 1.97181C13.786 1.96706 13.8976 1.98439 14.0028 2.0228C14.1079 2.06121 14.2045 2.11996 14.2869 2.19568C14.4676 2.36104 14.6406 2.53406 14.806 2.71391C14.9588 2.88051 15.0392 3.10099 15.0294 3.32685C15.0197 3.55271 14.9206 3.76545 14.754 3.91826C14.5874 4.07107 14.3669 4.15144 14.141 4.14169C13.9152 4.13194 13.7024 4.03287 13.5496 3.86627C13.4176 3.72228 13.2794 3.58407 13.1354 3.45203C13.0528 3.37643 12.986 3.2853 12.9386 3.18386C12.8913 3.08241 12.8644 2.97264 12.8595 2.8608C12.8546 2.74896 12.8718 2.63725 12.91 2.53205C12.9483 2.42685 13.0069 2.32937 13.0825 2.24683ZM7.67105 3.36254C7.8971 3.36254 8.1139 3.45234 8.27374 3.61218C8.43359 3.77203 8.52339 3.98882 8.52339 4.21487V8.47657H11.0804C11.3065 8.47657 11.5233 8.56637 11.6831 8.72621C11.8429 8.88606 11.9327 9.10285 11.9327 9.32891C11.9327 9.55496 11.8429 9.77176 11.6831 9.9316C11.5233 10.0914 11.3065 10.1812 11.0804 10.1812H7.67105C7.44499 10.1812 7.2282 10.0914 7.06835 9.9316C6.90851 9.77176 6.81871 9.55496 6.81871 9.32891V4.21487C6.81871 3.98882 6.90851 3.77203 7.06835 3.61218C7.2282 3.45234 7.44499 3.36254 7.67105 3.36254ZM15.291 4.74588C15.5002 4.66034 15.7348 4.66141 15.9432 4.74884C16.1517 4.83627 16.3168 5.00291 16.4024 5.21211C16.5233 5.50796 16.6271 5.81046 16.7135 6.11815C16.7471 6.22689 16.7586 6.34126 16.7473 6.45452C16.736 6.56778 16.7021 6.67763 16.6477 6.77758C16.5933 6.87754 16.5194 6.96558 16.4303 7.0365C16.3413 7.10743 16.239 7.15981 16.1294 7.19055C16.0198 7.2213 15.9052 7.22978 15.7923 7.2155C15.6793 7.20122 15.5704 7.16446 15.4719 7.10741C15.3734 7.05035 15.2874 6.97415 15.2188 6.88329C15.1503 6.79244 15.1006 6.68877 15.0728 6.57841C15.0038 6.33356 14.921 6.09281 14.8247 5.85733C14.7391 5.64822 14.7401 5.41369 14.8273 5.20527C14.9146 4.99686 15.0811 4.83162 15.2901 4.74588" fill="black"/>
                </svg>
                <p>itemactivity</p>
              </div>
              <div className="itemscroll">
                <table className='itembody'>
                  <tr>
                    <th>Event</th>
                    <th>Price</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Date</th>
                    <th>Expiry Date</th>
                  </tr>
                  {transarray.slice().reverse().map((data, index) => (
                    <tr key={index}>
                      <td>{data.event}</td>
                      <td>{data.price} ETH</td>
                      <td>{data.from}</td>
                      <td>{data.to}</td>
                      <td><Timeago timestamp={data.date}/></td>
                      <td><Timeleft timestamp={data.expirydate}/></td> 
                    </tr>
                  ))}
                </table>
              </div>
            </div>
            <div className='morefromcol'>
              <div className='more'>
                <svg width="19" height="17" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.10222 3.67948e-09C7.35658 -1.58716e-05 7.60831 0.0513392 7.84234 0.150985C8.07636 0.250631 8.28784 0.396516 8.46411 0.579889L8.57744 0.709278L9.89778 2.36111H17C17.4765 2.36096 17.9355 2.54094 18.285 2.86497C18.6344 3.189 18.8484 3.63313 18.8842 4.10833L18.8889 4.25V15.1111C18.889 15.5877 18.7091 16.0466 18.385 16.3961C18.061 16.7455 17.6169 16.9595 17.1417 16.9953L17 17H1.88889C1.41234 17.0002 0.953354 16.8202 0.603927 16.4961C0.2545 16.1721 0.0404632 15.728 0.00472243 15.2528L9.46976e-08 15.1111V1.88889C-0.000150714 1.41234 0.179828 0.953354 0.503858 0.603927C0.827888 0.2545 1.27202 0.0404631 1.74722 0.00472233L1.88889 3.67948e-09H7.10222ZM7.10222 1.88889H1.88889V15.1111H17V4.25H9.89778C9.64342 4.25002 9.39169 4.19866 9.15767 4.09901C8.92364 3.99937 8.71216 3.85348 8.53589 3.67011L8.42256 3.54072L7.10222 1.88889ZM6.61111 8.5C6.86159 8.5 7.10182 8.5995 7.27893 8.77662C7.45605 8.95374 7.55556 9.19396 7.55556 9.44444C7.55556 9.69493 7.45605 9.93515 7.27893 10.1123C7.10182 10.2894 6.86159 10.3889 6.61111 10.3889C6.36063 10.3889 6.12041 10.2894 5.94329 10.1123C5.76617 9.93515 5.66667 9.69493 5.66667 9.44444C5.66667 9.19396 5.76617 8.95374 5.94329 8.77662C6.12041 8.5995 6.36063 8.5 6.61111 8.5ZM9.44444 8.5C9.69493 8.5 9.93515 8.5995 10.1123 8.77662C10.2894 8.95374 10.3889 9.19396 10.3889 9.44444C10.3889 9.69493 10.2894 9.93515 10.1123 10.1123C9.93515 10.2894 9.69493 10.3889 9.44444 10.3889C9.19396 10.3889 8.95374 10.2894 8.77662 10.1123C8.5995 9.93515 8.5 9.69493 8.5 9.44444C8.5 9.19396 8.5995 8.95374 8.77662 8.77662C8.95374 8.5995 9.19396 8.5 9.44444 8.5ZM12.2778 8.5C12.5283 8.5 12.7685 8.5995 12.9456 8.77662C13.1227 8.95374 13.2222 9.19396 13.2222 9.44444C13.2222 9.69493 13.1227 9.93515 12.9456 10.1123C12.7685 10.2894 12.5283 10.3889 12.2778 10.3889C12.0273 10.3889 11.7871 10.2894 11.61 10.1123C11.4328 9.93515 11.3333 9.69493 11.3333 9.44444C11.3333 9.19396 11.4328 8.95374 11.61 8.77662C11.7871 8.5995 12.0273 8.5 12.2778 8.5Z" fill="black"/>
                </svg>
                <p>More from this Collection</p>
              </div>
              <div className='morebody'>
                <div className='scroll'>
                  <div className='items'>
                    {nftsdata.length ? (<>
                    {nftsdata.map((item, index) => (
                      <NFTSacc
                        key={index}
                        imgg={item.image}
                        name={item.name}
                        dis={item.description}
                        address={address}
                        id={item._id}
                      />
                    ))}
                    </>):(<h2>No more Nfts in this collection</h2>)}
                  </div>
                </div>
              </div>
              <br></br>
              <Link to={`/Collection/${collectionid}`}>
                <button>View Collection</button>
              </Link>
            </div>
          </div>
          <Footer/>
      </div>
    </>
  );
}
export default CardDetails;