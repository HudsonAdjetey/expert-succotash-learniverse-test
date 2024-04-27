import React, { useState } from "react";
import "../../container/styles/sign.css";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
const ParentalInfo = ({
  line,
  parentContact,
  handleInputChange,
  handleInputs,
  address,
  guardian,
}) => {
  return (
    <div className={line == 2 ? "activeTab parentInfo" : "unActive"}>
      <div className="basicInfo__container ">
        <h2 className="basic__infoHeader i__header">
          Guardian Info <span>(optional)</span>
        </h2>

        {/* SUB LEADING */}
        <div className="sub__leading">
          <div className="profile__basic">
            <div className="fields__contents">
              <div className="account__input">
                <label htmlFor="guardian">Guardian Name</label>
                <input
                  type="text"
                  id="guardian"
                  name="guardian"
                  value={guardian}
                  onChange={handleInputs}
                />
              </div>
              <div className="account__input">
                <label htmlFor="address">Address</label>
                <input
                  type="address"
                  id="address"
                  name="address"
                  value={address}
                  onChange={handleInputs}
                />
              </div>

              <div className="contact__input  ">
                <PhoneInput
                  defaultCountry="GH"
                  numberInputProps={{
                    minLength: "9",
                    maxLength: "10",
                    placeholder: "Guardian Contact",
                    id: "parentContact",
                  }}
                  value={parentContact}
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

export default ParentalInfo;
