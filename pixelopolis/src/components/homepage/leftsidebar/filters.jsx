import React, { useState, useEffect } from 'react';
import Cate from './categories';

function Fil() {
  return (
      <div className='filters'>
        <span>Categories</span>
        <div className='fil'>
          <div className='categories'><Cate /></div>
        </div>
      </div>
  );
}

export default Fil;
