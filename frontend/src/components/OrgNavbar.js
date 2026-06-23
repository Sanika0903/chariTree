import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function OrgNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const links = [
    { path: '/dashboard/org', label: 'Dashboard' },
    { path: '/dashboard/org/campaigns', label: 'Campaigns' },
    { path: '/dashboard/org/wishlist', label: 'Wishlist' },
    { path: '/dashboard/org/donations', label: 'Donations' },
    { path: '/dashboard/org/volunteers', label: 'Volunteers' },
    { path: '/dashboard/org/analytics', label: 'Analytics' },
    { path: '/dashboard/org/profile', label: 'Profile' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <Link to="/dashboard/org" className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition">
          ChariTree 🌱
        </Link>

        <div className="flex flex-wrap gap-4 items-center">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={
                location.pathname === link.path
                  ? 'text-white font-semibold underline underline-offset-4'
                  : 'text-slate-300 hover:text-blue-300 transition'
              }
            >
              {link.label}
            </Link>
          ))}

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="px-4 py-2 rounded-2xl bg-red-600 text-white hover:bg-red-700 transition font-semibold"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

