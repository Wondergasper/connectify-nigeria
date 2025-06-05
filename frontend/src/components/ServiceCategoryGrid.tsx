
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Wrench, Paintbrush, Scissors, Car, 
  Hammer, Globe, Utensils, HeartPulse, 
  Laptop, BookOpen, ShieldCheck, Truck
} from "lucide-react";

interface ServiceCategory {
  id: string;
  name: string;
  icon: JSX.Element;
}

const ServiceCategoryGrid = () => {
  const navigate = useNavigate();
  
  const categories: ServiceCategory[] = [
    { id: "plumbing", name: "Plumbing", icon: <Wrench className="h-10 w-10 text-connectify-blue" /> },
    { id: "cleaning", name: "Cleaning", icon: <Paintbrush className="h-10 w-10 text-connectify-blue" /> },
    { id: "tailoring", name: "Tailoring", icon: <Scissors className="h-10 w-10 text-connectify-blue" /> },
    { id: "mechanics", name: "Mechanics", icon: <Car className="h-10 w-10 text-connectify-blue" /> },
    { id: "carpentry", name: "Carpentry", icon: <Hammer className="h-10 w-10 text-connectify-blue" /> },
    { id: "web-design", name: "Web Design", icon: <Globe className="h-10 w-10 text-connectify-blue" /> },
    { id: "catering", name: "Catering", icon: <Utensils className="h-10 w-10 text-connectify-blue" /> },
    { id: "healthcare", name: "Healthcare", icon: <HeartPulse className="h-10 w-10 text-connectify-blue" /> },
    { id: "it-support", name: "IT Support", icon: <Laptop className="h-10 w-10 text-connectify-blue" /> },
    { id: "tutoring", name: "Tutoring", icon: <BookOpen className="h-10 w-10 text-connectify-blue" /> },
    { id: "security", name: "Security", icon: <ShieldCheck className="h-10 w-10 text-connectify-blue" /> },
    { id: "delivery", name: "Delivery", icon: <Truck className="h-10 w-10 text-connectify-blue" /> },
  ];

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/search?category=${categoryId}`);
  };

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-6">
      {categories.map((category) => (
        <div 
          key={category.id}
          className="service-card"
          onClick={() => handleCategoryClick(category.id)}
        >
          {category.icon}
          <p className="font-medium mt-2">{category.name}</p>
        </div>
      ))}
    </div>
  );
};

export default ServiceCategoryGrid;
