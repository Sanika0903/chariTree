import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function OrgNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition">
          ChariTree 🌱
        </Link>

        {/* Center - Dashboard Link */}
        <Link
          to="/dashboard/org"
          className="text-white hover:text-blue-400 transition font-semibold"
        >
          Dashboard
        </Link>

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('auth');
            navigate('/');
          }}
          className="px-4 py-2 rounded-2xl bg-red-600 text-white hover:bg-red-700 transition font-semibold"
        >
          🚪 Logout
        </button>
      </div>
    </nav>
  );
}

