import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { apiUrl } from "../config/api";

// Chart.js imports & setup
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function OrgDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [org, setOrg] = useState(null);
  const [donations, setDonations] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Profile Edit states
  const [profileForm, setProfileForm] = useState({
    name: "",
    category: "",
    location: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");

  // Certificate Modal states
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certForm, setCertForm] = useState({
    title: "Certificate of Appreciation",
    hoursLogged: "10",
    description: "In recognition of outstanding dedication and support as a volunteer.",
    userId: "",
    userName: "",
  });
  const [certSubmitting, setCertSubmitting] = useState(false);

  // Log Hours Modal states
  const [logHoursModalOpen, setLogHoursModalOpen] = useState(false);
  const [logHoursForm, setLogHoursForm] = useState({
    hours: "4",
    userId: "",
    userName: "",
    opportunityTitle: "",
  });
  const [hoursSubmitting, setHoursSubmitting] = useState(false);

  const navItems = [
    { id: "overview", label: "Dashboard", icon: "📊" },
    { id: "campaigns", label: "Campaigns", icon: "📢" },
    { id: "wishlist", label: "Wishlist", icon: "🛍️" },
    { id: "donations", label: "Donations", icon: "💰" },
    { id: "volunteers", label: "Volunteers", icon: "🤝" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  const fetchData = useCallback(async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // Fetch org dashboard data
      const orgRes = await axios.get(apiUrl("/api/organizations/dashboard/me"), config);
      setOrg(orgRes.data);
      setDonations(orgRes.data.donations || []);
      setProfileForm({
        name: orgRes.data.name || "",
        category: orgRes.data.category || "",
        location: orgRes.data.location || "",
      });

      // Fetch campaigns
      if (orgRes.data._id) {
        const campaignRes = await axios
          .get(apiUrl(`/api/campaigns/org/${orgRes.data._id}`), config)
          .catch(() => ({ data: [] }));
        setCampaigns(campaignRes.data || []);
      }

      // Fetch volunteer requests
      const volRes = await axios.get(apiUrl("/api/organizations/volunteers"), config).catch(() => ({ data: [] }));
      setVolunteers(volRes.data || []);
    } catch (err) {
      console.error("Error fetching organization data:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/dashboard/org/campaigns")) setActiveTab("campaigns");
    else if (path.includes("/dashboard/org/wishlist")) setActiveTab("wishlist");
    else if (path.includes("/dashboard/org/donations")) setActiveTab("donations");
    else if (path.includes("/dashboard/org/volunteers")) setActiveTab("volunteers");
    else if (path.includes("/dashboard/org/analytics")) setActiveTab("analytics");
    else if (path.includes("/dashboard/org/profile")) setActiveTab("profile");
    else setActiveTab("overview");

    if (token) fetchData();
  }, [token, location.pathname, fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <p className="font-semibold text-lg">Loading dashboard…</p>
      </div>
    );
  }

  // Dashboard Overview Calculations
  const totalDonations = donations.length;
  const totalMoney = donations
    .filter((d) => d.type === "monetary" || d.type === "split")
    .reduce((sum, d) => sum + (d.amount || 0), 0);
  const activeCampaigns = campaigns.filter((c) => c.status === "active").length;
  const activeVolunteersCount = volunteers.filter((v) => v.status === "approved").length;

  // Recent Activity Timeline Construction
  const recentActivities = [
    ...donations.map((d) => ({
      type: "donation",
      text: `${d.donorName || "Anonymous"} made a ${d.type} donation of ${
        d.type === "monetary" || d.type === "split" ? `₹${d.amount}` : `${d.quantity}x ${d.item}`
      }`,
      date: new Date(d.date),
    })),
    ...volunteers.map((v) => ({
      type: "volunteer",
      text: `${v.name} applied to volunteer (${v.status})`,
      date: new Date(v.createdAt),
    })),
  ].sort((a, b) => b.date - a.date);

  // Volunteer Approvals Handlers
  const handleVolunteerStatus = async (appId, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(apiUrl(`/api/organizations/volunteers/${appId}`), { status: newStatus }, config);
      alert(`Volunteer application set to ${newStatus}`);
      fetchData();
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status.");
    }
  };

  // Certificate Issuance Handler
  const handleCertSubmit = async (e) => {
    e.preventDefault();
    if (!certForm.title || !certForm.hoursLogged) {
      return alert("Title and Hours are required.");
    }
    setCertSubmitting(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(
        apiUrl(`/api/volunteers/${certForm.userId}/certificates`),
        {
          title: certForm.title,
          description: certForm.description,
          hoursLogged: parseInt(certForm.hoursLogged),
        },
        config
      );
      alert("🏆 Certificate issued successfully!");
      setCertModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Failed to issue certificate:", err);
      alert(err.response?.data?.message || "Failed to issue certificate.");
    } finally {
      setCertSubmitting(false);
    }
  };

  // Log Hours Handler
  const handleLogHoursSubmit = async (e) => {
    e.preventDefault();
    if (!logHoursForm.hours || Number(logHoursForm.hours) <= 0) {
      return alert("Hours must be greater than zero.");
    }
    setHoursSubmitting(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(
        apiUrl(`/api/volunteers/${logHoursForm.userId}/log-hours`),
        {
          hours: Number(logHoursForm.hours),
          opportunityTitle: logHoursForm.opportunityTitle,
        },
        config
      );
      alert("🕒 Hours logged successfully!");
      setLogHoursModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Failed to log hours:", err);
      alert(err.response?.data?.message || "Failed to log hours.");
    } finally {
      setHoursSubmitting(false);
    }
  };

  // Profile Edit Handler
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess("");
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.put(apiUrl("/api/organizations/profile"), profileForm, config);
      setOrg(res.data.organization);
      setProfileSuccess("Profile updated successfully!");
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to save profile.");
    } finally {
      setProfileSaving(false);
    }
  };

  // Analytics Chart Data Config
  // Chart 1: Revenue by Campaign Goal progress
  const campaignChartData = {
    labels: campaigns.map((c) => c.title.substring(0, 15) + "..."),
    datasets: [
      {
        label: "Raised (₹)",
        data: campaigns.map((c) => c.raisedAmount),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      },
      {
        label: "Goal (₹)",
        data: campaigns.map((c) => c.goalAmount),
        backgroundColor: "rgba(107, 114, 128, 0.2)",
        borderColor: "rgb(107, 114, 128)",
        borderWidth: 1,
      },
    ],
  };

  // Chart 2: Donation Type Distribution
  const donationTypeCounts = {
    monetary: donations.filter((d) => d.type === "monetary").length,
    wishlist: donations.filter((d) => d.type === "wishlist").length,
    split: donations.filter((d) => d.type === "split").length,
  };

  const donationChartData = {
    labels: ["Monetary", "Wishlist Items", "Split Donations"],
    datasets: [
      {
        data: [donationTypeCounts.monetary, donationTypeCounts.wishlist, donationTypeCounts.split],
        backgroundColor: ["#3b82f6", "#a855f7", "#eab308"],
        borderColor: ["#1e293b", "#1e293b", "#1e293b"],
        borderWidth: 2,
      },
    ],
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-sans">
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-8 px-6 py-8 max-w-7xl mx-auto">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-20 h-fit rounded-3xl bg-slate-800 p-6 shadow-2xl lg:w-64 w-full border border-slate-700">
            <h3 className="text-lg font-bold mb-6 text-slate-100 uppercase tracking-wider text-sm">Navigation</h3>
            <nav className="space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-2xl transition flex items-center font-medium ${
                    activeTab === item.id
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("auth");
                  navigate("/");
                }}
                className="w-full text-left px-4 py-3 rounded-2xl bg-red-650 text-white hover:bg-red-750 transition mt-6 flex items-center font-semibold"
              >
                <span className="mr-3">🚪</span> Logout
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-8 mt-6 lg:mt-0">
            {/* Header banner */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1 }}
              className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 shadow-xl border border-blue-500"
            >
              <h1 className="text-4xl font-extrabold">Welcome, {org?.name || "Organization"}</h1>
              <p className="mt-3 text-blue-100 text-lg">Manage your campaigns, donations, and volunteer opportunities.</p>
            </motion.div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-3xl bg-slate-800 p-6 shadow-lg border border-slate-700">
                    <p className="text-slate-400 text-sm font-semibold">Total Donations</p>
                    <p className="mt-3 text-3xl font-extrabold text-blue-400">{totalDonations}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-800 p-6 shadow-lg border border-slate-700">
                    <p className="text-slate-400 text-sm font-semibold">Total Raised</p>
                    <p className="mt-3 text-3xl font-extrabold text-emerald-455">₹{totalMoney}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-800 p-6 shadow-lg border border-slate-700">
                    <p className="text-slate-400 text-sm font-semibold">Active Campaigns</p>
                    <p className="mt-3 text-3xl font-extrabold text-purple-400">{activeCampaigns}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-800 p-6 shadow-lg border border-slate-700">
                    <p className="text-slate-400 text-sm font-semibold">Volunteers Approved</p>
                    <p className="mt-3 text-3xl font-extrabold text-yellow-450">{activeVolunteersCount}</p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-[1.5fr_1fr]">
                  {/* Recent Donations List */}
                  <div className="rounded-3xl bg-slate-800 p-8 shadow-lg border border-slate-700">
                    <h2 className="text-2xl font-bold mb-6">Recent Donations</h2>
                    {donations.length > 0 ? (
                      <div className="space-y-3">
                        {donations.slice(0, 5).map((don, i) => (
                          <div key={i} className="rounded-2xl bg-slate-700/60 p-4 border border-slate-600">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-semibold text-white">{don.donorName || "Anonymous"}</p>
                                <p className="text-xs text-slate-400 capitalize">{don.type}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-emerald-400">
                                  {don.type === "monetary" || don.type === "split"
                                    ? `₹${don.amount}`
                                    : don.item}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                  {new Date(don.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400">No donations received yet.</p>
                    )}
                  </div>

                  {/* Activity Log Timeline */}
                  <div className="rounded-3xl bg-slate-800 p-8 shadow-lg border border-slate-700">
                    <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
                    {recentActivities.length > 0 ? (
                      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                        {recentActivities.slice(0, 5).map((act, i) => (
                          <div key={i} className="flex gap-3 items-start border-l-2 border-slate-600 pl-4 py-1 relative">
                            <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-2"></div>
                            <div>
                              <p className="text-sm text-slate-200">{act.text}</p>
                              <p className="text-xs text-slate-500 mt-1">{act.date.toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-sm">No recent activities log.</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Campaigns Tab */}
            {activeTab === "campaigns" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Manage Campaigns</h2>
                  <button
                    onClick={() => navigate("/dashboard/org/campaigns/create")}
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

                          {/* Progress bar */}
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-slate-350">
                                ₹{campaign.raisedAmount} of ₹{campaign.goalAmount}
                              </span>
                              <span className="text-sm font-semibold text-blue-400">
                                {Math.round(progress)}%
                              </span>
                            </div>
                            <div className="w-full h-3 rounded-full bg-slate-700 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex justify-between text-xs text-slate-400 mb-4">
                            <span>Deadline: {new Date(campaign.deadline).toLocaleDateString()}</span>
                            <span className="capitalize font-semibold text-blue-450">{campaign.status}</span>
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => navigate(`/dashboard/org/campaigns/${campaign._id}/edit`)}
                              className="flex-1 rounded-2xl bg-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-600 transition"
                            >
                              ✏️ Edit / Delete
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
                      onClick={() => navigate("/dashboard/org/campaigns/create")}
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
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Wishlist Items</h2>
                  <button
                    onClick={() => navigate("/dashboard/org/wishlist")}
                    className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 transition"
                  >
                    ✏️ Manage Wishlist
                  </button>
                </div>
                <div className="rounded-3xl bg-slate-800 p-8 shadow-lg border border-slate-700">
                  {org?.wishlist?.length ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {org.wishlist.map((item, i) => (
                        <div key={i} className="rounded-2xl bg-slate-700 p-5 border border-slate-600">
                          <p className="font-bold text-lg text-white">{item.item}</p>
                          <p className="text-sm text-slate-400 mt-2 font-medium">Needed: {item.quantity}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-center py-6">No wishlist items logged. Add items to request gifts.</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Donations Tab */}
            {activeTab === "donations" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h2 className="text-2xl font-bold">Donations Received</h2>
                <div className="rounded-3xl bg-slate-800 p-8 shadow-lg border border-slate-700 overflow-x-auto">
                  {donations.length > 0 ? (
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead>
                        <tr className="border-b border-slate-700 text-slate-400">
                          <th className="pb-3 px-4">Donor</th>
                          <th className="pb-3 px-4">Type</th>
                          <th className="pb-3 px-4">Details</th>
                          <th className="pb-3 px-4">Status</th>
                          <th className="pb-3 px-4">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {donations.map((don, i) => (
                          <tr key={i} className="border-b border-slate-700 hover:bg-slate-700/40 transition">
                            <td className="py-4 px-4 font-semibold">{don.donorName || "Anonymous"}</td>
                            <td className="py-4 px-4 capitalize">{don.type}</td>
                            <td className="py-4 px-4">
                              {don.type === "monetary" || don.type === "split"
                                ? `₹${don.amount}`
                                : `${don.item} (Qty: ${don.quantity})`}
                            </td>
                            <td className="py-4 px-4">
                              <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                                don.status && don.status.toLowerCase() === "completed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {don.status || "Completed"}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-slate-400">
                              {new Date(don.date).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-slate-400 text-center py-6">No donations received yet.</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Volunteers Tab */}
            {activeTab === "volunteers" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h2 className="text-2xl font-bold">Volunteer Requests</h2>
                <div className="rounded-3xl bg-slate-800 p-8 shadow-lg border border-slate-700 overflow-x-auto">
                  {volunteers.length > 0 ? (
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-700 text-slate-400">
                          <th className="pb-3 px-4">Name</th>
                          <th className="pb-3 px-4">Email</th>
                          <th className="pb-3 px-4">Availability</th>
                          <th className="pb-3 px-4">Message</th>
                          <th className="pb-3 px-4">Status</th>
                          <th className="pb-3 px-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {volunteers.map((v) => (
                          <tr key={v._id} className="border-b border-slate-700 hover:bg-slate-700/40 transition">
                            <td className="py-4 px-4 font-semibold">{v.name}</td>
                            <td className="py-4 px-4">{v.email}</td>
                            <td className="py-4 px-4">{v.availability || "Not stated"}</td>
                            <td className="py-4 px-4 max-w-xs truncate">{v.message || "-"}</td>
                            <td className="py-4 px-4">
                              <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                                v.status === "approved"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : v.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {v.status}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex gap-2 justify-center">
                                {v.status === "pending" && (
                                  <>
                                    <button
                                      onClick={() => handleVolunteerStatus(v._id, "approved")}
                                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-semibold text-xs transition"
                                    >
                                      Accept
                                    </button>
                                    <button
                                      onClick={() => handleVolunteerStatus(v._id, "rejected")}
                                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-xl font-semibold text-xs transition"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                                {v.status === "approved" && v.userId && (
                                  <div className="flex gap-2 justify-center">
                                    <button
                                      onClick={() => {
                                        setLogHoursForm({
                                          hours: "4",
                                          userId: v.userId,
                                          userName: v.name,
                                          opportunityTitle: v.opportunityTitle || "Volunteer Opportunity",
                                        });
                                        setLogHoursModalOpen(true);
                                      }}
                                      className="bg-emerald-650 hover:bg-emerald-750 text-white px-3 py-1.5 rounded-xl font-semibold text-xs transition"
                                    >
                                      🕒 Log Hours
                                    </button>
                                    <button
                                      onClick={() => {
                                        setCertForm({
                                          title: "Certificate of Appreciation",
                                          hoursLogged: "10",
                                          description: "In recognition of outstanding dedication and support as a volunteer.",
                                          userId: v.userId,
                                          userName: v.name,
                                        });
                                        setCertModalOpen(true);
                                      }}
                                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl font-semibold text-xs transition"
                                    >
                                      🏆 Issue Cert
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-slate-400 text-center py-6">No volunteer applications submitted yet.</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <h2 className="text-2xl font-bold">Analytics & Reports</h2>

                <div className="grid gap-8 md:grid-cols-2">
                  {/* Chart 1: Campaigns Goal Coverage */}
                  <div className="rounded-3xl bg-slate-800 p-6 shadow-lg border border-slate-700">
                    <h3 className="text-lg font-bold mb-4">Campaign Goals Coverage (₹)</h3>
                    {campaigns.length > 0 ? (
                      <div className="h-64 flex justify-center">
                        <Bar
                          data={campaignChartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { labels: { color: "#cbd5e1" } },
                            },
                            scales: {
                              x: { ticks: { color: "#cbd5e1" }, grid: { color: "#334155" } },
                              y: { ticks: { color: "#cbd5e1" }, grid: { color: "#334155" } },
                            },
                          }}
                        />
                      </div>
                    ) : (
                      <p className="text-slate-400 text-center py-10">No campaigns to display analytics.</p>
                    )}
                  </div>

                  {/* Chart 2: Donation Type Distribution */}
                  <div className="rounded-3xl bg-slate-800 p-6 shadow-lg border border-slate-700">
                    <h3 className="text-lg font-bold mb-4">Donation Type Breakdown</h3>
                    {donations.length > 0 ? (
                      <div className="h-64 flex justify-center">
                        <Doughnut
                          data={donationChartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { position: "right", labels: { color: "#cbd5e1" } },
                            },
                          }}
                        />
                      </div>
                    ) : (
                      <p className="text-slate-400 text-center py-10">No donation distribution to analyze.</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h2 className="text-2xl font-bold">Organization Profile</h2>

                {profileSuccess && (
                  <div className="p-4 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-2xl font-medium text-sm">
                    {profileSuccess}
                  </div>
                )}

                <div className="rounded-3xl bg-slate-800 p-8 shadow-lg border border-slate-700">
                  <form onSubmit={handleProfileSave} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Organization Name</label>
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          className="w-full rounded-2xl bg-slate-700 border border-slate-600 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Email Address (Read Only)</label>
                        <input
                          type="email"
                          value={org?.email}
                          disabled
                          className="w-full rounded-2xl bg-slate-700 border border-slate-600 px-4 py-3 text-slate-400 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Category</label>
                        <input
                          type="text"
                          value={profileForm.category}
                          onChange={(e) => setProfileForm({ ...profileForm, category: e.target.value })}
                          className="w-full rounded-2xl bg-slate-700 border border-slate-600 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Location</label>
                        <input
                          type="text"
                          value={profileForm.location}
                          onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                          className="w-full rounded-2xl bg-slate-700 border border-slate-600 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 font-bold transition disabled:opacity-50"
                    >
                      {profileSaving ? "Saving..." : "💾 Save Changes"}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </main>
        </div>
      </div>

      {/* Certificate Modal */}
      <AnimatePresence>
        {certModalOpen && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-800 rounded-3xl p-8 max-w-md w-full border border-slate-700 shadow-2xl space-y-6 text-white"
            >
              <div>
                <h3 className="text-2xl font-bold">🏆 Issue Appreciation Certificate</h3>
                <p className="text-sm text-slate-400 mt-1">For volunteer {certForm.userName}</p>
              </div>

              <form onSubmit={handleCertSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Certificate Title</label>
                  <input
                    type="text"
                    value={certForm.title}
                    onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                    className="w-full rounded-xl bg-slate-700 border border-slate-600 px-3 py-2 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Hours Logged</label>
                  <input
                    type="number"
                    value={certForm.hoursLogged}
                    onChange={(e) => setCertForm({ ...certForm, hoursLogged: e.target.value })}
                    className="w-full rounded-xl bg-slate-700 border border-slate-600 px-3 py-2 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Description / Bio</label>
                  <textarea
                    value={certForm.description}
                    onChange={(e) => setCertForm({ ...certForm, description: e.target.value })}
                    rows="3"
                    className="w-full rounded-xl bg-slate-700 border border-slate-600 px-3 py-2 text-white text-sm"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setCertModalOpen(false)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={certSubmitting}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold disabled:opacity-50"
                  >
                    {certSubmitting ? "Issuing..." : "Issue Cert"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Log Hours Modal */}
      <AnimatePresence>
        {logHoursModalOpen && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-800 rounded-3xl p-8 max-w-md w-full border border-slate-700 shadow-2xl space-y-6 text-white"
            >
              <div>
                <h3 className="text-2xl font-bold">🕒 Log Volunteer Hours</h3>
                <p className="text-sm text-slate-400 mt-1">For volunteer {logHoursForm.userName}</p>
                <p className="text-xs text-slate-500 mt-0.5">Opportunity: {logHoursForm.opportunityTitle}</p>
              </div>

              <form onSubmit={handleLogHoursSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Hours to Log</label>
                  <input
                    type="number"
                    value={logHoursForm.hours}
                    onChange={(e) => setLogHoursForm({ ...logHoursForm, hours: e.target.value })}
                    className="w-full rounded-xl bg-slate-700 border border-slate-600 px-3 py-2 text-white"
                    required
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setLogHoursModalOpen(false)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={hoursSubmitting}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold disabled:opacity-50"
                  >
                    {hoursSubmitting ? "Logging..." : "Log Hours"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
