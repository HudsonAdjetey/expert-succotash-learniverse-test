import React, { memo, useRef } from "react";
import { useSelector } from "react-redux";
const Acc = memo(
  ({
    fullName,
    username,
    profile,
    handleChange,
    displayUser,
    email,
    contact,
    firstName,
    lastName,
    status,
    currentPassword,
    handleSubmit,
    setImage,
    handleInputs,
  }) => {
    const fileRef = useRef(null);
    const { user } = useSelector((state) => state.user);
    return (
      <div className="profile__page">
        {/* PROFILE IMAGE */}
        <div className="profile__image-container">
          <input
            type="file"
            ref={fileRef}
            hidden
            name="file"
            accept="image/*"
            onChange={setImage}
          />
          <div className="image__update">
            <img src={profile} alt="" onClick={() => fileRef.current.click()} />
            <i className="bi bi-pen-fill"></i>
          </div>
          <div className="name__sub">
            <h3>{fullName}</h3>
            <p className="status">{user.va1}</p>
          </div>
        </div>
        {/* PROFILE IMAGE */}

        {/* FORM CONTAINER */}
        <form className="account__form" onSubmit={handleSubmit}>
          {/* FIRST NAME AND LAST NAME */}
          <div className="form__account-container">
            <div className="c__v-combine flex-row ">
              <div className="account__input">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  name="firstName"
                  onChange={handleInputs}
                />
              </div>

              <div className="account__input">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  name="lastName"
                  onChange={handleInputs}
                />
              </div>
            </div>
            {/* FIRST NAME AND LAST NAME */}

            {/* USERNAME AND EMAIL */}
            <div className="c__v-combine flex-row">
              <div className="account__input">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  name="username"
                  onChange={handleInputs}
                />
              </div>

              <div className="account__input">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  name="email"
                  onChange={handleInputs}
                />
              </div>
            </div>
            {/* USERNAME AND EMAIL */}

            {/* PHONE NUMBER */}
            <div className="account__input contact__input">
              <label htmlFor="phone">Contact</label>
              <input
                type="text"
                id="phone"
                name="contact"
                value={contact}
                onChange={handleChange}
              />
            </div>
            {/* PHONE NUMBER */}

            {/* CURRENT PASSWORD AND NEW PASSWORD*/}
            <div className="c__v-combine flex-row">
              <div className="account__input">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  name="currentPassword"
                  onChange={handleInputs}
                />
              </div>

              <div className="account__input">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  onChange={handleInputs}
                />
              </div>
            </div>
            {/* CURRENT PASSWORD AND NEW PASSWORD*/}

            {/* BUTTON */}
            <div className="con_v-p">
              <button type="button" onClick={handleSubmit} className="confirm">
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
);

export default Acc;
