import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../config/api";

export default function DonorSignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(apiUrl("/api/user/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: "donor" }),
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

      if (!res.ok) throw new Error(data.message || "Signup failed");
      // Redirect to login after successful signup
      navigate("/donor-login");
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white">
      <form className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Donor Signup</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <input name="name" type="text" placeholder="Name" value={form.name} onChange={handleChange} className="mb-4 w-full px-4 py-2 border rounded-lg" required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="mb-4 w-full px-4 py-2 border rounded-lg" required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="mb-4 w-full px-4 py-2 border rounded-lg" required />
        <input name="phone" type="text" placeholder="Phone" value={form.phone} onChange={handleChange} className="mb-6 w-full px-4 py-2 border rounded-lg" />
        <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">Sign Up</button>
        <div className="mt-4 text-center text-sm">Already have an account? <a href="/donor-login" className="text-blue-600 hover:underline">Login</a></div>
      </form>
    </div>
  );
}
