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

// =================== Тесты =================== //

fastify.get("/", async (req, reply) => {
  try {
    reply.code(418).send({ message: "Добрый день!" });
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

fastify.get("/roles", async (req, reply) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM roles`);
    reply.send(rows);
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

fastify.get("/users", async (req, reply) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM users`);
    reply.send(rows);
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// =================== Факультеты =================== //

fastify.get("/faculties", async (req, reply) => {
  const { rows: faculties } = await pool.query(`
    SELECT f.*, 
           json_agg(d.*) AS directions 
    FROM faculties f
    LEFT JOIN directions d ON d.faculty_id = f.id
    GROUP BY f.id
  `);
  reply.send(faculties);
});

fastify.get("/faculties/with-directions", async (req, reply) => {
  const { rows } = await pool.query(`
    SELECT 
      f.id,
      f.name,
      f.dean_name as dean,
      json_agg(
        json_build_object(
          'id', d.id,
          'code', d.code,
          'name', d.name
        ) ORDER BY d.code
      ) FILTER (WHERE d.id IS NOT NULL) as directions
    FROM faculties f
    LEFT JOIN directions d ON d.faculty_id = f.id
    GROUP BY f.id
    ORDER BY f.id
  `);
  reply.send(rows);
});

fastify.get("/faculties/:id", async (req, reply) => {
  const { id } = req.params;
  const { rows } = await pool.query(
    `
    SELECT 
      f.*,
      (
        SELECT json_agg(
          json_build_object(
            'id', d.id,
            'code', d.code,
            'name', d.name
          )
        )
        FROM directions d
        WHERE d.faculty_id = f.id
      ) as directions
    FROM faculties f
    WHERE f.id = $1
  `,
    [id]
  );
  reply.send(rows[0] || null);
});

fastify.get("/directions/:id", async (req, reply) => {
  const { id } = req.params;
  const { rows } = await pool.query(
    `
    SELECT 
      d.*,
      f.name as faculty_name,
      (
        SELECT json_agg(
          json_build_object(
            'id', g.id,
            'name', g.name,
            'start_year', g.start_year,
            'end_year', g.end_year
          )
        )
        FROM groups g
        WHERE g.direction_id = d.id
      ) as groups
    FROM directions d
    JOIN faculties f ON d.faculty_id = f.id
    WHERE d.id = $1
  `,
    [id]
  );
  reply.send(rows[0] || null);
});

fastify.get("/directions/:id/groups", async (req, reply) => {
  const { id } = req.params;
  const { rows } = await pool.query(
    "SELECT * FROM groups WHERE direction_id = $1",
    [id]
  );
  reply.send(rows);
});

// =================== Авторизация =================== //

fastify.post("/auth/login", async (req, reply) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return reply.code(400).send({ error: "Email and password are required" });
    }

    const { rows } = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);

    if (rows.length === 0) {
      return reply.code(401).send({ error: "Invalid email or password" });
    }

    const user = rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return reply.code(401).send({ error: "Invalid email or password" });
    }

    const token = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      role_id: user.role_id,
    });

    const { password: _, ...userData } = user;
    reply.send({
      user: userData,
      token,
    });
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

fastify.post("/auth/register", async (req, reply) => {
  try {
    const { email, password, name, surname, patronymic, phone } = req.body;

    if (!email || !password || !name || !surname) {
      return reply.code(400).send({ error: "Missing required fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
      `INSERT INTO users (email, password, name, surname, patronymic, phone, role_id) 
       VALUES ($1, $2, $3, $4, $5, $6, DEFAULT)
       RETURNING id, email, name, surname, patronymic, phone, created_at, role_id`,
      [email, hashedPassword, name, surname, patronymic || null, phone || null]
    );

    const user = rows[0];
    const token = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      role_id: user.role_id,
    });

    reply.code(201).send({
      user,
      token,
    });
  } catch (error) {
    if (error.code === "23505") {
      reply.code(409).send({ error: "User with this email already exists" });
    } else {
      reply.code(500).send({ error: error.message });
    }
  }
});

// =================== Группы =================== //

fastify.post("/users/:userId/groups", async (req, reply) => {
  const { userId } = req.params;
  const { groupId } = req.body;

  await pool.query(
    "INSERT INTO user_groups (user_id, group_id) VALUES ($1, $2)",
    [userId, groupId]
  );

  reply.code(201).send({ message: "User added to group" });
});

const start = async () => {
  try {
    await fastify.listen({
      port: process.env.SERVER_PORT || 3001,
      host: "0.0.0.0",
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
