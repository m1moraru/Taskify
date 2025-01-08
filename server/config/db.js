require('dotenv').config({path: '../.env'});
const { Pool } = require('pg');

console.log('Database password:', process.env.DB_PASSWORD);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

console.log('Database password:', process.env.DB_PASSWORD);

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the database');
    release();
  }
});

(async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database connected:', result.rows[0]);
  } catch (err) {
    console.error('Error connecting to database:', err.message);
  }
})();


module.exports = pool;