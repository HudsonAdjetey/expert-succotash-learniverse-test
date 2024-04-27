import React, { useEffect, useRef, useState } from "react";
import "../../container/styles/authStyles.css";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { WelcomePage } from "../../constants/image";

const BasicInfo = ({
  line,
  setImage,
  profile,
  contact,
  firstName,
  lastName,
  email,
  handleInputs,
  username,
  handleInputChange,
  password,
}) => {
  return (
    <div className={line == 1 ? "activeTab" : "unActive"}>
      <div className="basicInfo__container">
        <h2 className="basic__infoHeader" style={{ marginBottom: "1.5rem" }}>
          Basic Info
        </h2>

        {/* SUB LEADING */}
        <div className="sub__leading">
          <div className="profile__basic">
            <div className="fields__contents">
              <div className="account__input">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  onChange={handleInputs}
                  value={username}
                />
              </div>
              <div className="account__input">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleInputs}
                />
              </div>
              <div className="account__input">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={firstName}
                  onChange={handleInputs}
                />
              </div>
              <div className="account__input">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={lastName}
                  onChange={handleInputs}
                />
              </div>
              <div className="account__input">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleInputs}
                  minLength={6}
                  required
                />
              </div>
              <div className="contact__input  ">
                <PhoneInput
                  defaultCountry="GH"
                  numberInputProps={{
                    minLength: "9",
                    maxLength: "10",
                    placeholder: "Personal Contact",
                    id: "personalContact",
                  }}
                  name="contact"
                  value={contact}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>
        {/* SUB LEADING */}
      </div>
    </div>
  );
};

export default BasicInfo;

/* 
       <PhoneInput
          value={phoneNumber}
          onChange={handleInputChange}
          defaultCountry="GH"
          numberInputProps={{
            minLength: "9",
            maxLength: "10",
          }}
        />

*/
