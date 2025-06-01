const { query } = require("../client");

class Model {
  constructor(tableName) {
    this.tableName = tableName;
  }

  async findById(id) {
    const { rows } = await query(
      `SELECT * FROM ${this.tableName} WHERE id = $1`,
      [id]
    );
    return rows[0];
  }

  async findAll() {
    const { rows } = await query(`SELECT * FROM ${this.tableName}`);
    return rows;
  }

  async create(data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");

    const { rows } = await query(
      `INSERT INTO ${this.tableName} (${keys.join(
        ", "
      )}) VALUES (${placeholders}) RETURNING *`,
      values
    );

    return rows[0];
  }
}

module.exports = Model;
