import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Guards
import MainLayout from './components/layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Public Pages
import HomePage from './pages/public/HomePage';
import FindWorkPage from './pages/public/FindWorkPage';
import JobDetailsPage from './pages/public/JobDetailsPage';
import FindServicesPage from './pages/public/FindServicesPage';
import ServiceDetailsPage from './pages/public/ServiceDetailsPage';
import MarketplacePage from './pages/public/MarketplacePage';
import ProductDetailsPage from './pages/public/ProductDetailsPage';
import FreeStuffPage from './pages/public/FreeStuffPage';
import FreeItemDetailsPage from './pages/public/FreeItemDetailsPage';
import HowItWorksPage from './pages/public/HowItWorksPage';
import TrustVerificationPage from './pages/public/TrustVerificationPage';
import ContactPage from './pages/public/ContactPage';
import TermsPage from './pages/public/TermsPage';
import PrivacyPage from './pages/public/PrivacyPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Dashboard Pages
import DashboardOverview from './pages/dashboard/DashboardOverview';
import MyProfilePage from './pages/dashboard/MyProfilePage';
import MyPostsPage from './pages/dashboard/MyPostsPage';
import CreateJobPage from './pages/dashboard/CreateJobPage';
import CreateServicePage from './pages/dashboard/CreateServicePage';
import CreateSaleListingPage from './pages/dashboard/CreateSaleListingPage';
import CreateFreeListingPage from './pages/dashboard/CreateFreeListingPage';
import MyApplicationsPage from './pages/dashboard/MyApplicationsPage';
import ReceivedApplicationsPage from './pages/dashboard/ReceivedApplicationsPage';
import ProofBoxPage from './pages/dashboard/ProofBoxPage';
import PaymentHistoryPage from './pages/dashboard/PaymentHistoryPage';
import VerificationCenterPage from './pages/dashboard/VerificationCenterPage';
import AvailabilityPage from './pages/dashboard/AvailabilityPage';
import MessagesPage from './pages/dashboard/MessagesPage';
import NotificationsPage from './pages/dashboard/NotificationsPage';
import MyFavouritesPage from './pages/dashboard/MyFavouritesPage';

// Admin Pages
import AdminOverviewPage from './pages/admin/AdminOverviewPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminVerificationsPage from './pages/admin/AdminVerificationsPage';
import WebsiteCustomizationPage from './pages/admin/WebsiteCustomizationPage';

function App() {
  return (
    <Routes>
      {/* Public Pages with Main Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<FindWorkPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/services" element={<FindServicesPage />} />
        <Route path="/services/:id" element={<ServiceDetailsPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/marketplace/:id" element={<ProductDetailsPage />} />
        <Route path="/free-stuff" element={<FreeStuffPage />} />
        <Route path="/free-stuff/:id" element={<FreeItemDetailsPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/trust-verification" element={<TrustVerificationPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* User Dashboard Pages with Dashboard Layout & Guard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="profile" element={<MyProfilePage />} />
        <Route path="my-posts" element={<MyPostsPage />} />
        <Route path="create-job" element={<CreateJobPage />} />
        <Route path="create-service" element={<CreateServicePage />} />
        <Route path="create-product" element={<CreateSaleListingPage />} />
        <Route path="create-free-item" element={<CreateFreeListingPage />} />
        <Route path="my-applications" element={<MyApplicationsPage />} />
        <Route path="received-applications" element={<ReceivedApplicationsPage />} />
        <Route path="proofbox" element={<ProofBoxPage />} />
        <Route path="proofbox/:jobId" element={<ProofBoxPage />} />
        <Route path="payments" element={<PaymentHistoryPage />} />
        <Route path="verification" element={<VerificationCenterPage />} />
        <Route path="availability" element={<AvailabilityPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="favourites" element={<MyFavouritesPage />} />
      </Route>

      {/* Admin Suite with Dashboard Layout & Admin Guard */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin={true}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverviewPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="verifications" element={<AdminVerificationsPage />} />
        <Route path="customization" element={<WebsiteCustomizationPage />} />
      </Route>

      {/* 404 Fallback */}
      <Route element={<MainLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
