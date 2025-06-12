import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const seed = async () => {
  try {
    await pool.query(`
      INSERT INTO test_table (name) VALUES 
      ('Test 1'), ('Test 2'), ('Test 3')
    `);
    console.log("Seeding completed successfully");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await pool.end();
  }
};

seed();
