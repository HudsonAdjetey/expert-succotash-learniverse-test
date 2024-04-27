import React from "react";

const HangClassModal = ({
  closeModal,
  handleIsOpen,
  cancelConfirm,
  data,
  handleInputs,
}) => {
  return (
    <div className="sub__main-modal  " onClick={closeModal}>
      <div className="modal__main-container">
        <p className="header__modal-title">Class Details</p>

        <div className="entry__field">
          <label htmlFor="nameOfClass">Class Name</label>
          <input
            type="text"
            id="nameOfClass"
            name="name"
            value={data.name}
            onChange={handleInputs}
          />
        </div>

        <div className="entry__field">
          <label htmlFor="feeAssigned">Monthly Fee</label>
          <input
            type="number"
            id="feeAssigned"
            min={1}
            name="monthFee"
            value={data.monthFee}
            onChange={handleInputs}
          />
        </div>

        <div className="entry__field">
          <label htmlFor="admissionAssign">Admission Fee</label>
          <input
            type="number"
            id="admissionAssign"
            min={1}
            name="admission"
            value={data.admission}
            onChange={handleInputs}
          />
        </div>

        <div className="entry__field">
          <label htmlFor="price">Price (GHS) </label>
          <input
            type="number"
            id="price"
            min={1}
            name="price"
            value={data.price}
            onChange={handleInputs}
          />
        </div>

        <div className="entry__field">
          <label htmlFor="subjectAssign">Description</label>
          <input
            type="text"
            id="subjectAssign"
            name="description"
            value={data.description}
            onChange={handleInputs}
          />
        </div>

        <div className="modalActionBtns">
          <button className="btn btn--primary" onClick={cancelConfirm}>
            Save Changes
          </button>
          <button onClick={handleIsOpen} className="btn btn--primary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default HangClassModal;
