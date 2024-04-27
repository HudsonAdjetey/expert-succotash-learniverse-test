import React from "react";
import "../../container/styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer flex-row">
      <div className="copyRight">
        <p>©2021 All rights reserved | Designed by Ikob Devs</p>
      </div>
      <div className="social_icons flex-row">
        <span>Reach us on</span>
        <span>
          <i className="bi bi-facebook">
            <span className="hover_name">Facebook</span>
          </i>
          <i className="bi bi-twitter-x">
            <span className="hover_name">Twitter</span>
          </i>
          <i className="bi bi-github">
            <span className="hover_name">GitHub</span>
          </i>
          <i className="bi bi-link">
            <span className="hover_name">Website</span>
          </i>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
