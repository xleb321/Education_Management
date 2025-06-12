// Header.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, Calendar, LogIn } from "react-feather";
import "./Header.css";

const Header = ({ userRole }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [upcomingEvent, setUpcomingEvent] = useState(null);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  // Fetch notifications and upcoming events when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch notifications count
        const notificationsRes = await fetch("/notifications/unread-count");
        if (notificationsRes.ok) {
          const data = await notificationsRes.json();
          setNotificationCount(data.count);
        }

        // Fetch upcoming event
        const eventRes = await fetch("/events/upcoming");
        if (eventRes.ok) {
          const event = await eventRes.json();
          setUpcomingEvent(event);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (userRole) {
      fetchData();
    }
  }, [userRole]);

  // Base navigation links
  const baseNavLinks = [{ path: "/", text: "Главная" }];

  // Role-specific navigation links
  const roleBasedLinks = {
    student: [
      { path: "/schedule", text: "Расписание" },
      { path: "/grades", text: "Оценки" },
      { path: "/materials", text: "Материалы" },
    ],
    professor: [
      { path: "/schedule", text: "Расписание" },
      { path: "/students", text: "Студенты" },
      { path: "/materials", text: "Материалы" },
    ],
    admin: [
      { path: "/users", text: "Пользователи" },
      { path: "/faculties", text: "Факультеты" },
      { path: "/settings", text: "Настройки" },
    ],
    training_department: [
      { path: "/applications", text: "Заявки" },
      { path: "/reports", text: "Отчеты" },
    ],
    organizing_department: [{ path: "/events", text: "Мероприятия" }],
    chancellery: [{ path: "/documents", text: "Документы" }],
    stud_office: [
      { path: "/students", text: "Студенты" },
      { path: "/scholarships", text: "Стипендии" },
    ],
  };

  // Combine base links with role-specific links
  const navLinks = [
    ...baseNavLinks,
    ...(userRole ? roleBasedLinks[userRole] || [] : []),
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

          <div className="header__icons">
            {userRole ? (
              <>
                <Link to="/notifications" className="header__icon-link">
                  <Bell size={20} />
                  {notificationCount > 0 && (
                    <span className="header__notification-badge">
                      {notificationCount}
                    </span>
                  )}
                </Link>

                {upcomingEvent && (
                  <Link
                    to={`/event/${upcomingEvent.id}`}
                    className="header__icon-link"
                    title={upcomingEvent.title}
                  >
                    <Calendar size={20} />
                  </Link>
                )}
              </>
            ) : (
              <Link to="/AuthPage" className="header__icon-link" title="Войти">
                <LogIn size={20} />
              </Link>
            )}
          </div>

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
            {userRole ? (
              <>
                <li>
                  <Link to="/notifications" onClick={closeMobileMenu}>
                    Уведомления{" "}
                    {notificationCount > 0 && `(${notificationCount})`}
                  </Link>
                </li>
                {upcomingEvent && (
                  <li>
                    <Link
                      to={`/event/${upcomingEvent.id}`}
                      onClick={closeMobileMenu}
                    >
                      Ближайшее: {upcomingEvent.title}
                    </Link>
                  </li>
                )}
              </>
            ) : (
              <li>
                <Link to="/login" onClick={closeMobileMenu}>
                  Войти
                </Link>
              </li>
            )}
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
