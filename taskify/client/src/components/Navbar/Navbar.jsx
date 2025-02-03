import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  
  return (
    <nav className="sidebar">
      <Link to="/create">Create Task</Link>
      <Link to="/archive">Archive</Link>
      <button>Logout</button>
    </nav>
  );
}

export default Navbar;
