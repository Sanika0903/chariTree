import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { apiUrl } from "../config/api";
import OrgNavbar from "../components/OrgNavbar";

export default function OrgDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [org, setOrg] = useState(null);
  const [donations, setDonations] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const navItems = [
    { id: "overview", label: "Dashboard", icon: "📊" },
    { id: "campaigns", label: "Campaigns", icon: "📢" },
    { id: "wishlist", label: "Wishlist", icon: "🛍️" },
    { id: "donations", label: "Donations", icon: "💰" },
    { id: "volunteers", label: "Volunteers", icon: "🤝" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orgRes = await axios.get(apiUrl("/api/organizations/dashboard/me"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrg(orgRes.data);
        setDonations(orgRes.data.donations || []);

        if (orgRes.data._id) {
          const campaignRes = await axios.get(apiUrl(`/api/campaigns/org/${orgRes.data._id}`), {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => ({ data: [] }));
          setCampaigns(campaignRes.data || []);
        }
      } catch (err) {
        console.error("Error fetching org data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-700 font-semibold">Loading dashboard…</p>
      </div>
    );
  }

  const totalDonations = donations.length;
  const totalMoney = donations
    .filter((d) => d.type === "monetary" || d.type === "split")
    .reduce((sum, d) => sum + (d.amount || 0), 0);
  const activeCampaigns = campaigns.filter((c) => c.status === "active").length;

  return (
    <>
      <OrgNavbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-8 px-6 py-8 max-w-7xl mx-auto">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-20 h-fit rounded-3xl bg-slate-800 p-6 shadow-2xl lg:w-64 w-full">
            <h3 className="text-lg font-bold mb-6 text-slate-100">Navigation</h3>
            <nav className="space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-2xl transition ${
                    activeTab === item.id
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("auth");
                  navigate("/");
                }}
                className="w-full text-left px-4 py-3 rounded-2xl bg-red-600 text-white hover:bg-red-700 transition mt-6"
              >
                🚪 Logout
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 shadow-xl"
            >
              <h1 className="text-4xl font-bold">Welcome, {org?.name || "Organization"}</h1>
              <p className="mt-3 text-blue-100">Manage your campaigns, donations, and impact.</p>
            </motion.div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-3xl bg-slate-800 p-6 shadow-lg border border-slate-700">
                    <p className="text-slate-400 text-sm">Total Donations</p>
                    <p className="mt-3 text-3xl font-bold text-blue-400">{totalDonations}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-800 p-6 shadow-lg border border-slate-700">
                    <p className="text-slate-400 text-sm">Total Raised (₹)</p>
                    <p className="mt-3 text-3xl font-bold text-green-400">{totalMoney}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-800 p-6 shadow-lg border border-slate-700">
                    <p className="text-slate-400 text-sm">Active Campaigns</p>
                    <p className="mt-3 text-3xl font-bold text-purple-400">{activeCampaigns}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-800 p-6 shadow-lg border border-slate-700">
                    <p className="text-slate-400 text-sm">Wishlist Items</p>
                    <p className="mt-3 text-3xl font-bold text-yellow-400">{org?.wishlist?.length || 0}</p>
                  </div>
                </div>

                <div className="rounded-3xl bg-slate-800 p-8 shadow-lg border border-slate-700">
                  <h2 className="text-2xl font-bold mb-6">Recent Donations</h2>
                  {donations.length > 0 ? (
                    <div className="space-y-3">
                      {donations.slice(0, 5).map((don, i) => (
                        <div key={i} className="rounded-2xl bg-slate-700 p-4 border border-slate-600">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-white">{don.donorName || "Anonymous"}</p>
                              <p className="text-sm text-slate-400">{don.type}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-400">
                                {don.type === "monetary" || don.type === "split"
                                  ? `₹${don.amount}`
                                  : don.impact || "-"}
                              </p>
                              <p
                                className={`text-xs mt-1 ${
                                  don.status === "Completed"
                                    ? "text-green-400"
                                    : "text-yellow-400"
                                }`}
                              >
                                {don.status}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400">No donations yet.</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Campaigns Tab */}
            {activeTab === "campaigns" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Manage Campaigns</h2>
                  <button
                    onClick={() => navigate("/org-campaigns/create")}
                    className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 transition"
                  >
                    ➕ Create Campaign
                  </button>
                </div>

                {campaigns.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {campaigns.map((campaign) => {
                      const progress = (campaign.raisedAmount / campaign.goalAmount) * 100;
                      return (
                        <div
                          key={campaign._id}
                          className="rounded-3xl bg-slate-800 p-6 shadow-lg border border-slate-700 hover:border-blue-500 transition"
                        >
                          <h3 className="text-lg font-bold mb-2">{campaign.title}</h3>
                          <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                            {campaign.description}
                          </p>

                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-slate-300">
                                ₹{campaign.raisedAmount} of ₹{campaign.goalAmount}
                              </span>
                              <span className="text-sm font-semibold text-blue-400">
                                {Math.round(progress)}%
                              </span>
                            </div>
                            <div className="w-full h-3 rounded-full bg-slate-700 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>

                          <p className="text-xs text-slate-400 mb-4">
                            Deadline: {new Date(campaign.deadline).toLocaleDateString()}
                          </p>

                          <div className="flex gap-3">
                            <button
                              onClick={() => navigate(`/org-campaigns/${campaign._id}/edit`)}
                              className="flex-1 rounded-2xl bg-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-600 transition"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => navigate(`/campaign/${campaign._id}`)}
                              className="flex-1 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition"
                            >
                              👁️ View
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-3xl bg-slate-800 p-12 text-center border border-dashed border-slate-600">
                    <p className="text-slate-400 mb-4">No campaigns yet.</p>
                    <button
                      onClick={() => navigate("/org-campaigns/create")}
                      className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 transition"
                    >
                      Create Your First Campaign
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h2 className="text-2xl font-bold">Wishlist Management</h2>
                <button
                  onClick={() => navigate("/org-wishlist")}
                  className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 transition"
                >
                  ✏️ Manage Wishlist
                </button>
                <div className="rounded-3xl bg-slate-800 p-8 shadow-lg border border-slate-700">
                  {org?.wishlist?.length ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {org.wishlist.map((item, i) => (
                        <div key={i} className="rounded-2xl bg-slate-700 p-4 border border-slate-600">
                          <p className="font-semibold text-white">{item.item}</p>
                          <p className="text-sm text-slate-400 mt-2">Needed: {item.quantity}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-center">No wishlist items yet.</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Donations Tab */}
            {activeTab === "donations" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h2 className="text-2xl font-bold">Donations</h2>
                <div className="rounded-3xl bg-slate-800 p-8 shadow-lg border border-slate-700 overflow-x-auto">
                  {donations.length > 0 ? (
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="pb-3 text-slate-300">Donor</th>
                          <th className="pb-3 text-slate-300">Type</th>
                          <th className="pb-3 text-slate-300">Amount</th>
                          <th className="pb-3 text-slate-300">Status</th>
                          <th className="pb-3 text-slate-300">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {donations.map((don, i) => (
                          <tr key={i} className="border-b border-slate-700 hover:bg-slate-700 transition">
                            <td className="py-3">{don.donorName || "Anonymous"}</td>
                            <td className="py-3">{don.type}</td>
                            <td className="py-3">
                              {don.type === "monetary" || don.type === "split"
                                ? `₹${don.amount}`
                                : don.impact || "-"}
                            </td>
                            <td
                              className={`py-3 font-semibold ${
                                don.status === "Completed"
                                  ? "text-green-400"
                                  : "text-yellow-400"
                              }`}
                            >
                              {don.status}
                            </td>
                            <td className="py-3 text-slate-400">
                              {new Date(don.date).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-slate-400 text-center">No donations yet.</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Volunteers Tab */}
            {activeTab === "volunteers" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h2 className="text-2xl font-bold">Volunteer Requests</h2>
                <div className="rounded-3xl bg-slate-800 p-12 text-center shadow-lg border border-slate-700">
                  <p className="text-slate-400">Volunteer management coming soon.</p>
                </div>
              </motion.div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h2 className="text-2xl font-bold">Analytics</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-800 p-6 shadow-lg border border-slate-700">
                    <p className="text-slate-400 text-sm">Total Donations This Month</p>
                    <p className="mt-3 text-3xl font-bold text-blue-400">
                      {donations
                        .filter((d) => {
                          const d_date = new Date(d.date);
                          const now = new Date();
                          return (
                            d_date.getMonth() === now.getMonth() &&
                            d_date.getFullYear() === now.getFullYear()
                          );
                        })
                        .length}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-slate-800 p-6 shadow-lg border border-slate-700">
                    <p className="text-slate-400 text-sm">Revenue This Month</p>
                    <p className="mt-3 text-3xl font-bold text-green-400">
                      ₹
                      {donations
                        .filter((d) => {
                          const d_date = new Date(d.date);
                          const now = new Date();
                          return (
                            d_date.getMonth() === now.getMonth() &&
                            d_date.getFullYear() === now.getFullYear()
                          );
                        })
                        .reduce(
                          (sum, d) =>
                            sum +
                            (d.type === "monetary" || d.type === "split"
                              ? d.amount || 0
                              : 0),
                          0
                        )}
                    </p>
                  </div>
                </div>
                <div className="rounded-3xl bg-slate-800 p-8 shadow-lg border border-slate-700">
                  <h3 className="text-xl font-bold mb-4">Donation Breakdown</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-300">Monetary</span>
                        <span className="text-blue-400 font-semibold">
                          {donations.filter((d) => d.type === "monetary").length}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{
                            width: `${(
                              (donations.filter((d) => d.type === "monetary")
                                .length /
                              donations.length) *
                              100
                            ).toFixed(0)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-300">Wishlist</span>
                        <span className="text-purple-400 font-semibold">
                          {donations.filter((d) => d.type === "wishlist").length}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500"
                          style={{
                            width: `${(
                              (donations.filter((d) => d.type === "wishlist")
                                .length /
                              donations.length) *
                              100
                            ).toFixed(0)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h2 className="text-2xl font-bold">Organization Profile</h2>
                <div className="rounded-3xl bg-slate-800 p-8 shadow-lg border border-slate-700 space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <p className="text-slate-400 text-sm">Organization Name</p>
                      <p className="mt-2 text-lg font-semibold">{org?.name}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Email</p>
                      <p className="mt-2 text-lg font-semibold">{org?.email}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Category</p>
                      <p className="mt-2 text-lg font-semibold">{org?.category}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Location</p>
                      <p className="mt-2 text-lg font-semibold">{org?.location}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

