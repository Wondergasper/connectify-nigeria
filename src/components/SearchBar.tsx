
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-5 w-5 text-connectify-mediumGray" />
        <input
          type="text"
          placeholder="Find a service provider..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-20 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-connectify-blue"
        />
        <Button 
          type="submit" 
          className="absolute right-1 px-4 bg-connectify-blue hover:bg-connectify-darkBlue text-white font-medium rounded-md"
        >
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
