
// import { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import SearchBar from "@/components/SearchBar";
// import ProviderCard from "@/components/ProviderCard";
// import Loading from "@/components/Loading";
// import { Filter, ArrowUpDown, MapPin, Star } from "lucide-react";
// import { 
//   DropdownMenu, 
//   DropdownMenuContent, 
//   DropdownMenuItem, 
//   DropdownMenuTrigger 
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";

// // Mock data for providers
// const mockProviders = [
//   {
//     id: "1",
//     name: "John Okafor",
//     photo: "https://randomuser.me/api/portraits/men/1.jpg",
//     rating: 4.8,
//     price: "₦2,500/hr",
//     category: "Plumbing",
//     location: "Lagos"
//   },
//   {
//     id: "2",
//     name: "Amina Ibrahim",
//     photo: "https://randomuser.me/api/portraits/women/2.jpg",
//     rating: 4.5,
//     price: "₦3,000/hr",
//     category: "Cleaning",
//     location: "Abuja"
//   },
//   {
//     id: "3",
//     name: "Emmanuel Nwachukwu",
//     photo: "https://randomuser.me/api/portraits/men/3.jpg",
//     rating: 4.9,
//     price: "₦5,000/hr",
//     category: "Carpentry",
//     location: "Port Harcourt"
//   },
//   {
//     id: "4",
//     name: "Chioma Eze",
//     photo: "https://randomuser.me/api/portraits/women/4.jpg",
//     rating: 4.7,
//     price: "₦4,000/hr",
//     category: "Tailoring",
//     location: "Enugu"
//   },
//   {
//     id: "5",
//     name: "Oluwaseun Adeyemi",
//     photo: "https://randomuser.me/api/portraits/men/5.jpg",
//     rating: 4.6,
//     price: "₦3,500/hr",
//     category: "Mechanics",
//     location: "Ibadan"
//   }
// ];

// const SearchResults = () => {
//   const location = useLocation();
//   const [isLoading, setIsLoading] = useState(true);
//   const [providers, setProviders] = useState(mockProviders);
//   const [sortBy, setSortBy] = useState("rating");
//   const [locationFilter, setLocationFilter] = useState("");

//   // Get search params
//   const queryParams = new URLSearchParams(location.search);
//   const searchQuery = queryParams.get("q");
//   const category = queryParams.get("category");

//   useEffect(() => {
//     // Simulate API call
//     const timer = setTimeout(() => {
//       let filteredProviders = [...mockProviders];
      
//       // Filter by search query
//       if (searchQuery) {
//         filteredProviders = filteredProviders.filter(provider => 
//           provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           provider.category.toLowerCase().includes(searchQuery.toLowerCase())
//         );
//       }
      
//       // Filter by category
//       if (category) {
//         filteredProviders = filteredProviders.filter(provider => 
//           provider.category.toLowerCase() === category.toLowerCase()
//         );
//       }
      
//       // Filter by location
//       if (locationFilter) {
//         filteredProviders = filteredProviders.filter(provider => 
//           provider.location.toLowerCase() === locationFilter.toLowerCase()
//         );
//       }
      
//       // Sort providers
//       if (sortBy === "rating") {
//         filteredProviders.sort((a, b) => b.rating - a.rating);
//       } else if (sortBy === "price-low") {
//         filteredProviders.sort((a, b) => 
//           parseInt(a.price.replace(/[^0-9]/g, "")) - parseInt(b.price.replace(/[^0-9]/g, ""))
//         );
//       } else if (sortBy === "price-high") {
//         filteredProviders.sort((a, b) => 
//           parseInt(b.price.replace(/[^0-9]/g, "")) - parseInt(a.price.replace(/[^0-9]/g, ""))
//         );
//       }
      
//       setProviders(filteredProviders);
//       setIsLoading(false);
//     }, 1000);
    
//     return () => clearTimeout(timer);
//   }, [searchQuery, category, locationFilter, sortBy]);

//   if (isLoading) {
//     return <Loading />;
//   }

//   return (
//     <div className="space-y-6 animate-fade-in">
//       <SearchBar />
      
//       <div className="flex justify-between items-center">
//         <h2 className="text-xl font-semibold text-connectify-darkGray">
//           {searchQuery ? `Results for "${searchQuery}"` : 
//           category ? `${category} Services` : "All Providers"}
//         </h2>
//         <div className="flex space-x-2">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" size="sm" className="flex items-center">
//                 <Filter className="h-4 w-4 mr-1" /> Filter
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem onClick={() => setLocationFilter("Lagos")}>
//                 <MapPin className="h-4 w-4 mr-2" /> Lagos
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setLocationFilter("Abuja")}>
//                 <MapPin className="h-4 w-4 mr-2" /> Abuja
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setLocationFilter("Port Harcourt")}>
//                 <MapPin className="h-4 w-4 mr-2" /> Port Harcourt
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setLocationFilter("")}>
//                 Clear Filter
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
          
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" size="sm" className="flex items-center">
//                 <ArrowUpDown className="h-4 w-4 mr-1" /> Sort
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem onClick={() => setSortBy("rating")}>
//                 <Star className="h-4 w-4 mr-2" /> Highest Rating
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setSortBy("price-low")}>
//                 Price: Low to High
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setSortBy("price-high")}>
//                 Price: High to Low
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>
      
//       {locationFilter && (
//         <div className="flex items-center">
//           <span className="text-sm text-connectify-darkGray">
//             Filtered by location: <span className="font-medium">{locationFilter}</span>
//           </span>
//           <Button 
//             variant="ghost" 
//             size="sm" 
//             className="ml-2 h-6 text-sm" 
//             onClick={() => setLocationFilter("")}
//           >
//             Clear
//           </Button>
//         </div>
//       )}
      
//       {providers.length === 0 ? (
//         <div className="text-center py-8">
//           <p className="text-connectify-darkGray">No providers found. Try different search terms.</p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {providers.map(provider => (
//             <ProviderCard key={provider.id} provider={provider} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchResults;

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import ProviderCard from "@/components/ProviderCard";
import Loading from "@/components/Loading";
import { Filter, ArrowUpDown, MapPin, Star } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import axios from "axios";

const SearchResults = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [providers, setProviders] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState("rating");
  const [locationFilter, setLocationFilter] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Get search params
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q");
  const category = queryParams.get("category");

  useEffect(() => {
    const fetchProviders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append("q", searchQuery);
        if (category) params.append("category", category);
        if (locationFilter) params.append("location", locationFilter);
        if (sortBy) params.append("sort", sortBy);

        const response = await axios.get(`http://localhost:5000/api/providers?${params.toString()}`);
        setProviders(response.data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data.message || "Failed to fetch providers. Please try again.");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, [searchQuery, category, locationFilter, sortBy]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-connectify-darkGray">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4 bg-connectify-blue hover:bg-connectify-darkBlue">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <SearchBar />
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-connectify-darkGray">
          {searchQuery ? `Results for "${searchQuery}"` : 
          category ? `${category} Services` : "All Providers"}
        </h2>
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <Filter className="h-4 w-4 mr-1" /> Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLocationFilter("Lagos")}>
                <MapPin className="h-4 w-4 mr-2" /> Lagos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocationFilter("Abuja")}>
                <MapPin className="h-4 w-4 mr-2" /> Abuja
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocationFilter("Port Harcourt")}>
                <MapPin className="h-4 w-4 mr-2" /> Port Harcourt
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocationFilter("")}>
                Clear Filter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <ArrowUpDown className="h-4 w-4 mr-1" /> Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("rating")}>
                <Star className="h-4 w-4 mr-2" /> Highest Rating
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("price-low")}>
                Price: Low to High
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("price-high")}>
                Price: High to Low
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {locationFilter && (
        <div className="flex items-center">
          <span className="text-sm text-connectify-darkGray">
            Filtered by location: <span className="font-medium">{locationFilter}</span>
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-2 h-6 text-sm" 
            onClick={() => setLocationFilter("")}
          >
            Clear
          </Button>
        </div>
      )}
      
      {providers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-connectify-darkGray">No providers found. Try different search terms.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {providers.map(provider => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;