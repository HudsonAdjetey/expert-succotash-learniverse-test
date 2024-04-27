import React, { useState, useEffect, useRef } from "react";
import "../../container/styles/nav.css";
import { logOut } from "../../app/userSlice";

import { Link } from "react-router-dom";
import { useAnimate, stagger, motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { getAuth, signOut } from "firebase/auth";
import axios from "axios";

const staggerMenuItems = stagger(0.1, { startDelay: 0.15 });
const URL = `/api/auth`;

function useMenuAnimation(isOpen) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    animate(".arrow", { rotate: isOpen ? 180 : 0 }, { duration: 0.2 });

    animate(
      "ul",
      {
        clipPath: isOpen
          ? "inset(0% 0% 0% 0% round 10px)"
          : "inset(10% 50% 90% 50% round 10px)",
      },
      {
        type: "spring",
        bounce: 0,
        duration: 0.5,
      }
    );

    animate(
      "li",
      isOpen
        ? { opacity: 1, scale: 1, filter: "blur(0px)" }
        : { opacity: 0, scale: 0.3, filter: "blur(20px)" },
      {
        duration: 0.2,
        delay: isOpen ? staggerMenuItems : 0,
      }
    );
  }, [isOpen]);

  return scope;
}
const NavMenu2 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const scope = useMenuAnimation(isOpen);
  const menuRef = useRef(null);

  const handleLinkClick = () => {
    setIsOpen(false); // Close the menu when a link is clicked
  };

  const handleClickOutsideMenu = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsOpen(false); // Close the menu if clicked outside the menu
    }
  };
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

  useEffect(() => {
    document.addEventListener("click", handleClickOutsideMenu);

    return () => {
      document.removeEventListener("click", handleClickOutsideMenu);
    };
  }, []);

  return (
    <div className="menu__container">
      {/* SMALLER NAVBAR */}
      <nav className="menu" ref={(menuRef, scope)}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsOpen(!isOpen)}
          className="menu__btn"
        >
          <i className="bi bi-list"></i>

          <div
            className="arrow"
            style={{ transformOrigin: "50% 55%", display: "none" }}
          >
            <svg width="15" height="15" viewBox="0 0 20 20">
              <path d="M0 7 L 20 7 L 10 16" />
            </svg>
          </div>
        </motion.button>

        <ul
          style={{
            pointerEvents: isOpen ? "auto" : "none",
            clipPath: "inset(10% 50% 90% 50% round 10px)",
          }}
          className="navbar nav__container"
        >
          <div className="logo__header-container">
            <h3>Learniverse Universities</h3>
          </div>
          <li>
            <Link to={"/"} onClick={handleLinkClick}>
              Home
            </Link>
          </li>
          <li>
            <Link to={"/account"} onClick={handleLinkClick}>
              Account Profile
            </Link>
          </li>
          <li>
            <Link to={`/subscription`} onClick={handleLinkClick}>
              Subscription
            </Link>
          </li>
          <li>
            <a onClick={handleSignOut}>Log Out</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavMenu2;
