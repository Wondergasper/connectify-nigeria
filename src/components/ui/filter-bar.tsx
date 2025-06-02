import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Filter, X } from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
  type: "text" | "select" | "date" | "number";
  options?: { value: string; label: string }[];
}

interface FilterBarProps {
  filters: FilterOption[];
  onFilterChange: (filters: Record<string, any>) => void;
  className?: string;
}

export function FilterBar({ filters, onFilterChange, className = "" }: FilterBarProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (id: string, value: any) => {
    const newFilters = { ...activeFilters, [id]: value };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilter = (id: string) => {
    const newFilters = { ...activeFilters };
    delete newFilters[id];
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearAll = () => {
    setActiveFilters({});
    onFilterChange({});
  };

  const activeFilterCount = Object.keys(activeFilters).length;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 rounded-full bg-connectify-blue text-white px-2 py-0.5 text-xs">
              {activeFilterCount}
            </span>
          )}
        </Button>
        
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-connectify-mediumGray hover:text-connectify-darkGray"
          >
            Clear all
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          {filters.map((filter) => (
            <div key={filter.id} className="space-y-2">
              <label className="text-sm font-medium">{filter.label}</label>
              
              {filter.type === "text" && (
                <Input
                  value={activeFilters[filter.id] || ""}
                  onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                  placeholder={`Enter ${filter.label.toLowerCase()}`}
                />
              )}
              
              {filter.type === "select" && filter.options && (
                <Select
                  value={activeFilters[filter.id] || ""}
                  onValueChange={(value) => handleFilterChange(filter.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${filter.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              {filter.type === "date" && (
                <DatePicker
                  value={activeFilters[filter.id] ? new Date(activeFilters[filter.id]) : undefined}
                  onChange={(date) => handleFilterChange(filter.id, date?.toISOString())}
                />
              )}
              
              {filter.type === "number" && (
                <Input
                  type="number"
                  value={activeFilters[filter.id] || ""}
                  onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                  placeholder={`Enter ${filter.label.toLowerCase()}`}
                />
              )}
              
              {activeFilters[filter.id] && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleClearFilter(filter.id)}
                  className="h-6 px-2 text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 