import React,{useEffect,useState} from "react";
import Cartele from "./cartele";
import EthereumToINR from "../../../carddetails/currency";
import axios from 'axios';

const Cartpage = ({close,address}) =>{
    const [userdata, setuserdata] = useState([]);
    const [nftdata,setnftdata] = useState([]);
    const [update,setupdate] = useState("");
    const handleupdate = (category) => {
        setupdate(category);
      };
    const fetchData = async () => {
        try {
            const userslist = await axios.get('http://localhost:5000/userinfo');
            const users = userslist.data.data;
            const foundUserData = users.find(item => item._id === address);
            if (foundUserData) {
                setuserdata(foundUserData);
            }

            const nftslist = await axios.get('http://localhost:5000/nfts');
            const nfts = nftslist.data.data;
            if (nfts) {
                setnftdata(nfts);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [address,update]);

    const nftlist = [];
    if(userdata){
        nftdata.forEach(nft => {
            var nft2 = [];
            if (userdata.cart.includes(nft._id)) {
                nft2 = nft;
                nft2["price"]=(nft.transaction[nft.transaction.length -1].price)
                nftlist.push(nft2);
            }
        });
    }

    const pricelist = [];
    nftlist.forEach(nft => {
        pricelist.push(nft.price);
    });

    var tolvalue = 0;
    pricelist.forEach(price => {
        tolvalue = tolvalue + price;
    });

    const cartinfo = {address: address};
    const eraseall = async (e) => {
        try {
            const response = await axios.post('http://localhost:5000/removeallcart', cartinfo);
            if (response.data.message === 'removed') {
                setupdate(Math.random());
            }
        } catch (error) {
            console.error('Error updating data:', error);
        }
      };
    return(
        <div className='cartpage'>
            <div className="cartheader">
                <div className="headtext">
                    <p>Cart</p>
                    <p>Items in your cart are not guaranteed at purchase.</p>
                </div>
                <svg className="close" onClick={close} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 100 100">
                    <line x1="20" y1="20" x2="80" y2="80" stroke="black" stroke-width="10" />
                    <line x1="80" y1="20" x2="20" y2="80" stroke="black" stroke-width="10" />
                </svg>
            </div>
            <div className="countclear">
                <p>{nftlist.length} Items</p>
                <div onClick={eraseall}>Clear all</div>
            </div>
            <div className="itemscroll">
                <div className="items">
                    {nftlist.map((item, index) => (
                        <Cartele
                            key={index}
                            imgg={item.image}
                            name={item.name}
                            collname={item.collections}
                            price={item.price}
                            id={item._id}
                            address={address}
                            updated={handleupdate}
                        />
                    ))}
                </div>
            </div>
            <div className="countclear">
                <p>Total Price</p>
                <div className="column">
                    <p>{tolvalue} ETH</p>
                    <p><EthereumToINR price={tolvalue}/></p>
                </div>
            </div>
            <div className='collectionitem'>
                <button>Purchase</button>
            </div>
        </div>
    );
}

export default Cartpage;