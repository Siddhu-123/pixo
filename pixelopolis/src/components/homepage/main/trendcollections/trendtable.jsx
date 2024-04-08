import React,{useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import '../../../../css files/dashboard/settings.css';
import i1 from '../../../../images/square/fig (20).jpg';
import i2 from '../../../../images/square/fig(10).jpg';
import i3 from '../../../../images/square/fig (11).jpg';
import i4 from '../../../../images/square/fig (12).jpg';
import i5 from '../../../../images/square/fig (13).jpg';
import i6 from '../../../../images/square/fig (14).jpg';
import i7 from '../../../../images/square/fig (15).jpg';
import i8 from '../../../../images/square/fig (16).jpg';
import axios from 'axios'; 
const Cell = ({ ind, id, imgg, name, vol, sale, floor }) => {
    return (
        <div className="row">
                <div className="cell1">{ind + 1}</div>
                <div className="cell2">
                    <Link to={`/Collection/${id}`}>
                        <img src={require(`../../../../image/coll/${imgg}`)} alt={name} style={{ width: '4rem', borderRadius: '1rem' }} />
                    </Link>
                    <div className='name' style={{ paddingLeft: '1rem' }}>{name}</div>
                </div>
                <div className="cell3">{vol}</div>
                <div className="cell4">{sale}</div>
                <div className="cell5">{floor}</div>
            </div>
    );
}

const Toptable = () => {    
    const [colldata,setcolldata] = useState([]);
    useEffect(() => {
      const fetchData = async () => {
        try {
            const address = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const collResponse = await axios.get('http://localhost:5000/collection');
            const collData = collResponse.data.data;
            const nftResponse = await axios.get('http://localhost:5000/nfts');
            const nftData = nftResponse.data.data;
            if(address[0]){
                var foundCollData = collData.filter(item => item.address !== address[0]);
            }
            else{
                var foundCollData = collData;
            }
            var sale = 0;
            var floor = [];
            var temp2 = 0;
            var collsdata = [];
            var temp3 = {};
            var tolvol = 0;
            foundCollData.forEach(coll => {
                floor = [];
                temp3 = {};
                coll.nfts.forEach(nft => {
                    sale = 0;
                    temp2 = 0;
                    var temp = nftData.find(item => item._id === nft);
                    temp.transaction.forEach(transaction => {
                        if (transaction.event === "sale"){
                            sale++;
                        }
                        if(transaction.event !== "offer"){
                            temp2 = transaction.price;
                        }
                    });
                    floor.push(temp2);
                });
                temp3["id"] = coll._id;
                temp3["image"] = coll.image;
                temp3["name"] = coll.name;
                temp3["floor"] = floor.sort()[0] || 0;
                temp3["sale"] = sale;
                tolvol = floor.reduce((acc, curr) => acc + curr, 0);
                temp3["vol"] = tolvol.toFixed(4);
                collsdata.push(temp3);
            });
            if(collsdata.length){
                setcolldata(collsdata);
            }                
        } catch (error) {
            console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);
    return (
        <>
            <div className="toptable">
                <h2>Trending Collections</h2>
                <div className="rowheader">
                    <div className="cell1">#</div>
                    <div className="cell2">Collection</div>
                    <div className="cell3">Volume</div>
                    <div className="cell4">Sales</div>
                    <div className="cell5">Floor Price</div>
                </div>
                <div className="rowscroll">
                    <div className="rows">
                        {colldata.map((coll, index) => (
                            <Cell key={index} ind={index} id={coll.id} imgg={coll.image} name={coll.name} sale={coll.sale} floor={coll.floor} vol={coll.vol} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Toptable;
