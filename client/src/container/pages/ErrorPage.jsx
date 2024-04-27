import React from "react";
import "../styles/error.css";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="notFound">
      <div className="content__error">
        <h1>Oops! Page Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
        <div className="error-btn">
          <button>
            <Link to={"/"}>Return Home</Link>
          </button>
        </div>
      </div>
      {/* You can add a link back to home or other pages */}
    </div>
  );
};

export default ErrorPage;
