import React,{useState} from 'react';
import Pixo from './pixo';
import Themeicon from './themeicon';
import Conwallet from './conwallet';
import Cartpage from './cartpage/cartpage';
import {Link} from 'react-router-dom';
import '../../../css files/nav.css';
function Nav({address}){
  const [imgclick, setimgclick] = useState(false);
  const [cart, setcart] = useState(false);
  const ifclicked = () => {
    if (window.innerWidth <= 1220){
      setimgclick(true);
    }
  }
  const cartclicked = () => {
    setcart(!cart);
  }
  const close1 = () => {
    setimgclick(false);
  }
  const close = () => {
    setcart(false);
  }
  return (
    <>
      { imgclick ? (
        <div className='searchbaricon'>
          <input type='text' placeholder='Search items, collections and accounts'></input>        
          <svg onClick={close1} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>):
        ( <div className='nav'>
            <div className='nf'>
              <Link to="/"><Pixo/></Link>
              <div className="searchbar">
                  <svg onClick={ifclicked} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.0703 20.0444C21.9769 18.1313 23.1556 15.4922 23.1556 12.5778C23.1556 6.73583 18.4197 2 12.5778 2C6.73583 2 2 6.73583 2 12.5778C2 18.4197 6.73583 23.1556 12.5778 23.1556C15.5053 23.1556 18.1551 21.9663 20.0703 20.0444ZM20.0703 20.0444L28.5 28.5" stroke="black" stroke-width="3" stroke-linecap="round"/></svg>
                  <input type='text' placeholder='Search items, collections and accounts'></input>        
              </div> 
            </div>
            <div className='nl'>
              <Conwallet/>
              <Link to="/Account">        
                <div className="accicon"> 
                  <svg viewBox="0 0 28 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 28V26.5556C2 21.7691 6.02944 17.8889 11 17.8889H17C21.9706 17.8889 26 21.7691 26 26.5556V28M14 13.5556C10.6863 13.5556 8 10.9688 8 7.77778C8 4.5868 10.6863 2 14 2C17.3137 2 20 4.5868 20 7.77778C20 10.9688 17.3137 13.5556 14 13.5556Z" stroke="#0C1E92" stroke-width="3" stroke-linecap="round"/>
                  </svg>
                </div>
              </Link>
                <div onClick={cartclicked} className="carticon"> 
                  <svg viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.04382 0.5C1.7394 0.5 1.44745 0.620932 1.23219 0.836191C1.01693 1.05145 0.895996 1.3434 0.895996 1.64783C0.895996 1.95225 1.01693 2.2442 1.23219 2.45946C1.44745 2.67472 1.7394 2.79565 2.04382 2.79565H2.60855C2.85779 2.79608 3.10012 2.87763 3.29892 3.02797C3.49771 3.17831 3.64217 3.38927 3.71046 3.62897L7.35137 16.3698C7.55729 17.0888 7.99172 17.7213 8.58896 18.1715C9.1862 18.6217 9.91378 18.8652 10.6617 18.8652H21.1505C21.8389 18.8653 22.5115 18.6591 23.0815 18.2733C23.6515 17.8874 24.0928 17.3395 24.3484 16.7004L27.7322 8.23864C27.8713 7.89045 27.923 7.51349 27.8827 7.1407C27.8425 6.76791 27.7116 6.41065 27.5014 6.10015C27.2913 5.78964 27.0082 5.53534 26.6771 5.35948C26.3459 5.18361 25.9767 5.09154 25.6018 5.0913H6.51575L5.91659 2.99767C5.71118 2.27861 5.27728 1.64596 4.68047 1.19534C4.08366 0.744732 3.35637 0.500653 2.60855 0.5H2.04382ZM11.2264 28.0478C11.6786 28.0478 12.1264 27.9587 12.5442 27.7857C12.962 27.6126 13.3416 27.359 13.6613 27.0392C13.9811 26.7195 14.2347 26.3399 14.4078 25.9221C14.5808 25.5043 14.6699 25.0565 14.6699 24.6043C14.6699 24.1521 14.5808 23.7044 14.4078 23.2866C14.2347 22.8688 13.9811 22.4892 13.6613 22.1694C13.3416 21.8497 12.962 21.596 12.5442 21.423C12.1264 21.2499 11.6786 21.1609 11.2264 21.1609C10.3132 21.1609 9.4373 21.5237 8.79152 22.1694C8.14574 22.8152 7.78295 23.6911 7.78295 24.6043C7.78295 25.5176 8.14574 26.3935 8.79152 27.0392C9.4373 27.685 10.3132 28.0478 11.2264 28.0478ZM20.409 28.0478C20.8612 28.0478 21.309 27.9587 21.7268 27.7857C22.1446 27.6126 22.5242 27.359 22.8439 27.0392C23.1637 26.7195 23.4173 26.3399 23.5904 25.9221C23.7634 25.5043 23.8525 25.0565 23.8525 24.6043C23.8525 24.1521 23.7634 23.7044 23.5904 23.2866C23.4173 22.8688 23.1637 22.4892 22.8439 22.1694C22.5242 21.8497 22.1446 21.596 21.7268 21.423C21.309 21.2499 20.8612 21.1609 20.409 21.1609C19.4958 21.1609 18.6199 21.5237 17.9741 22.1694C17.3283 22.8152 16.9656 23.6911 16.9656 24.6043C16.9656 25.5176 17.3283 26.3935 17.9741 27.0392C18.6199 27.685 19.4958 28.0478 20.409 28.0478Z" fill="#0C1E92"/>
                  </svg>
                </div>
                {cart ?(
                  <Cartpage close={close} address={address}/>
                ):(<></>)}
              <Themeicon />
            </div>
          </div>
        )
      }
    </>
  );
}
export default Nav;