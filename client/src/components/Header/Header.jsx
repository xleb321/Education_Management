import React from "react";
import { Link } from "react-router-dom";
import { LogIn } from "react-feather";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="University Logo" />
        </Link>

        <nav className="main-nav">
          <Link to="/">Главная</Link>

          <div className="actions">
            <Link to="/login" className="icon-button">
              <LogIn size={20} />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
