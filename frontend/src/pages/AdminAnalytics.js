import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../config/api";

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    donations: [],
    campaigns: [],
    users: [],
    organizations: []
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [donationsRes, campaignsRes, usersRes, orgsRes] = await Promise.all([
          axios.get(apiUrl("/api/donations"), { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] })),
          axios.get(apiUrl("/api/campaigns")),
          axios.get(apiUrl("/api/user")),
          axios.get(apiUrl("/api/organizations")),
        ]);

        setData({
          donations: donationsRes.data || [],
          campaigns: campaignsRes.data || [],
          users: usersRes.data || [],
          organizations: orgsRes.data || []
        });
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <p className="text-lg font-semibold">Loading platform analytics…</p>
      </div>
    );
  }

  // Analytics logic
  const donorCount = data.users.filter(u => u.role === 'donor').length;
  const volunteerCount = data.users.filter(u => u.role === 'volunteer').length;
  const orgCount = data.organizations.length;

  const monetaryDonations = data.donations.filter(d => d.type === 'monetary').length;
  const wishlistDonations = data.donations.filter(d => d.type === 'wishlist' || d.type === 'item').length;
  const splitDonations = data.donations.filter(d => d.type === 'split').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-extrabold text-blue-400">Platform Analytics</h1>

        <div className="grid gap-6 md:grid-cols-2">
          {/* User Distribution */}
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/50 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-slate-100 border-b border-slate-700/50 pb-2">User Distribution</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1 text-slate-300">
                  <span>Donors</span>
                  <span>{donorCount}</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${(donorCount / Math.max(data.users.length, 1)) * 100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1 text-slate-300">
                  <span>Volunteers</span>
                  <span>{volunteerCount}</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${(volunteerCount / Math.max(data.users.length, 1)) * 100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1 text-slate-300">
                  <span>Organizations</span>
                  <span>{orgCount}</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: `${(orgCount / Math.max(data.users.length + orgCount, 1)) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Donation Breakdowns */}
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/50 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-slate-100 border-b border-slate-700/50 pb-2">Donation Channels</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1 text-slate-300">
                  <span>Direct Monetary</span>
                  <span>{monetaryDonations}</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400" style={{ width: `${(monetaryDonations / Math.max(data.donations.length, 1)) * 100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1 text-slate-300">
                  <span>Wishlist Items Fulfill</span>
                  <span>{wishlistDonations}</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400" style={{ width: `${(wishlistDonations / Math.max(data.donations.length, 1)) * 100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1 text-slate-300">
                  <span>Split (Direct + Item)</span>
                  <span>{splitDonations}</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-400" style={{ width: `${(splitDonations / Math.max(data.donations.length, 1)) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
