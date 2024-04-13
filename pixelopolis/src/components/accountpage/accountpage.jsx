import React, {useState,useEffect} from 'react';
import { debounce } from 'lodash';
import '../../css files/accpage.css';
import Uploadback from './imageuploader/uploadbackground';
import Uploadprofilepic from './imageuploader/uploadprofilepic';
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

const Accountpage = ({address}) =>{
    const [activeIndex, setActiveIndex] = useState(0);
    const names = [ "All","NFTs","Collections","Activelisting"];
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
    const [infoarray,setinfoarray] = useState([]);
    const [combinedData, setcombineddata] = useState([]);
    const [allnftdata, setallnftdata] = useState([]);
    const [nftdata, setnftdata] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userInfoResponse = await axios.get('http://localhost:5000/userinfo');
                const userInfoData = userInfoResponse.data.data;
                var userlist = [];
                userInfoData.forEach(user => {
                    if (user._id === address) {
                        userlist = user;
                    }
                });
                setinfoarray(userlist);

                const collectionsResponse = await axios.get('http://localhost:5000/collection');
                const collectionsData = collectionsResponse.data.data;
                const addressCollectionsMap = [];
                collectionsData.forEach(collection => {
                    if (collection.address === address) {
                        addressCollectionsMap.push(collection);
                    }
                });
                setcombineddata(addressCollectionsMap);

                const nftsResponse = await axios.get('http://localhost:5000/nfts');
                const nftsData = nftsResponse.data.data;
                setallnftdata(nftsData);
                const flattenedNfts = [];
                const nftlasttransaction = [];
                if(address){
                    nftsData.forEach(nft => {
                        if (nft.address === address || nft.address === address) {
                            flattenedNfts.push(nft);
                            if(nft.transaction[nft.transaction.length -1].event !== "offer"){
                                nftlasttransaction.push(nft.transaction[nft.transaction.length -1]);
                            }
                        }
                    });
                }
                setnftdata(flattenedNfts);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [address]);

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    if (infoarray.date){
        var date0 =  months[infoarray.date.substring(5,7)-1];
        var year =  infoarray.date.substring(0,4);
        var follower = infoarray.followers.length;
        var following = infoarray.following.length;
    }

    var floor = [];
    var nftt = [];
    var floorcase = {};
    if(combinedData && allnftdata ){
        for (let i = 0; i < combinedData.length; i++) {
            floor = [];
            for (let j = 0; j < combinedData[i].nfts.length; j++){
                nftt = allnftdata.find(item => item._id === combinedData[i].nfts[j]);
                if(nftt){
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

    const [nftsdata1, setnftsdata1] = useState(nftdata);
    const [colldata1, setcolldata1] = useState(combinedData);
    const [filter, setfilter] = useState();


    const filterfunction = () => {
        let sortedNftData;
        if (nftdata && nftdata.length > 0) {
            if (filter === 0) {
                sortedNftData = nftdata.slice().sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateB - dateA;
                });
            } else if (filter === 1) {
                sortedNftData = nftdata.slice().sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateA - dateB;
                });
            }
            else if (filter === 2) {
                sortedNftData = nftdata.slice().sort((a, b) => {
                    const priceA = a.transaction[0].price;
                    const priceB = b.transaction[0].price;
                    return priceA - priceB;
                });
            } else if (filter === 3) {
                sortedNftData = nftdata.slice().sort((a, b) => {
                    const priceA = a.transaction[0].price;
                    const priceB = b.transaction[0].price;
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
    
    const handleFilterChange = (newValue) => {
        setfilter(newValue);
    };
    useEffect(() => {
        filterfunction();
        filterfunctionforcol();
        listednftdata();
    }, [nftdata,filter]);
    const address1 = (address.substring(0, 6) + "..." + address.substring(36, 42)).toUpperCase();
    
    
    // search for elements in the accountsection ///////////////////////

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
    //////////////////////////////////////////////////
    return(
        <>
        {address ?(<></>):
        (
            <div onClick={close} className='loading'>
            <Loading/>
        </div>
        )
        }
        <div className="accscroll">
            <div className='account1'>
                <div className='accprofile'>
                    <div className="profileinfo">
                        <div className="profilesection" >
                            <div className="profilebackimage"><Uploadback address1={address}/></div>
                            <div className="profilepic"><Uploadprofilepic address2={address}/></div>
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
                                <div className="followers"><p>Followers:</p><p>{follower}</p></div>
                                <div className="followers"><p>Following:</p><p>{following}</p></div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="operationpanel">
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
export default Accountpage;