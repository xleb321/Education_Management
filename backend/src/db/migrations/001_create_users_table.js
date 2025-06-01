const { query } = require("../client");

module.exports = {
  up: async () => {
    await query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
  },

  down: async () => {
    await query("DROP TABLE IF EXISTS users");
  },
};
