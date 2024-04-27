import React, { memo } from "react";
import { WelcomePage } from "../../constants/image";
import { useSelector } from "react-redux";

const Header = memo(() => {
  const { user } = useSelector((state) => state.user);
  return (
    <header className="topHeaderNav">
      <nav className="nav__top">
        <div className="userProfile">
          <img src={user.profile} alt="" />
          <p className="username">{user.firstName + " " + user.lastName}</p>
        </div>
      </nav>
    </header>
  );
});
export default Header;
