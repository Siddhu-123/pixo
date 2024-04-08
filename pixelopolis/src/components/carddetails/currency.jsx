import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EthereumToINR = ({price,refresh}) => {
  const [ethToInr, setEthToInr] = useState(null);

  const fetchExchangeRate = async () => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr');
      const ethInrRate = response.data.ethereum.inr;
      setEthToInr(ethInrRate);
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    }
  };
  useEffect(() => {
    fetchExchangeRate();
  }, [price,refresh]);
  return (
    <div>
      {ethToInr !== null ? (
        <p>₹{price * ethToInr}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EthereumToINR;