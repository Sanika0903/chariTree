import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function AdminNavbar() {
  const location = useLocation();
  const links = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/users', label: 'Users' },
    { path: '/admin/organizations', label: 'Organizations' },
    { path: '/admin/campaigns', label: 'Campaigns' },
    { path: '/admin/reports', label: 'Reports' },
  ];

  return (
    <nav className="bg-white shadow-md py-3 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-700">ChariTree 🌱</Link>
        <ul className="flex gap-6 items-center">
          {links.map((l) => (
            <li key={l.path}><Link to={l.path} className={location.pathname === l.path ? 'text-blue-700 font-semibold' : 'text-gray-700 hover:text-blue-600'}>{l.label}</Link></li>
          ))}
          <li><Link to="/" onClick={() => localStorage.removeItem('auth')} className="text-red-600">Logout</Link></li>
        </ul>
      </div>
    </nav>
  );
}
