import React,{useEffect,useState} from 'react';
import Trencoll from './topcollectors';
import Topcrea from './trencollection';
import '../../../css files/dashboard/rightsidebar.css';
function Rightsidebars({trendingclick2, topclick2}){
  const [length, setlength] = useState("M0.976562 8L1197.14 8.00004");
  var l = window.innerWidth - 549;
  var vi = "0 0 1198 16";
  vi = vi.replace("1198", String(l));
  
  const updatePath1 = () => {
    var newpath = length.replace(length.substring(10,19),"8L" + String(window.innerWidth-1) + ".13");
    setlength(newpath);
  };
  useEffect(() => {
    updatePath1();
    window.addEventListener('resize', updatePath1);
    return () => {
      window.removeEventListener('resize', updatePath1);
    };
  }, []);
  return (
    <>
      <svg className="navsvg" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 1C7 1 7 11.0393 13.9767 18C20.9534 24.9607 30.9767 25 30.9767 25" stroke="#455EFF" stroke-width="14"/>
      </svg>
      <svg className="navsvg1" width={l} height="16" viewBox={vi} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={length} stroke="#455EFF" stroke-width="14"/>
      </svg>
      <svg className="navsvg2" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24.9766 31C24.9766 31 24.9766 20.9607 17.9999 14C11.0232 7.03926 0.999869 6.99999 0.999869 6.99999" stroke="#455EFF" stroke-width="14"/>
      </svg>


      <div className='rightsidebars'> 
        <Trencoll trendingclick={trendingclick2}/>
        <Topcrea topclick={topclick2}/>
      </div>
  </>
  );
}
export default Rightsidebars;