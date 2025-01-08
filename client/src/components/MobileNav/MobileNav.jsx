import React, { useState } from 'react';
import './MobileNav.css';

const MobileNav = ({ user, activeSection, setActiveSection, setIsCreateTaskOpen, handleSignOut }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  if (!user) return null;

  return (
    <div className="mobile-nav-container">
      {/* Burger Menu */}
      <div
        className={`burger-menu ${isSidebarOpen ? 'open' : ''}`}
        onClick={toggleSidebar}
      >
        <div></div>
        <div></div>
        <div></div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="user-section">
          <p className="greet">Hello,</p>
          <p>
            <strong>{user.first_name}!</strong>
          </p>
        </div>
        <ul>
          <li
            className={`mobile-nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => {
              setActiveSection('dashboard');
              toggleSidebar();
            }}
          >
            <h3>Dashboard</h3>
            <p>Back to overview page.</p>
          </li>
          <li
            className={`mobile-nav-item ${activeSection === 'tasks' ? 'active' : ''}`}
            onClick={() => {
              setActiveSection('tasks');
              toggleSidebar();
            }}
          >
            <h3>Tasks</h3>
            <p>View and manage your tasks.</p>
          </li>
          <li
            className="mobile-nav-item"
            onClick={() => {
              setIsCreateTaskOpen(true);
              toggleSidebar();
            }}
          >
            <h3>
              <span className="add-symbol">+</span> Create Task
            </h3>
            <p>Add new tasks to your list.</p>
          </li>
          <li
            className={`mobile-nav-item ${activeSection === 'archive' ? 'active' : ''}`}
            onClick={() => {
              setActiveSection('archive');
              toggleSidebar();
            }}
          >
            <h3>Archive</h3>
            <p>Access archived tasks.</p>
          </li>
          <li className="mobile-nav-item signout" onClick={handleSignOut}>
            <h3>Sign Out</h3>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MobileNav;



