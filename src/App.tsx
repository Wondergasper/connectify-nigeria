
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { UserProvider } from './contexts/UserContext';

// Pages
import Layout from "./components/Layout";
import Loading from "./components/Loading";
import NotFound from "./pages/NotFound";
import UserTypeSelection from "./pages/UserTypeSelection";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Home from "./pages/Home"; // Direct import instead of lazy loading
import Profile from "./pages/Profile"; // Direct import instead of lazy loading

// Lazy loaded pages
const SearchResults = lazy(() => import("./pages/SearchResults"));
const ProviderProfile = lazy(() => import("./pages/ProviderProfile"));
const Bookings = lazy(() => import("./pages/Bookings"));
const PaymentScreen = lazy(() => import("./pages/PaymentScreen"));
const ProviderDashboard = lazy(() => import("./pages/provider/Dashboard"));
const ProviderJobs = lazy(() => import("./pages/provider/Jobs"));
const ProviderProfileManagement = lazy(() => import("./pages/provider/Profile"));
const ProviderAnalytics = lazy(() => import("./pages/provider/Analytics"));
const ProviderRegistration = lazy(() => import("./pages/provider/Registration"));

const queryClient = new QueryClient();

const App = () => {
  // Register service worker for PWA
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/serviceWorker.js")
          .then(registration => {
            console.log("ServiceWorker registration successful with scope: ", registration.scope);
          })
          .catch(error => {
            console.log("ServiceWorker registration failed: ", error);
          });
      });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UserProvider>
          <BrowserRouter>
            <Suspense fallback={<Loading />}>
              <Routes>
                {/* User type selection route */}
                <Route path="/select-user-type" element={<UserTypeSelection />} />
                
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="search" element={<SearchResults />} />
                  <Route path="provider/:id" element={<ProviderProfile />} />
                  
                  {/* Customer routes */}
                  <Route path="bookings" element={
                    <ProtectedRoute allowedRole="customer">
                      <Bookings />
                    </ProtectedRoute>
                  } />
                  <Route path="payment/:bookingId" element={
                    <ProtectedRoute allowedRole="customer">
                      <PaymentScreen />
                    </ProtectedRoute>
                  } />
                  <Route path="profile" element={<Profile />} />
                  
                  {/* Provider routes */}
                  <Route path="provider-registration" element={<ProviderRegistration />} />
                  <Route path="provider-dashboard" element={
                    <ProtectedRoute allowedRole="provider">
                      <ProviderDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="provider-jobs" element={
                    <ProtectedRoute allowedRole="provider">
                      <ProviderJobs />
                    </ProtectedRoute>
                  } />
                  <Route path="provider-profile" element={
                    <ProtectedRoute allowedRole="provider">
                      <ProviderProfileManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="provider-analytics" element={
                    <ProtectedRoute allowedRole="provider">
                      <ProviderAnalytics />
                    </ProtectedRoute>
                  } />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </UserProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
