import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import HomePage from "./pages/HomePage";
import DonatePage from "./pages/DonatePage";
import OrgAuthPage from "./pages/OrgAuthPage";
import OrgDashboard from "./pages/OrgDashboard";
import PaymentPage from "./pages/PaymentPage";
import DonorDashboard from "./pages/DonorDashboard";
import DonorProfile from "./pages/DonorProfile";
import DonorLoginPage from "./pages/DonorLoginPage";
import DonorSignupPage from "./pages/DonorSignupPage";
import VolunteerAuthPage from "./pages/VolunteerAuthPage";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import CommunityPage from "./pages/CommunityPage";
import AboutPage from "./pages/AboutPage";

// Context & nav
import { AuthProvider } from './context/AuthContext';
import PublicNavbar from './components/PublicNavbar';
import DonorNavbar from './components/DonorNavbar';
import VolunteerNavbar from './components/VolunteerNavbar';
import OrgNavbar from './components/OrgNavbar';
// AdminNavbar intentionally not imported (not used yet)
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {

  return (
    <AuthProvider>
      <Router>
        {/* Public navbar on top-level routes */}
        <PublicNavbar />

        <Routes>
          {/* Public pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<div className="p-8">Contact page placeholder</div>} />
          <Route path="/organizations" element={<DonatePage />} />
          <Route path="/campaigns" element={<CommunityPage />} />
          <Route path="/login" element={<DonorLoginPage />} />
          <Route path="/signup" element={<DonorSignupPage />} />
          <Route path="/payment" element={<PaymentPage />} />

          {/* Auth pages (legacy routes kept) */}
          <Route path="/donor-login" element={<DonorLoginPage />} />
          <Route path="/donor-signup" element={<DonorSignupPage />} />
          <Route path="/org-login" element={<OrgAuthPage />} />

          {/* Dashboard summaries (protected) */}
          <Route
            path="/dashboard/donor"
            element={<ProtectedRoute roles={["donor"]}><DonorNavbar /><DonorDashboard /></ProtectedRoute>}
          />

          <Route
            path="/dashboard/volunteer"
            element={<ProtectedRoute roles={["volunteer"]}><VolunteerNavbar /><VolunteerDashboard /></ProtectedRoute>}
          />

          <Route
            path="/dashboard/org"
            element={<ProtectedRoute roles={["organization"]}><OrgNavbar /><OrgDashboard /></ProtectedRoute>}
          />

          {/* Donor profile (protected) */}
          <Route path="/donor-profile" element={<ProtectedRoute roles={["donor"]}><DonorNavbar /><DonorProfile /></ProtectedRoute>} />

          {/* Organization pages (keep existing org dashboard path) */}
          <Route path="/org-dashboard" element={<ProtectedRoute roles={["organization"]}><OrgNavbar /><OrgDashboard /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
