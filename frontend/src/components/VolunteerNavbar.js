import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function VolunteerNavbar() {
  const location = useLocation();
  const links = [
    { path: '/dashboard/volunteer', label: 'Dashboard' },
    { path: '/dashboard/volunteer/events', label: 'Events' },
    { path: '/dashboard/volunteer/my-events', label: 'My Events' },
    { path: '/dashboard/volunteer/certificates', label: 'Certificates' },
    { path: '/dashboard/volunteer/profile', label: 'Profile' },
  ];

  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md py-3 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-700">ChariTree 🌱</Link>
        <ul className="flex gap-6 items-center">
          {links.map((l) => (
            <li key={l.path}>
              <Link to={l.path} className={location.pathname === l.path ? 'text-blue-700 font-semibold' : 'text-gray-700 hover:text-blue-600'}>{l.label}</Link>
            </li>
          ))}
          <li>
            <button onClick={handleLogout} className="text-red-600 hover:text-red-700 font-semibold">Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
