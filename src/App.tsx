
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";

// Pages
import Layout from "./components/Layout";
import Loading from "./components/Loading";
import NotFound from "./pages/NotFound";

// Lazy loaded pages
const Home = lazy(() => import("./pages/Home"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const ProviderProfile = lazy(() => import("./pages/ProviderProfile"));
const Bookings = lazy(() => import("./pages/Bookings"));
const PaymentScreen = lazy(() => import("./pages/PaymentScreen"));
const ProviderDashboard = lazy(() => import("./pages/provider/Dashboard"));
const ProviderJobs = lazy(() => import("./pages/provider/Jobs"));
const ProviderProfileManagement = lazy(() => import("./pages/provider/Profile"));
const ProviderAnalytics = lazy(() => import("./pages/provider/Analytics"));
const ProviderRegistration = lazy(() => import("./pages/provider/Registration"));
const Profile = lazy(() => import("./pages/Profile"));

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
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="search" element={<SearchResults />} />
                <Route path="provider/:id" element={<ProviderProfile />} />
                <Route path="bookings" element={<Bookings />} />
                <Route path="payment/:bookingId" element={<PaymentScreen />} />
                <Route path="profile" element={<Profile />} />
                
                {/* Provider routes */}
                <Route path="provider-registration" element={<ProviderRegistration />} />
                <Route path="provider-dashboard" element={<ProviderDashboard />} />
                <Route path="provider-jobs" element={<ProviderJobs />} />
                <Route path="provider-profile" element={<ProviderProfileManagement />} />
                <Route path="provider-analytics" element={<ProviderAnalytics />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
