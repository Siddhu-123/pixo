import React, { useState ,useEffect} from 'react';
import {BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Nav from './components/homepage/nav/nav';
import Homepage from './components/homepage/homepage';
import Accountpage from './components/accountpage/accountpage';
import Ownerpage from './components/accountpage/ownerpage1';
import Collectionpage from './components/collectionpage/collectionpage';
import Cursoraction from './components/cursoraction';
import CardDetails from './components/carddetails/carddetails';
import {DisabledProvider} from './components/wanddisable';
const App = () =>{
  const [address, setAddress] = useState("");
  const [randomNumber, setRandomNumber] = useState(null);
  const checkMetaMaskConnection = async () => {
      if (window.ethereum) {
          try {
              const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
              await window.ethereum.request({ method: 'eth_requestAccounts' });
              setAddress(accounts[0]);
          } catch (error) {
              console.error(error);
          }
      }
  };
  useEffect(() => {
      checkMetaMaskConnection();
  }, [randomNumber]);
  
  window.onload = () => setRandomNumber(Math.floor(Math.random() * 100) + 1);
  return(
    <div className='App'>
      <DisabledProvider>
        <BrowserRouter>
          <Nav address={address}/>
          <Routes>
            <Route path="/" element={<Homepage address={address}/>}></Route>
            <Route path="/Account" element={<Accountpage address={address}/>}></Route>
            <Route path="/:id" element={<Ownerpage address={address}/>}></Route>
            <Route path="/Assets/:id" element={<CardDetails address={address}/>}></Route>
            <Route path="/Collection/:name" element={<Collectionpage address={address}/>}></Route>
          </Routes>
        </BrowserRouter>
        <Cursoraction/>
      </DisabledProvider>
    </div>
  );
}

export default App;