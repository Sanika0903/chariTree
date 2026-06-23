import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { apiUrl } from "../config/api";
import { AuthContext } from "../context/AuthContext";

export default function VolunteerDashboard() {
  const { auth } = useContext(AuthContext);
  const userId = auth?.user?.id || "";
  const token = auth?.token || "";

  const [stats, setStats] = useState({
    activeOpportunities: 0,
    totalHoursLogged: 0,
    certificates: 0,
  });
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Fetch volunteer profile stats
        const profileRes = await axios.get(apiUrl(`/api/volunteers/${userId}/profile`));
        if (profileRes.data) {
          setStats({
            activeOpportunities: profileRes.data.activeOpportunities || 0,
            totalHoursLogged: profileRes.data.totalHoursLogged || 0,
            certificates: profileRes.data.certificates || 0,
          });
        }

        // Fetch user applications/registrations to show upcoming events
        const appsRes = await axios.get(apiUrl("/api/volunteers/me/applications"), config);
        const list = appsRes.data || [];
        // Filter for upcoming events (approved or pending, date >= today or just recent ones)
        setUpcomingEvents(list.slice(0, 3));
      } catch (err) {
        console.error("Failed to load volunteer dashboard data", err);
        setError("Unable to load your dashboard stats. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userId, token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header section */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1 }}
          className="rounded-3xl bg-white p-8 shadow-xl border border-slate-100"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-emerald-800">Volunteer Dashboard</h1>
              <p className="mt-3 text-slate-600 max-w-2xl">
                Welcome back, {auth?.user?.name || "Volunteer"}! Thank you for giving your time and skills to make a difference.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
              <div className="rounded-2xl bg-emerald-50 p-4 text-center border border-emerald-100">
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Upcoming</div>
                <div className="mt-2 text-2xl font-bold text-emerald-800">{stats.activeOpportunities}</div>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-4 text-center border border-emerald-100">
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Hours</div>
                <div className="mt-2 text-2xl font-bold text-emerald-800">{stats.totalHoursLogged} hrs</div>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-4 text-center border border-emerald-100">
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Certificates</div>
                <div className="mt-2 text-2xl font-bold text-emerald-800">{stats.certificates}</div>
              </div>
            </div>
          </div>
        </motion.section>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl">
            {error}
          </div>
        )}

        <section className="grid lg:grid-cols-[1.4fr_1fr] gap-8">
          <div className="space-y-8">
            {/* Upcoming/Registered Events */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1 }}
              className="rounded-3xl bg-white p-8 shadow-xl border border-slate-100"
            >
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 font-bold">My Registered Events</h2>
                  <p className="text-sm text-slate-500 mt-1">Status of your volunteer applications and registrations.</p>
                </div>
                <Link to="/dashboard/volunteer/my-events" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                  View all
                </Link>
              </div>

              {loading ? (
                <div className="text-center py-10 text-slate-500">Loading events...</div>
              ) : upcomingEvents.length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                  No registered events yet. Go to <Link to="/dashboard/volunteer/events" className="text-emerald-600 font-semibold underline">Browse Events</Link> to express interest!
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingEvents.map((app) => (
                    <div key={app._id} className="rounded-2xl bg-slate-50 p-5 border border-slate-100 hover:bg-slate-100 transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-slate-900">{app.opportunityTitle}</h3>
                          <p className="text-xs text-slate-500 mt-1">{app.orgName} • {app.location}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                          app.status === "approved"
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                            : app.status === "rejected"
                            ? "bg-red-100 text-red-700 border border-red-300"
                            : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                        }`}>
                          {app.status}
                        </span>
                      </div>
                      <div className="mt-3 flex justify-between items-center text-xs text-slate-500">
                        <span>Event Date: {app.date}</span>
                        <span>{app.loggedHours ? `${app.loggedHours} hrs logged` : "No hours logged yet"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1 }}
              className="rounded-3xl bg-white p-8 shadow-xl border border-slate-100"
            >
              <h2 className="text-2xl font-semibold text-slate-900 font-bold mb-6">Quick Links</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Link to="/dashboard/volunteer/events" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 hover:bg-slate-100 transition">
                  <div className="text-emerald-700 text-xl font-bold">🤝</div>
                  <div className="mt-3 font-semibold text-slate-900">Browse Events</div>
                  <div className="mt-2 text-sm text-slate-500">Find volunteer opportunities that match your skills.</div>
                </Link>
                <Link to="/dashboard/volunteer/my-events" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 hover:bg-slate-100 transition">
                  <div className="text-emerald-700 text-xl font-bold">📜</div>
                  <div className="mt-3 font-semibold text-slate-900 font-bold">My Events</div>
                  <div className="mt-2 text-sm text-slate-500">View status, schedule, and hours of registered events.</div>
                </Link>
                <Link to="/dashboard/volunteer/certificates" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 hover:bg-slate-100 transition">
                  <div className="text-emerald-700 text-xl font-bold">🏆</div>
                  <div className="mt-3 font-semibold text-slate-900">Certificates</div>
                  <div className="mt-2 text-sm text-slate-500">View and print certificates of appreciation.</div>
                </Link>
                <Link to="/dashboard/volunteer/profile" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 hover:bg-slate-100 transition">
                  <div className="text-emerald-700 text-xl font-bold">👤</div>
                  <div className="mt-3 font-semibold text-slate-900">Volunteer Profile</div>
                  <div className="mt-2 text-sm text-slate-500">Update your details, skills, bio, and city.</div>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Sidebar Info */}
          <motion.aside
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl bg-white p-8 shadow-xl border border-slate-100 h-fit space-y-6"
          >
            <h2 className="text-2xl font-semibold text-slate-900 font-bold">My Profile Overview</h2>
            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Skills</div>
                <div className="mt-2 font-semibold text-slate-900">
                  {auth?.user?.skills && auth.user.skills.length > 0
                    ? auth.user.skills.join(", ")
                    : "No skills listed yet. Add them in your Profile!"}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">City</div>
                <div className="mt-2 font-semibold text-slate-900">{auth?.user?.city || "Not set"}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Bio</div>
                <div className="mt-2 text-sm text-slate-600 italic">
                  "{auth?.user?.bio || "No bio added yet."}"
                </div>
              </div>
            </div>
          </motion.aside>
        </section>
      </div>
    </div>
  );
}
