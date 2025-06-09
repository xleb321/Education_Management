import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();
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
  origin: ["http://localhost:3000", "http://localhost:3001"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

fastify.register(jwt, {
  secret: process.env.JWT_SECRET,
});

fastify.get("/", async () => {
  return { message: "Hello from Dockerized Fastify!" };
});

fastify.post("/registration", async (req, reply) => {
  try {
    reply.code(201).send("Получены данные:", req.body);
    console.log("Получены данные:", req.body);
    // Пример сохранения данных в базу данных через Prisma
    // const newApplicant = await prisma.applicant.create({
    //   data: {
    //     firstName: req.body.firstName,
    //     lastName: req.body.lastName,
    //     email: req.body.email,
    //     phone: req.body.phone,
    //     course: req.body.course,
    //     birthDate: new Date(req.body.birthDate),
    //   },
    // });
    // reply.code(201).send({ message: "Данные успешно сохранены", data: newApplicant });
  } catch (error) {
    console.error("Ошибка:", error);
    reply.code(500).send({ error: "Ошибка при обработке данных" });
  }
});

fastify.get("/test-db", async () => {
  try {
    await prisma.$connect();
    return { status: "DB connection OK" };
  } catch (error) {
    return { error: "DB connection failed", details: error.message };
  }
});

const start = async () => {
  try {
    await fastify.listen({
      port: 3001,
      host: "0.0.0.0",
    });
    // fastify.log.info(`Server running at ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
