import React from "react";

const AlertModal = ({ cancelConfirm, acceptConfirm, msg }) => {
  return (
    <div className="alert__container">
      <div className="alert__subContainer">
        <p className="alert__message">{msg}</p>
        <div className="delete__confirm">
          <button onClick={acceptConfirm}>Confirm</button>
          <button onClick={cancelConfirm}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
