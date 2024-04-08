import React ,{useState,useEffect}from 'react';
import '../../../../css files/dashboard/dashboard.css';
import Carousel from './corousel/carousel';
import Cards from './cards/cards';
import Footer from './footer';
import Cate from '../collection/categoriescoll';

export const Dashboard = () =>{
    const [index, setIndex] = useState(0);
    const [randomNumber, setRandomNumber] = useState(null);
    window.onload = () => setRandomNumber(Math.floor(Math.random() * 100) + 1);
    const [address, setAddress] = useState("");

    const checkMetaMaskConnection = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAddress(accounts[0]);
            } catch (error) {
                console.error(error);
            }
        }
    };
    useEffect(() => {
        checkMetaMaskConnection();
    }, [address,randomNumber]);
    
    useEffect(() => {const interval = setInterval(() => {
            if (index < 4) {
                rightClick();
            } else if (index === 4) {
                setIndex(0);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [index]);
    const names = ["All", "Avatar", "Art", "Gaming", "Sport", "Digital land", "Photography", "Music", "Generative AI", "PFP's", "Memberships"];
    const [selectedCategory, setSelectedCategory] = useState("All");
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };
    useEffect(() => {
        setSelectedCategory(names[localStorage.getItem('category')]);
    }, [localStorage.getItem('category')]);

    const leftClick = () => {if (index > 0) {setIndex(index - 1);}};
    const rightClick = () => {if (index < 4) {setIndex(index + 1);}};

    const sliderStyle = {transform: `translateX(-${index * 20}%)`,};


    return (
        <>
            <div id="Dashboard" className='mains0'>
                <div className='shiftl' onClick={leftClick}>{"<"}</div>
                <Carousel slider={sliderStyle}/>
                <div className='shiftr' onClick={rightClick}>{">"}</div>
                <div className="shiftdiv">
                    <div className='shiftl' onClick={leftClick}>{"<"}</div>
                    <div className='shiftr' onClick={rightClick}>{">"}</div>
                </div>
            </div>
            <svg className='starsvg' viewBox="0 0 863 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_i_414_982)">
                    <path d="M0.0317688 19.9998C432.085 19.9998 432.086 19.9998 432.163 0C432.24 20.0002 432.638 20.0002 863 20.0002C432.163 20.0002 432.163 20.0002 432.163 39C432.163 19.9998 432.086 19.9998 0.0329192 19.9998H0.0317688Z" fill="#E090FF" />
                </g>
                <path d="M432.163 0C432.086 20.0002 432.085 19.9998 0 19.9998C432.086 19.9998 432.163 19.9993 432.163 39C432.163 20.0002 432.163 20.0002 863 20.0002C432.638 20.0002 432.24 20.0002 432.163 0Z" stroke="black" />
                <defs>
                    <filter id="filter0_i_414_982" x="0" y="-0.00195312" width="863" height="39.002" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dx="3" dy="3" />
                        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0" />
                        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_414_982" />
                    </filter>
                </defs>
            </svg>
            <div className="dashfil">
                <span>Categories</span>
                <Cate onCategorySelect={handleCategorySelect} />
            </div>
            <Cards heading="Category Collections" address={address} type={"category"} category={selectedCategory}/>
            <svg className='starsvg' viewBox="0 0 863 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_i_414_982)">
                    <path d="M0.0317688 19.9998C432.085 19.9998 432.086 19.9998 432.163 0C432.24 20.0002 432.638 20.0002 863 20.0002C432.163 20.0002 432.163 20.0002 432.163 39C432.163 19.9998 432.086 19.9998 0.0329192 19.9998H0.0317688Z" fill="#E090FF" />
                </g>
                <path d="M432.163 0C432.086 20.0002 432.085 19.9998 0 19.9998C432.086 19.9998 432.163 19.9993 432.163 39C432.163 20.0002 432.163 20.0002 863 20.0002C432.638 20.0002 432.24 20.0002 432.163 0Z" stroke="black" />
                <defs>
                    <filter id="filter0_i_414_982" x="0" y="-0.00195312" width="863" height="39.002" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dx="3" dy="3" />
                        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0" />
                        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_414_982" />
                    </filter>
                </defs>
            </svg>
            <Cards heading="High Value Collections" address={address} type={"high"} category={selectedCategory}/>
            <svg className='starsvg' viewBox="0 0 863 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_i_414_982)">
                    <path d="M0.0317688 19.9998C432.085 19.9998 432.086 19.9998 432.163 0C432.24 20.0002 432.638 20.0002 863 20.0002C432.163 20.0002 432.163 20.0002 432.163 39C432.163 19.9998 432.086 19.9998 0.0329192 19.9998H0.0317688Z" fill="#E090FF" />
                </g>
                <path d="M432.163 0C432.086 20.0002 432.085 19.9998 0 19.9998C432.086 19.9998 432.163 19.9993 432.163 39C432.163 20.0002 432.163 20.0002 863 20.0002C432.638 20.0002 432.24 20.0002 432.163 0Z" stroke="black" />
                <defs>
                    <filter id="filter0_i_414_982" x="0" y="-0.00195312" width="863" height="39.002" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dx="3" dy="3" />
                        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0" />
                        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_414_982" />
                    </filter>
                </defs>
            </svg>
            <Cards heading="Most Liked Collections" address={address} type={"liked"} category={selectedCategory}/>
            <svg className='starsvg' viewBox="0 0 863 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_i_414_982)">
                    <path d="M0.0317688 19.9998C432.085 19.9998 432.086 19.9998 432.163 0C432.24 20.0002 432.638 20.0002 863 20.0002C432.163 20.0002 432.163 20.0002 432.163 39C432.163 19.9998 432.086 19.9998 0.0329192 19.9998H0.0317688Z" fill="#E090FF" />
                </g>
                <path d="M432.163 0C432.086 20.0002 432.085 19.9998 0 19.9998C432.086 19.9998 432.163 19.9993 432.163 39C432.163 20.0002 432.163 20.0002 863 20.0002C432.638 20.0002 432.24 20.0002 432.163 0Z" stroke="black" />
                <defs>
                    <filter id="filter0_i_414_982" x="0" y="-0.00195312" width="863" height="39.002" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dx="3" dy="3" />
                        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0" />
                        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_414_982" />
                    </filter>
                </defs>
            </svg>
            <Footer/>
        </>
    );
}
export default Dashboard;
