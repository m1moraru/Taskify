import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TaskList.css';
import bin_icon from '../../assets/bin-icon.png';
import update_icon from '../../assets/update-icon.png';

const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || "https://taskify-nuog.onrender.com/api").replace(/\/$/, "");

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [updatedTask, setUpdatedTask] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [viewedTask, setViewedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks`, { withCredentials: true });
      if (Array.isArray(response.data)) {
        setTasks(response.data);
      } else {
        console.error("Invalid response: API did not return an array.");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error.response?.data || error.message);
    }
  };

  const archiveTask = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/tasks/${id}`, { archived: true }, { withCredentials: true });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Error archiving task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${id}`, { withCredentials: true });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const openEditPopup = (task) => {
    setEditingTask(task.id);
    setUpdatedTask({ ...task });
    setIsPopupOpen(true);
  };

  const closeEditPopup = () => {
    setEditingTask(null);
    setUpdatedTask({});
    setIsPopupOpen(false);
  };

  const updateTask = async () => {
    try {
      const response = await axios.put(`${API_BASE_URL}/tasks/${editingTask}`, updatedTask, { withCredentials: true });
      setTasks((prevTasks) => prevTasks.map((task) => (task.id === editingTask ? { ...task, ...response.data } : task)));
      closeEditPopup();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="task-list-container">
      {tasks.length === 0 ? (
        <div className="no-tasks-message">
          <h3>No tasks available</h3>
          <p>Create a task to get started!</p>
        </div>
      ) : (
        tasks.map((task) => (
          <div className="task-card" key={task.id}>
            <div>
              <div className="status">
                <p className={
                  task.priority === 'High' ? 'priority-high' :
                  task.priority === 'Medium' ? 'priority-medium' :
                  'priority-low'}>
                  {task.priority}
                </p>
              </div>
              <div className="task-info">
                <h3>{task.title}</h3>
                <p className="deadline">Deadline: {task.deadline ? task.deadline.split('T')[0] : 'No deadline set'}</p>
                <p>{task.description}</p>
              </div>
              <div className="btn-container">
                <p>{task.status}</p>
                <button onClick={() => archiveTask(task.id)} className="archive-btn">Archive</button>
                <button onClick={() => openEditPopup(task)}>
                  <img src={update_icon} alt="Update" className="update-icon" />
                </button>
                <button onClick={() => deleteTask(task.id)}>
                  <img src={bin_icon} alt="Delete" className="bin-icon" />
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Edit Task</h3>
            <input
              type="text"
              value={updatedTask.title || ''}
              onChange={(e) => setUpdatedTask({ ...updatedTask, title: e.target.value })}
            />
            <textarea
              value={updatedTask.description || ''}
              onChange={(e) => setUpdatedTask({ ...updatedTask, description: e.target.value })}
            />
            <select
              value={updatedTask.priority || ''}
              onChange={(e) => setUpdatedTask({ ...updatedTask, priority: e.target.value })}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <select
              value={updatedTask.status || ''}
              onChange={(e) => setUpdatedTask({ ...updatedTask, status: e.target.value })}
            >
              <option value="To-Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <input
              type="date"
              value={updatedTask.deadline ? updatedTask.deadline.split('T')[0] : ''}
              onChange={(e) => setUpdatedTask({ ...updatedTask, deadline: e.target.value })}
            />
            <div className="popup-buttons">
              <button onClick={updateTask}>Save</button>
              <button onClick={closeEditPopup}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskList;
