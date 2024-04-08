import React, { createContext, useContext, useEffect, useState } from 'react';

const DisabledContext = createContext();

export const useDisabled = () => useContext(DisabledContext);

export const DisabledProvider = ({ children }) => {
  const storedDisabled = localStorage.getItem('isDisabled');
  const [isDisabled, setIsDisabled] = useState(storedDisabled ? JSON.parse(storedDisabled) : false);

  const toggleDisabled = () => {
    setIsDisabled(prevState => {
      const newState = !prevState;
      localStorage.setItem('isDisabled', JSON.stringify(newState));
      return newState;
    });
  };

  useEffect(() => {
    if (isDisabled) {
      document.body.style.cssText = "padding: 0;margin: 0;box-sizing: border-box;";
    } else {
      document.body.style.cssText = "padding: 0;margin: 0;box-sizing: border-box; cursor: none;";
    }
    localStorage.setItem('isDisabled', JSON.stringify(isDisabled));
  }, [isDisabled]);

  return (
    <DisabledContext.Provider value={{ isDisabled, toggleDisabled }}>
      {children}
    </DisabledContext.Provider>
  );
};
