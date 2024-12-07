import React, {useState,useEffect} from 'react';
import { debounce } from 'lodash';
import '../../css files/accpage.css';
import { useParams } from 'react-router-dom';
import Footer from '../homepage/main/dashboard/footer';
import Filters from '../collectionpage/filters';
import Loading from '../loading';
import NFTSacc from './nfts';
import Cardacc from './cardacc';
import axios from 'axios';

const TabButton = ({ children, onClick, isActive }) => {
    const buttonClass = isActive ? 'tabbuttons active' : 'tabbuttons';
    return (
        <button className={buttonClass} onClick={onClick}>
          {children}
        </button>
    );
};

const Ownerpage = ({address}) =>{
    const {id} = useParams();
    const [activeIndex, setActiveIndex] = useState(parseInt(localStorage.getItem('acctab')) || 0);
    const names = [ "All","Created","Collections","Activelisting"];
    useEffect(() => {
        localStorage.setItem('acctab', activeIndex);
    }, [activeIndex]);
    const handleIconClick = (index) => {
      setActiveIndex(index);
    };
    const [imgclick, setimgclick] = useState(false);
    const ifclicked = () => {
      if (window.innerWidth <= 1024 && window.innerWidth > 768 || window.innerWidth <= 500){
        setimgclick(true);
      }
    }
    const close = () => {
      setimgclick(false);
    }
    const id2 = id.toLowerCase();
    const [infoarray,setinfoarray] = useState([]);
    const [combinedData, setcombineddata] = useState([]);
    const [allnftdata, setallnftdata] = useState([]);
    const [nftdata, setnftdata] = useState([]);
    const [decide, setdecide] = useState(true);
    const [randomNumber, setRandomNumber] = useState(null);
    
    
    const fetchData = async () => {
        try {
            const userInfoResponse = await axios.get('http://localhost:5001/userinfo');
            const userInfoData = userInfoResponse.data.data;
            userInfoData.forEach(user => {
                if (user._id === id2) {
                    setinfoarray(user);
                }
            });
            const collectionsResponse = await axios.get('http://localhost:5001/collection');
            const collectionsData = collectionsResponse.data.data;
            const addressCollectionsMap = [];
            collectionsData.forEach(collection => {
                if (collection.address === id2) {
                    addressCollectionsMap.push(collection);
                }
            });
            setcombineddata(addressCollectionsMap);

            const nftsResponse = await axios.get('http://localhost:5001/nfts');
            const nftsData = nftsResponse.data.data;
            setallnftdata(nftsData);

            const flattenedNfts = [];
            if(id2){
                nftsData.forEach(nft => {
                    if (nft.address === id2) {
                        flattenedNfts.push(nft);
                    }
                });
            }
            setnftdata(flattenedNfts);

            if(id2 === address){
                setdecide(false);
            }
            else{
                setdecide(true);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {

        fetchData();
    }, [id2,randomNumber]);

    window.onload = () => setRandomNumber(Math.floor(Math.random() * 100) + 1);
    
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    var profileimage = "";
    var backgroundimage = "";
    var followers = [];
    var following = [];
    var countfollowers = 0;
    var countfollowing = 0;
    if (infoarray.date){
        var date0 =  months[infoarray.date.substring(5,7)-1];
        var year =  infoarray.date.substring(0,4);
        profileimage = infoarray.profileimage;
        backgroundimage = infoarray.backgroundimage;
        followers = infoarray.followers;
        following = infoarray.following;
        countfollowers = followers.length;
        countfollowing = following.length;
    }
    else{
        profileimage = "images.png";
        backgroundimage = "images.png";
    }

    var floor = [];
    var nftt = [];
    var floorcase = {};
    if(combinedData && allnftdata ){
        for (let i = 0; i < combinedData.length; i++) {
            floor = [];
            for (let j = 0; j < combinedData[i].nfts.length; j++){
                nftt = allnftdata.find(item => item._id === combinedData[i].nfts[j]);
                if(nftt && nftt.transaction.event !== "offer"){
                    floor.push(nftt.transaction[nftt.transaction.length -1].price);
                }
            }
            floorcase[combinedData[i]._id] = floor;
        }
    }
    var tolvol = 0;
    var floor1 = [];
    if(floorcase && combinedData){
        for (let i = 0; i < combinedData.length; i++) {
            combinedData[i]["floor"] = floorcase[combinedData[i]._id].sort()[0];
            floor1 = floorcase[combinedData[i]._id];
            tolvol = 0
            for (let j = 0; j < floor1.length; j++) {
                tolvol += parseFloat(floor1[j]);
            }
            tolvol= Number(tolvol.toFixed(4));
            combinedData[i]["tolvol"] = tolvol;
        }
    }

    const [nftsdata1, setnftsdata1] = useState([]);
    const [colldata1, setcolldata1] = useState([]);
    const [filter, setfilter] = useState();

    const filterfunction = () => {
        let sortedNftData;
        if (nftdata && nftdata.length > 0) {
            if (filter === 0) {
                sortedNftData = nftdata.slice().sort((a, b) => {
                    const dateA = new Date(a.transaction[a.transaction.length - 1].date);
                    const dateB = new Date(b.transaction[b.transaction.length - 1].date);
                    return dateB - dateA;
                });
            } else if (filter === 1) {
                sortedNftData = nftdata.slice().sort((a, b) => {
                    const dateA = new Date(a.transaction[a.transaction.length - 1].date);
                    const dateB = new Date(b.transaction[b.transaction.length - 1].date);
                    return dateA - dateB;
                });
            }
            else if (filter === 2) {
                sortedNftData = nftdata.slice().sort((a, b) => {
                    const priceA = a.transaction[a.transaction.length - 1].price;
                    const priceB = b.transaction[b.transaction.length - 1].price;
                    return priceA - priceB;
                });
            } else if (filter === 3) {
                sortedNftData = nftdata.slice().sort((a, b) => {
                    const priceA = a.transaction[a.transaction.length - 1].price;
                    const priceB = b.transaction[b.transaction.length - 1].price;
                    return priceB - priceA;
                });
            }
            setnftsdata1(sortedNftData);
        }
    }
    
    const filterfunctionforcol = () => {
        let sortedcollData;
        if (combinedData && combinedData.length > 0) {
            if (filter === 0) {
                sortedcollData = combinedData.slice().sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateB - dateA;
                });
            } else if (filter === 1) {
                sortedcollData = combinedData.slice().sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateA - dateB;
                });
            }
            else if (filter === 2) {
                sortedcollData = combinedData.slice().sort((a, b) => {
                    const priceA = a.tolvol;
                    const priceB = b.tolvol;
                    return priceA - priceB;
                });
            } else if (filter === 3) {
                sortedcollData = combinedData.slice().sort((a, b) => {
                    const priceA = a.tolvol;
                    const priceB = b.tolvol;
                    return priceB - priceA;
                });
            }
            setcolldata1(sortedcollData);
        }
    }
    const [listednftdata1,setlistednftdata] = useState([]);
    var temp = [];
    const listednftdata = () => {
        for (let i=0; i<nftsdata1.length; i++){
            if (nftsdata1[i].transaction[nftsdata1[i].transaction.length -1].event === "listing"){
                var tempdate = new Date(nftsdata1[i].transaction[nftsdata1[i].transaction.length -1].expirydate);
                var todaydate = new Date();
                if ((tempdate-todaydate) > 0){
                    temp.push(nftsdata1[i]);
                }
            }
        }
        setlistednftdata(temp);
    }
    useEffect(() => {
        filterfunction();
        filterfunctionforcol();
        listednftdata();
    }, [nftdata,filter]);
    
    const handleFilterChange = (newValue) => {
        setfilter(newValue);
    };
    ////////////////////////////////////////////////////////////////
    const [nftsdata2, setnftsdata2] = useState(nftsdata1);
    const [colldata2, setcolldata2] = useState(colldata1);
    const [listednftdata2,setlistednftdata2] = useState(listednftdata1);
    const [query, setquery] = useState('');

    const handlesearchinput = (e) => {
        setquery(e.target.value);
        handleSearch(e.target.value , nftsdata1,setnftsdata2);
        handleSearch1(e.target.value , colldata1,setcolldata2);
        handleSearch(e.target.value , listednftdata1,setlistednftdata2);
    };

    const handleSearch = (inputValue,data,set) => {
        const filteredResults = data.filter(obj => {
            return (
                obj.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                obj.description.toLowerCase().includes(inputValue.toLowerCase()) ||
                obj.traits.toLowerCase().includes(inputValue.toLowerCase())
            );
        });
        set(filteredResults);
    };
    const handleSearch1 = (inputValue,data,set) => {
        const filteredResults = data.filter(obj => {
            return (
                obj.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                obj.description.toLowerCase().includes(inputValue.toLowerCase())
            );
        });
        set(filteredResults);
    };
    
    const debouncedHandleSearchInput = debounce(handlesearchinput, 500);
    ////////////////////////////////////////////////////////////////
    const address1 = (id2.substring(0, 6) + "..." + id2.substring(36, 42)).toUpperCase();
    const [followclick, setfollowclick] = useState(null);

    useEffect(() => {
        if (followers.includes(address)) {
            setfollowclick(false);
            countfollowers = followers.length;
            countfollowing = following.length;
        } else {
            setfollowclick(true);
        }
      }, [followers,address]);
    const clicked = () => {
        if(followclick) {
            setfollowclick(false);
            followbutton();
        }
        else{
            setfollowclick(true);
            unfollowbutton();
        }
    }
    const followinfo = {id: id2,address: address};
    const followbutton = async (e) => {
      try {
        const response = await axios.post('http://localhost:5001/follow', followinfo);
        if (response.data.message === 'success') {
            fetchData();
        }
      } catch (error) {
          console.error('Error updating data:', error);
      }
    };
    const unfollowbutton = async (e) => {
      try {
        const response = await axios.post('http://localhost:5001/unfollow', followinfo);
        if (response.data.message === 'success') {
        fetchData();
        }
      } catch (error) {
          console.error('Error updating data:', error);
      }
    };
    return(
        <>
        {id2 ?(<></>):
        (
            <div onClick={close} className='loading'>
            <Loading/>
        </div>
        )
        }
        <div className="accscroll">
            <div className='account2'>
                <div className='accprofile'>
                    <div className="profileinfo">
                        <div className="collprofilesection" >
                            <div className="collprofilebackimage">
                                <img className="blurpic" src={require(`../../image/user/${backgroundimage}`)}  alt="background" />
                                <img className="actualpic" src={require(`../../image/user/${backgroundimage}`)}  alt="background" />
                            </div>
                            <div className="collprofilepic"><img src={require(`../../image/user/${profileimage}`)} alt="profile" /></div>
                        </div>
                        <div className="accountinfo">
                            <div className="accuserinfo">
                                <p className="username">{infoarray.username}</p>
                                <div className="userinfo">
                                    <div className="userinfo1">
                                        <svg viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 0L0 7.17073L4 9.73171L8 7.17073L4 0ZM0 8.02439L4 14L8 8.02439L4 10.5854L0 8.02439Z" fill="#5E73FF"/></svg>
                                        <p>{address1}</p>
                                    </div>
                                    <p className="joined date">Joined {date0} {year}</p>
                                </div>
                            </div>
                            <div className="userfollowers">
                                <div className="followers"><p>Followers:</p><p>{countfollowers}</p></div>
                                <div className="followers"><p>Following:</p><p>{countfollowing}</p></div>
                                {id2 === address? (<></>):(
                                    <div className="createitem">
                                        <button onClick={clicked}>
                                            {followclick ?
                                            (<p>Follow</p>):(<p>Following</p>)}</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="operationpanel">
                        { imgclick ? (
                            <div className='searchbaricon'>
                            <input type='text' placeholder='Search items, collections and accounts' onChange={debouncedHandleSearchInput}></input>        
                            <svg onClick={close} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                            </div>):
                            (
                            <>
                                <div className='acctabs'>
                                    {names.map((name, index) => (
                                        <TabButton
                                        key={index}
                                        children={name}
                                        isActive={activeIndex === index}
                                        onClick={() => handleIconClick(index)}
                                        />
                                        ))}
                                </div>
                                <div className="searchitems">
                                    <svg onClick={ifclicked} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.0703 20.0444C21.9769 18.1313 23.1556 15.4922 23.1556 12.5778C23.1556 6.73583 18.4197 2 12.5778 2C6.73583 2 2 6.73583 2 12.5778C2 18.4197 6.73583 23.1556 12.5778 23.1556C15.5053 23.1556 18.1551 21.9663 20.0703 20.0444ZM20.0703 20.0444L28.5 28.5" stroke="black" stroke-width="3" stroke-linecap="round"/></svg>
                                    <input type='text' placeholder='Search items' onChange={debouncedHandleSearchInput}></input>        
                                </div>
                                <Filters onFilterChange={handleFilterChange}/>
                            </>
                            )}
                        </div>
                        <div className="nftsacc">
                            {(activeIndex === 0 || activeIndex === 2) ? (<>
                                {query ? (<>
                                    {colldata2.map((item, index) => (
                                        <Cardacc
                                            key={index}
                                            imgg={item.image}
                                            name={item.name}
                                            floor={item.floor}
                                            tolvol={item.tolvol}
                                            id={item._id}
                                            address={address}
                                        />
                                    ))}
                                </>):(<>
                                    {colldata1.map((item, index) => (
                                        <Cardacc
                                            key={index}
                                            imgg={item.image}
                                            name={item.name}
                                            floor={item.floor}
                                            tolvol={item.tolvol}
                                            id={item._id}
                                            address={address}
                                        />
                                    ))}
                                </>)}
                            </>):(<></>)}
                            {(activeIndex === 0 || activeIndex === 1) ? (<>
                            {query ? (<>
                                {nftsdata2.map((item, index) => (
                                <NFTSacc
                                    key={index}
                                    imgg={item.image}
                                    name={item.name}
                                    dis={item.description}
                                    address={address}
                                    id={item._id}
                                />
                            ))}
                            </>):(<>
                                {nftsdata1.map((item, index) => (
                                <NFTSacc
                                    key={index}
                                    imgg={item.image}
                                    name={item.name}
                                    dis={item.description}
                                    address={address}
                                    id={item._id}
                                />
                            ))}
                            </>)}
                            </>):(<></>)}
                            {(activeIndex === 3) ? (<>
                            {query? (<>
                                {listednftdata2.map((item, index) => (
                                <NFTSacc
                                    key={index}
                                    imgg={item.image}
                                    name={item.name}
                                    dis={item.description}
                                    address={address}
                                    id={item._id}
                                />
                            ))}
                            </>):(<>
                                {listednftdata1.map((item, index) => (
                                <NFTSacc
                                    key={index}
                                    imgg={item.image}
                                    name={item.name}
                                    dis={item.description}
                                    address={address}
                                    id={item._id}
                                />
                            ))}
                            </>)}
                            </>):(<></>)}
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        </div>
        </>
    );
}
export default Ownerpage;