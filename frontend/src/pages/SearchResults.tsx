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
import api from "@/lib/axios";

interface Provider {
  id: string;
  name: string;
  photo: string;
  rating: number;
  price: string;
  category: string;
  location: string;
}

const SearchResults = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [sortBy, setSortBy] = useState("rating");
  const [locationFilter, setLocationFilter] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Get search params
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q");
  const category = queryParams.get("category");

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await api.get("/providers", {
          params: {
            q: searchQuery,
            category: category,
            location: locationFilter
          }
        });
        setProviders(response.data);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch providers");
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, [searchQuery, category, locationFilter]);

  if (isLoading) return <Loading />;
  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <SearchBar />
      <h2>{searchQuery ? `Results for "${searchQuery}"` : category ? `${category} Services` : "All Providers"}</h2>
      {providers.length === 0 ? (
        <p>No providers found.</p>
      ) : (
        providers.map(provider => <ProviderCard key={provider.id} provider={provider} />)
      )}
    </div>
  );
};

export default SearchResults;