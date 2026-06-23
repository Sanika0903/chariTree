import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { apiUrl } from '../config/api';
import { AuthContext } from '../context/AuthContext';

export default function VolunteerCertificates() {
  const { auth } = useContext(AuthContext);
  const token = auth?.token || '';
  const userName = auth?.user?.name || 'Volunteer';

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
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
        const res = await axios.get(apiUrl('/api/volunteers/me/certificates'), config);
        setCertificates(res.data || []);
      } catch (err) {
        console.error('Failed to fetch certificates', err);
        setError('Failed to load certificates. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [token]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white px-6 py-10 print:bg-white print:p-0">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto print:hidden">
        <h1 className="text-4xl font-bold text-emerald-700 mb-4">My Certificates</h1>
        <p className="text-slate-600 mb-8">Review and download certificates earned through your volunteering milestones.</p>

        {loading ? (
          <div className="text-center py-16 text-slate-600">Loading your certificates…</div>
        ) : error ? (
          <div className="rounded-3xl bg-red-50 border border-red-200 p-6 text-red-700">{error}</div>
        ) : certificates.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 shadow-lg text-center text-slate-500">
            No certificates earned yet. Participate in events and log hours with organizations to earn certificates!
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {certificates.map((certificate) => (
              <div key={certificate._id || certificate.id} className="rounded-3xl bg-white p-6 shadow-lg border border-slate-200 flex flex-col justify-between">
                <div>
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Verified Certificate</p>
                  <h2 className="text-2xl font-semibold text-slate-900 mt-2">{certificate.title}</h2>
                  <p className="text-slate-600 mt-1">Awarded by {certificate.organization}</p>
                  <p className="text-slate-500 text-sm mt-3">{certificate.description || 'Appreciation for service and dedication'}</p>
                </div>
                <div className="mt-6 border-t border-slate-100 pt-4 flex justify-between items-center">
                  <div className="text-xs text-slate-400">
                    <p>{new Date(certificate.date).toLocaleDateString()}</p>
                    <p className="font-semibold text-slate-600 mt-1">{certificate.hoursLogged} Hours Logged</p>
                  </div>
                  <button
                    onClick={() => setSelectedCert(certificate)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-2xl transition"
                  >
                    View & Print
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Elegant Printable Certificate Modal */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:absolute print:inset-0 print:bg-white print:p-0">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl border-4 border-double border-amber-500 relative print:shadow-none print:border-amber-600 print:rounded-none"
            >
              {/* Gold Filigree Style Corners */}
              <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-500 print:border-amber-600"></div>
              <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-500 print:border-amber-600"></div>
              <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-500 print:border-amber-600"></div>
              <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-500 print:border-amber-600"></div>

              <div className="text-center space-y-6 py-6">
                <div className="text-emerald-700 text-4xl">🌱</div>
                <h3 className="font-serif text-3xl font-bold text-amber-600 uppercase tracking-widest print:text-amber-800">
                  Certificate of Appreciation
                </h3>
                <p className="text-slate-500 italic text-lg">This certificate is proudly presented to</p>
                <h4 className="font-serif text-4xl font-extrabold text-slate-800 underline decoration-amber-500 decoration-wavy underline-offset-8">
                  {userName}
                </h4>
                <p className="text-slate-600 max-w-xl mx-auto leading-relaxed text-md">
                  In recognition of outstanding dedication and support as a volunteer. Contributing{' '}
                  <span className="font-bold text-emerald-700">{selectedCert.hoursLogged} hours</span> of service for{' '}
                  <span className="font-bold text-slate-900">"{selectedCert.title}"</span> organized by{' '}
                  <span className="font-bold text-emerald-800">{selectedCert.organization}</span>.
                </p>
                {selectedCert.description && (
                  <p className="text-xs text-slate-400 italic">" {selectedCert.description} "</p>
                )}

                <div className="pt-10 grid grid-cols-2 gap-10 max-w-md mx-auto text-slate-600">
                  <div className="border-t border-slate-300 pt-2 text-sm text-center">
                    <p className="font-serif font-semibold text-slate-800">{selectedCert.organization}</p>
                    <p className="text-xs text-slate-400">Awarding Partner</p>
                  </div>
                  <div className="border-t border-slate-300 pt-2 text-sm text-center">
                    <p className="font-semibold text-slate-800">ChariTree 🌱</p>
                    <p className="text-xs text-slate-400">Date: {new Date(selectedCert.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex gap-4 justify-end border-t border-slate-100 pt-6 print:hidden">
                <button
                  onClick={() => setSelectedCert(null)}
                  className="px-5 py-3 border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 font-semibold transition"
                >
                  Close
                </button>
                <button
                  onClick={handlePrint}
                  className="px-6 py-3 bg-amber-500 text-white rounded-2xl hover:bg-amber-600 font-bold transition flex items-center gap-2"
                >
                  🖨️ Print / Save PDF
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
