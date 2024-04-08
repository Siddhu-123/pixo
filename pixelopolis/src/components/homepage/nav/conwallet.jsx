import React, { useState, useEffect } from 'react';
import c1 from '../../../images/long/gate.jpg';
import axios from 'axios';
const Conwallet = () => {
  const [connected, setConnected] = useState(false);
  const [consymbol, setconsymbol] = useState("#ff0000");
  const [con, setcon] = useState(false);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      try {
        const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setConnected(true);
        setconsymbol("#14FF00");
        handleSubmit(account[0]);
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    } else {
      setconsymbol("ff0000");
    }
  };
  
  useEffect(() => {
    loadWeb3();
  }, []);


  const handleSubmit = async (event) => {
    const d = new Date();
    try{
      const formdata = {
        _id: event,
        name: "",
        username: "",
        profileimage: "",
        backgroundimage: "",
        date: d,
        bio: "",
        following: [],
        followers: [],
        email: "",
        instagram: "",
        twitter: "",
        website: "",
        collections: [],
        cart: [],
      };
      await axios.post('http://localhost:5000/createuser',formdata);
    }
    catch (error) {
      console.error('Error:', error);
    }
  }
  const popup = () => {
    if(!connected){
      setcon(true);
    }
  }
  const close = () => {
    setcon(false);
  }
  return(
      <>
          <button onClick={() => { loadWeb3(); popup();}} className="Conwallet">
          <svg className="walletbig"  viewBox="0 0 36 29" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 8C0 3.58172 3.58172 0 8 0H24C28.4183 0 32 3.58172 32 8V21C32 25.4183 28.4183 29 24 29H8C3.58172 29 0 25.4183 0 21V8Z" fill="#FF80CD"/>
            <path d="M21 15.5C21 11.9101 23.9101 9 27.5 9H33C34.6569 9 36 10.3431 36 12V19C36 20.6569 34.6569 22 33 22H27.5C23.9101 22 21 19.0899 21 15.5Z" fill="#0D1F96"/>
            <path d="M28.5 15.75C28.5 16.7165 27.7165 17.5 26.75 17.5C25.7835 17.5 25 16.7165 25 15.75C25 14.7835 25.7835 14 26.75 14C27.7165 14 28.5 14.7835 28.5 15.75Z" fill="white"/>
            <path d="M6 8C6 7.44772 6.44772 7 7 7H14C14.5523 7 15 7.44772 15 8C15 8.55228 14.5523 9 14 9H7C6.44772 9 6 8.55228 6 8Z" fill="#85109C"/>
          </svg>
          <svg className="walletsmall" viewBox="0 0 36 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 11C0 6.58172 3.58172 3 8 3H24C28.4183 3 32 6.58172 32 11V24C32 28.4183 28.4183 32 24 32H8C3.58172 32 0 28.4183 0 24V11Z" fill="#FF80CD"/>
            <path d="M21 18.5C21 14.9101 23.9101 12 27.5 12H33C34.6569 12 36 13.3431 36 15V22C36 23.6569 34.6569 25 33 25H27.5C23.9101 25 21 22.0899 21 18.5Z" fill="#0D1F96"/>
            <path d="M28.5 18.75C28.5 19.7165 27.7165 20.5 26.75 20.5C25.7835 20.5 25 19.7165 25 18.75C25 17.7835 25.7835 17 26.75 17C27.7165 17 28.5 17.7835 28.5 18.75Z" fill="white"/>
            <path d="M6 11C6 10.4477 6.44772 10 7 10H14C14.5523 10 15 10.4477 15 11C15 11.5523 14.5523 12 14 12H7C6.44772 12 6 11.5523 6 11Z" fill="#85109C"/>
            <circle cx="27" cy="4" r="4" fill={consymbol}/>
          </svg>
              {!connected ? (<p>Connect Wallet</p>
              ):(<p>Connected</p>)
              }
          </button>
          {con &&(
            <div className="back">
              <div className="connectop">
                <img src={c1} alt="gate"/>
                <svg className="logo" viewBox="0 0 24 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.0857 2.30189V1C15.0857 0.447715 14.638 0 14.0857 0H1C0.447715 0 0 0.447716 0 1V12.8679C0 13.4202 0.447715 13.8679 0.999999 13.8679H3.11429C3.66657 13.8679 4.11414 13.4171 4.11449 12.8648C4.11811 7.1246 4.18674 5.87362 5.48571 4.62264C6.78745 3.369 8.08919 3.3053 14.0821 3.30206C14.6344 3.30176 15.0857 2.85417 15.0857 2.30189Z" fill="white"/>
                    <path d="M14.0857 8.58491H10.6C10.0477 8.58491 9.6 9.03262 9.6 9.58491V12.8679C9.6 13.4202 10.0477 13.8679 10.6 13.8679H14.0857C14.638 13.8679 15.0857 13.4202 15.0857 12.8679V9.58491C15.0857 9.03262 14.638 8.58491 14.0857 8.58491Z" fill="white"/>
                    <path d="M19.2 17.8302C17.8983 19.0838 16.5965 19.1475 10.6036 19.1508C10.0513 19.1511 9.6 19.5989 9.6 20.1512V22.1138C9.6 22.666 10.0477 23.1132 10.6 23.1132H23C23.5523 23.1132 24 22.6655 24 22.1132V10.9057C24 10.3534 23.553 9.90566 23.0007 9.90566H21.572C21.0197 9.90566 20.5717 10.3546 20.571 10.9068C20.5654 15.3641 20.4804 16.5971 19.2 17.8302Z" fill="white"/>
                    <path d="M3.11429 19.1509H1C0.447715 19.1509 0 19.5987 0 20.1509V34C0 34.5523 0.447715 35 0.999999 35H3.11429C3.66657 35 4.11429 34.5523 4.11429 34V20.1509C4.11429 19.5987 3.66657 19.1509 3.11429 19.1509Z" fill="white"/>
                </svg>
                <div className="content">
                  <div className="text">
                    <p>Connect Your Wallet to Metamask</p>
                    <p>Ready to dive into NFTs? Connect your wallet now. Click "Install Metamask" and let the adventure begin!</p>
                  </div>
                  <div className="buttons">
                    <button className="install"><a href='https://metamask.io/download/'>Install Metamask</a></button>

                    <button className="ignore" onClick={close}>Already Installed</button>
                  </div>
                </div>
              </div>
            </div>
          )}
      </>
  );
}
export default Conwallet;