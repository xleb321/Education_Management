import React, { useState } from "react";
import "./HomePage.css";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const directions = [
    {
      title: "Управление в технических системах",
      items: [
        "Интеллектуальные средства обработки информации",
        "Качество и управление в технических системах",
        "Комплексные системы безопасности",
        "Робототехника и искусственный интеллект",
        "Системы и средства автоматизации технологических процессов",
      ],
      link: "fitu",
    },
    {
      title: "Электроэнергетика и электротехника",
      items: [],
      link: "CK",
    },
  ];

  return (
    <div className="home-page">
      <section className="hero">
        <h1>Добро пожаловать в Университет Технологий</h1>
        <p>Лидер в области инновационного образования и научных исследований</p>
        <button className="button">Подать заявку</button>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>Рост по карьерной лестнице</h3>
          <p>
            Руководящие должности доступны преимущественно специалистам с высшим
            образованием.
          </p>
        </div>
        <div className="feature-card">
          <h3>Вакансии в крупных компаниях</h3>
          <p>
            Диплом вуза обязателен при трудоустройстве в государственные
            корпорации и частные холдинги.
          </p>
        </div>
        <div className="feature-card">
          <h3>Подтверждённая квалификация</h3>
          <p>
            Работодатели ценят кандидатов, чья квалификация подтверждена
            соответствующими документамю.
          </p>
        </div>
        <div className="feature-card">
          <h3>Увеличение доходов</h3>
          <p>
            Заработная плата сотрудников с дипломом вуза выше, чем у сотрудников
            без высшего образования.
          </p>
        </div>
      </section>

      <section className="choose-direction">
        <h1>Выбери свое направление</h1>
        <div className="directions-container">
          {directions.map((direction, index) => (
            <div
              className={`direction-dropdown ${
                activeDropdown === index ? "open" : ""
              }`}
            >
              <div
                className="direction-title"
                onClick={() => toggleDropdown(index)}
              >
                {direction.title}
                <span className="dropdown-icon">
                  {activeDropdown === index ? "▲" : "▼"}
                </span>
              </div>
              <div className="direction-content">
                <ul>
                  {direction.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
                {direction.items.length > 0 && (
                  <Link to={`/directions/${direction.link}`}>
                    <button className="details-button button">подробнее</button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
