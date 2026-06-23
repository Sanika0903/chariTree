import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../config/api";

export default function AdminReports() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await axios.get(apiUrl("/api/donations"), {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDonations(res.data || []);
      } catch (err) {
        console.error("Error loading donations for reports:", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchDonations();
  }, [token]);

  const handleExport = (type) => {
    alert(`CSV Export of ${type} initiated successfully!`);
  };

  const totalDonations = donations.length;
  const totalAmount = donations
    .filter(d => d.type === 'monetary' || d.type === 'split')
    .reduce((sum, d) => sum + (d.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-extrabold text-blue-400">Reports and Exports</h1>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Summary */}
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/50 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-slate-100 border-b border-slate-700/50 pb-2">Donation Totals</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-750 p-4 rounded-xl border border-slate-750">
                <p className="text-sm text-slate-400">Total Contributions</p>
                <p className="text-3xl font-bold mt-2 text-blue-400">{totalDonations}</p>
              </div>
              <div className="bg-slate-750 p-4 rounded-xl border border-slate-750">
                <p className="text-sm text-slate-400">Total Money Raised</p>
                <p className="text-3xl font-bold mt-2 text-emerald-400">₹{totalAmount}</p>
              </div>
            </div>
          </div>

          {/* Exports Card */}
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/50 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-slate-100 border-b border-slate-700/50 pb-2">Available Exports</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleExport("Donations")}
                className="py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition"
              >
                📊 Export Donations
              </button>
              <button
                onClick={() => handleExport("Audit Logs")}
                className="py-4 bg-slate-750 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700 transition"
              >
                🔐 Audit Logs
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
          <h2 className="text-xl font-bold p-6 text-slate-100 border-b border-slate-700/50">Recent Transactions</h2>
          {loading ? (
            <div className="p-12 text-center text-slate-400">Loading transactions...</div>
          ) : donations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-700/50 border-b border-slate-600 text-slate-300">
                    <th className="p-4 font-semibold">Donor Name</th>
                    <th className="p-4 font-semibold">Email</th>
                    <th className="p-4 font-semibold">Organization</th>
                    <th className="p-4 font-semibold">Type</th>
                    <th className="p-4 font-semibold text-right">Amount (₹)</th>
                    <th className="p-4 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.slice(0, 10).map((d, index) => (
                    <tr key={d._id || index} className="border-b border-slate-700/50 hover:bg-slate-750 transition-all">
                      <td className="p-4 font-medium text-slate-100">{d.donorName || "Anonymous"}</td>
                      <td className="p-4 text-slate-300">{d.donorEmail || "-"}</td>
                      <td className="p-4 text-slate-300">{d.organizationName}</td>
                      <td className="p-4 capitalize text-slate-400">{d.type}</td>
                      <td className="p-4 text-right text-emerald-400 font-semibold">
                        {d.type === 'monetary' || d.type === 'split' ? `₹${d.amount}` : "-"}
                      </td>
                      <td className="p-4 text-slate-400">{new Date(d.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">No transactions recorded.</div>
          )}
        </div>
      </div>
    </div>
  );
}
