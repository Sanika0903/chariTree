import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { apiUrl } from "../config/api";
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function OrgAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    category: "Child Welfare",
    location: "Mumbai",
  });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const endpoint = isLogin
        ? apiUrl("/api/auth/org/login")
        : apiUrl("/api/auth/org/signup");
      const res = await axios.post(endpoint, formData);
      // centralize auth
      login({ token: res.data.token, role: 'organization', user: res.data.organization });
      alert(`Welcome ${res.data.organization.name}!`);
      navigate('/dashboard/org');
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white p-10 rounded-2xl shadow-lg max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          {isLogin ? "Organization Login" : "Organization Signup"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Organization Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="border rounded-lg px-4 py-2"
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="border rounded-lg px-4 py-2"
              >
                <option>Child Welfare</option>
                <option>Animal Welfare</option>
                <option>Education</option>
                <option>Healthcare</option>
                <option>Elderly Care</option>
              </select>
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="border rounded-lg px-4 py-2"
              >
                <option>Mumbai</option>
                <option>Pune</option>
                <option>Delhi</option>
                <option>Bangalore</option>
                <option>Chennai</option>
                <option>Kolkata</option>
              </select>
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="border rounded-lg px-4 py-2"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="border rounded-lg px-4 py-2"
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          {isLogin ? "New here?" : "Already have an account?"}{" "}
          <button
            className="text-blue-600 font-semibold"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Create account" : "Login"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
