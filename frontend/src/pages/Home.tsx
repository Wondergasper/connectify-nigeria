
import React from "react";
import SearchBar from "@/components/SearchBar";
import ServiceCategoryGrid from "@/components/ServiceCategoryGrid";
import WhatsAppBanner from "@/components/WhatsAppBanner";

const Home = () => {
  return (
    <div className="flex flex-col space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-connectify-darkGray">Connectify Nigeria</h1>
        <p className="text-connectify-mediumGray mt-2">Find trusted service providers near you</p>
      </div>

      <SearchBar />
      
      <div>
        <h2 className="text-xl font-semibold text-connectify-darkGray">Popular Services</h2>
        <ServiceCategoryGrid />
      </div>

      <WhatsAppBanner />
    </div>
  );
};

export default Home;
