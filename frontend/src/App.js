import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import HomePage from "./pages/HomePage";
import DonatePage from "./pages/DonatePage";
import OrganizationDetails from "./pages/OrganizationDetails";
import OrgAuthPage from "./pages/OrgAuthPage";
import OrgDashboard from "./pages/OrgDashboard";
import PaymentPage from "./pages/PaymentPage";
import DonorDashboard from "./pages/DonorDashboard";
import DonorProfile from "./pages/DonorProfile";
import DonorLoginPage from "./pages/DonorLoginPage";
import DonorSignupPage from "./pages/DonorSignupPage";
import VolunteerAuthPage from "./pages/VolunteerAuthPage";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import VolunteerLanding from "./pages/VolunteerLanding";
import CommunityPage from "./pages/CommunityPage";
import AboutPage from "./pages/AboutPage";
import CampaignCreate from "./pages/CampaignCreate";
import CampaignEdit from "./pages/CampaignEdit";
import CampaignDetails from "./pages/CampaignDetails";
import OrganizationWishlist from "./pages/OrganizationWishlist";

// Context & nav
import { AuthProvider } from './context/AuthContext';
import PublicLayout from './components/PublicLayout';
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
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><div className="p-8">Contact page placeholder</div></PublicLayout>} />
          <Route path="/organizations" element={<PublicLayout><DonatePage /></PublicLayout>} />
          <Route path="/organization/:id" element={<PublicLayout><OrganizationDetails /></PublicLayout>} />
          <Route path="/campaign/:id" element={<PublicLayout><CampaignDetails /></PublicLayout>} />
          <Route path="/volunteer-landing" element={<PublicLayout><VolunteerLanding /></PublicLayout>} />
          <Route path="/campaigns" element={<PublicLayout><CommunityPage /></PublicLayout>} />
          <Route path="/login" element={<PublicLayout><DonorLoginPage /></PublicLayout>} />
          <Route path="/signup" element={<PublicLayout><DonorSignupPage /></PublicLayout>} />
          <Route path="/payment" element={<PublicLayout><PaymentPage /></PublicLayout>} />

          {/* Auth pages (legacy routes kept) */}
          <Route path="/donor-login" element={<PublicLayout><DonorLoginPage /></PublicLayout>} />
          <Route path="/donor-signup" element={<PublicLayout><DonorSignupPage /></PublicLayout>} />
          <Route path="/org-login" element={<PublicLayout><OrgAuthPage /></PublicLayout>} />

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
            element={<ProtectedRoute roles={["organization"]}><OrgDashboard /></ProtectedRoute>}
          />

          {/* Campaign management (protected) */}
          <Route
            path="/org-campaigns/create"
            element={<ProtectedRoute roles={["organization"]}><CampaignCreate /></ProtectedRoute>}
          />

          <Route
            path="/org-campaigns/:id/edit"
            element={<ProtectedRoute roles={["organization"]}><CampaignEdit /></ProtectedRoute>}
          />

          <Route
            path="/org-wishlist"
            element={<ProtectedRoute roles={["organization"]}><OrganizationWishlist /></ProtectedRoute>}
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
