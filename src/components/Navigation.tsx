import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex gap-6">
        <Link
          to="/"
          className={`${
            isActive('/') ? 'text-white' : 'text-gray-300'
          } hover:text-white transition-colors`}
        >
          Products
        </Link>
        <Link
          to="/login"
          className={`${
            isActive('/login') ? 'text-white' : 'text-gray-300'
          } hover:text-white transition-colors`}
        >
          Login
        </Link>
        <Link
          to="/upload"
          className={`${
            isActive('/upload') ? 'text-white' : 'text-gray-300'
          } hover:text-white transition-colors`}
        >
          Image Upload
        </Link>
      </div>
    </nav>
  );
}