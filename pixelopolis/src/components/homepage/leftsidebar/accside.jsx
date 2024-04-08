import React from 'react';
import Menu from './menu';
import m1 from '../../../images/create.svg';
import m2 from '../../../images/settings.svg';
import m3 from '../../../images/mycollection.svg';
import m4 from '../../../images/favorite.svg';
import m5 from '../../../images/create1.svg';
import m6 from '../../../images/settings1.svg';
import m7 from '../../../images/mycollection1.svg';
import m8 from '../../../images/favorite1.svg';
function Accside({createclick,collectclick,favclick,setclick,theme}){
    const imageUrls = theme ? 
    {m1:m5,m2:m6,m3:m7,m4:m8}
    :{
      m1:m1,m2:m2,m3:m3,m4:m4
      };
  return (
    <>
      <div className='account'>
        <span>Account</span>
        <div className='account1'>
            <Menu imgg1={imageUrls.m1} imgg2 = {imageUrls.m3} txt="Create" txt1 = "Collection" onbuttonclickleft={createclick} onbuttonclickright={collectclick}/>
            <Menu imgg1={imageUrls.m4} imgg2 = {imageUrls.m2} txt="Favorites" txt1 = "Settings" onbuttonclickleft={favclick} onbuttonclickright={setclick}/>
        </div>
      </div>
    </>
  );
}
export default Accside;