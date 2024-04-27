import React, { useEffect, useState } from "react";
import Payment from "../payment/Payment";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { WithContext as ReactTags } from "react-tag-input";

const URL = `/api/auth`;
const BASE = `/api/course`;
const RegisterModal = ({
  registerInfo,
  handleInputs,
  handleSelectChange,
  selectedClasses,
  disabledOptions,
  allClassName,
  monthFee,
  submitForm,
  handleIsModal,
  setMonthFee,
}) => {
  return (
    <div className="sub__main-modal  ">
      <div className="modal__main-container">
        <form>
          <p className="header__modal-title">Students Details</p>
          <div className="entry__field">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={registerInfo.firstName}
              onChange={handleInputs}
              required
            />
          </div>

          <div className="entry__field">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              onChange={handleInputs}
              value={registerInfo.lastName}
              required
            />
          </div>

          <div className="entry__field">
            <label htmlFor="studentName">Username</label>
            <input
              type="text"
              id="usernameAssign"
              name="username"
              value={registerInfo.username}
              onChange={handleInputs}
            />
          </div>

          <div className="entry__field">
            <label htmlFor="telPhone">Contact</label>
            <input
              type="tel"
              id="telPhone"
              name="contact"
              value={registerInfo.contact}
              onChange={handleInputs}
              required
            />
          </div>

          <div className="entry__field">
            <label htmlFor="emailAddress">Email Address</label>
            <input
              type="email"
              id="emailAddress"
              name="email"
              value={registerInfo.email}
              onChange={handleInputs}
              required
            />
          </div>

          <div className="entry__field">
            <label htmlFor="passwordMain">Password</label>
            <input
              type="password"
              value={registerInfo.password}
              onChange={handleInputs}
              id="passwordMain"
              name="password"
              required
            />
          </div>

          <div className="entry__field">
            <label htmlFor="residential">Residential Address (optional)</label>
            <input
              type="text"
              id="residential"
              name="address"
              value={registerInfo.address}
              onChange={handleInputs}
            />
          </div>

          <div className="entry__field">
            <label htmlFor="schoolAssign">Name of Institution (optional)</label>

            <input type="text" id="schoolAssign" name="schoolName" />
          </div>

          <div className="entry__field">
            <label htmlFor="classAssign">Class</label>
            <select
              name="classAssign"
              id="classAssign"
              multiple
              onChange={handleSelectChange}
              value={selectedClasses}
              required
              className="selectedTag"
            >
              {allClassName.map((item, index) => (
                <option
                  key={index}
                  value={item}
                  disabled={disabledOptions.includes(item)}
                >
                  {item}
                </option>
              ))}
            </select>

            <div className="item_selected">
              {selectedClasses.map((selectedClass) => (
                <span key={selectedClass}>
                  <span className="nameClass">{selectedClass}</span>
                  <button
                    className="bi bi-x"
                    onClick={() => handleCancel(selectedClass)}
                  ></button>
                </span>
              ))}
            </div>
          </div>

          <div className="entry__field">
            <label htmlFor="gender">Select Month</label>
            <select
              name="month"
              value={monthFee}
              onChange={(e) => {
                setMonthFee(e.target.value);
              }}
              id="month"
            >
              <option value={""} disabled selected>
                Expiry Month
              </option>
              <option value="1">One Month Period</option>
              <option value="3">Per Semester</option>
            </select>
          </div>
        </form>

        {/* SUBSCRIPTION DeTAILS */}

        {/* PAYMENT DETAILS */}

        {/* PAYMENT DETAILS */}

        <div className="modalActionBtns">
          <button
            className="btn btn--primary"
            onClick={submitForm}
            type="submit"
          >
            Save Changes
          </button>
          <button className="btn btn--primary" onClick={handleIsModal}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;

/* 
import React, { useState } from 'react';

// Assuming 'allClassName' is an array of strings
const allClassName = ['Class A', 'Class B', 'Class C', 'Class D'];

const RegisterModal = ({ handleIsOpen, closeModal, dataInfo }) => {
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [disabledOptions, setDisabledOptions] = useState([]);

  const handleSelectChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    const newlySelected = selectedOptions.filter((option) => !selectedClasses.includes(option));

    setSelectedClasses([...selectedClasses, ...newlySelected]);
    setDisabledOptions([...disabledOptions, ...newlySelected]);
  };

  const handleCancel = (selectedClass) => {
    const updatedSelected = selectedClasses.filter((option) => option !== selectedClass);
    setSelectedClasses(updatedSelected);

    const updatedDisabled = disabledOptions.filter((option) => option !== selectedClass);
    setDisabledOptions(updatedDisabled);
  };

  return (
    <div>
      <select
        name="classAssign"
        id="classAssign"
        multiple
        onChange={handleSelectChange}
        value={selectedClasses}
      >
        {allClassName.map((item, index) => (
          <option key={index} value={item} disabled={disabledOptions.includes(item)}>
            {item}
          </option>
        ))}
      </select>

      <div>
        {selectedClasses.map((selectedClass) => (
          <span key={selectedClass}>
            {selectedClass}
            <button onClick={() => handleCancel(selectedClass)}>Cancel</button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default RegisterModal;


*/

/* 
import React, { useState } from "react";

const YourComponent = () => {
  const [selected, setSelected] = useState([]);
  const [allClassName, setAllClassName] = useState([
    "Class A",
    "Class B",
    "Class C",
    // Add your class names here
  ]);

  const handleSelectChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    setSelected(selectedOptions);
  };

  const handleCancelClick = (cancelledClass) => {
    const updatedSelected = selected.filter(
      (selectedClass) => selectedClass !== cancelledClass
    );
    setSelected(updatedSelected);
  };

  return (
    <div>
      <select
        name=""
        id=""
        multiple
        onChange={handleSelectChange}
      >
        {allClassName.map((item, index) => (
          <option key={index} value={item} disabled={selected.includes(item)}>
            {item}
          </option>
        ))}
      </select>

      <div>
        <p>Selected Classes:</p>
        <ul>
          {selected.map((selectedClass, index) => (
            <li key={index}>
              {selectedClass}{" "}
              <button onClick={() => handleCancelClick(selectedClass)}>
                Cancel
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default YourComponent;


*/
