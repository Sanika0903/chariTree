import React, { useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { apiUrl } from '../config/api';

export default function VolunteerProfilePage() {
  const { auth, updateUser } = useContext(AuthContext);
  const userId = auth?.user?.id || '';
  const token = auth?.token || '';

  const [volunteer, setVolunteer] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    skills: [],
    totalHoursLogged: 0,
    activeOpportunities: 0,
    certificates: 0,
    bio: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    skills: '',
    bio: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await axios.get(apiUrl(`/api/volunteers/${userId}/profile`));
      if (res.data) {
        setVolunteer(res.data);
        setFormData({
          name: res.data.name || '',
          phone: res.data.phone || '',
          city: res.data.city || '',
          skills: Array.isArray(res.data.skills) ? res.data.skills.join(', ') : '',
          bio: res.data.bio || '',
        });
      }
    } catch (err) {
      console.error('Failed to fetch volunteer profile', err);
      setErrorMsg('Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.name) return setErrorMsg('Name is required');

    setSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      };

      const res = await axios.put(apiUrl(`/api/volunteers/${userId}/profile`), payload, config);
      if (res.data) {
        setSuccessMsg('Profile updated successfully!');
        // Update user state globally in AuthContext
        updateUser(res.data.profile);
        setIsEditing(false);
        fetchProfile();
      }
    } catch (err) {
      console.error('Failed to update volunteer profile', err);
      setErrorMsg(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-emerald-700">Volunteer Profile</h1>
            <p className="text-slate-600 mt-2">Manage your volunteering skills, details, and review achievements.</p>
          </div>
          <button
            onClick={() => {
              setIsEditing(!isEditing);
              setSuccessMsg('');
              setErrorMsg('');
            }}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl transition max-w-fit shadow-md"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        {successMsg && (
          <div className="p-4 bg-emerald-100 text-emerald-750 border border-emerald-250 rounded-2xl font-medium text-sm">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="p-4 bg-red-50 text-red-750 border border-red-200 rounded-2xl font-medium text-sm">
            {errorMsg}
          </div>
        )}

        {loading ? (
          <div className="text-center py-10 text-slate-500">Loading profile...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Profile Info Form / Detail Card */}
            <div className="rounded-3xl bg-white p-8 shadow-lg border border-slate-200">
              {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">Edit Profile</h2>

                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-1">Email (Read Only)</label>
                    <input
                      type="email"
                      value={volunteer.email}
                      disabled
                      className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50 text-slate-400 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Skills (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                      placeholder="e.g. Teaching, Event Planning, Driving"
                      className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows="3"
                      className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl py-3 shadow transition"
                  >
                    {submitting ? 'Updating...' : 'Save Profile Changes'}
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-slate-900">Personal Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Name</p>
                      <p className="font-semibold text-slate-900 mt-1">{volunteer.name || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Email</p>
                      <p className="font-semibold text-slate-900 mt-1">{volunteer.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Phone</p>
                      <p className="font-semibold text-slate-900 mt-1">{volunteer.phone || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">City</p>
                      <p className="font-semibold text-slate-900 mt-1">{volunteer.city || 'Not set'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Skills</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {volunteer.skills && volunteer.skills.length > 0 ? (
                        volunteer.skills.map((s, idx) => (
                          <span key={idx} className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-3 py-1.5 rounded-full font-semibold">
                            {s}
                          </span>
                        ))
                      ) : (
                        <p className="text-slate-500 text-sm">No skills added yet.</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Bio</p>
                    <p className="text-slate-700 text-sm mt-2 leading-relaxed bg-slate-50 p-4 border border-slate-100 rounded-2xl italic">
                      "{volunteer.bio || 'Tell organizations about yourself...'}"
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Volunteer Statistics */}
            <div className="rounded-3xl bg-white p-8 shadow-lg border border-slate-200 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-6">Volunteer Hours</h2>
                <div className="space-y-6">
                  <div className="rounded-2xl bg-emerald-50/50 p-6 border border-emerald-100">
                    <p className="text-sm text-emerald-800 font-semibold uppercase tracking-wider">Total Hours Logged</p>
                    <p className="text-4xl font-extrabold text-emerald-700 mt-2">{volunteer.totalHoursLogged} hrs</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Opportunities</p>
                      <p className="mt-2 text-2xl font-bold text-slate-800">{volunteer.activeOpportunities}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Verified Certificates</p>
                      <p className="mt-2 text-2xl font-bold text-slate-800">{volunteer.certificates}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 border-t border-slate-100 pt-6 text-slate-500 text-xs flex justify-between items-center">
                <span>Joined ChariTree {volunteer.joinedDate ? new Date(volunteer.joinedDate).toLocaleDateString() : new Date().toLocaleDateString()}</span>
                <span className="capitalize px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-semibold">Volunteer</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
