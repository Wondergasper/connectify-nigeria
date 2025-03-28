
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Calendar, User } from "lucide-react";

const BottomNavigation = () => {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route: string) => {
    if (route === "/" && path === "/") return true;
    if (route !== "/" && path.startsWith(route)) return true;
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md z-10">
      <div className="flex justify-around py-3">
        <Link to="/" className={`nav-item ${isActive("/") ? "active" : ""}`}>
          <Home className="h-6 w-6" />
          <span>Home</span>
        </Link>
        <Link to="/search" className={`nav-item ${isActive("/search") ? "active" : ""}`}>
          <Search className="h-6 w-6" />
          <span>Search</span>
        </Link>
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
