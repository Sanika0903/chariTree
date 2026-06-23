import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../config/api";

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get(apiUrl("/api/campaigns"));
      setCampaigns(res.data || []);
    } catch (err) {
      console.error("Error loading campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "active" ? "paused" : "active";
    try {
      await axios.put(apiUrl(`/api/campaigns/${id}/admin`), { status: nextStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`✅ Campaign status updated to ${nextStatus}`);
      fetchCampaigns();
    } catch (err) {
      console.error("Error toggling campaign status:", err);
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;
    try {
      await axios.delete(apiUrl(`/api/campaigns/${id}/admin`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("✅ Campaign deleted successfully!");
      fetchCampaigns();
    } catch (err) {
      console.error("Error deleting campaign:", err);
      alert("Failed to delete campaign");
    }
  };

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                          c.organizationName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-extrabold text-purple-400">Campaign Moderation</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50">
          <input
            type="text"
            placeholder="Search campaigns or NGOs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-700/50 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-700/50 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Campaigns List */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400">Loading campaigns...</div>
          ) : filteredCampaigns.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-700/50 border-b border-slate-600 text-slate-300">
                    <th className="p-4 font-semibold">Title</th>
                    <th className="p-4 font-semibold">Organization</th>
                    <th className="p-4 font-semibold text-right">Goal (₹)</th>
                    <th className="p-4 font-semibold text-right">Raised (₹)</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCampaigns.map((c) => (
                    <tr key={c._id} className="border-b border-slate-700/50 hover:bg-slate-750 transition-all">
                      <td className="p-4 font-medium text-slate-100">{c.title}</td>
                      <td className="p-4 text-slate-300">{c.organizationName}</td>
                      <td className="p-4 text-right text-slate-300">₹{c.goalAmount}</td>
                      <td className="p-4 text-right text-emerald-400 font-medium">₹{c.raisedAmount || 0}</td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                          c.status === 'active'
                            ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-500/20'
                            : c.status === 'paused'
                            ? 'bg-amber-900/30 text-amber-300 border border-amber-500/20'
                            : 'bg-blue-900/30 text-blue-300 border border-blue-500/20'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-4 text-center flex justify-center gap-3">
                        <button
                          onClick={() => handleToggleStatus(c._id, c.status)}
                          className={`px-3 py-1.5 font-semibold rounded-lg text-xs transition ${
                            c.status === 'active'
                              ? 'bg-amber-600 hover:bg-amber-700 text-white'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          {c.status === "active" ? "Pause" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
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
            <div className="p-12 text-center text-slate-400">No campaigns found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
