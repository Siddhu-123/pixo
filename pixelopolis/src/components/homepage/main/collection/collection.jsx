import React,{useState,useEffect} from "react";
import '../../../../css files/dashboard/collection.css';
import i1 from "../../../../images/ethicon.svg";
import Collectionuploadimage from './collectionuploadimage';
import Cate from './categoriescoll';
import Loadingani from "../create/loadingani";
import {Link} from 'react-router-dom';
import axios from 'axios';

const Collectionitem = ({imgg,name1,collid}) => {
    return (
        <div className="createcollectionitem">
            <Link to={`/collection/${collid}`}>
                <img src={require(`../../../../image/coll/${imgg}`)}/>
            </Link>
            <p>{name1}</p>
        </div>
      );
  };

const Collection = ({address}) =>{
    const [connect,setconnect] = useState(false);
    const [createnftclicked,setcreatenftclicked] = useState(false);
    const [imageuploaded,setimageuploaded] = useState(false);
    const [contractmade,setcontractmade] = useState(false);
    const [minting,setminting] = useState(false);
    var address1 = (address.substring(0,6) + "..." +address.substring(36,42)).toUpperCase();
    const [create, setcreate] = useState(false);
    const createcoll = () => {
        setcreate(true);
    }
    const close = () => {
        setcreate(false);
    }
    const [names, setNames] = useState([]);

    useEffect(() => {
        if(address){
            setconnect(true);
        }
        axios.get('http://localhost:5000/collection')
            .then(response => {
                const data = response.data.data;
                const addressCollectionsMap = [];
                data.forEach(collection => {
                    if (collection.address === address) {
                        addressCollectionsMap.push(collection);
                    }
                });
                const flattenedNames = [];
                addressCollectionsMap.forEach(collection => {
                    flattenedNames.push({
                        imgg: collection.image,
                        name: collection.name,
                        collid: collection._id,
                    });
                });
                setNames(flattenedNames);
            })
            .catch(error => {
                console.error('Error fetching collections:', error);
            });
    }, [names]);
    const [imagepath1,setimagepath] = useState("");
    const [collectionid,setcollectionid] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const handleCategorySelect = (category) => {
      setSelectedCategory(category);
    };
    const [image, setImage] = useState(null);
    const imagepath2 = (file) => {
        setimagepath(file.name);
        setImage(file);
    }
    const closeit = () => {
        setTimeout(() => {
            setcreatenftclicked(false);
            setcontractmade(false);
            setimageuploaded(false);
            setminting(false);
            setcreate(false);
        }, 5000);
    };
    const mintdelay = () => {
        setTimeout(() => {
            setminting(true);
            closeit();
        }, 5000);
    };
    const uploaddelay = () => {
        setTimeout(() => {
            setimageuploaded(true);
            mintdelay();
        }, 2000);
    };
    const handleimageupload = async (e) => {
        if (e) {
            e.preventDefault();
        }
        const formData = new FormData();
        formData.append("image", image);
        try {
            await axios.post("http://localhost:5000/upload-collimage", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            uploaddelay();
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };
    const contractdelay = () => {
        setTimeout(() => {
            handleimageupload();
            setcontractmade(true);
        }, 2000);
    };
    const handleSubmit = async (event) => {
        if (event) {
            event.preventDefault();
        }
        event.preventDefault();
        const d = new Date();
        const date2 = String(d.getDate())+(d.getMonth()+1)+d.getFullYear()+d.getHours()+d.getMinutes()+d.getSeconds();
        setcollectionid(date2 +"-" + address);
        try {
            const formData = {
                _id:collectionid,
                image: imagepath1,
                date: d,
                address: address,
                category:selectedCategory,
                name: event.target.elements.name.value,
                description: event.target.elements.description.value,
                likes:[],
                nfts:[],
            };
            if(collectionid){
                setcreatenftclicked(true);
                await axios.post('http://localhost:5000/createcollection', formData);
                contractdelay();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    return(
        <div className="mainscollection">
            {createnftclicked ? (
            <>
                <div className="creatingnftblock">
                    <h2>Creating a Collection </h2>
                    <div className="hori">
                        <Loadingani status={contractmade}/>
                        <p>Creating Contract for the Collection creation</p>
                    </div>
                    <div className="hori">
                        <Loadingani status={imageuploaded}/>
                        <p>Uploading the image to the server</p>
                    </div>
                    <div className="hori">
                        <Loadingani status={minting}/>
                        <p>Creating the collection</p>
                    </div>
                    {minting ? (
                        <p>Your Collection is Created</p>
                    ):(<></>)}
                </div>
            </>):(<></>)}
            <div className='collectionnft'>
                <p>Collection </p>
                <div className='collectionaccsection'>
                    <div className='collectionaccinfo'>
                        <img src={i1}/>
                        <div className='collectionaccinfoid'>
                            <p>{address1}</p>
                            <p>Ethereum</p>
                        </div>
                    </div>
                    {connect ?(
                        <div className="yes">
                            <p>Connected</p>
                        </div>
                    ):(
                        <div className="no">
                            <p>Not Connected</p>
                        </div>
                    )}
                </div>
                <div className="selectcollection">
                    <p className="p1">Your Collections</p>
                    <p className="p2" onClick={createcoll}>+</p>
                </div>
                <div className="scrollcollection">
                    <div className="collectionitems">
                    {names.map((name, index) => (
                        <Collectionitem
                        key={index}
                        imgg={name.imgg}
                        name1={name.name}
                        collid={name.collid}
                        />
                        ))}
                    </div>
                </div>
                {create ? (
                    <>
                        <svg className="close" onClick={close} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 100 100">
                            <line x1="20" y1="20" x2="80" y2="80" stroke="black" stroke-width="10" />
                            <line x1="80" y1="20" x2="20" y2="80" stroke="black" stroke-width="10" />
                        </svg>
                        <form onSubmit={handleSubmit}>
                            <div className="collectioncreate">
                                <div className="imggcollcreate">
                                    <p className="p1">Upload file</p>
                                    <Collectionuploadimage imagepath={imagepath2}/>
                                </div>
                                <div className="collfillinfo">
                                    <div className="collectionentername">
                                        <p>Name</p>
                                        <input type="text" name="name" placeholder='e.g."Mountain minions and monkeys"'/>
                                    </div>
                                    <div className="collectionentername">
                                        <p>Description  (upto 1000 Words)</p>
                                        <textarea rows="4" name="description" placeholder='e.g. "It is a huge mountain with minions in it dancing and partying with the monkeys"' required/>
                                    </div>
                                    <div className="collectionentername">
                                        <p>Category (Optional)</p>
                                        <div className="sizeandtype">
                                            <Cate onCategorySelect={handleCategorySelect} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='collectionitem'>
                                <button type="submit">Create Collection</button>
                            </div>
                        </form>
                    </>
                ):(<></>)}
            </div>
        </div>
    );
}

export default Collection;