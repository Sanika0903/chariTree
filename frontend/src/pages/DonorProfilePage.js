import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { apiUrl } from "../config/api";
import { AuthContext } from "../context/AuthContext";

export default function DonorProfilePage() {
  const { auth, updateUser } = useContext(AuthContext);
  const email = auth?.user?.email || "";
  const token = auth?.token || "";

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [stats, setStats] = useState({
    totalCount: 0,
    totalDonated: 0,
    orgsCount: 0,
    campaignsCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (auth?.user) {
      setFormData({
        name: auth.user.name || "",
        phone: auth.user.phone || "",
      });
    }
  }, [auth]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!email) return;
      setLoading(true);
      try {
        const res = await axios.get(apiUrl(`/api/donations/donor/${encodeURIComponent(email)}`));
        const list = res.data.donations || [];

        const monetary = list.filter((d) => d.type === "monetary" || d.type === "split");
        const totalAmount = monetary.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

        const orgsCount = new Set(list.map((d) => d.organizationId || d.organizationName)).size;
        const campaignsCount = new Set(list.filter((d) => d.campaignName || d.campaignId).map((d) => d.campaignName || d.campaignId)).size;

        setStats({
          totalCount: list.length,
          totalDonated: totalAmount,
          orgsCount,
          campaignsCount: campaignsCount || (list.length > 0 ? 1 : 0),
        });
      } catch (err) {
        console.error("Failed to load statistics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return setErrorMsg("Name is required");

    setSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.put(apiUrl("/api/user/profile"), formData, config);
      if (res.data && res.data.user) {
        updateUser(res.data.user);
        setSuccessMsg("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setErrorMsg(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto space-y-8"
      >
        <div>
          <h1 className="text-4xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-600 mt-2">Manage your personal details and view your impact summary.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Personal Details & Edit Form */}
          <div className="rounded-3xl bg-white p-8 shadow-lg border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Personal Details</h2>

            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-sm font-medium">
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Email (Read Only)</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your full name"
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Your phone number"
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-sky-600 text-white rounded-2xl py-3 font-semibold hover:bg-sky-700 transition"
              >
                {submitting ? "Updating..." : "Save Changes"}
              </button>
            </form>
          </div>

          {/* Donation Statistics */}
          <div className="rounded-3xl bg-white p-8 shadow-lg border border-slate-200 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Donation Statistics</h2>
              <p className="text-slate-500 text-sm mb-6">Here is an overview of the support you have provided to date.</p>

              {loading ? (
                <div className="text-center py-10 text-slate-500">Loading stats...</div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                    <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Donated</div>
                    <div className="mt-2 text-2xl font-bold text-sky-700">₹{stats.totalDonated}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                    <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Times Donated</div>
                    <div className="mt-2 text-2xl font-bold text-sky-700">{stats.totalCount}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                    <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">NGOs Supported</div>
                    <div className="mt-2 text-2xl font-bold text-sky-700">{stats.orgsCount}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                    <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Campaigns</div>
                    <div className="mt-2 text-2xl font-bold text-sky-700">{stats.campaignsCount}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 border-t border-slate-100 pt-6 text-slate-500 text-xs flex justify-between items-center">
              <span>Member since {auth?.user?.joinedAt ? new Date(auth.user.joinedAt).toLocaleDateString() : new Date().toLocaleDateString()}</span>
              <span className="capitalize px-3 py-1 bg-sky-50 text-sky-700 rounded-full font-semibold">{auth?.user?.role || "donor"}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
