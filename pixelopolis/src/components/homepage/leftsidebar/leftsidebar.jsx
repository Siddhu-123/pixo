import React,{useEffect,useState} from 'react';
import Marketplace from './marketplace';
import Accside from './accside';
import sideline from '../../../images/sideline.png';
import Ads from "./ads/ads";
import '../../../css files/dashboard/leftsidebar.css';
import Wand from './wand';
function Leftsidebar({dashboardclick1,virtuallandclick1,createclick1,collectclick1,favclick1,setclick1,trendingclick1,topclick1}){
  const [hasTheme, setHasTheme] = useState(false);
  useEffect(() => {
    const checkTheme = () => {
      const body = document.body;
      if (body) {
        const theme = body.classList.contains('dark-theme');
        setHasTheme(theme);
      }
    };
    checkTheme();
    document.body.addEventListener('transitionend', checkTheme);
  }, []);
  const [dynamicPath, setDynamicPath] = useState("M1 7.00049L304 7.99988C304 7.99988 320 7.99976 328 15.9999C338 24 338 39.9999 338 39.9999V1020");
  var l = window.innerHeight - 84;
  var vi = "0 0 344 ";
  vi = vi + String(l);
  const updatePath = () => {
    var l = window.innerHeight - 84;
    const newPath = "M1 7.00049L304 7.99988C304 7.99988 320 7.99976 328 15.9999C336 24 336 39.9999 336 39.9999V" + l;
    setDynamicPath(newPath);
  };
  useEffect(() => {
    const handleResize = () => {
      updatePath();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <>
      <svg className='leftsidebarsvg' width="344" height={l} viewBox={vi} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d={dynamicPath} stroke="#455EFF" stroke-width="14"/>
      </svg>
      <div className='leftsidebar'> 
        <Marketplace dashboardclick={dashboardclick1} virtuallandclick={virtuallandclick1} trendingclick={trendingclick1} topclick={topclick1} theme={hasTheme}/>
        <img className='sideline' src={sideline}></img>
        <Ads/>
        <img className='sideline' src={sideline}></img>
        <Accside createclick= {createclick1} collectclick= {collectclick1} favclick= {favclick1} setclick= {setclick1} theme={hasTheme}/>
        <img className='sideline' src={sideline}></img>
        <div className="wand">
          <p>Magic Wand</p>
          <Wand/>
        </div>
      </div>
    </>
  );
}
export default Leftsidebar;