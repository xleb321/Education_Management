import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

// Инициализация
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

fastify.get("/health", async (req, reply) => {
  return { status: "OK" };
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
    fastify.log.info(`Server running at ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
