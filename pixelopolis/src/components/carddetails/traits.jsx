import React from "react";
const Traits = ({title,name}) => {
  return(
    <div className="traitelements">
      <p>{title}</p>
      <p>{name}</p>
      {/* <p>{floor}</p> */}
    </div>
  )
}
export default Traits;