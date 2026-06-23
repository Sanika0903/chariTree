import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiUrl } from '../config/api';

export default function VolunteerEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(apiUrl('/api/organizations'));
        const orgs = res.data || [];
        const mapped = orgs.slice(0, 8).map((org, index) => ({
          id: org._id || index,
          title: `${org.name} Volunteer Opportunity`,
          description: org.description || `Support ${org.category?.toLowerCase() || 'community'} efforts in ${org.location || 'your city'}.`,
          location: org.location || 'Remote',
          date: `2025-${(index % 12) + 1}-15`,
          organization: org.name,
          org,
        }));
        setEvents(mapped);
      } catch (err) {
        console.warn('Failed to load volunteer events', err.message || err);
        setError('Unable to load opportunities. Please try again later.');
        setEvents([
          {
            id: 'mock_1',
            title: 'Community Food Distribution',
            description: 'Help pack and distribute food kits to local families in need.',
            location: 'Mumbai',
            date: '2025-11-10',
            organization: 'Helping Hands',
            org: { name: 'Helping Hands', category: 'Food Security', location: 'Mumbai' },
          },
          {
            id: 'mock_2',
            title: 'After-school Tutoring',
            description: 'Support children with reading and homework in your neighborhood.',
            location: 'Bangalore',
            date: '2025-11-18',
            organization: 'BrightFutures',
            org: { name: 'BrightFutures', category: 'Education', location: 'Bangalore' },
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-emerald-700">Volunteer Events</h1>
          <p className="text-slate-600 mt-2">Discover local and virtual opportunities to volunteer and make a difference.</p>
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-600">Loading volunteer opportunities…</div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {events.map((event) => (
              <div key={event.id} className="rounded-3xl bg-white p-6 shadow-lg border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900">{event.title}</h2>
                    <p className="text-slate-500 mt-2">{event.organization} • {event.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm uppercase tracking-[0.15em] text-emerald-600 font-semibold">{event.date}</p>
                  </div>
                </div>
                <p className="mt-4 text-slate-600">{event.description}</p>
                <button
                  onClick={() => navigate('/volunteer-landing', { state: { org: event.org } })}
                  className="mt-6 inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-white font-semibold hover:bg-emerald-700 transition"
                >
                  Express Interest
                </button>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        )}
      </motion.div>
    </div>
  );
}
