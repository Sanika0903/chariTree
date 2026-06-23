import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AdminNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const links = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/users', label: 'Users' },
    { path: '/admin/organizations', label: 'Organizations' },
    { path: '/admin/campaigns', label: 'Campaigns' },
    { path: '/admin/reports', label: 'Reports' },
    { path: '/admin/analytics', label: 'Analytics' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 shadow-md py-4 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/admin" className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition">
          ChariTree Admin 🌱
        </Link>
        <ul className="flex gap-6 items-center">
          {links.map((l) => (
            <li key={l.path}>
              <Link
                to={l.path}
                className={
                  location.pathname === l.path
                    ? 'text-white font-semibold underline underline-offset-4'
                    : 'text-slate-300 hover:text-blue-300 transition'
                }
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-500 font-semibold transition bg-transparent border-none cursor-pointer"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
