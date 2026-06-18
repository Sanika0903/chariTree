import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { apiUrl } from "../config/api";
import { AuthContext } from "../context/AuthContext";

export default function DonorDashboard() {
  const { auth } = useContext(AuthContext);
  const [donations, setDonations] = useState([]);
  const [summary, setSummary] = useState({ totalDonated: 0, totalCount: 0, wishlistCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      if (!auth?.user?.email) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(apiUrl(`/api/donations/donor/${encodeURIComponent(auth.user.email)}`));
        const list = res.data.donations || [];
        setDonations(list.slice(0, 5));

        const monetary = list.filter((d) => d.type === "monetary" || d.type === "split");
        const wishlist = list.filter((d) => d.type === "item" || d.type === "wishlist");
        const totalAmount = monetary.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

        setSummary({
          totalDonated: totalAmount,
          totalCount: list.length,
          wishlistCount: wishlist.length,
        });
      } catch (err) {
        console.error("Failed to fetch donor donations", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [auth]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1 }} className="rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Donor Dashboard</h1>
              <p className="mt-3 text-slate-600 max-w-2xl">
                Your summary view for donations, impact, and quick access to organizations and campaigns.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full md:w-auto">
              <div className="rounded-3xl bg-sky-50 p-4 text-center">
                <div className="text-sm text-slate-500">Total Donated</div>
                <div className="mt-2 text-2xl font-semibold text-slate-900">₹{summary.totalDonated}</div>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4 text-center">
                <div className="text-sm text-slate-500">Donations</div>
                <div className="mt-2 text-2xl font-semibold text-slate-900">{summary.totalCount}</div>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4 text-center">
                <div className="text-sm text-slate-500">Wishlist Gifts</div>
                <div className="mt-2 text-2xl font-semibold text-slate-900">{summary.wishlistCount}</div>
              </div>
            </div>
          </div>
        </motion.section>

        <section className="grid lg:grid-cols-[1.4fr_1fr] gap-8">
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1 }} className="rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Recent Donations</h2>
                  <p className="mt-2 text-slate-500">Your latest contributions and status updates.</p>
                </div>
                <Link to="/donor-profile" className="text-sm font-semibold text-blue-600 hover:text-blue-700">View all</Link>
              </div>

              <div className="mt-8 grid gap-4">
                {loading ? (
                  <div className="text-slate-500">Loading donations…</div>
                ) : donations.length === 0 ? (
                  <div className="text-slate-500">No donation activity yet.</div>
                ) : (
                  donations.map((donation) => (
                    <div key={donation._id} className="rounded-3xl bg-slate-50 p-5 hover:bg-slate-100 transition">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                          <div className="font-semibold text-slate-900">{donation.organizationName}</div>
                          <div className="text-sm text-slate-500">{donation.type === 'monetary' ? `Monetary donation of ₹${donation.amount}` : donation.type === 'wishlist' ? `${donation.quantity} × ${donation.item}` : 'Split donation'}</div>
                        </div>
                        <div className="text-sm text-slate-500">{new Date(donation.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                        <span className="rounded-full bg-white border border-slate-200 px-3 py-1">{donation.status || 'Completed'}</span>
                        <span className="rounded-full bg-white border border-slate-200 px-3 py-1">{donation.type}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1 }} className="rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Quick Links</h2>
                  <p className="mt-2 text-slate-500">Jump to the pages you use most.</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Link to="/organizations" className="rounded-3xl border border-slate-200 bg-slate-50 p-5 hover:bg-slate-100 transition">
                  <div className="text-blue-700 text-xl">🏢</div>
                  <div className="mt-3 font-semibold text-slate-900">Organizations</div>
                  <div className="mt-2 text-sm text-slate-500">Browse verified nonprofits.</div>
                </Link>
                <Link to="/campaigns" className="rounded-3xl border border-slate-200 bg-slate-50 p-5 hover:bg-slate-100 transition">
                  <div className="text-blue-700 text-xl">📣</div>
                  <div className="mt-3 font-semibold text-slate-900">Campaigns</div>
                  <div className="mt-2 text-sm text-slate-500">Explore active causes.</div>
                </Link>
                <Link to="/donor-profile" className="rounded-3xl border border-slate-200 bg-slate-50 p-5 hover:bg-slate-100 transition">
                  <div className="text-blue-700 text-xl">📜</div>
                  <div className="mt-3 font-semibold text-slate-900">Donation History</div>
                  <div className="mt-2 text-sm text-slate-500">Review your contributions.</div>
                </Link>
                <Link to="/notifications" className="rounded-3xl border border-slate-200 bg-slate-50 p-5 hover:bg-slate-100 transition">
                  <div className="text-blue-700 text-xl">🔔</div>
                  <div className="mt-3 font-semibold text-slate-900">Notifications</div>
                  <div className="mt-2 text-sm text-slate-500">See updates and alerts.</div>
                </Link>
              </div>
            </motion.div>
          </div>

          <motion.aside initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1 }} className="rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
            <h2 className="text-2xl font-semibold text-slate-900">Profile</h2>
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-slate-50 p-5">
                <div className="text-sm text-slate-500">Name</div>
                <div className="mt-2 text-lg font-semibold text-slate-900">{auth?.user?.name || "Donor"}</div>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <div className="text-sm text-slate-500">Email</div>
                <div className="mt-2 text-lg font-semibold text-slate-900">{auth?.user?.email || "Not available"}</div>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <div className="text-sm text-slate-500">Role</div>
                <div className="mt-2 text-lg font-semibold text-slate-900">{auth?.user?.role || "donor"}</div>
              </div>
            </div>
          </motion.aside>
        </section>
      </div>
    </div>
  );
}
