import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function OrgNavbar() {
  const location = useLocation();
  const links = [
    { path: '/org-dashboard', label: 'Dashboard' },
    { path: '/campaigns', label: 'Campaigns' },
    { path: '/org-wishlist', label: 'Wishlist' },
    { path: '/org-donations', label: 'Donations' },
    { path: '/org-volunteers', label: 'Volunteers' },
    { path: '/org-analytics', label: 'Analytics' },
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
