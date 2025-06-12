-- Создание таблицы ролей
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

-- Создание таблицы факультетов
CREATE TABLE faculties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    dean_id INT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Создание таблицы пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    faculty_id INT REFERENCES faculties(id),
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Добавляем внешний ключ для декана
ALTER TABLE faculties ADD CONSTRAINT fk_dean FOREIGN KEY (dean_id) REFERENCES users(id);

-- Создание таблицы групп
CREATE TABLE student_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    faculty_id INT REFERENCES faculties(id),
    curator_id INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Создание таблицы предметов
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    faculty_id INT REFERENCES faculties(id),
    description TEXT
);

-- Создание таблицы расписания
CREATE TABLE schedules (
    id SERIAL PRIMARY KEY,
    subject_id INT NOT NULL REFERENCES subjects(id),
    group_id INT NOT NULL REFERENCES student_groups(id),
    teacher_id INT NOT NULL REFERENCES users(id),
    room VARCHAR(20) NOT NULL,
    day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_even_week BOOLEAN,
    valid_from DATE NOT NULL,
    valid_until DATE
);

-- Создание таблицы экзаменов
CREATE TABLE exams (
    id SERIAL PRIMARY KEY,
    subject_id INT REFERENCES subjects(id),
    exam_date DATE NOT NULL,
    teacher_id INT REFERENCES users(id),
    room VARCHAR(20) NOT NULL
);

-- Создание таблицы оценок
CREATE TABLE grades (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES users(id),
    exam_id INT REFERENCES exams(id),
    grade INT CHECK (grade BETWEEN 0 AND 100),
    passed BOOLEAN DEFAULT FALSE,
    recorded_at TIMESTAMP DEFAULT NOW()
);

-- Создание таблицы учебных материалов
CREATE TABLE study_materials (
    id SERIAL PRIMARY KEY,
    subject_id INT REFERENCES subjects(id),
    title VARCHAR(255) NOT NULL,
    file_path VARCHAR(255),
    upload_date TIMESTAMP DEFAULT NOW(),
    uploaded_by INT REFERENCES users(id)
);

-- Создание таблицы заявок
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    applicant_id INT NOT NULL REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'На рассмотрении',
    content TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP,
    resolved_by INT REFERENCES users(id)
);

-- Создание таблицы стипендий
CREATE TABLE scholarships (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    approved_by INT REFERENCES users(id)
);

-- Создание таблицы сообщений
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL REFERENCES users(id),
    recipient_id INT REFERENCES users(id),
    group_id INT REFERENCES student_groups(id),
    content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE
);

-- Создание таблицы уведомлений
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Создание таблицы карт доступа
CREATE TABLE access_cards (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    card_id VARCHAR(50) UNIQUE NOT NULL,
    valid_until TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Создание таблицы логов доступа
CREATE TABLE access_logs (
    id SERIAL PRIMARY KEY,
    card_id VARCHAR(50) NOT NULL,
    access_time TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) NOT NULL
);

-- Создание таблицы посещаемости
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES users(id),
    date DATE NOT NULL,
    entry_time TIMESTAMP,
    exit_time TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'Отсутствует'
);

-- Создание индексов
CREATE INDEX idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_group ON messages(group_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE is_read = FALSE;

-- Заполнение ролей
INSERT INTO roles (name, description) VALUES
('student', 'Студент'),
('professor', 'Преподаватель'),
('training_department', 'Учебный отдел'),
('organizing_department', 'Организационный отдел'),
('chancellery', 'Канцелярия'),
('stud_office', 'Деканат/Студенческий офис'),
('admin', 'Администратор системы');

-- Заполнение факультетов
INSERT INTO faculties (name) VALUES
('Факультет информационных технологий'),
('Физико-математический факультет'),
('Факультет гуманитарных наук');

-- Заполнение пользователей (пароли должны быть хешированы в реальной системе)
INSERT INTO users (email, password_hash, name, is_active) VALUES
-- Администраторы
('admin@edu.ru', '$2a$10$xJwL5v5Jz5U5Z5U5Z5U5Ze', 'Администратор Системы', true),
-- Преподаватели
('professor1@edu.ru', '$2a$10$xJwL5v5Jz5U5Z5U5Z5U5Ze', 'Пётр Преподавателев', true),
('professor2@edu.ru', '$2a$10$xJwL5v5Jz5U5Z5U5Z5U5Ze', 'Ольга Лекторова', true),
('professor3@edu.ru', '$2a$10$xJwL5v5Jz5U5Z5U5Z5U5Ze', 'Сергей Семинаров', true),
-- Студенты
('student1@edu.ru', '$2a$10$xJwL5v5Jz5U5Z5U5Z5U5Ze', 'Иван Студентов', true),
('student2@edu.ru', '$2a$10$xJwL5v5Jz5U5Z5U5Z5U5Ze', 'Мария Академикова', true),
('student3@edu.ru', '$2a$10$xJwL5v5Jz5U5Z5U5Z5U5Ze', 'Алексей Лекторов', true),
-- Персонал
('training@edu.ru', '$2a$10$xJwL5v5Jz5U5Z5U5Z5U5Ze', 'Анна Успеваева', true),
('organizing@edu.ru', '$2a$10$xJwL5v5Jz5U5Z5U5Z5U5Ze', 'Дмитрий Организаторов', true),
('chancellery@edu.ru', '$2a$10$xJwL5v5Jz5U5Z5U5Z5U5Ze', 'Елена Документова', true),
('studoffice@edu.ru', '$2a$10$xJwL5v5Jz5U5Z5U5Z5U5Ze', 'Артём Справкин', true);

-- Назначение деканов факультетов
UPDATE faculties SET dean_id = 2 WHERE id = 1; -- ФИТ
UPDATE faculties SET dean_id = 3 WHERE id = 2; -- ФМФ
UPDATE faculties SET dean_id = 4 WHERE id = 3; -- ФГН

-- Назначение ролей пользователям
INSERT INTO user_roles (user_id, role_id) VALUES
-- Администратор
(1, 7),
-- Преподаватели
(2, 2), (3, 2), (4, 2),
-- Студенты
(5, 1), (6, 1), (7, 1),
-- Персонал
(8, 3), (9, 4), (10, 5), (11, 6);

-- Заполнение групп
INSERT INTO student_groups (name, faculty_id, curator_id) VALUES
('ИТ-21', 1, 2),
('ИТ-22', 1, 2),
('ФМ-21', 2, 3),
('ФМ-22', 2, 3),
('ГН-21', 3, 4);

-- Заполнение предметов
INSERT INTO subjects (name, faculty_id, description) VALUES
('Программирование', 1, 'Основы программирования на Java'),
('Базы данных', 1, 'SQL и проектирование БД'),
('Физика', 2, 'Общий курс физики'),
('Математический анализ', 2, 'Дифференциальное и интегральное исчисление'),
('История', 3, 'История России'),
('Философия', 3, 'Основы философского знания');

-- Заполнение расписания
INSERT INTO schedules (subject_id, group_id, teacher_id, room, day_of_week, start_time, end_time, is_even_week, valid_from, valid_until) VALUES
-- Понедельник
(1, 1, 2, 'А-101', 1, '09:00', '10:30', NULL, '2023-09-01', '2023-12-31'),
(2, 1, 2, 'А-102', 1, '10:40', '12:10', NULL, '2023-09-01', '2023-12-31'),
-- Вторник
(3, 3, 3, 'Б-201', 2, '09:00', '10:30', NULL, '2023-09-01', '2023-12-31'),
-- Среда (разные недели)
(4, 3, 3, 'Б-202', 3, '09:00', '10:30', true, '2023-09-01', '2023-12-31'),
(5, 5, 4, 'В-301', 3, '09:00', '10:30', false, '2023-09-01', '2023-12-31');

-- Заполнение экзаменов
INSERT INTO exams (subject_id, exam_date, teacher_id, room) VALUES
(1, '2023-12-25', 2, 'А-101'),
(2, '2023-12-26', 2, 'А-102'),
(3, '2023-12-27', 3, 'Б-201'),
(4, '2023-12-28', 3, 'Б-202'),
(5, '2023-12-29', 4, 'В-301');

-- Заполнение оценок
INSERT INTO grades (student_id, exam_id, grade, passed) VALUES
(5, 1, 85, true),
(6, 1, 72, true),
(7, 1, 90, true),
(5, 2, 68, true),
(6, 2, 75, true);

-- Заполнение учебных материалов
INSERT INTO study_materials (subject_id, title, file_path, uploaded_by) VALUES
(1, 'Лекция 1. Введение в Java', '/materials/java_lecture1.pdf', 2),
(1, 'Практическое задание 1', '/materials/java_task1.pdf', 2),
(3, 'Лекция 1. Механика', '/materials/physics_lecture1.pdf', 3);

-- Заполнение заявок
INSERT INTO applications (applicant_id, type, status, content, created_at) VALUES
(5, 'Академ.отпуск', 'На рассмотрении', 'Прошу предоставить академический отпуск по состоянию здоровья', '2023-10-15 14:30:00'),
(6, 'Перевод', 'В процессе', 'Прошу перевести на факультет гуманитарных наук', '2023-10-16 10:15:00');

-- Заполнение стипендий
INSERT INTO scholarships (student_id, type, amount, start_date, end_date, approved_by) VALUES
(5, 'Академическая', 2000.00, '2023-09-01', '2023-12-31', 2),
(6, 'Повышенная', 3000.00, '2023-09-01', NULL, 2);

-- Заполнение сообщений
INSERT INTO messages (sender_id, recipient_id, group_id, content) VALUES
(2, NULL, 1, 'Добрый день! Напоминаю о сдаче лабораторной работы до конца недели'),
(5, 2, NULL, 'Здравствуйте, у меня вопрос по лабораторной работе');

-- Заполнение уведомлений
INSERT INTO notifications (user_id, title, message) VALUES
(5, 'Новая оценка', 'Вам выставлена оценка по предмету "Программирование"'),
(6, 'Новое сообщение', 'У вас новое сообщение от преподавателя');

-- Заполнение карт доступа
INSERT INTO access_cards (user_id, card_id, valid_until) VALUES
(5, 'A1B2C3D4', '2024-09-01 00:00:00'),
(6, 'E5F6G7H8', '2024-09-01 00:00:00'),
(2, 'I9J0K1L2', '2024-09-01 00:00:00');

-- Заполнение логов доступа
INSERT INTO access_logs (card_id, status) VALUES
('A1B2C3D4', 'Разрешено'),
('E5F6G7H8', 'Разрешено'),
('I9J0K1L2', 'Разрешено');

-- Заполнение посещаемости
INSERT INTO attendance (student_id, date, entry_time, exit_time, status) VALUES
(5, '2023-10-16', '2023-10-16 08:45:00', '2023-10-16 14:30:00', 'Присутствовал'),
(6, '2023-10-16', '2023-10-16 09:00:00', '2023-10-16 15:00:00', 'Присутствовал'),
(7, '2023-10-16', NULL, NULL, 'Отсутствует');