import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ openCreateModal }) => {
  return (
    <nav className="navbar bg-base-200 p-4 shadow-lg">
      <div className="flex-1">
    
        <Link to="/" className="text-xl font-bold text-primary">
          Notes App
        </Link>
      </div>
      <div className="flex-none">
        <Link to="/" className="btn btn-ghost btn-sm mx-2">
          Home
        </Link>
        <Link to="/register" className="btn btn-ghost btn-sm mx-2">
          Register
        </Link>
        <Link to="/signin" className="btn btn-ghost btn-sm mx-2">
          Sign In
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;