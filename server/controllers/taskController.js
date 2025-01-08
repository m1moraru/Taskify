const taskModel = require('../models/taskModel');
const pool = require('../config/db');

// Create a task
const createTask = async (req, res) => {
  try {
    console.log('req.user:', req.user); // Log the user object

    const { title, description, priority, status, deadline } = req.body;

    // Validate incoming data
    if (!title || !description || !priority || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Use default user ID for testing if req.user is undefined
    const userId = req.user?.id || 1; // Replace 1 with a valid user ID from your database

    console.log('Parsed data:', { title, description, priority, status, deadline, user_id: userId });

    const newTask = await taskModel.createTask({
      title,
      description,
      priority,
      status,
      deadline,
      user_id: userId,
    });

    console.log('Task successfully created:', newTask);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error.message); // Log the error
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Get all tasks
const getAllTasks = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a task
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { archived, title, description, priority, status, deadline } = req.body;

  try {
    const result = await pool.query(
      `UPDATE tasks SET 
        archived = COALESCE($1, archived),
        title = COALESCE($2, title), 
        description = COALESCE($3, description), 
        priority = COALESCE($4, priority), 
        status = COALESCE($5, status), 
        deadline = COALESCE($6, deadline) 
      WHERE id = $7 RETURNING *`,
      [archived, title, description, priority, status, deadline, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating task:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params; // Extract ID from the request
    console.log('Received DELETE request for ID:', id); // Debugging

    const result = await taskModel.deleteTask(id); // Interact with the database
    console.log('Delete result:', result); // Debugging

    if (result) {
      return res.status(200).json({ message: 'Task deleted successfully.' });
    } else {
      return res.status(404).json({ error: 'Task not found.' });
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Export all controller functions
module.exports = {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
};
