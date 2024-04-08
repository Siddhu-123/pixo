import React ,{useState,useEffect}from 'react';
import Slides from './slides';
import axios from 'axios';
const Carousel = ({slider}) => {
  const [randomcollection,setrandomcollection] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
        try {
          const address = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const collectionsResponse = await axios.get('http://localhost:5000/collection');
          const addressCollectionsMap = collectionsResponse.data.data.filter(item => item.address !== address[0]);
          const randomcoll = addressCollectionsMap.sort(() => Math.random() - 0.5).slice(0, 5);
          setrandomcollection(randomcoll);
          } catch (error) {
            console.error('Error fetching NFT data:', error);
          }
        };
        fetchData();
    }, []);
    return (
      <>
        <div className='car'>
            <div className='matter'>
              <div className="caro" style={slider}>
                {randomcollection.map((item, index) => (
                    <Slides key={index} txt1={item.name} txt2={item.description} imgg={item.image} collid={item._id}/>
                ))}
              </div>
            </div>
        </div>
      </>
    );
}
export default Carousel;