import React from 'react';
import {Link} from 'react-router-dom';

const NFT = ({imgg,id}) => {
    return (
        <Link to={`/assets/${id}`}>
            <div className="nftimage">
                <img src={require(`../../../../image/nft/${imgg}`)} alt='collection'/>
            </div>
        </Link>
    );
};

export default NFT;