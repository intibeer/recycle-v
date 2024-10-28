import algoliasearch from "algoliasearch";

const client = algoliasearch('LCJ8YL7RLE', 'ec319a204d0b72f8d17a4611a96aaa46');
const index = client.initIndex("used-objects");
import { ResultItem } from "@/hooks/used-object-search"; // Import the ResultItem type


export async function fetchItemsByTypeAndLocation(type: string, location: string): Promise<ResultItem[]> {
  const response = await index.search(type, {
    hitsPerPage: 100,
    filters: `location:"${location}"`,
  });
  
  // Map the response to ensure it fits the ResultItem structure
  return response.hits.map((hit: any) => ({
    objectID: hit.objectID,
    name: hit.name || "", // Default to empty string if undefined
    description: hit.description || "",
    image_url: hit.image_url || "",
    url: hit.url || "",
    date: hit.date || "",
    time_posted: hit.time_posted || "",
    price: hit.price || "",
    href: hit.href || "",
    location: hit.location || "",
    site: hit.site || "",
    lat: hit.lat || 0,
    lon: hit.lon || 0,
    town: hit.town || "",
    region: hit.region || "",
    country: hit.country || "",
    _geoloc: hit._geoloc || { lat: 0, lng: 0 }, // Use _geoloc to match the ResultItem type
    distance: hit.distance || 0, // Optional property
  }));
}
// New function to fetch items by location only
export async function fetchItemsByLocation(location: string): Promise<ResultItem[]> {
  const response = await index.search("", { // Empty query to fetch all items in the location
    hitsPerPage: 100,
    filters: `location:"${location}"`, // Correctly using template literals
  });
  console.log('location searching for ',location)
  console.log('response log')
  console.log(response)
  // Map the response to fit the ResultItem structure
  return response.hits.map((hit: any) => ({
    objectID: hit.objectID,
    name: hit.name || "",
    description: hit.description || "",
    image_url: hit.image_url || "",
    url: hit.url || "",
    date: hit.date || "",
    time_posted: hit.time_posted || "",
    price: hit.price || "",
    href: hit.href || "",
    location: hit.location || "",
    site: hit.site || "",
    lat: hit.lat || 0,
    lon: hit.lon || 0,
    town: hit.town || "",
    region: hit.region || "",
    country: hit.country || "",
    _geoloc: hit._geoloc || { lat: 0, lng: 0 },
    distance: hit.distance || 0,
  }));
}

/*
export interface ResultItem {
  objectID: string;          // Unique identifier for the item
  name: string;              // Name of the item
  description: string;       // Description of the item
  image_url: string;         // URL of the item's image
  url: string;               // Link to the item
  date: string;              // Date when the item was posted
  time_posted: string;       // Timestamp of when the item was added
  price: string;             // Price of the item
  href: string;              // Another link related to the item
  location: string;          // Geographical location of the item
  site: string;              // Site or platform where the item is listed
  lat: number;               // Latitude for geolocation
  lon: number;               // Longitude for geolocation
  town: string;              // Town name
  region: string;            // Region name
  country: string;           // Country name
  _geoloc: {                 // Geolocation object
    lat: number;             // Latitude
    lng: number;             // Longitude
  };
  distance?: number;         // Optional distance from a reference point
}
*/