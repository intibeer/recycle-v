import { MapPin, ExternalLink } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Marketplaces, ResultItem as ResultItemType } from '@/hooks/used-object-search';

type ResultItemProps = {
  item: ResultItemType;
  marketplaces: Marketplaces;
};

export function ResultItem({ item, marketplaces }: ResultItemProps) {
  const handleGetItem = () => {
    if (item.href) {
      window.open(item.href, '_blank');
    } else {
      console.error("URL not found for item", item);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
          <div className="relative">
            <img
              src={item.image_url ? item.image_url : '/placeholder.svg'}
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
                {
                  isNaN(parseFloat(item.price)) || item.price === '0' || item.price === '0.00' || parseFloat(item.price) === 0 
                    ? 'Free' 
                    : `£${Math.round(parseFloat(item.price.replace(/£/g, '')))}`
                }
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
                className="pr-2 h-6 grayscale contrast-200 brightness-0 "
              />
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{item.name}</DialogTitle>
          <DialogDescription>
            <div className="mt-2 space-y-2">
              <img src={item.image_url} alt={item.name} className="w-full h-48 object-cover rounded-md" />
              <p>{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xl tracking-tighter extra-bold">
                  {
                    isNaN(parseFloat(item.price)) || item.price === '0' || item.price === '0.00' || parseFloat(item.price) === 0 
                      ? 'Free' 
                      : `£${Math.round(parseFloat(item.price.replace(/£/g, '')))}`
                  }
                </span>
                <img 
                  src={`/${marketplaces[item.site]?.logo}`} 
                  alt={item.site} 
                  className="h-6"
                />
              </div>
              <div className="flex items-center text-base text-gray-500">
                <MapPin className="w-4 h-4 mr-1" />
                {item.location} {item.distance && `(${Math.round(item.distance)} km)`}
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Button onClick={handleGetItem} className="w-full text-white font-bold">
            Get
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}