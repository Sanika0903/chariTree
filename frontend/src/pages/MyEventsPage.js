import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { apiUrl } from '../config/api';
import { AuthContext } from '../context/AuthContext';

export default function MyEventsPage() {
  const { auth } = useContext(AuthContext);
  const token = auth?.token || '';

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const res = await axios.get(apiUrl('/api/volunteers/me/applications'), config);
        setApplications(res.data || []);
      } catch (err) {
        console.error('Failed to fetch volunteer applications', err.message || err);
        setError('Unable to load your volunteer events at this time.');
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-emerald-700 mb-4">My Volunteer Events</h1>
        <p className="text-slate-600 mb-8">Review your recent applications, status, and logged volunteer hours.</p>

        {loading ? (
          <div className="text-center py-16 text-slate-600">Loading your events…</div>
        ) : error ? (
          <div className="rounded-3xl bg-red-50 border border-red-200 p-6 text-red-700">{error}</div>
        ) : applications.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 shadow-lg text-center text-slate-500">
            No volunteer event registrations found yet.
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => (
              <div key={app._id} className="rounded-3xl bg-white p-6 shadow-lg border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900">{app.opportunityTitle}</h2>
                    <p className="text-slate-500 mt-2">{app.orgName} • {app.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">{app.date}</p>
                    <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase ${app.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : app.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {app.status}
                    </span>
                  </div>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-slate-500 text-sm">Availability note / Message</p>
                    <p className="mt-2 text-slate-700">{app.message || app.availability || 'No additional details provided.'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm">Hours logged</p>
                    <p className="mt-2 text-slate-750 font-semibold">{app.loggedHours || 0} hrs</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
