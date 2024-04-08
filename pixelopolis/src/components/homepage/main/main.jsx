import React, { useState, useEffect } from 'react';
import Dashboard from './dashboard/dashboard';
import Virtualland from './virtualland/virtualland'; 
import Create from './create/create'; 
import Collection from './collection/collection'; 
import Favorites from './favorites/favorites'; 
import Settings from './settings/settings';
import Toptable from './topcollectors/toptable'; 
import Trendtable from './trendcollections/trendtable'; 
import Navop from './navop';
import '../../../css files/dashboard/main.css';

export const Main = ({ dash, nvoclick, address }) => {
    const dash1 = parseInt(localStorage.getItem('dash')) || 1;
    
    let content;
    if (dash === 1) {
        content = <Dashboard />;
    } else if (dash === 2 || dash1 === 2) {
        content = <Virtualland />;
    } else if (dash === 3) {
        content = <Create address={address} />;
    } else if (dash === 4) {
        content = <Collection address={address} />;
    } else if (dash === 5) {
        content = <Favorites address={address} />;
    } else if (dash === 6) {
        content = <Settings address={address} />;
    } else if (dash === 7) {
        content = <Toptable />;
    } else if (dash === 8) {
        content = <Trendtable />;
    }

    return (
        <div className="main">
            <div className='mains'>
                <Navop navopclick={nvoclick} />
                {content}
            </div>
        </div>
    );
};

export default Main;
