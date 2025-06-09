import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>
          &copy; {new Date().getFullYear()} Университет Технологий. Все права
          защищены.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
