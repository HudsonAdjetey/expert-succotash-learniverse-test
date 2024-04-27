import React from "react";

const ClassModal = ({
  closeModal,
  handleIsOpen,
  cancelConfirm,
  handleInputs,
  classData,
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
            value={classData.name}
            name="name"
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
            value={classData.admission}
            onChange={handleInputs}
          />
        </div>

        <div className="entry__field">
          <label htmlFor="price">Price (GHS)</label>
          <input
            type="number"
            id="price"
            min={1}
            name="price"
            value={classData.price}
            onChange={handleInputs}
          />
        </div>

        <div className="entry__field">
          <label htmlFor="subjectAssign">Description</label>
          <input
            type="text"
            id="subjectAssign"
            name="description"
            value={classData.description}
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

export default ClassModal;
