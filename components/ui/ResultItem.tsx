import { useRouter } from "next/navigation"; // Import Next.js router for client-side navigation
import { MapPin, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Marketplaces,
  ResultItem as ResultItemType,
} from "@/hooks/used-object-search";

type ResultItemProps = {
  item: ResultItemType;
  marketplaces: Marketplaces;
};

export function ResultItem({ item, marketplaces }: ResultItemProps) {
  const router = useRouter(); // Initialize the Next.js router

  // Navigate to the product-specific page on click
  const handleNavigateToItem = () => {
    router.push(`/item/${item.objectID}`); // Navigate to /item/[id] dynamically
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleNavigateToItem} // Attach click handler to the entire card
    >
      <div className="relative">
        <img
          src={item.image_url ? item.image_url : "/placeholder.svg"}
          alt={item.name}
          className="w-full h-48 object-cover"
        />
        {item.distance && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-base">
            {`${Math.round(item.distance)} km`}
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xl font-bold">
            {(() => {
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
            })()}
          </span>
        </div>
        <div className="flex items-center text-base text-gray-500">
          <MapPin className="w-4 h-4 mr-1" />
          {item.location}
        </div>
        <div className="mt-2 flex justify-end">
          <img
            src={`/${marketplaces[item.site]?.logo}`}
            alt={item.site}
            className="pr-2 h-6 grayscale contrast-200 brightness-0"
          />
        </div>
      </CardContent>
    </Card>
  );
}