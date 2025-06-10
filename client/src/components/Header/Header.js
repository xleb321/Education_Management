// Header.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const navLinks = [
    { path: "/", text: "Главная" },
    { path: "/register", text: "Регистрация" },
  ];

  return (
    <header className="header" role="banner">
      <div className="header__container">
        <Link to="/" aria-label="На главную">
          <img className="header__logo" src="/logo.png" alt="Логотип сайта" />
        </Link>

        <nav className="header__desktop-nav" aria-label="Основная навигация">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path}>
              {link.text}
            </Link>
          ))}

          <button
            className="header__mobile-button"
            onClick={toggleMobileMenu}
            aria-label="Открыть меню"
            aria-expanded={isMobileMenuOpen}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </nav>

        <nav
          className={`header__mobile-nav ${
            isMobileMenuOpen ? "header__mobile-nav--open" : ""
          }`}
          aria-label="Мобильная навигация"
        >
          <ul className="header__mobile-nav-list">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path} onClick={closeMobileMenu}>
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {isMobileMenuOpen && (
          <div
            className="header__mobile-overlay"
            onClick={closeMobileMenu}
            role="button"
            aria-label="Закрыть меню"
            tabIndex={0}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
