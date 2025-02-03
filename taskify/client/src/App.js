import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import Homepage from './pages/Homepage';
import TaskList from './components/TaskList/TaskList';
import CreateTask from './components/CreateTask/CreateTask';
import Archive from './components/Archive/Archive';
import Login from './pages/Login';
import Register from './pages/Register';
import MobileNav from './components/MobileNav/MobileNav'; // Import MobileNav

function App() {
  const sections = [
    { name: 'homepage', label: 'Homepage' },
    { name: 'task-list', label: 'Task List' },
    { name: 'create', label: 'Create Task' },
    { name: 'archive', label: 'Archive' },
  ];

  const handleSectionSelect = (sectionName) => {
    window.location.href = `/${sectionName}`;
  };

  return (
    <AuthProvider>
      <Router>
        <MobileNav sections={sections} onSectionSelect={handleSectionSelect} />
        <Routes>
          {/* Redirect the root path to Login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Routes accessible after login */}
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/task-list" element={<TaskList />} />
          <Route path="/create" element={<CreateTask />} />
          <Route path="/archive" element={<Archive />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;




