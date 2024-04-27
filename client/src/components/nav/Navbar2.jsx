import React from "react";
import { Link, Navigate } from "react-router-dom";
import "../../container/styles/nav.css";
import NavMenu from "./NavMenu";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logOut } from "../../app/userSlice";
import { getAuth, signOut } from "firebase/auth";
import NavMenu2 from "./NavMenu2";
const URL = `/api/auth`;

const Navbar2 = () => {
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth); // Firebase sign-out on the client-side

      // Send a request to the server to handle server-side logout
      await axios.post(`${URL}/signout`);

      // Dispatch action to update state (if using Redux)
      dispatch(logOut());
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  return (
    <div className="sideBar">
      <NavMenu2 />
      <div className="nav__container desktop">
        <nav className="__sideMain">
          <div className="logo">Learniverse</div>
          <ul className="navbar">
            <li>
              <Link to={"/"}>Home</Link>
            </li>
            <li>
              <Link to={"/account"}>Account Profile</Link>
            </li>
            <li>
              <Link to={`/subscription`}>Subscription</Link>
            </li>
            <li>
              <a onClick={handleSignOut}>Log Out</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Navbar2;
