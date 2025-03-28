import React from "react";
import { Outlet, Link } from "react-router-dom";
import BottomNavigation from "./BottomNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "./ThemeToggle";
import WhatsAppBanner from "./WhatsAppBanner";
import { Menu, Home, Search, Calendar, User } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Layout = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground dark-transition">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border p-4 flex justify-between items-center dark-transition">
        <div className="flex items-center space-x-4">
          {!isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px] sm:w-[300px]">
                <div className="py-6 space-y-6">
                  <h2 className="text-lg font-medium">Connectify</h2>
                  <nav className="flex flex-col space-y-3">
                    <Link to="/" className="flex items-center py-2 text-sm hover:text-connectify-blue">
                      <Home className="h-4 w-4 mr-2" />
                      Home
                    </Link>
                    <Link to="/search" className="flex items-center py-2 text-sm hover:text-connectify-blue">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Link>
                    <Link to="/bookings" className="flex items-center py-2 text-sm hover:text-connectify-blue">
                      <Calendar className="h-4 w-4 mr-2" />
                      Bookings
                    </Link>
                    <Link to="/profile" className="flex items-center py-2 text-sm hover:text-connectify-blue">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          )}
          <Link to="/" className="flex items-center">
            <h1 className="text-xl font-bold text-connectify-blue">
              Connectify
            </h1>
          </Link>
        </div>
        <ThemeToggle />
      </header>
      
      <main className="flex-1 container p-4 pb-24 md:pb-6 dark-transition animate-fade-in">
        <WhatsAppBanner />
        <Outlet />
      </main>
      
      {isMobile && <BottomNavigation />}
    </div>
  );
};

export default Layout;
