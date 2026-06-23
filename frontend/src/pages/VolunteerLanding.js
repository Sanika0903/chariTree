import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../config/api";
import { AuthContext } from "../context/AuthContext";

export default function VolunteerLanding() {
  const navigate = useNavigate();
  const location = useLocation();
  const org = location.state?.org;
  const { auth } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [availability, setAvailability] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (auth?.user) {
      setName(auth.user.name || "");
      setEmail(auth.user.email || "");
    }
  }, [auth]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!name || !email || !availability) return alert('Please fill name, email and availability.');
    setSubmitting(true);
    try {
      await axios.post(apiUrl('/api/volunteers/apply'), {
        orgId: org?._id,
        orgName: org?.name,
        name,
        email,
        availability,
        message,
        opportunityTitle: `${org?.name || 'Community'} Volunteer Opportunity`,
        location: org?.location || 'Remote',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      alert('Application submitted — the organization will contact you.');
      setName(''); setEmail(''); setAvailability(''); setMessage('');
      navigate('/dashboard/volunteer/my-events');
    } catch (err) {
      console.warn('Apply request failed:', err.message || err);
      alert('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white text-gray-800">
      {/* 💚 Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto text-center py-20 px-6"
      >
        <h2 className="text-4xl font-extrabold text-green-700 mb-4">
          Welcome, Change-Maker 🌿
        </h2>
        <p className="text-gray-600 text-lg mb-8">
          Empower communities with your time, skills, and compassion. Join hands to make a lasting difference.
        </p>

        <button
          onClick={() => navigate("/events")}
          className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 shadow-md transition"
        >
          Find Opportunities 🤝
        </button>
      </motion.section>

      {/* If user arrived from an org card, show org details and quick-apply */}
      {org && (
        <section className="max-w-4xl mx-auto py-8 px-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-green-700">Volunteer at {org.name}</h3>
                <div className="text-sm text-gray-500 mt-1">{org.category} • {org.location}</div>
                {org.email && <div className="text-sm text-gray-500">Contact: {org.email}</div>}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <form onSubmit={handleApply} className="space-y-3">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="w-full border px-3 py-2 rounded" required />
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="w-full border px-3 py-2 rounded" required />
                <input value={availability} onChange={(e) => setAvailability(e.target.value)} placeholder="Availability (e.g. Weekends, Weekdays after 5pm)" className="w-full border px-3 py-2 rounded" required />
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Optional message to the organization" className="w-full border px-3 py-2 rounded" />
                <div className="flex gap-3">
                  <button disabled={submitting} type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">{submitting ? 'Submitting…' : 'Apply to Volunteer'}</button>
                  <button type="button" onClick={() => navigate('/volunteer-dashboard')} className="px-4 py-2 border rounded">Back</button>
                </div>
              </form>

              <div className="text-sm text-gray-700">
                <h4 className="font-semibold mb-2">About the Opportunity</h4>
                <p className="mb-2">This quick apply lets you express interest and availability. The organization will reach out to coordinate details.</p>
                <h5 className="font-semibold">Wishlist / Needs</h5>
                <ul className="list-disc ml-5 text-gray-600">
                  {(org.wishlist || []).slice(0,5).map((w, i) => (
                    <li key={i}>{w.item} — needed: {w.quantity}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 🌍 Community Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-green-50 py-16 px-6 text-center"
      >
        <h3 className="text-3xl font-bold text-green-700 mb-4">
          Join the Volunteer Community 💪
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Collaborate with like-minded individuals and participate in local and national initiatives.
        </p>
        <button
          onClick={() => navigate("/community")}
          className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
        >
          Explore Community
        </button>
      </motion.section>
    </div>
  );
}
