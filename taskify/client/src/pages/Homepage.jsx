import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CSS/Homepage.css';
import CreateTask from '../components/CreateTask/CreateTask';
import TaskList from '../components/TaskList/TaskList';
import Archive from '../components/Archive/Archive';
import PriorityOverview from '../components/PriorityOverview/PriorityOverview';
import { AuthContext } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL;

function Homepage() {
  const { user, logout } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const response = await axios.get('${API_URL}/tasks');
      setTasks(response.data.filter((task) => !task.archived));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    if (activeSection === 'dashboard' || activeSection === 'tasks') {
      fetchTasks();
    }
  }, [activeSection]);

  const handleTaskSubmit = async (taskData) => {
    try {
      const response = await axios.post(`${API_URL}/tasks`, taskData);
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

  const closeSidebar = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="homepage-container">
      
      {/* Dark Gradient Overlay for Blur Effect */}
      <div className="top-gradient"></div>

      {/* Burger Menu (Transforms into an "X" when sidebar is open) */}
      <div className={`burger-menu ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <div></div>
        <div></div>
        <div></div>
      </div>
  
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="user-section">
          <p>Hello,</p>
          <p><strong>{user ? user.first_name : 'Guest'}!</strong></p>
        </div>
        <div className={`widget ${activeSection === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveSection('dashboard'); setIsSidebarOpen(false); }}>
          <h3>Dashboard</h3>
          <p>Back to overview page.</p>
        </div>
        <div className={`widget ${activeSection === 'tasks' ? 'active' : ''}`} onClick={() => { setActiveSection('tasks'); setIsSidebarOpen(false); }}>
          <h3>Tasks</h3>
          <p>View and manage your tasks.</p>
        </div>
        <div className="widget add-task-widget" onClick={() => setIsCreateTaskOpen(true)}>
          <h3>
            <span className="add-symbol">+</span> Create Task
          </h3>
          <p>Add new tasks to your list.</p>
        </div>
        <div className={`widget ${activeSection === 'archive' ? 'active' : ''}`} onClick={() => { setActiveSection('archive'); setIsSidebarOpen(false); }}>
          <h3>Archive</h3>
          <p>Access archived tasks.</p>
        </div>
        <div className="signout-button-container signout">
          <button className="signout-button" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </div>
  
      {/* Main Content */}
      <div className={`main-content ${isSidebarOpen ? 'overlay-active' : ''}`}>
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
