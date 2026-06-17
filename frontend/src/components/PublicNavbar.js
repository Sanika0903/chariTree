import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function PublicNavbar() {
  const location = useLocation();
  const links = [
    { path: '/', label: 'Home' },
    { path: '/organizations', label: 'Organizations' },
    { path: '/campaigns', label: 'Campaigns' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-700">ChariTree 🌱</Link>
        <nav className="hidden md:flex gap-6 items-center">
          {links.map((l) => (
            <Link key={l.path} to={l.path} className={location.pathname === l.path ? 'text-blue-700 font-semibold' : 'text-gray-700 hover:text-blue-600'}>{l.label}</Link>
          ))}
          <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Login</Link>
          <Link to="/signup" className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg">Signup</Link>
        </nav>
      </div>
    </header>
  );
}
