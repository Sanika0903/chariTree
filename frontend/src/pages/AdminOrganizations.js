import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../config/api";

export default function AdminOrganizations() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterVerified, setFilterVerified] = useState("all");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrgs();
  }, []);

  const fetchOrgs = async () => {
    try {
      const res = await axios.get(apiUrl("/api/organizations"));
      setOrganizations(res.data || []);
    } catch (err) {
      console.error("Error loading organizations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVerify = async (id) => {
    try {
      const res = await axios.put(apiUrl(`/api/organizations/${id}/verify`), {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`✅ ${res.data.message}`);
      fetchOrgs();
    } catch (err) {
      console.error("Error verifying organization:", err);
      alert("Failed to update verification status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this organization?")) return;
    try {
      await axios.delete(apiUrl(`/api/organizations/${id}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("✅ Organization deleted successfully!");
      fetchOrgs();
    } catch (err) {
      console.error("Error deleting organization:", err);
      alert("Failed to delete organization");
    }
  };

  const filteredOrgs = organizations.filter((org) => {
    const matchesSearch = org.name.toLowerCase().includes(search.toLowerCase()) || 
                          org.email.toLowerCase().includes(search.toLowerCase());
    const matchesVerify = filterVerified === "all" || 
                          (filterVerified === "verified" && org.verified) || 
                          (filterVerified === "pending" && !org.verified);
    return matchesSearch && matchesVerify;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-extrabold text-emerald-400">Organization Management</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50">
          <input
            type="text"
            placeholder="Search by NGO name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-700/50 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
          />
          <select
            value={filterVerified}
            onChange={(e) => setFilterVerified(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-700/50 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
          >
            <option value="all">All Verification Statuses</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending Approval</option>
          </select>
        </div>

        {/* Orgs List */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400">Loading organizations...</div>
          ) : filteredOrgs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-700/50 border-b border-slate-600 text-slate-300">
                    <th className="p-4 font-semibold">Name</th>
                    <th className="p-4 font-semibold">Category</th>
                    <th className="p-4 font-semibold">Location</th>
                    <th className="p-4 font-semibold">Email</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrgs.map((org) => (
                    <tr key={org._id} className="border-b border-slate-700/50 hover:bg-slate-750 transition-all">
                      <td className="p-4 font-medium text-slate-100">{org.name}</td>
                      <td className="p-4 text-slate-300">{org.category}</td>
                      <td className="p-4 text-slate-400">📍 {org.location}</td>
                      <td className="p-4 text-slate-300">{org.email}</td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                          org.verified
                            ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-500/20'
                            : 'bg-yellow-900/30 text-yellow-300 border border-yellow-500/20'
                        }`}>
                          {org.verified ? "Verified" : "Pending"}
                        </span>
                      </td>
                      <td className="p-4 text-center flex justify-center gap-3">
                        <button
                          onClick={() => handleToggleVerify(org._id)}
                          className={`px-3 py-1.5 font-semibold rounded-lg text-xs transition ${
                            org.verified
                              ? 'bg-amber-600 hover:bg-amber-700 text-white'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          {org.verified ? "Revoke" : "Approve"}
                        </button>
                        <button
                          onClick={() => handleDelete(org._id)}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-xs transition"
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
            <div className="p-12 text-center text-slate-400">No organizations found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
