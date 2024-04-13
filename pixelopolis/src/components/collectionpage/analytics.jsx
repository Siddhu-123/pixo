import React from "react";
import Line from './graphs/line';
import Anacard from "./microcomponents/anacard";
import Eleslide from "./microcomponents/eleslide";
import Ownerele from "./microcomponents/ownerele";
import n2 from '../../images/square/fig (19).jpg';
import '../../css files/collpage.css';
const Analytics = ({nftdata,colldata,userdata,floor,tolvol})=>{
    let transacsale = 0;
    nftdata.forEach(nft => {
        nft.transaction.forEach(transaction => {
            if (transaction.event === "sale") {
                transacsale = transacsale + 1;
            }
        });
    });
    var lists = [];
    
    if (nftdata && userdata) {
        nftdata.forEach(nft => {
            nft.transaction.forEach(transaction => {
                var date = new Date();
                var expire = new Date(transaction.expirydate) - date;
                if (transaction.event === "listing" && expire > 0) {
                    if(parseInt(((transaction.price/floor)*100)-100) < 10){
                        var per = parseFloat(((transaction.price/floor)*100)-100);
                    }
                    else{
                        var per = parseInt(((transaction.price/floor)*100)-100);
                    }
                    lists.push({"id":nft._id,"imgg":nft.image,"name" : nft._id.substring(0,11),"time" : transaction.date ,"eth" : transaction.price ,"per" : String(per)});
                }
            });
        });
    }
    var sortedNftData = lists.slice().sort((a, b) => {
        const dateA = a.eth;
        const dateB = b.eth;
        return dateA - dateB;
    });

    var listsale = [];
    
    if (nftdata && userdata) {
        nftdata.forEach(nft => {
            nft.transaction.forEach(transaction => {
                if (transaction.event === "sale") {
                    if(parseInt(((transaction.price/floor)*100)-100) < 10){
                        var per = parseFloat(((transaction.price/floor)*100)-100);
                    }
                    else{
                        var per = parseInt(((transaction.price/floor)*100)-100);
                    }
                    listsale.push({"id":nft._id,"imgg":nft.image,"name" : nft._id.substring(0,11),"time" : transaction.date ,"eth" : transaction.price ,"per" : String(per)});
                }
            });
        });
    }
    var sortedlistsale = listsale.slice().sort((a, b) => {
        const dateA = a.eth;
        const dateB = b.eth;
        return dateA - dateB;
    });
    var countlist = sortedNftData.length;
    var countsales = sortedlistsale.length;

    var data11 = [];
    var data12 = [];
    var temp = {};
    var t = 0;
    nftdata.forEach(nft => {
        const address = nft.address;
        nft.transaction.forEach(transarray => {
            let tempObj1 = {};
            if(transarray.event === "listing" || transarray.event === "sale"){
                tempObj1["x"] = new Date(transarray.date);
                tempObj1["y"] = transarray.price;
                data11.push(tempObj1);
            }
            if(transarray.event === "sale"){
                tempObj1["x"] = new Date(transarray.date);
                tempObj1["y"] = transarray.price;
                data12.push(tempObj1);
            }
        });
        temp[address] = (temp[address] || 0) + 1; 
    });

    var data1 = data11.slice().sort((a, b) => {
        const dateA = a.x;
        const dateB = b.x;
        return dateA - dateB;
    });

    const data13 = Object.entries(temp).map(([key, value]) => ({ address: key, count: value }));

    const rangeCounts = {
        '1 item': 0,
        '2-5 items': 0,
        '5-10 items': 0,
        '10-50 items': 0,
        '+50 items': 0
    };
    
    const totalCount = data13.length;
    
    data13.forEach(({ count }) => {
        if (count === 1) rangeCounts['1 item']++;
        else if (count <= 5) rangeCounts['2-5 items']++;
        else if (count <= 10) rangeCounts['5-10 items']++;
        else if (count <= 50) rangeCounts['10-50 items']++;
        else rangeCounts['+50 items']++;
    });
    
    const percentages = Object.entries(rangeCounts).map(([range, count]) => ({
        per: (count / totalCount) * 100,
        item: range
    }));
    // console.log(data13);

    var temp14 = {};
    var data14 = [];
    var totalnftcount = nftdata.length;
    if(userdata){
        data13.forEach((data) => {
            temp14 = {};
            var user = userdata.find((item) => item._id === data.address);
            temp14["image"] = user.profileimage;
            temp14["name"] = user.name;
            temp14["address"] = data.address;
            temp14["num"] = data.count;
            var per = (data.count / totalnftcount) * 100;
            temp14["per"] = per.toFixed(4);
            data14.push(temp14);
        });
    }

    return(
        <div className="analytics">
            <div className="I">
                <p>Volume</p>
                <span>{tolvol} ETH</span>
            </div>
            <div className="II">
                <p>Sales</p>
                <span>{transacsale}</span>
            </div>
            <div className="III">
                <p>Floor price</p>
                <span>{floor} ETH</span>
            </div>
            <div className="flrpri">
                <p>Floor price</p>
                <Line type="line" data={data1}/>
            </div>
            <div className="sales">
                <p>Sales</p>
                {data12.length ? (<>
                <Line type="scatter" data={data12}/>
                </>):(<h2>No Sales</h2>)}
            </div>
            <div className="listnft">
                <p>Listings</p>
                <div className="listnftscroll">
                    <div className="listnftbody">
                        {countlist ? (<>
                            {sortedNftData.map((item, index) => (
                                <Anacard
                                key={index}
                                id={item.id}
                                imgg={item.imgg}
                                time={item.time}
                                name={item.name}
                                eth={item.eth}
                                per={item.per}/>
                            ))}
                        </>):(<h2>No Listings</h2>)}
                    </div>
                </div>
            </div>
            <div className="salenft">
                <p>Sales</p>
                <div className="salenftscroll">
                    <div className="salenftbody">
                        {countsales ? (<>
                            {sortedlistsale.map((item, index) => (
                                <Anacard
                                key={index}
                                id={item.id}
                                imgg={item.imgg}
                                time={item.time}
                                name={item.name}
                                eth={item.eth}
                                per={item.per}/>
                            ))}
                        </>):(<h2>No Sales</h2>)}
                    </div>
                </div>
            </div>
            <div className="owndis">
                <p>Owner Discription</p>
                <p>{totalCount}</p>
                <div className="owndisbody">
                    {percentages.map((thing, index) => (
                        <Eleslide key={index} per={thing.per} item={thing.item} />
                    ))}
                </div>
            </div>
            <div className="owners">
                <p>Owners</p>
                <p>Top 100</p>
                <div className="tablehead">
                    <p>NAME</p>
                    <div className="right">
                        <p>ADDRESS</p>
                        <p>OWNED</p>
                        <p>%OWNED</p>
                    </div>
                </div>
                <div className="ownerscroll">
                    <div className="ownerbody">
                        {data14.map((item, index) => (
                            <Ownerele key={index} key1={index} imgg={item.image} name={item.name} address={item.address} num={item.num} per={item.per}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Analytics;