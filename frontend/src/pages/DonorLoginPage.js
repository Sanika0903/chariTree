import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../config/api";
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function DonorLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch(apiUrl("/api/user/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const responseText = await res.text();
      let data = {};
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error(
            `Server returned invalid response (${res.status}). Check API URL and backend deployment.`
          );
        }
      }

      if (!res.ok) throw new Error(data.message || "Login failed");

      // Centralize auth
      login({ token: data.token, role: data.user?.role || 'donor', user: data.user || null });
      // Redirect based on role
      const role = data.user?.role || 'donor';
      if (role === 'donor') navigate('/dashboard/donor');
      else if (role === 'volunteer') navigate('/dashboard/volunteer');
      else navigate('/');
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white">
      <form className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Donor Login</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="mb-4 w-full px-4 py-2 border rounded-lg" required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="mb-6 w-full px-4 py-2 border rounded-lg" required />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="mt-4 text-center text-sm">Don't have an account? <a href="/donor-signup" className="text-blue-600 hover:underline">Sign Up</a></div>
      </form>
    </div>
  );
}
