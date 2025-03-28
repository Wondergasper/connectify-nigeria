
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

interface ProviderCardProps {
  provider: {
    id: string;
    name: string;
    photo: string;
    rating: number;
    price: string;
    category: string;
    location: string;
  };
}

const ProviderCard = ({ provider }: ProviderCardProps) => {
  return (
    <Link to={`/provider/${provider.id}`} className="block">
      <div className="provider-card">
        <div className="flex">
          <div className="w-20 h-20 mr-4">
            <img 
              src={provider.photo} 
              alt={provider.name} 
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{provider.name}</h3>
            <p className="text-connectify-mediumGray text-sm">{provider.category}</p>
            <p className="text-connectify-mediumGray text-sm">{provider.location}</p>
            <div className="flex items-center mt-1">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="ml-1 text-sm font-medium">{provider.rating}</span>
              </div>
              <span className="mx-2 text-connectify-mediumGray">•</span>
              <span className="text-sm font-medium text-connectify-darkGray">{provider.price}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProviderCard;
