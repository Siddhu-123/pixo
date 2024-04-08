import React, { useState, useEffect } from "react";
import Pixo from '../../nav/pixo';
import { Link } from 'react-router-dom';
import i1 from "../../../../images/github.png";
import i2 from "../../../../images/instagram.png";
import i3 from "../../../../images/youtube.png";
import i4 from "../../../../images/facebook.png";
import i5 from "../../../../images/linkedin.png";

function Footer() {

    const handleIconClick = (index) => {
        localStorage.setItem('category', index);
    };
    const handleIconClick1 = (index) => {
        localStorage.setItem('dash', index);
        window.location.reload();
    };
    return (
        <div className="padfooter">
            <div className='footer'>
                <div className='text'>
                    <div className='titlepixo'>
                        <Link to="/"><Pixo /></Link>
                    </div>
                    <div className="spanp">
                        <span>Marketplace</span>
                        <div className='fotmarket'>
                            <Link to="/"><p onClick={() => handleIconClick1(1)}>Dashboard</p></Link>
                            <Link to="/"><p onClick={() => handleIconClick1(2)}>Virtual Land</p></Link>
                        </div>
                    </div>
                    <div className="spanp">
                        <span>Categories</span>
                        <div className='fotmarket'>
                            <Link to="/"><p onClick={() => handleIconClick(0)}>All</p></Link>
                            <Link to="/"><p onClick={() => handleIconClick(1)}>Avatar</p></Link>
                            <Link to="/"><p onClick={() => handleIconClick(2)}>Art</p></Link>
                            <Link to="/"><p onClick={() => handleIconClick(3)}>Gaming</p></Link>
                            <Link to="/"><p onClick={() => handleIconClick(4)}>Sport</p></Link>
                            <Link to="/"><p onClick={() => handleIconClick(5)}>Digital</p></Link>
                            <Link to="/"><p onClick={() => handleIconClick(6)}>Photography</p></Link>
                            <Link to="/"><p onClick={() => handleIconClick(7)}>Music</p></Link>
                            <Link to="/"><p onClick={() => handleIconClick(8)}>Generative AI</p></Link>
                            <Link to="/"><p onClick={() => handleIconClick(9)}>PFP's</p></Link>
                            <Link to="/"><p onClick={() => handleIconClick(10)}>Memberships</p></Link>
                        </div>
                    </div>
                    <div className="spanp">
                        <span>My Account</span>
                        <div className='fotmarket'>
                            <Link to="/"><p onClick={() => handleIconClick1(3)}>Create</p></Link>
                            <Link to="/"><p onClick={() => handleIconClick1(4)}>My collection</p></Link>
                            <Link to="/"><p onClick={() => handleIconClick1(5)}>Favorite</p></Link>
                            <Link to="/"><p onClick={() => handleIconClick1(6)}>Settings</p></Link>
                            <Link to="/Account"><p>Profile</p></Link>
                            <p>Theme</p>
                        </div>
                    </div>
                </div>
                <div className="icons">
                    <img src={i1} alt="Github" />
                    <img src={i2} alt="Instagram" />
                    <img src={i3} alt="Youtube" />
                    <img src={i4} alt="Facebook" />
                    <img src={i5} alt="LinkedIn" />
                </div>
            </div>
        </div>
    );
}
export default Footer;