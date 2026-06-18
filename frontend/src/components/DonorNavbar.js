import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function DonorNavbar() {
  const location = useLocation();

  const navLinks = [
    { path: "/dashboard/donor", label: "Home" },
    { path: "/organizations", label: "Organizations" },
    { path: "/campaigns", label: "Campaigns" },
    { path: "/donor-profile", label: "Donation History" },
    { path: "/notifications", label: "Notifications" },
    { path: "/donor-profile", label: "Profile" },
  ];

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
      </ul>
    </nav>
  );
}
