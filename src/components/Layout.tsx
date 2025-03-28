
import React from "react";
import { Outlet } from "react-router-dom";
import BottomNavigation from "./BottomNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "./ThemeToggle";
import WhatsAppBanner from "./WhatsAppBanner";

const Layout = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col bg-background text-connectify-navyBlue dark:text-connectify-blue dark-transition">
      <header className="sticky top-0 z-10 bg-background border-b border-border p-4 flex justify-between items-center dark-transition">
        <h1 className="text-xl font-bold text-connectify-navyBlue dark:text-connectify-blue">Connectify</h1>
        <ThemeToggle />
      </header>
      
      <main className="flex-1 container p-4 pb-20 md:p-6 md:pb-6 dark-transition">
        <WhatsAppBanner />
        <Outlet />
      </main>
      
      {isMobile && <BottomNavigation />}
    </div>
  );
};

export default Layout;
