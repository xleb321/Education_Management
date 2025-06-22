CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    login VARCHAR(50) NOT NULL UNIQUE,              -- Уникальный логин
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,             -- Уникальный email
    phone VARCHAR(20),                              -- Телефон (необязательный)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(50) NOT NULL,                      -- Имя
    surname VARCHAR(50) NOT NULL,                   -- Фамилия
    patronymic VARCHAR(50),                         -- Отчество (необязательное)
    role_id INTEGER NOT NULL DEFAULT 1,             -- Внешний ключ для связи
    CONSTRAINT fk_user_role 
        FOREIGN KEY (role_id) REFERENCES roles(id) 
        ON DELETE RESTRICT
);









-- Создание ролей
INSERT INTO roles (name) VALUES ('user');       -- 1
INSERT INTO roles (name) VALUES ('student');    -- 2
INSERT INTO roles (name) VALUES ('lecturer');   -- 3
INSERT INTO roles (name) VALUES ('deaden');     -- 4
INSERT INTO roles (name) VALUES ('admin');      -- 5

--Тестовые пользователи
INSERT INTO users (login, password, email, name, surname, role_id) 
VALUES ('ivan', '1234', 'ivan@mail.ru', 'Иван', 'Иванов', 2);

INSERT INTO users (login, password, email, name, surname, role_id) 
VALUES ('egor', '1234', 'egor@mail.ru', 'Егор', 'Петров', 5);
