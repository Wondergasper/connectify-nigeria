
import { Outlet } from "react-router-dom";
import BottomNavigation from "./BottomNavigation";
import { useIsMobile } from "@/hooks/use-mobile";

const Layout = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col bg-connectify-lightGray">
      <main className="flex-1 container p-4 pb-20 md:p-6 md:pb-6">
        <Outlet />
      </main>
      {isMobile && <BottomNavigation />}
    </div>
  );
};

export default Layout;
