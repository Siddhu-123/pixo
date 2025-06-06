import React ,{useState} from 'react';
import {Link} from 'react-router-dom';
export const Card = ({imgg,name,floor,vol}) => {
    const [fillColor, setFillColor] = useState('#00');
    const clicks = () => {
        if (fillColor === '#00'){
            setFillColor('#ff0000');
        }
        else {
            setFillColor('#00');
        }
    }
    return (
        <div className='card'>
            <Link to={`/Collection/${name}`}>
                <div className='image'>
                    <img src={imgg}/>
                </div>
            </Link>
            <div className='text'>
                <div className='favheart'>
                    <div className='name'>{name}</div>
                    <div className="heart" onClick={clicks}>
                        <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.88659 16.6603L8.88587 16.6596C6.30104 14.3157 4.19578 12.4033 2.73088 10.6111C1.27148 8.82559 0.5 7.22062 0.5 5.5C0.5 2.68674 2.69555 0.5 5.5 0.5C7.08885 0.5 8.62206 1.24223 9.62058 2.40564L10 2.84771L10.3794 2.40564C11.3779 1.24223 12.9112 0.5 14.5 0.5C17.3045 0.5 19.5 2.68674 19.5 5.5C19.5 7.22062 18.7285 8.82559 17.2691 10.6111C15.8042 12.4033 13.699 14.3157 11.1141 16.6596L11.1134 16.6603L10 17.6738L8.88659 16.6603Z" fill={fillColor} stroke="white"/>
                        </svg>
                    </div>
                </div>
                <div className='specs'>
                    <div className='floor'>
                        <p>Floor</p>
                        <span>{floor}</span>
                    </div>
                    <div className='vol'>
                        <p>Total volume</p>
                        <span>{vol}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Card;