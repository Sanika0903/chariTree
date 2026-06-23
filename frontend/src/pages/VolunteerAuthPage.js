import React, { useContext, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../config/api";
import { AuthContext } from "../context/AuthContext";

export default function VolunteerAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    skills: "",
    city: "",
  });

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isLogin
        ? apiUrl("/api/user/login")
        : apiUrl("/api/user/register");
      const payload = isLogin
        ? formData
        : { ...formData, role: "volunteer" };

      const res = await axios.post(url, payload);
      login({ token: res.data.token, role: "volunteer", user: res.data.user });

      alert(`Welcome ${formData.name || "Volunteer"}!`);
      navigate("/dashboard/volunteer");
    } catch (err) {
      console.error(err);
      alert("Authentication failed. Check credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-green-700 text-center mb-6">
          {isLogin ? "Volunteer Login" : "Volunteer Sign Up"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="border px-4 py-2 rounded-lg w-full"
              />
              <input
                type="text"
                name="skills"
                placeholder="Your Skills (e.g. Teaching, First Aid)"
                value={formData.skills}
                onChange={handleChange}
                className="border px-4 py-2 rounded-lg w-full"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="border px-4 py-2 rounded-lg w-full"
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="border px-4 py-2 rounded-lg w-full"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="border px-4 py-2 rounded-lg w-full"
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          {isLogin ? "New volunteer?" : "Already registered?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-green-600 font-semibold"
          >
            {isLogin ? "Create Account" : "Login"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
