import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function DonorNavbar() {
  const location = useLocation();

  const navLinks = [
    { path: "/dashboard/donor", label: "Home" },
    { path: "/organizations", label: "Organizations" },
    { path: "/campaigns", label: "Campaigns" },
    { path: "/dashboard/donor/donations", label: "Donation History" },
    { path: "/dashboard/donor/notifications", label: "Notifications" },
    { path: "/dashboard/donor/profile", label: "Profile" },
  ];

  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-100 to-white shadow-md py-4 px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sticky top-0 z-50">
      <Link
        to="/dashboard/donor"
        className="text-2xl font-extrabold text-blue-700 flex items-center gap-2"
      >
        ChariTree 🌱
      </Link>

      <ul className="flex flex-wrap gap-4 text-gray-700 font-semibold">
        {navLinks.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`hover:text-blue-600 transition ${
                location.pathname === link.path ? "text-blue-700 underline" : ""
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
<li>
            <button onClick={handleLogout} className="text-red-600 hover:text-red-700 font-semibold">Logout</button>
          </li>
        </ul>
    </nav>
  );
}
