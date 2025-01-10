import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Archive.css';
import bin_icon from '../../assets/bin-icon.png';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

function Archive() {
  const [archivedTasks, setArchivedTasks] = useState([]);

  useEffect(() => {
    fetchArchivedTasks();
  }, []);

  const fetchArchivedTasks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks`);
    setArchivedTasks(response.data.filter((task) => task.archived)); // Filter archived tasks
  } catch (error) {
    console.error('Error fetching archived tasks:', error);
  }
};

  const restoreTask = async (id) => {
  try {
    await axios.put(`${API_BASE_URL}/tasks/${id}`, { archived: false });
    setArchivedTasks((prevTasks) => prevTasks.filter((task) => task.id !== id)); // Remove from archived list
  } catch (error) {
    console.error('Error restoring task:', error);
  }
};

 const deleteTask = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/tasks/${id}`);
    setArchivedTasks((prevTasks) => prevTasks.filter((task) => task.id !== id)); // Remove from archived list
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="archive-container">
      {archivedTasks.map((task) => (
        <div className="archive-card" key={task.id}>
          <h3>{task.title}</h3>
          <p className="description">{task.description}</p>
          <p
            className={
              task.priority === 'High'
                ? 'priority-high'
                : task.priority === 'Medium'
                ? 'priority-medium'
                : 'priority-low'
            }
          >
            {task.priority}
          </p>
          <p>{task.status}</p>
          <p>Deadline: {task.deadline ? formatDate(task.deadline) : 'No deadline set'}</p>
          <div className="btn-container">
            <button onClick={() => restoreTask(task.id)}>Restore</button>
            <button onClick={() => deleteTask(task.id)}>
               <img src={bin_icon} alt="Delete" className="bin-icon" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Archive;

