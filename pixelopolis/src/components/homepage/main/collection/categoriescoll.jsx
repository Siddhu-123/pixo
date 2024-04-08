import React,{useState,useEffect} from 'react';
import '../../../../css files/dashboard/collection.css';
const Cateele = ({ children, onClick, isActive }) => {
  const buttonClass = isActive ? 'cateelecoll active' : 'cateelecoll';
  return (
      <button type='button' className={buttonClass} onClick={onClick}>
        {children}
      </button>
    );
};
function Cate({onCategorySelect}){
  const [activeIndex, setActiveIndex] = useState(parseInt(localStorage.getItem('category')) || 0);
  useEffect(() => {
    localStorage.setItem('category',activeIndex);
  }, [activeIndex]);
  const names = ["All", "Avatar", "Art", "Gaming", "Sport", "Digital land", "Photography", "Music", "Generative AI", "PFP's", "Memberships"];

  const handleIconClick = (index) => {
    setActiveIndex(index);
    onCategorySelect(names[index]);
  };
  return (
  <>
    <div className='cate'>
        {names.map((name, index) => (
            <Cateele
            key={index}
            children={name}
            isActive={activeIndex === index}
            onClick={() => handleIconClick(index)}
            />
            ))}
    </div>
  </>
  );
}
export default Cate;