import React from "react";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <h1>Добро пожаловать в Университет Технологий</h1>
        <p>Лидер в области инновационного образования и научных исследований</p>
        <button className="button">Узнать больше</button>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>Качественное образование</h3>
          <p>Наши программы соответствуют международным стандартам</p>
        </div>
        <div className="feature-card">
          <h3>Современные лаборатории</h3>
          <p>Оснащены самым современным оборудованием</p>
        </div>
        <div className="feature-card">
          <h3>Международное признание</h3>
          <p>Наши дипломы ценятся по всему миру</p>
        </div>
      </section>

      <section className="news">
        <h2>Последние новости</h2>
        <div className="news-item">
          <h3>Открытие нового корпуса</h3>
          <p>
            15 сентября состоится торжественное открытие нового учебного корпуса
          </p>
        </div>
        <div className="news-item">
          <h3>Научная конференция</h3>
          <p>Приглашаем всех желающих на ежегодную научную конференцию</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
