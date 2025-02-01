import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CSS/Homepage.css';
import CreateTask from '../components/CreateTask/CreateTask';
import TaskList from '../components/TaskList/TaskList';
import Archive from '../components/Archive/Archive';
import PriorityOverview from '../components/PriorityOverview/PriorityOverview';
import { AuthContext } from '../context/AuthContext';
import MobileNav from '../components/MobileNav/MobileNav';

const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || "https://taskify-nuog.onrender.com").replace(/\/$/, "");
console.log('API_BASE_URL:', API_BASE_URL);

function Homepage() {
  const { user, logout } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const url = `${API_BASE_URL}/api/tasks`;
      console.log("Fetching tasks from:", url);
      
      const response = await axios.get(url, { withCredentials: true });
  
      console.log("Response Data:", response.data);
  
      if (!Array.isArray(response.data)) {
        throw new Error("Invalid response: API did not return an array.");
      }
  
      setTasks(response.data.filter((task) => !task.archived));
    } catch (error) {
      console.error("Error fetching tasks:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (activeSection === 'dashboard' || activeSection === 'tasks') {
      fetchTasks();
    }
  }, [activeSection]);

  const handleTaskSubmit = async (taskData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/tasks`, taskData);
      if (response.status === 201) {
        fetchTasks();
        setIsCreateTaskOpen(false);
      }
    } catch (error) {
      console.error('Error creating task:', error.response?.data || error.message);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="homepage-container">
      {/* Mobile Navigation */}
      <MobileNav
        user={user}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        setIsCreateTaskOpen={setIsCreateTaskOpen}
        handleSignOut={handleSignOut}
      />

      {/* Sidebar (visible on larger screens) */}
      <div className="sidebar">
        <div className="user-section">
          <p>Hello,</p>
          <p>
            <strong>{user ? user.first_name : 'Guest'}!</strong>
          </p>
        </div>
        <div
          className={`widget ${activeSection === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveSection('dashboard')}
        >
          <h3>Dashboard</h3>
          <p>Back to overview page.</p>
        </div>
        <div
          className={`widget ${activeSection === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveSection('tasks')}
        >
          <h3>Tasks</h3>
          <p>View and manage your tasks.</p>
        </div>
        <div
          className="widget add-task-widget"
          onClick={() => setIsCreateTaskOpen(true)}
        >
          <h3>
            <span className="add-symbol">+</span> Create Task
          </h3>
          <p>Add new tasks to your list.</p>
        </div>
        <div
          className={`widget ${activeSection === 'archive' ? 'active' : ''}`}
          onClick={() => setActiveSection('archive')}
        >
          <h3>Archive</h3>
          <p>Access archived tasks.</p>
        </div>
        <div className="signout-button-container">
          <button className="signout-button" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeSection === 'dashboard' && (
          <>
            <h1>Welcome to Taskify</h1>
            <p>Here you can manage all your tasks effectively.</p>
            <PriorityOverview tasks={tasks} />
          </>
        )}
        {activeSection === 'tasks' && <TaskList tasks={tasks} fetchTasks={fetchTasks} />}
        {activeSection === 'archive' && <Archive />}
      </div>

      {/* Create Task Modal */}
      {isCreateTaskOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Create a New Task</h3>
            <CreateTask onSubmit={handleTaskSubmit} onClose={() => setIsCreateTaskOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Homepage;



