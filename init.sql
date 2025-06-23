CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    patronymic VARCHAR(50),
    role_id INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT fk_user_role 
        FOREIGN KEY (role_id) REFERENCES roles(id) 
        ON DELETE RESTRICT
);

-- Факультеты
CREATE TABLE faculties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    dean_name VARCHAR(50) NOT NULL
);

-- Направления
CREATE TABLE directions (
    id SERIAL PRIMARY KEY,
    faculty_id INTEGER NOT NULL REFERENCES faculties(id) ON DELETE CASCADE,
    code VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT, -- ДОБАВЛЕН СТОЛБЕЦ
    UNIQUE (faculty_id, code)
);

-- Учебные группы
CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    direction_id INTEGER NOT NULL REFERENCES directions(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    start_year INTEGER NOT NULL,
    end_year INTEGER NOT NULL,
    UNIQUE (direction_id, name)
);

-- Связь пользователей с группами (многие-ко-многим)
CREATE TABLE user_groups (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, group_id)
);

-- Добавляем связь пользователя с группой в основной таблице пользователей
ALTER TABLE users ADD COLUMN group_id INTEGER REFERENCES groups(id) ON DELETE SET NULL;

-- Создание ролей
INSERT INTO roles (name) VALUES 
('user'),      -- 1
('student'),   -- 2
('lecturer'),  -- 3
('deaden'),    -- 4
('admin');     -- 5

--Тестовые пользователи
INSERT INTO users (email, password, name, surname, role_id) VALUES 
('ivan@mail.ru', '1234', 'Иван', 'Иванов', 2),
('egor@mail.ru', '1234', 'Егор', 'Петров', 5);

-- Факультеты
INSERT INTO faculties (name, dean_name) VALUES
('Технологический факультет', 'Иванов Иван Иванович'),
('Энергетический факультет', 'Петров Петр Петрович'),
('Факультет информационных технологий и управления', 'Сидорова Анна Михайловна'),
('Факультет геологии, горного и нефтегазового дела', 'Кузнецов Алексей Владимирович'),
('Факультет инноватики и организации производства', 'Смирнова Елена Дмитриевна'),
('Механический факультет', 'Васильев Денис Сергеевич'),
('Строительный факультет', 'Николаева Ольга Павловна');

-- Направления
INSERT INTO directions (faculty_id, code, name, description) VALUES
(1, '18.03.01', 'Химическая технология', 'Описание направления химической технологии'),
(1, '20.03.01', 'Техносферная безопасность', 'Описание направления техносферной безопасности'),
(2, '13.03.02', 'Электроэнергетика и электротехника', 'Описание направления электроэнергетики'),
(2, '13.03.01', 'Теплоэнергетика и теплотехника', 'Описание направления теплоэнергетики'),
(3, '09.03.01', 'Информатика и вычислительная техника', 'Описание направления информатики'),
(3, '27.03.04', 'Управление в технических системах', 'Описание направления управления'),
(4, '21.03.01', 'Нефтегазовое дело', 'Описание направления нефтегазового дела'),
(4, '21.05.04', 'Горное дело', 'Описание направления горного дела'),
(4, '05.03.01', 'Прикладная геология', 'Описание направления прикладной геологии'),
(5, '38.03.01', 'Экономика', 'Описание направления экономики'),
(5, '39.03.03', 'Организация работы с молодежью', 'Описание работы с молодежью'),
(6, '15.03.04', 'Автоматизация технологических процессов и производств', 'Описание автоматизации'),
(6, '23.03.03', 'Эксплуатация транспортно-технологических машин', 'Описание эксплуатации'),
(7, '08.03.01', 'Строительство', 'Описание строительного направления'),
(7, '54.03.01', 'Дизайн архитектурной среды', 'Описание дизайна архитектурной среды');

-- Группы
INSERT INTO groups (direction_id, name, start_year, end_year) VALUES
(1, 'ХТ-101', 2023, 2027),
(1, 'ХТ-102', 2023, 2027),
(2, 'ТБ-201', 2022, 2026),
(5, 'ИВТ-301', 2023, 2027),
(5, 'ИВТ-302', 2023, 2027),
(7, 'НГД-401', 2022, 2026);

-- Назначение пользователя в группу
UPDATE users SET group_id = 1 WHERE email = 'ivan@mail.ru';
UPDATE users SET group_id = 4 WHERE email = 'egor@mail.ru';

-- Или через связь многие-ко-многим
INSERT INTO user_groups (user_id, group_id) VALUES
(1, 1),
(1, 3),
(2, 4);