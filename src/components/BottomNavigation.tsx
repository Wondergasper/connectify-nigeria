import { Link, useLocation } from "react-router-dom";
import { Home, Search, Calendar, User, Briefcase, BarChart3, Clipboard, Bell } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Notifications } from "@/components/ui/notifications";

const BottomNavigation = () => {
  const location = useLocation();
  const path = location.pathname;
  const { userRole } = useUser();

  const isActive = (route: string) => {
    if (route === "/" && path === "/") return true;
    if (route !== "/" && path.startsWith(route)) return true;
    return false;
  };

  // Provider navigation items
  if (userRole === "provider") {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-10 dark-transition">
        <div className="flex justify-around py-3">
          <Link to="/provider-dashboard" className={`nav-item ${isActive("/provider-dashboard") ? "active" : ""}`}>
            <Home className="h-6 w-6" />
            <span>Dashboard</span>
          </Link>
          <Link to="/provider-jobs" className={`nav-item ${isActive("/provider-jobs") ? "active" : ""}`}>
            <Clipboard className="h-6 w-6" />
            <span>Jobs</span>
          </Link>
          <div className="nav-item">
            <Notifications />
            <span>Notifications</span>
          </div>
          <Link to="/provider-analytics" className={`nav-item ${isActive("/provider-analytics") ? "active" : ""}`}>
            <BarChart3 className="h-6 w-6" />
            <span>Analytics</span>
          </Link>
          <Link to="/provider-profile" className={`nav-item ${isActive("/provider-profile") ? "active" : ""}`}>
            <User className="h-6 w-6" />
            <span>Profile</span>
          </Link>
        </div>
      </div>
    );
  }

  // Default/Customer navigation items
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-10 dark-transition">
      <div className="flex justify-around py-3">
        <Link to="/" className={`nav-item ${isActive("/") ? "active" : ""}`}>
          <Home className="h-6 w-6" />
          <span>Home</span>
        </Link>
        <Link to="/search" className={`nav-item ${isActive("/search") ? "active" : ""}`}>
          <Search className="h-6 w-6" />
          <span>Search</span>
        </Link>
        <div className="nav-item">
          <Notifications />
          <span>Notifications</span>
        </div>
        <Link to="/bookings" className={`nav-item ${isActive("/bookings") ? "active" : ""}`}>
          <Calendar className="h-6 w-6" />
          <span>Bookings</span>
        </Link>
        <Link to="/profile" className={`nav-item ${isActive("/profile") ? "active" : ""}`}>
          <User className="h-6 w-6" />
          <span>Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;
