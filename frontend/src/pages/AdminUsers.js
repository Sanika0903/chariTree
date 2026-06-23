import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../config/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(apiUrl("/api/user"));
      setUsers(res.data || []);
    } catch (err) {
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(apiUrl(`/api/user/${id}`), { headers: { Authorization: `Bearer ${token}` } });
      alert("✅ User deleted successfully!");
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-extrabold text-blue-400">User Management</h1>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-700/50 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-700/50 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          >
            <option value="all">All Roles</option>
            <option value="donor">Donors</option>
            <option value="volunteer">Volunteers</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400">Loading user database...</div>
          ) : filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-700/50 border-b border-slate-600 text-slate-300">
                    <th className="p-4 font-semibold">Name</th>
                    <th className="p-4 font-semibold">Email</th>
                    <th className="p-4 font-semibold">Phone</th>
                    <th className="p-4 font-semibold">Role</th>
                    <th className="p-4 font-semibold">Joined At</th>
                    <th className="p-4 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="border-b border-slate-700/50 hover:bg-slate-750 transition-all">
                      <td className="p-4 font-medium text-slate-100">{user.name}</td>
                      <td className="p-4 text-slate-300">{user.email}</td>
                      <td className="p-4 text-slate-400">{user.phone || "-"}</td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                          user.role === 'admin' 
                            ? 'bg-red-900/30 text-red-300 border border-red-500/20'
                            : user.role === 'volunteer'
                            ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-500/20'
                            : 'bg-blue-900/30 text-blue-300 border border-blue-500/20'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400">{new Date(user.joinedAt || user.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDelete(user._id)}
                          disabled={user.role === 'admin'}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-xs transition disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">No users found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
