import React, { useState, useEffect } from 'react';

const Timeleft = ({ timestamp}) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  var expired = "";

  useEffect(() => {
    const calculateTimeRemaining = () => {
        const currentTime = new Date();
        const futureTime = new Date(timestamp);
        const timeDifference = futureTime - currentTime;
        const minutes = Math.floor(timeDifference / (1000 * 60)) % 60;
        const hours = Math.floor(timeDifference / (1000 * 60 * 60)) % 24;
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        
        if((days + hours + minutes) < 0){
            setTimeRemaining("expired");
            expired = "expired";
        }
        else if(days > 2){
          setTimeRemaining(`${days} Days`);
        }
        else{
          setTimeRemaining(`${days} Days ${hours} H ${minutes} M`);
        }
    };

    const interval = setInterval(() => {
      calculateTimeRemaining();
    }, 1000);

    calculateTimeRemaining();

    return () => clearInterval(interval);
  }, [timestamp]);

  return (
  <>
    <span>{timeRemaining}</span>
  </>);
};

export default Timeleft;
