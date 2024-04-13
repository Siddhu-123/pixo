import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import '../../css files/collpage.css';
import { useParams } from 'react-router-dom';
import Footer from '../homepage/main/dashboard/footer';
import Analytics from './analytics';
import Filters from './filters';
import Loading from '../loading';
import NFTSacc from '../accountpage/nfts';
import {Link} from 'react-router-dom';
import axios from 'axios';

const TabButton = ({ children, onClick, isActive }) => {
    const buttonClass = isActive ? 'tabbuttons active' : 'tabbuttons';
    return (
        <button className={buttonClass} onClick={onClick}>
            {children}
        </button>
    );
};

const Collectionpage = ({address}) => {
    const { name } = useParams();
    const [nftdata, setnftdata] = useState([]);
    const [nftsdata, setnftsdata] = useState([]);
    const [filter, setfilter] = useState(null);
    const [allnftdata, setallnftdata] = useState([]);
    const [colldata, setcolldata] = useState(null);
    const [userdata, setuserdata] = useState([]);
    const [usersdata, setusersdata] = useState(null);
    const [randomNumber, setRandomNumber] = useState(1);
    const [decide, setdecide] = useState(true);
    const [collimage,setcollimage] = useState("images.png");
    
    useEffect(() => {
        const fetchNftData = async () => {
            try {
                const collectionsResponse = await axios.get('http://localhost:5000/collection');
                const collectionsData = collectionsResponse.data.data;
                const collection = collectionsData.find(collection => collection._id === name);
                if (collection) {
                    setcolldata(collection);
                    const collnftslist = collection.nfts;
                    setcollimage(collection.image);

                    const nftsResponse = await axios.get('http://localhost:5000/nfts');
                    const nftsData = nftsResponse.data.data;
                    setallnftdata(nftsData);
                    const addressNftsMap = nftsData.filter(nft => collnftslist.includes(nft._id));
                    setnftdata(addressNftsMap);

                    const nftuser = await axios.get('http://localhost:5000/userinfo');
                    const userData = nftuser.data.data;
                    setusersdata(userData);
                    const user = userData.find(item => item._id === collection.address);
                    setuserdata(user);
                    if(user._id === address){
                        setdecide(false);
                    }
                    else{
                        setdecide(true);
                    }
                }
            } catch (error) {
                console.error('Error fetching NFT data:', error);
            }
        };
        fetchNftData();
    }, [name,randomNumber]);

    window.onload = () => setRandomNumber(Math.floor(Math.random() * 100) + 1);

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    var nftslist=[];
    var floor = [];

    if (userdata && colldata && nftdata){
        var collname = colldata.name;
        var username = userdata.username;
        var colldate = colldata.date;
        var collmonth = months[parseInt(colldate.substring(6,8)) -1];
        var collyear = colldate.substring(0,4);
        var nftscount = colldata.nfts.length;
        nftslist= colldata.nfts;
        var userid = userdata._id;
    }
    
    for (let i = 0; i < nftslist.length; i++) {
        var nftt = allnftdata.find(item => item._id === nftslist[i]);
        if(nftt) {
        floor.push(nftt.transaction[nftt.transaction.length -1].price);
        }
    }

    let Transaclist = 0;

    nftdata.forEach(nft => {
        nft.transaction.forEach(transaction => {
            var date = new Date();
            var expire = new Date(transaction.expirydate) - date;
            if (transaction.event === "listing" && expire > 0) {
                Transaclist = Transaclist + 1;
            }
        });
    });

    const filterfunction = () => {

        if (nftdata && nftdata.length > 0) {
            let sortedNftData;
            switch (filter) {
                case 0:
                    sortedNftData = sortNftsByDate(nftdata.slice(), true);
                    break;
                case 1:
                    sortedNftData = sortNftsByDate(nftdata.slice(), false);
                    break;
                case 2:
                    sortedNftData = sortNftsByPrice(nftdata.slice(), true);
                    break;
                case 3:
                    sortedNftData = sortNftsByPrice(nftdata.slice(), false);
                    break;
                default:
                    sortedNftData = nftdata.slice();
            }
            setnftsdata(sortedNftData);
        }
    };
    
    const sortNftsByDate = (data, ascending) => {
        return data.sort((a, b) => {
            const dateA = new Date(a.transaction[0].date);
            const dateB = new Date(b.transaction[0].date);
            return ascending ? dateA - dateB : dateB - dateA;
        });
    };
    
    const sortNftsByPrice = (data, ascending) => {
        return data.sort((a, b) => {
            const priceA = a.transaction[0].price;
            const priceB = b.transaction[0].price;
            return ascending ? priceA - priceB : priceB - priceA;
        });
    };
    
    useEffect(() => {
        filterfunction();
    }, [nftdata, filter]);
    
    const handleFilterChange = (newValue) => {
        setfilter(newValue);
    };
    const [query, setquery] = useState('');    
    const handlesearchinput = (e) => {
        handleSearch(e.target.value);
        setquery(e.target.value);
    };

    const [results, setResults] = useState([]);

    const handleSearch = (inputValue) => {
        const filteredResults = nftsdata.filter(obj => {
            return (
                obj.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                obj.description.toLowerCase().includes(inputValue.toLowerCase()) ||
                obj.traits.toLowerCase().includes(inputValue.toLowerCase())
            );
        });
        setResults(filteredResults);
    };
    
    const debouncedHandleSearchInput = debounce(handlesearchinput, 500);

    const floor1 = parseFloat(floor.sort()[0]);
    let tolvol = 0;
    for (let i = 0; i < floor.length; i++) {
        tolvol += parseFloat(floor[i]);
    }
    tolvol= Number(tolvol.toFixed(4));

    const [activeIndex, setActiveIndex] = useState(parseInt(localStorage.getItem('acctab')) || 0);
    const names = ["Items", "Analytics"];

    useEffect(() => {
        localStorage.setItem('acctab', activeIndex);
    }, [activeIndex]);

    window.onload = () => {
        if(userid === address){
            setdecide(false);
        }
        else{
            setdecide(true);
        }
    }

    const handleIconClick = (index) => {
        setActiveIndex(index);
    };

    const [imgclick, setimgclick] = useState(false);

    const ifclicked = () => {
        if (window.innerWidth <= 500) {
            setimgclick(true);
        }
    };

    const close = () => {
        setimgclick(false);
    };
    return (
        <>
            { nftdata && colldata && userdata && address ?(<></>):
            (
            <div onClick={close} className='loading'>
                <Loading/>
            </div>
            )
            }
            <div className="collscroll">
                <div className='collount1'>
                    <div className='collprofile'>
                        <div className="collprofileinfo">
                            <div className="collprofilesection" >
                                <div className="collprofilebackimage">
                                    <img className="blurpic" src={require(`../../image/coll/${collimage}`)}  alt="background" />
                                    <img className="actualpic" src={require(`../../image/coll/${collimage}`)}  alt="background" />
                                </div>
                                <div className="collprofilepic"><img src={require(`../../image/coll/${collimage}`)} alt="profile" /></div>
                            </div>
                            <div className="colloutinfo">
                                <div className="collinfodiv">
                                    <p className="collname">{collname}</p>
                                    <div className="collinfo">
                                        <div className="collinfo1">
                                            <svg viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 0L0 7.17073L4 9.73171L8 7.17073L4 0ZM0 8.02439L4 14L8 8.02439L4 10.5854L0 8.02439Z" fill="#5E73FF"/></svg>
                                            <Link to={`/${userid}`}>
                                                <span> {username}</span>
                                            </Link>
                                        </div>
                                        <p className="colljoineddate">Created on {collmonth} {collyear}</p>
                                    </div>
                                </div>
                                <div className="collspecsdiv">
                                    <div className="spec">
                                        <p>{tolvol} ETH</p>
                                        <p>Total Volume</p>
                                    </div>
                                    <div className="spec">
                                        <p>{floor1} ETH</p>
                                        <p>Floor Price</p>
                                    </div>
                                    <div className="spec">
                                        <p>{Number((Transaclist/nftscount)*100).toFixed(4)}%</p>
                                        <p>Listed</p>
                                    </div>
                                    <div className="spec">
                                        <p>{nftscount}</p>
                                        <p>Items</p>
                                    </div>
                                    <div className="spec">
                                        <p>1%</p>
                                        <p>Creator Earnings</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="colloperationpanel">
                                { imgclick ? (
                                    <div className='searchbaricon'>
                                        <input type='text' placeholder='Search items, collections and collounts' onChange={debouncedHandleSearchInput} ></input>
                                        <svg onClick={close} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </div>) :
                                    (
                                    <>
                                        <div className='colltabs'>
                                            {names.map((name, index) => (
                                                <TabButton
                                                    key={index}
                                                    children={name}
                                                    isActive={activeIndex === index}
                                                    onClick={() => handleIconClick(index)}
                                                />
                                            ))}
                                        </div>
                                        <div className="collsearchitems">
                                            <svg onClick={ifclicked} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.0703 20.0444C21.9769 18.1313 23.1556 15.4922 23.1556 12.5778C23.1556 6.73583 18.4197 2 12.5778 2C6.73583 2 2 6.73583 2 12.5778C2 18.4197 6.73583 23.1556 12.5778 23.1556C15.5053 23.1556 18.1551 21.9663 20.0703 20.0444ZM20.0703 20.0444L28.5 28.5" stroke="black" strokeWidth="3" strokeLinecap="round"/></svg>
                                            <input type='text' placeholder='Search items' onChange={debouncedHandleSearchInput} ></input>
                                        </div>
                                        <Filters onFilterChange={handleFilterChange}/>
                                    </>
                                    )}
                            </div>
                            {!activeIndex ? (
                                <div className="nftscoll">
                                    {query ? (<>
                                        {results.map((item, index) => (
                                            <NFTSacc
                                                key={index}
                                                imgg={item.image}
                                                name={item.name}
                                                dis={item.description}
                                                id={item._id}
                                                address={address}
                                                decide={decide}
                                            />
                                        ))}
                                    </>):(<>
                                        {nftsdata.map((item, index) => (
                                            <NFTSacc
                                                key={index}
                                                imgg={item.image}
                                                name={item.name}
                                                dis={item.description}
                                                id={item._id}
                                                address={address}
                                                decide={decide}
                                            />
                                        ))}
                                    </>)}
                                </div>
                            ) : (
                                <Analytics nftdata={nftdata} colldata={colldata} userdata={usersdata} floor={floor1} tolvol={tolvol}/>
                            )}
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default Collectionpage;