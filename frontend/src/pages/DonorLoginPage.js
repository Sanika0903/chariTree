import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiUrl } from "../config/api";
import { AuthContext } from '../context/AuthContext';

export default function LoginPage() {
  const [loginType, setLoginType] = useState("user"); // "user" or "org"
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const endpoint = loginType === "user" 
        ? "/api/user/login" 
        : "/api/auth/org/login";

      const res = await fetch(apiUrl(endpoint), {
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
          throw new Error(`Server returned invalid response. Please try again later.`);
        }
      }

      if (!res.ok) throw new Error(data.message || "Invalid email or password");

      if (loginType === "user") {
        const user = data.user || {};
        const role = user.role || 'donor';
        login({ token: data.token, role, user });
        
        if (role === 'donor') navigate('/dashboard/donor');
        else if (role === 'volunteer') navigate('/dashboard/volunteer');
        else if (role === 'admin') navigate('/admin');
        else navigate('/');
      } else {
        const org = data.organization || {};
        login({ token: data.token, role: 'organization', user: org });
        navigate('/dashboard/org');
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-sky-100 px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 w-full max-w-md transition-all duration-300 hover:shadow-2xl">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-extrabold text-blue-700 hover:opacity-90 transition">
            ChariTree 🌱
          </Link>
          <p className="text-slate-500 mt-2 text-sm">Empowering social change, together.</p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
          <button
            type="button"
            onClick={() => { setLoginType("user"); setError(""); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              loginType === "user"
                ? "bg-white text-blue-700 shadow"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            User / Admin
          </button>
          <button
            type="button"
            onClick={() => { setLoginType("org"); setError(""); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              loginType === "org"
                ? "bg-white text-blue-700 shadow"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Organization
          </button>
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          {loginType === "user" ? "User Login" : "Organization Login"}
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 border border-red-100 font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-2"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
