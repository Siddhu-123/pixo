import React, { useState, useEffect } from 'react';
import Anacard from './usercard';
import Nftcard from './nftcard';
import Collcard from './collcard';
import axios from 'axios';
import nlp from 'compromise';

const Searchresults = ({query}) => {
    const [allnftdata, setAllNftData] = useState([]);
    const [allcolldata, setAllCollData] = useState([]);
    const [alluserdata, setAllUserData] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [characteristics, setCharacteristics] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const nftsResponse = await axios.get('http://localhost:5000/nfts');
            const nftsData = nftsResponse.data.data;
            setAllNftData(nftsData);

            const collResponse = await axios.get('http://localhost:5000/collection');
            const collData = collResponse.data.data;
            setAllCollData(collData);

            const userResponse = await axios.get('http://localhost:5000/userinfo');
            const userData = userResponse.data.data;
            setAllUserData(userData);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
        };

        fetchData();
    }, []);

    const extractCharacteristics = (text) => {
        const doc = nlp(text);
        
        const characteristics = [];

        doc.nouns().out('array').forEach(chunk => {
            if (chunk.length > 2) {
                characteristics.push(chunk);
                if (characteristics.length === 5) {
                    return false;
                }
            }
        });
        
        return characteristics;
    };
    useEffect(() => {
        const handleSearch = () => {
            const result = extractCharacteristics(query);
            setCharacteristics(result);
            const filteredNFTs = allnftdata.filter(nft => {
                const nameMatches = nft.name.toLowerCase().includes(query.toLowerCase());
                const descriptionMatches = nft.description.toLowerCase().includes(query.toLowerCase());
                const imageFeaturesMatch = nft.image_features.toLowerCase().includes(query.toLowerCase()) || nft.image_features.toLowerCase().includes(characteristics);
                const traitsMatch = nft.traits.toLowerCase().includes(query.toLowerCase());
                
                return nameMatches || descriptionMatches || imageFeaturesMatch || traitsMatch;
            });
            const filteredCollections = allcolldata.filter(coll => {
                return coll.name.toLowerCase().includes(query.toLowerCase()) ||
                    coll.description.toLowerCase().includes(query.toLowerCase());
            });        
            const filteredUsers = alluserdata.filter(user => {
                return user.name.toLowerCase().includes(query.toLowerCase()) ||
                    user.username.toLowerCase().includes(query.toLowerCase()) || 
                    user.email.toLowerCase().includes(query.toLowerCase()) ||
                    user.instagram.toLowerCase().includes(query.toLowerCase()) ||
                    user.twitter.toLowerCase().includes(query.toLowerCase());
            });
            

            setSearchResults({
                nfts: filteredNFTs,
                collections: filteredCollections,
                users: filteredUsers
            });

        };
        handleSearch();
    }, [query]);

    return (<>
        {query ? (<>
        <div className="back">
            <div className="searchresults">
                <div className="users">
                    <p className='heading1'>Users</p>
                    <p className='text1'>{searchResults.users.length || 0} results found</p>
                    <div className="scrollusers">
                        <div className="usercards">
                            {searchResults.users && searchResults.users.map(users => (
                                <Anacard id={users._id} imgg={users.profileimage} name={users.name} username={users.username}/>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="nfts">
                    <p className='heading1'>NFTs</p>
                    <p className='text1'>{searchResults.nfts.length} results found</p>
                    <div className="scrollnfts">
                        <div className="nftcards">
                            {searchResults.nfts && searchResults.nfts.map(nfts => (
                                <Nftcard id={nfts._id} imgg={nfts.image} name={nfts.name} dis={nfts.description}/>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="colls">
                    <p className='heading1'>Collections</p>
                    <p className='text1'>{searchResults.collections.length || 0} results found</p>
                    <div className="scrollnfts">
                        <div className="collcards">
                            {searchResults.collections && searchResults.collections.map(coll => (
                                <Collcard id={coll._id} imgg={coll.image} name={coll.name}/>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>):(<></>)}
    </>);
};

export default Searchresults;








{/* <div>
                    <h2>NFTs</h2>
                    {searchResults.nfts && searchResults.nfts.map(nft => (
                        <div key={nft._id}>{nft.name}</div>
                    ))}
                </div>
                <div>
                    <h2>Collections</h2>
                    {searchResults.collections && searchResults.collections.map(collection => (
                        <div key={collection._id}>{collection.name}</div>
                    ))}
                </div>
                <div>
                    <h2>Users</h2>
                    {searchResults.users && searchResults.users.map(user => (
                        <div key={user._id}>{user.name}</div>
                    ))}
                </div> */}
                {/* {query && (
                    <div>
                        <h2>Main sub-names or characteristics:</h2>
                        <ul>
                            {characteristics.map((char, index) => (
                                <li key={index}>{char}</li>
                            ))}
                        </ul>
                    </div>
                )} */}