import React from 'react';
import Cursor from './cursor';
import { useDisabled } from './wanddisable';

const Cursoraction = () => {
  const { isDisabled } = useDisabled();

  return isDisabled ? null : <Cursor />;
};

export default Cursoraction;