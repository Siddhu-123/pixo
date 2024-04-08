import React from "react";
import '.././App.css'
    const Loading = () => {
    return(
        <>
        <svg className="loadingsvg" width="25" height="37" viewBox="0 0 25 37" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.5 0H0V15.5H4C4 8.5 4 7.18919 5.5 5.64865C7 4.10811 8.5 4 15.5 4V0Z" className="svg1"></path>
        <path d="M15.5 9.5H9.5L9.5 15.5H15.5L15.5 9.5Z" className="svg2"></path>
        <path d="M25 9.5H21V9.50003C21 16.6892 21 17.9595 19.5 19.5C18 21.0405 16.5 21.0405 9.50002 21.0405H9.5V25H25V9.5Z"  className="svg3"></path>
        <path d="M4 21.0405H0V37H4V21.0405Z" className="svg4"></path>
        </svg>
        </>
    )   
}
export default Loading;