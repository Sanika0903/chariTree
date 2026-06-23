import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import DonationTrackingView from '../components/DonationTrackingView';
import { apiUrl } from '../config/api';
import { AuthContext } from '../context/AuthContext';

export default function DonorProfile() {
  const { auth } = useContext(AuthContext);
  const email = auth?.user?.email || '';

  const [donations, setDonations] = useState([]);
  const [summary, setSummary] = useState({ totalMonetary: 0, monetaryCount: 0, wishlistCount: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [selectedDonationId, setSelectedDonationId] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      if (!email) return;
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(apiUrl(`/api/donations/donor/${encodeURIComponent(email)}`));
        const list = res.data.donations || [];
        setDonations(list);

        const monetary = list.filter((d) => d.type === 'monetary' || d.type === 'split');
        const wishlist = list.filter((d) => d.type === 'item' || d.type === 'wishlist');
        setSummary({
          totalMonetary: monetary.reduce((s, x) => s + (Number(x.amount) || 0), 0),
          monetaryCount: monetary.length,
          wishlistCount: wishlist.length,
        });
      } catch (err) {
        console.error('Failed to fetch donations', err.message || err);
        setError('Failed to fetch donation history. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [email]);

  const getStatusColor = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'verified':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'distributed':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'purchased':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'received':
      case 'completed':
        return 'bg-sky-100 text-sky-700 border-sky-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getCapitalizedStatus = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'completed') return 'Received';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Donation History</h1>
          <p className="text-slate-600 mt-2">Track the progress and impact of your contributions.</p>
        </div>

        {error && (
          <div className="rounded-3xl bg-red-50 border border-red-200 p-6 text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-slate-600">Loading your history…</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-md text-center">
                <div className="text-sm text-slate-500 font-medium">Total Monetary Support</div>
                <div className="text-3xl font-bold text-sky-700 mt-2">₹{summary.totalMonetary}</div>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-md text-center">
                <div className="text-sm text-slate-500 font-medium">Cash Donations</div>
                <div className="text-3xl font-bold text-sky-700 mt-2">{summary.monetaryCount}</div>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-md text-center">
                <div className="text-sm text-slate-500 font-medium">Items & Gifts Donated</div>
                <div className="text-3xl font-bold text-sky-700 mt-2">{summary.wishlistCount}</div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6">
              {donations.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                  You haven't made any donations yet. Visit the Donate page to get started!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                        <th className="py-4 px-4">Date</th>
                        <th className="py-4 px-4">Organization</th>
                        <th className="py-4 px-4">Type</th>
                        <th className="py-4 px-4">Amount/Details</th>
                        <th className="py-4 px-4">Status</th>
                        <th className="py-4 px-4 text-center">Tracking</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {donations.map((d) => (
                        <tr key={d._id} className="hover:bg-slate-50 transition">
                          <td className="py-4 px-4">{new Date(d.createdAt).toLocaleDateString()}</td>
                          <td className="py-4 px-4 font-semibold text-slate-900">{d.organizationName}</td>
                          <td className="py-4 px-4 capitalize">
                            <span className="rounded-full bg-slate-100 px-3 py-1 border border-slate-200">
                              {d.type}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-medium">
                            {d.type === 'monetary' || d.type === 'split'
                              ? `₹${d.amount}`
                              : `${d.item || ''} ${d.quantity ? `(${d.quantity})` : ''}`}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`rounded-full px-3 py-1 border text-xs font-semibold ${getStatusColor(d.status)}`}>
                              {getCapitalizedStatus(d.status)}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <button
                              onClick={() => { setSelectedDonationId(d._id); setTrackingOpen(true); }}
                              className="bg-sky-600 text-white px-4 py-2 rounded-2xl hover:bg-sky-700 transition font-semibold"
                            >
                              Track
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {trackingOpen && (
          <DonationTrackingView donationId={selectedDonationId} onClose={() => { setTrackingOpen(false); setSelectedDonationId(null); }} />
        )}
      </motion.div>
    </div>
  );
}
