const pool = require('./db');

(async () => {
    const usersTableStmt = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY NOT NULL,
    email VARCHAR(50) NOT NULL,
    password TEXT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  );
`;

const tasksTableStmt = `
  CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(50),
    status VARCHAR(50) DEFAULT 'To-Do',
    deadline DATE,
    user_id INT NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`;


    try {
        console.log('Connecting to the database...');

        // Perform queries using the pool
        console.log('Setting up database...');
        await pool.query(usersTableStmt);
        console.log('Users table setup complete.');
        await pool.query(tasksTableStmt);
        console.log('Tasks table setup complete.');
    } catch (err) {
        console.error('Error setting up the database:', err.message);
    } finally {
        // Release the pool to clean up resources
        await pool.end();
        console.log('Database connection pool closed.');
    }
})();
