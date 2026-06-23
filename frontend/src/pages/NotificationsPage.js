import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { apiUrl } from '../config/api';

export default function NotificationsPage() {
  const { auth } = useContext(AuthContext);
  const email = auth?.user?.email || '';
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!email) {
        setError('No donor email available for notifications.');
        return;
      }

      setLoading(true);
      setError('');

      try {
        const res = await axios.get(apiUrl(`/api/donations/donor/${encodeURIComponent(email)}/notifications`));
        setNotifications(res.data.notifications || []);
      } catch (err) {
        console.error('Failed to load notifications', err?.response?.data || err.message || err);
        setError('Unable to load notifications at the moment.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [email]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">Notifications</h1>
        <p className="text-gray-600 mb-6">Track donation updates and organization progress in one place.</p>

        {loading && <div className="text-center py-8 text-slate-600">Loading notifications…</div>}
        {error && <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-5 text-red-700">{error}</div>}

        {!loading && !error && (
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="rounded-3xl bg-white shadow p-8 text-center text-slate-500">
                No notifications yet. Donate to a campaign or wishlist item to receive updates.
              </div>
            ) : (
              notifications.map((note) => (
                <div key={note.id || note._id} className="rounded-3xl bg-white shadow p-6 border border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-400">{new Date(note.createdAt).toLocaleString()}</p>
                      <h2 className="text-xl font-semibold text-slate-900">{note.title}</h2>
                      <p className="text-slate-600 mt-2">{note.organizationName}</p>
                    </div>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700 text-sm font-semibold uppercase">
                      {note.status}
                    </span>
                  </div>
                  <p className="mt-4 text-slate-600">{note.description}</p>
                </div>
              ))
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
