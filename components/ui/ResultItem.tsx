import { MapPin, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Marketplaces,
  ResultItem as ResultItemType,
} from "@/hooks/used-object-search";

type ResultItemProps = {
  item: ResultItemType;
  marketplaces: Marketplaces;
};

export function ResultItem({ item, marketplaces }: ResultItemProps) {
  // Open the item URL in a new tab
  const handleNavigateToItem = () => {
    window.open(item.url, '_blank', 'noopener,noreferrer');
  };

  // Format the date if available
  const formattedDate = item.date ? new Date(item.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }) : null;

  // Format price function
  const formatPrice = () => {
    // If price is already a number, just format it
    if (typeof item.price === "number") {
      return item.price === 0 ? "Free" : `£${Math.round(item.price)}`;
    }

    // If price is a string
    if (typeof item.price === "string") {
      // Check for 'Free' or empty string
      if (!item.price || item.price.toLowerCase() === "free") {
        return "Free";
      }

      // Remove pound signs and try to parse
      const cleanPrice = item.price.replace(/£/g, "").trim();
      const parsedPrice = parseFloat(cleanPrice);

      // If we can parse it to a number
      if (!isNaN(parsedPrice)) {
        return parsedPrice === 0
          ? "Free"
          : `£${Math.round(parsedPrice)}`;
      }
    }

    // Default case if we can't parse the price
    return "Free";
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200"
      onClick={handleNavigateToItem}
    >
      <div className="relative">
        <div className="w-full h-48 overflow-hidden">
          <img
            src={item.image_url ? item.image_url : "/placeholder.svg"}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>
        
        {formatPrice() === "Free" ? (
          <Badge className="absolute top-2 left-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-1">
            FREE
          </Badge>
        ) : (
          <Badge className="absolute top-2 left-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1">
            {formatPrice()}
          </Badge>
        )}
        
        {item.distance && (
          <Badge className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-900 text-white px-2 py-1">
            {`${Math.round(item.distance)} km`}
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 h-14">{item.name}</h3>
        
        <div className="flex flex-col space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-gray-500" />
            <span className="truncate">{item.location}</span>
          </div>
          
          {formattedDate && (
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              <span>{formattedDate}</span>
            </div>
          )}
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
          <img
            src={`/${marketplaces[item.site]?.logo}`}
            alt={item.site}
            className="h-5"
          />
          <span className="text-xs text-gray-500">{item.site}</span>
        </div>
      </CardContent>
    </Card>
  );
}