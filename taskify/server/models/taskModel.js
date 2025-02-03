const pool = require('../config/db');

const Task = {
    async createTask({ title, description, priority, status, deadline, user_id }) {
        const query = `
          INSERT INTO tasks (title, description, priority, status, deadline, user_id, archived)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *;
        `;
        const values = [title, description, priority, status, deadline, user_id, false];
        const result = await pool.query(query, values);
        return result.rows[0];
      },
      async getAllTasks() {
        const result = await pool.query('SELECT * FROM tasks');
        return result.rows;
    },

  async getAllTasks() {
    const result = await pool.query('SELECT * FROM tasks');
    return result.rows;
  },

  async deleteTask(id) {
    console.log('Executing DELETE query for id:', id); // Log the ID
    const query = 'DELETE FROM tasks WHERE id = $1 RETURNING *;';
    const result = await pool.query(query, [id]);
    console.log('Query result:', result.rows); // Log the query result
    return result.rows[0];
  },
};

module.exports = Task;

