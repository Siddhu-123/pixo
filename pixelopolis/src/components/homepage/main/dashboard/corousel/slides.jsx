import React from 'react';
import ex from '../../../../../images/exploreicon.png';
import sh from '../../../../../images/shine.png';
import {Link} from 'react-router-dom';
export const Slides = ({txt1,txt2,imgg,collid}) => {
  
    return (
        <div className="slides">
          <div class="slidestext">
            <div>{txt1}</div>
            <div>{txt2}</div>
            <Link to={`/Collection/${collid}`}>
              <div className='explore'>
                  <img src={sh}/>
                  <div>Explore</div>
                  <img src={ex}/>
              </div>
            </Link>
          </div>
          <div className="slideimage">
            <img src={require(`../../../../../image/coll/${imgg}`)} alt='collection'/>
          </div>
        </div>
    );
}
export default Slides;