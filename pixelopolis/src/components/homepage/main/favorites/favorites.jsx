import React,{useState,useEffect} from "react";
import '../../../../css files/dashboard/favorite.css';
import Cate from '../collection/categoriescoll';
import Cardacc from '../../../accountpage/cardacc';
import NFTSacc from '../../../accountpage/nfts';
import axios from 'axios';
const Favorites = ({address}) =>{
    const [selectedCategory, setSelectedCategory] = useState("All");
    const handleCategorySelect = (category) => {
      setSelectedCategory(category);
    };
    const [combinedData, setcombineddata] = useState([]);
    const [nftlikedlist, setnftlikedlist] = useState([]);
    const [decide, setdecide] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const collectionsResponse = await axios.get('http://localhost:5000/collection');
                const collectionsData = collectionsResponse.data.data;
                const addressCollectionsMap = [];
    
                collectionsData.forEach(collection => {
                    if (collection.address !== address && (selectedCategory === "All" || collection.category === selectedCategory)) {
                        if (collection.likes.includes(address)) {
                            addressCollectionsMap.push(collection);
                        }
                    }
                });
                
                const nftsResponse = await axios.get('http://localhost:5000/nfts');
                const nftsdata = nftsResponse.data.data;
                
                const flattenedCollections = [];
                var tempfloor = [];
                var tolvol = 0;
                var temp = {};
                addressCollectionsMap.forEach(collection => {
                    temp = [];
                    tempfloor = [];
                    collection.nfts.forEach(nft => {
                        const nft1 = nftsdata.find(item => item._id === nft);
                        const nftprice = nft1.transaction[nft1.transaction.length - 1].price;
                        tempfloor.push(nftprice);
                        tolvol = tolvol + nftprice;
                    });
                    temp = collection;
                    temp["floor"] = tempfloor.sort()[0];
                    temp["tolvol"] = Number(tolvol.toFixed(4));
                    flattenedCollections.push(temp);
                });
                setcombineddata(flattenedCollections);
                setdecide(true);

                const nftslist = [];
                nftsdata.forEach(nft => {
                    const collection = collectionsData.find(item => item._id === nft.collectionid);
                    if ((nft.address !== address) && (selectedCategory === "All" || collection.category === selectedCategory)) {
                        if (nft.likes.includes(address)) {
                            nftslist.push(nft);
                        }
                    }
                });
                setnftlikedlist(nftslist);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, [address, selectedCategory]);
    return(
        <div className="mainscollection">
            <div className='collectionnft'>
                <p>Favorites</p>
                <p>The Favorites page on our NFT Marketplace is your go-to hub for personalized curation.</p>
                <div className="cardscroll">
                    <Cate onCategorySelect={handleCategorySelect} />
                    <div className='groupcards1'>
                        {combinedData.map((item, index) => (
                            <Cardacc
                                key={index}
                                imgg={item.image}
                                name={item.name}
                                floor={item.floor}
                                tolvol={item.tolvol}
                                id={item._id}
                                address={address}
                                decide={decide}
                            />
                        ))}
                        {nftlikedlist.map((item, index) => (
                            <NFTSacc
                                key={index}
                                imgg={item.image}
                                name={item.name}
                                dis={item.description}
                                address={address}
                                id={item._id}
                                decide={decide}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Favorites;