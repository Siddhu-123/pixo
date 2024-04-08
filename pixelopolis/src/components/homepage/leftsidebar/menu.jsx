import React ,{useState}from 'react';

const Menu = ({ imgg1,imgg2,txt,txt1,onbuttonclickleft,onbuttonclickright}) => {
  const [isFirstDivVisible, setFirstDivVisible] = useState(true);
  const clickleft = () => {
    onbuttonclickleft();
    setFirstDivVisible(true);
  };
  const clickright = () => {
    onbuttonclickright();
    setFirstDivVisible(false);
  };
  return (
    <>
        <div className='menu'>
        {isFirstDivVisible ? (
          <div className='textmenu'><p>{txt}</p></div>
        ) : (
            <div className='textmenu1'><p>{txt1}</p></div>
        )}
            <div onClick={clickleft} className="icon1">
              <img src={imgg1}/>
            </div>
            <div onClick={clickright} className="icon2">
              
            <img src={imgg2}/>
            </div>
      </div>
    </>
  );
};

export default Menu;
