import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../../../../css files/dashboard/create.css';
import i1 from "../../../../images/ethicon.svg";
import Createuploadimage from './createuploadimage';
import Loadingani from "./loadingani";
import axios from 'axios';

const Collectionitem = ({ imgg, name1,isactive,onClick}) => {
    return (
        <div className="createcollectionitem">
            <img className={`createcollectionitemimg ${isactive ? 'active' : ''}`} src={require(`../../../../image/coll/${imgg}`)} alt={name1}  onClick={onClick}/>
            <p>{name1}</p>
        </div>
    );
};

const Create = ({address}) => {
    const [connect, setconnect] = useState(false);
    const [createnftclicked,setcreatenftclicked] = useState(false);
    const [imageuploaded,setimageuploaded] = useState(false);
    const [contractmade,setcontractmade] = useState(false);
    const [minting,setminting] = useState(false);
    const [randomnumber, setRandomNumber] = useState(null);
    const address1 = (address.substring(0, 6) + "..." + address.substring(36, 42)).toUpperCase();
    const [value, setValue] = useState(0);
    const navigate = useNavigate();
    const handleChange = (e) => {
        setValue(e.target.value);
    };
    const calculateFee = () => {
        if (!value || isNaN(value)) {
            return 'Please enter a valid number';
        }
        const price = parseFloat(value);
        const fee = price - price * 0.02;
        return {
            originalprice: price,
            calprice: fee,
        };
    };
    const { originalprice, calprice } = calculateFee();
    const [dash, setDash] = useState(3 || 1);
    useEffect(() => {
        localStorage.setItem('dash', dash);
    }, [dash]);
    const change = () => {
        setDash(4);
        window.location.reload();
    };
    window.onload = () => setRandomNumber(Math.floor(Math.random() * 100) + 1);

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
    }, [address,randomnumber]);
    const [properties, setProperties] = useState([{ size: '', type: '' }]);
    const handleAddProperty = () => {
        const lastProperty = properties[properties.length - 1];
        if (lastProperty.size.trim() !== '' || lastProperty.type.trim() !== '') {
            setProperties([...properties, { size: '', type: '' }]);
        }
    };
    const handlePropertyChange = (index, e) => {
        const { name, value } = e.target;
        const updatedProperties = [...properties];
        updatedProperties[index][name] = value;
        setProperties(updatedProperties);
    };

    const handleRemoveProperty = (index) => {
        const updatedProperties = [...properties];
        updatedProperties.splice(index, 1);
        setProperties(updatedProperties);
    };
    const [selectedCollection, setSelectedCollection] = useState(null);

    const handleIconClick = (index) => {
        setSelectedCollection(index);
      };
    const [selectedImage, setSelectedImage] = useState(null);
    const [date1, setdate1] = useState();
    const handledate = (e) => {
        setdate1(e.target.value);
    };
    const [image, setImage] = useState(null);
    const handleImageSelect = (file) => {
        setSelectedImage(file.name);
        setImage(file);
    };

    const closeit = () => {
        setTimeout(() => {
            setcreatenftclicked(false);
            setcontractmade(false);
            setimageuploaded(false);
            setminting(false);
            navigate("/Account");
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
        var imagenamestr = "../pixelopolis/src/image/nft/" + image.name;
        const imagepath = {imagepath:imagenamestr,_id:nftcontractid};
        formData.append("image", image);
        try {
            await axios.post("http://localhost:5000/upload-nftimage", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            await axios.post('http://127.0.0.1:5000/process_data', imagepath);
            uploaddelay();
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };
    const contractdelay = () => {
        setTimeout(() => {
            handleimageupload();
            setcontractmade(true);
        }, 10000);
    };
    const [nftcontractid, setcontractid] = useState(null);

    const handleSubmit = async (event) => {
        if (event) {
            event.preventDefault();
        }
        const d = new Date();
        const date = String(d.getDate()) + (d.getMonth() + 1) + d.getFullYear() + d.getHours() + d.getMinutes();
        setcontractid(date + "-" + address);
        try {
            const formData = {
                transaction: [{
                    event: "listing",
                    price: value,
                    from: address,
                    to: "",
                    date: d,
                    expirydate: date1,
                }],
                _id: nftcontractid,
                collections: names[selectedCollection].name,
                collectionid: names[selectedCollection].collid,
                name: event.target.elements.name.value,
                date: d,
                image: selectedImage,
                traits: properties.map(property => `${property.size}-${property.type}`).join('_'),
                description: event.target.elements.description.value,
                address: address,
                likes: [],
                views: 0,
                image_features: "",
            };
            if (nftcontractid && names) {
                setcreatenftclicked(true);
                await axios.post('http://localhost:5000/createnft', formData);
                contractdelay();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    return (
        <div className="mainscreate">
            {createnftclicked ? (
            <>
                <div className="creatingnftblock">
                    
                    <h2>Creating your NFT </h2>
                    <div className="hori">
                        <Loadingani status={contractmade}/>
                        <p>Creating Contract for the NFT creation</p>
                    </div>
                    <div className="hori">
                        <Loadingani status={imageuploaded}/>
                        <p>Uploading the NFT to the server</p>
                    </div>
                    <div className="hori">
                        <Loadingani status={minting}/>
                        <p>Listing your NFT</p>
                    </div>
                    {minting ? (
                        <p>Your Nft is listed</p>
                    ):(<></>)}
                </div>
            </>):(<></>)}
                <div className='createnft'>
                    <p>Create New NFT</p>
                    <div className='createaccsection'>
                        <div className='createaccinfo'>
                            <img src={i1} alt="icon" />
                            <div className='createaccinfoid'>
                                <p>{address1}</p>
                                <p>Ethereum</p>
                            </div>
                        </div>
                        {connect ? (
                            <div className="yes">
                                <p>Connected</p>
                            </div>
                        ) : (
                            <div className="no">
                                <p>Not Connected</p>
                            </div>
                        )}
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="selectcollection">
                            <p className="p1">Select Collection</p>
                            <p className="p1" onClick={change}>+</p>
                        </div>
                        <div className="scrollcollection">
                            <div className="collectionitems">
                                {names.map((name, index) => (
                                    <Collectionitem
                                        key={index}
                                        imgg={name.imgg}
                                        name1={name.name}
                                        collid={name.collid}
                                        isactive={selectedCollection === index}
                                        onClick={() => handleIconClick(index)}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="p1">Upload file</p>
                        <Createuploadimage onImageSelect={handleImageSelect}/>
                        <div className='createpricingsection'>
                            <p>Put on marketplace</p>
                            <p>Enter price to allow users instantly purchase your NFT</p>
                            <p>Price</p>
                            <div className='createenterprice' >
                                <input type="text" placeholder="Enter Price" value={value} onChange={handleChange} required/>
                                <p>ETH</p>
                            </div>
                        </div>
                        <div className="createpricecal">
                            <div className="createcalprice">
                                <div className='price'>
                                    <p>Price</p>
                                    <p>{originalprice}</p>
                                </div>
                                <div className='price'>
                                    <p>Pixopolis fee</p>
                                    <p>2%</p>
                                </div>
                                <div className='price'>
                                    <p>Gas fee</p>
                                    <p>will be varied</p>
                                </div>
                            </div>
                            <div className="createcalpriceresult">
                                <p>You will receive</p>
                                <p>{calprice} ETH - Gas fee</p>
                            </div>
                        </div>
                        <div className='createlistingsection'>
                            <p>Date of listing expiration</p>
                            <div className='enterdate'>
                                <input type="datetime-local" name="datetime" value={date1} onChange={handledate} placeholder="Enter date and time" required/>
                            </div>
                        </div>
                        <div className="createentername">
                            <p>Name</p>
                            <input type="text" name="name" placeholder='e.g."Mountain minions and monkeys"' required/>
                        </div>
                        <div className="createentername">
                            <p>Description</p>
                            <textarea rows={3} name="description" placeholder='e.g. "It is a huge mountain with minions in it dancing and partying with the monkeys"' />
                        </div>
                        {properties.map((property, index) => (
                            <div key={index} className="createentername">
                                <div className="selectcollection">
                                    <p>Properties (Trait {index+1})</p>
                                    {index !== 0 && <div className="remove-button" onClick={() => handleRemoveProperty(index)}>−</div>}
                                </div>
                                <div className="sizeandtype">
                                    <input
                                        type="text"
                                        name="size"
                                        placeholder='e.g."Size"'
                                        value={property.size}
                                        onChange={(e) => handlePropertyChange(index, e)}
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="type"
                                        placeholder='e.g."Size and type"'
                                        value={property.type}
                                        onChange={(e) => handlePropertyChange(index, e)}
                                        required
                                    />
                                </div>
                            </div>
                        ))}
                        <button className='add' onClick={handleAddProperty}>Add Property</button>
                        <div className='createitem'>
                            <button type="submit">Create Item</button>
                        </div>
                    </form>
                </div>
        </div>
    );
}

export default Create;
