import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdSlide = () => {
  const [collections, setCollections] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const address = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const response = await axios.get('http://localhost:5001/collection');
        const filteredCollections = response.data.data
          .filter((item) => item.address !== address[0])
          .sort(() => Math.random() - 0.5)
          .slice(0, 5);
        setCollections(filteredCollections);
      } catch (error) {
        console.error('Error fetching NFT data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % collections.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [collections]);

  return (
    <div className="slideshow-container">
      {collections.map((item, index) => (
        <div key={index} className={`slide ${index === currentIndex ? 'active' : ''}`}>
          <Link to={`/Collection/${item._id}`}>
            <img src={require(`../../../../image/coll/${item.image}`)} alt="collection" />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default AdSlide;
