import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { apiUrl } from "../config/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    usersCount: 0,
    orgsCount: 0,
    campaignsCount: 0,
    donationsCount: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, orgsRes, campaignsRes, donationsRes] = await Promise.all([
          axios.get(apiUrl("/api/user")),
          axios.get(apiUrl("/api/organizations")),
          axios.get(apiUrl("/api/campaigns")),
          axios.get(apiUrl("/api/donations"), { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] })),
        ]);

        const users = usersRes.data || [];
        const orgs = orgsRes.data || [];
        const campaigns = campaignsRes.data || [];
        const donations = donationsRes.data || [];

        setStats({
          usersCount: users.length,
          orgsCount: orgs.length,
          campaignsCount: campaigns.length,
          donationsCount: donations.length,
        });

        // Generate mock recent activities based on fetched data
        const activities = [];
        if (users.length > 0) {
          activities.push({
            type: "user",
            text: `New user registration: ${users[users.length - 1].name} (${users[users.length - 1].role})`,
            time: "Just now",
          });
        }
        if (orgs.length > 0) {
          activities.push({
            type: "org",
            text: `New organization registered: ${orgs[orgs.length - 1].name}`,
            time: "Earlier today",
          });
        }
        if (campaigns.length > 0) {
          activities.push({
            type: "campaign",
            text: `New campaign launched: "${campaigns[0].title}"`,
            time: "1 day ago",
          });
        }

        setRecentActivities(activities);
      } catch (err) {
        console.error("Error loading admin stats:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchStats();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <p className="text-lg font-semibold">Loading admin panel…</p>
      </div>
    );
  }

  const statCards = [
    { label: "Total Users", value: stats.usersCount, color: "text-blue-400", border: "border-blue-500/20" },
    { label: "Organizations", value: stats.orgsCount, color: "text-emerald-400", border: "border-emerald-500/20" },
    { label: "Campaigns", value: stats.campaignsCount, color: "text-purple-400", border: "border-purple-500/20" },
    { label: "Total Donations", value: stats.donationsCount, color: "text-yellow-400", border: "border-yellow-500/20" },
  ];

  return (
    <div className="min-h-screen bg-slate-955 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 shadow-xl"
        >
          <h1 className="text-4xl font-extrabold">Admin Control Center</h1>
          <p className="mt-2 text-blue-100">Overview of ChariTree system health, metrics, and actions.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl bg-slate-800/80 p-6 border ${card.border} shadow-lg backdrop-blur`}
            >
              <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">{card.label}</p>
              <p className={`mt-4 text-4xl font-bold ${card.color}`}>{card.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Quick Actions */}
          <div className="rounded-2xl bg-slate-800/60 p-6 border border-slate-700/50 shadow-xl lg:col-span-1">
            <h2 className="text-xl font-bold mb-4 text-slate-100 border-b border-slate-700/50 pb-2">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/admin/organizations"
                className="block text-center py-3 rounded-xl bg-slate-700 hover:bg-blue-600 text-white font-semibold transition"
              >
                Approve NGO Registrations
              </Link>
              <Link
                to="/admin/campaigns"
                className="block text-center py-3 rounded-xl bg-slate-700 hover:bg-blue-600 text-white font-semibold transition"
              >
                Moderate active campaigns
              </Link>
              <Link
                to="/admin/users"
                className="block text-center py-3 rounded-xl bg-slate-700 hover:bg-blue-600 text-white font-semibold transition"
              >
                Manage user database
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl bg-slate-800/60 p-6 border border-slate-700/50 shadow-xl lg:col-span-2">
            <h2 className="text-xl font-bold mb-4 text-slate-100 border-b border-slate-700/50 pb-2">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((act, index) => (
                  <div key={index} className="flex justify-between items-center bg-slate-700/40 p-4 rounded-xl border border-slate-700/30">
                    <p className="text-slate-200 text-sm font-medium">{act.text}</p>
                    <span className="text-xs text-slate-400">{act.time}</span>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 py-4 text-center">No recent activities available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
