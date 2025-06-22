import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import dotenv from "dotenv";
import { Pool } from "pg";
import bcrypt from "bcrypt";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

const fastify = Fastify({
  logger: {
    level: "info",
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
});

const checkDatabaseConnection = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Database connection established");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

fastify.register(cors, {
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

fastify.register(jwt, {
  secret: process.env.JWT_SECRET,
});

// Хелпер для проверки аутентификации
async function authenticate(request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
}

fastify.get("/", async (req, reply) => {
  try {
    reply.code(418).send({ message: "Добрый день!" });
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

fastify.post("/register", async (req, reply) => {
  const { firstName, lastName, email, password, phone, course, birthDate } =
    req.body;

  // Валидация
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !phone ||
    !course ||
    !birthDate
  ) {
    return reply
      .code(400)
      .send({ error: "Все поля обязательны для заполнения" });
  }

  try {
    // Проверка существования пользователя
    const userExists = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return reply
        .code(409)
        .send({ error: "Пользователь с таким email уже существует" });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя
    const { rows } = await pool.query(
      `INSERT INTO users 
       (first_name, last_name, email, password_hash, phone, course, birth_date) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, first_name, last_name, email, phone, course`,
      [firstName, lastName, email, hashedPassword, phone, course, birthDate]
    );

    // Назначение роли (по умолчанию student)
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id) 
       VALUES ($1, (SELECT id FROM roles WHERE name = 'student'))`,
      [rows[0].id]
    );

    // Генерация токена
    const token = fastify.jwt.sign({
      id: rows[0].id,
      email: rows[0].email,
      role: "student",
    });

    reply.code(201).send({
      user: rows[0],
      token,
      message: "Регистрация успешна",
    });
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// Аутентификация пользователя
fastify.post("/login", async (req, reply) => {
  const { email, password } = req.body;

  // Валидация обязательных полей
  if (!email || !password) {
    return reply.code(400).send({ error: "Email and password are required" });
  }

  try {
    // Поиск пользователя с ролью
    const { rows } = await pool.query(
      `SELECT u.*, r.name as role 
       FROM users u
       JOIN user_roles ur ON u.id = ur.user_id
       JOIN roles r ON ur.role_id = r.id
       WHERE u.email = $1`,
      [email]
    );

    if (rows.length === 0) {
      return reply.code(401).send({ error: "Invalid credentials" });
    }

    const user = rows[0];

    // Проверка пароля
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return reply.code(401).send({ error: "Invalid credentials" });
    }

    // Генерация JWT токена
    const token = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Формирование ответа без sensitive данных
    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
    };

    reply.send({
      user: userData,
      token,
      message: "Login successful",
    });
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// API для работы с пользователями
fastify.get("/users", { preHandler: [authenticate] }, async (req, reply) => {
  const { rows } = await pool.query(
    `SELECT u.*, r.name as role 
     FROM users u
     JOIN user_roles ur ON u.id = ur.user_id
     JOIN roles r ON ur.role_id = r.id`
  );
  reply.send(rows);
});

// API для работы с факультетами
fastify.get("/faculties", async (req, reply) => {
  try {
    // const facultiesRes = await pool.query(`
    //   SELECT f.id, f.name, u.id as dean_id,u.name as dean_name
    //   FROM faculties f
    //   LEFT JOIN users u ON f.dean_id = u.id
    //   ORDER BY f.id
    // `);

    const facultiesRes = await pool.query(`
      SELECT u.id, u.name
      FROM users u
    `);

    reply.send(facultiesRes);
  } catch (error) {
    console.error("Error in /faculties:", error);
    reply.code(500).send({
      error: "Internal Server Error",
      details: error.message,
    });
  }
});

// API для работы с расписанием
fastify.get(
  "/schedules",
  { preHandler: [authenticate] },
  async (req, reply) => {
    const { group_id } = req.query;
    let query = `
    SELECT s.*, sub.name as subject_name, g.name as group_name, 
           u.name as teacher_name, r.name as role
    FROM schedules s
    JOIN subjects sub ON s.subject_id = sub.id
    JOIN student_groups g ON s.group_id = g.id
    JOIN users u ON s.teacher_id = u.id
    JOIN user_roles ur ON u.id = ur.user_id
    JOIN roles r ON ur.role_id = r.id
  `;

    if (group_id) {
      query += ` WHERE s.group_id = $1`;
      const { rows } = await pool.query(query, [group_id]);
      reply.send(rows);
    } else {
      const { rows } = await pool.query(query);
      reply.send(rows);
    }
  }
);

// API для работы с оценками
fastify.get("/grades", { preHandler: [authenticate] }, async (req, reply) => {
  const { student_id } = req.query;

  if (student_id) {
    const { rows } = await pool.query(
      `SELECT g.*, e.exam_date, sub.name as subject_name
       FROM grades g
       JOIN exams e ON g.exam_id = e.id
       JOIN subjects sub ON e.subject_id = sub.id
       WHERE g.student_id = $1`,
      [student_id]
    );
    reply.send(rows);
  } else {
    reply.code(400).send({ error: "student_id parameter is required" });
  }
});

// API для работы с заявками
fastify.post(
  "/applications",
  { preHandler: [authenticate] },
  async (req, reply) => {
    const { type, content } = req.body;
    const user_id = req.user.id;

    const { rows } = await pool.query(
      `INSERT INTO applications (applicant_id, type, content)
     VALUES ($1, $2, $3) RETURNING *`,
      [user_id, type, content]
    );

    reply.code(201).send(rows[0]);
  }
);

// API для работы с посещаемостью
fastify.get(
  "/attendance",
  { preHandler: [authenticate] },
  async (req, reply) => {
    const { student_id, date_from, date_to } = req.query;

    let query = `
    SELECT a.*, u.name as student_name
    FROM attendance a
    JOIN users u ON a.student_id = u.id
    WHERE a.student_id = $1
  `;

    const params = [student_id];

    if (date_from && date_to) {
      query += ` AND a.date BETWEEN $2 AND $3`;
      params.push(date_from, date_to);
    }

    const { rows } = await pool.query(query, params);
    reply.send(rows);
  }
);

// New API for unread notifications count
fastify.get(
  "/notifications/unread-count",
  { preHandler: [authenticate] },
  async (req, reply) => {
    const { rows } = await pool.query(
      `SELECT COUNT(*) FROM notifications 
       WHERE user_id = $1 AND is_read = FALSE`,
      [req.user.id]
    );
    reply.send({ count: parseInt(rows[0].count) });
  }
);

// New API for upcoming event
fastify.get(
  "/events/upcoming",
  { preHandler: [authenticate] },
  async (req, reply) => {
    try {
      // For students: get next class from schedule
      if (req.user.role === "student") {
        const { rows } = await pool.query(
          `SELECT s.id, sub.name as title, s.start_time as time, 
                  s.room, s.day_of_week, s.valid_from
           FROM schedules s
           JOIN subjects sub ON s.subject_id = sub.id
           JOIN student_groups sg ON s.group_id = sg.id
           JOIN users u ON sg.id = u.faculty_id
           WHERE u.id = $1 AND s.valid_from >= CURRENT_DATE
           ORDER BY s.valid_from ASC
           LIMIT 1`,
          [req.user.id]
        );

        if (rows.length > 0) {
          reply.send(rows[0]);
        } else {
          reply.code(404).send({ message: "No upcoming events" });
        }
      }
      // For professors: get next class they teach
      else if (req.user.role === "professor") {
        const { rows } = await pool.query(
          `SELECT s.id, sub.name as title, s.start_time as time, 
                  s.room, s.day_of_week, s.valid_from
           FROM schedules s
           JOIN subjects sub ON s.subject_id = sub.id
           WHERE s.teacher_id = $1 AND s.valid_from >= CURRENT_DATE
           ORDER BY s.valid_from ASC
           LIMIT 1`,
          [req.user.id]
        );

        if (rows.length > 0) {
          reply.send(rows[0]);
        } else {
          reply.code(404).send({ message: "No upcoming events" });
        }
      }
      // For other roles: get nearest exam
      else {
        const { rows } = await pool.query(
          `SELECT e.id, sub.name as title, e.exam_date as date, 
                  e.room, 'exam' as type
           FROM exams e
           JOIN subjects sub ON e.subject_id = sub.id
           WHERE e.exam_date >= CURRENT_DATE
           ORDER BY e.exam_date ASC
           LIMIT 1`
        );

        if (rows.length > 0) {
          reply.send(rows[0]);
        } else {
          reply.code(404).send({ message: "No upcoming events" });
        }
      }
    } catch (error) {
      reply.code(500).send({ error: error.message });
    }
  }
);

// API for notifications
fastify.get(
  "/notifications",
  { preHandler: [authenticate] },
  async (req, reply) => {
    const { rows } = await pool.query(
      `SELECT * FROM notifications 
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );
    reply.send(rows);
  }
);

// Mark notification as read
fastify.put(
  "/notifications/:id/read",
  { preHandler: [authenticate] },
  async (req, reply) => {
    const { id } = req.params;

    const { rows } = await pool.query(
      `UPDATE notifications 
       SET is_read = TRUE 
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, req.user.id]
    );

    if (rows.length === 0) {
      return reply.code(404).send({ error: "Notification not found" });
    }

    reply.send(rows[0]);
  }
);

const start = async () => {
  console.log("Waiting for PostgreSQL to initialize...");
  await new Promise((resolve) => setTimeout(resolve, 10000));

  try {
    await checkDatabaseConnection();
    console.log("✅ Database connection established");

    await fastify.listen({
      port: process.env.SERVER_PORT || 3001,
      host: "0.0.0.0",
    });
    console.log(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
