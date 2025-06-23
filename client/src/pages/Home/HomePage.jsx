import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFacultiesWithDirections } from "@api/faculties";
import "./HomePage.css";

const HomePage = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const data = await getFacultiesWithDirections();

        // Добавляем проверку и инициализацию directions
        const safeData = data.map((faculty) => ({
          ...faculty,
          directions: faculty.directions || [],
        }));

        setFaculties(safeData);
      } catch (err) {
        console.error("Failed to fetch faculties:", err);
        setError(
          err.response?.data?.error ||
            err.message ||
            "Не удалось загрузить данные о факультетах"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFaculties();
  }, []);

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка данных о факультетах...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>Ошибка загрузки</h3>
          <p>{error}</p>
          <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Герой-секция */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Добро пожаловать в Университет Технологий
          </h1>
          <p className="hero-subtitle">
            Лидер в области инновационного образования и научных исследований
          </p>
          <Link to="/admission" className="cta-button">
            Подать заявку
          </Link>
        </div>
      </section>

      {/* Преимущества */}
      <section className="benefits-section">
        <h2 className="section-title">Наши преимущества</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">📈</div>
            <h3>Карьерный рост</h3>
            <p>
              Руководящие должности доступны преимущественно специалистам с
              высшим образованием.
            </p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">💼</div>
            <h3>Трудоустройство</h3>
            <p>
              Диплом вуза обязателен при трудоустройстве в государственные
              корпорации и частные холдинги.
            </p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🎓</div>
            <h3>Квалификация</h3>
            <p>
              Работодатели ценят кандидатов, чья квалификация подтверждена
              соответствующими документами.
            </p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">💰</div>
            <h3>Доходы</h3>
            <p>
              Заработная плата сотрудников с дипломом вуза выше, чем у
              сотрудников без высшего образования.
            </p>
          </div>
        </div>
      </section>

      {/* Факультеты и направления */}
      <section className="faculties-section">
        <h2 className="section-title">Факультеты и направления подготовки</h2>
        <div className="faculties-list">
          {faculties.map((faculty, index) => (
            <div
              key={faculty.id}
              className={`faculty-card ${
                activeDropdown === index ? "active" : ""
              }`}
            >
              <div
                className="faculty-header"
                onClick={() => toggleDropdown(index)}
              >
                <h3 className="faculty-title">
                  {faculty.name}
                  {faculty.dean && (
                    <span className="dean-info"> (Декан: {faculty.dean})</span>
                  )}
                </h3>
                <span className="dropdown-arrow">
                  {activeDropdown === index ? "▲" : "▼"}
                </span>
              </div>

              {activeDropdown === index && (
                <div className="directions-list">
                  <ul>
                    {/* Добавлена проверка на существование directions */}
                    {(faculty.directions || []).map((direction) => (
                      <li key={direction.id} className="direction-item">
                        <Link
                          to={`/directions/${direction.id}`}
                          className="direction-link"
                        >
                          <span className="direction-code">
                            {direction.code}
                          </span>
                          <span className="direction-name">
                            {direction.name}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
