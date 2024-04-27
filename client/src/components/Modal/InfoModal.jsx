import React from "react";

const InfoModal = ({ handleIsOpen, handleModalClick }) => {
  return (
    <div className="modalContent  infoModal" onClick={handleIsOpen}>
      <div className="studentsModal " onClick={handleModalClick}>
        <div className="leading flex-col">
          <label htmlFor="name__class">Class Name</label>
          <input type="text" id="name__class" />
        </div>

        <div className="leading flex-col ">
          <label htmlFor="__monthFee">Monthly Fee</label>
          <input type="text" id="__monthFee" />
        </div>

        <div className="leading flex-col ">
          <label htmlFor="__admission">Admission Fee</label>
          <input type="text" id="__admission" />
        </div>

        <div className="leading flex-col ">
          <label htmlFor="links">WhatsApp Link</label>
          <input type="text" id="links" />
        </div>
        <div className="buttons__info">
          <button>Save</button>
          <button>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
