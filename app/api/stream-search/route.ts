import { NextRequest } from 'next/server';


// Sample dummy data with more items
const dummyItems = [
  {
    objectID: '1',
    name: 'Vintage Wooden Chair',
    description: 'Beautiful vintage wooden chair in excellent condition',
    image_url: 'https://picsum.photos/id/1/300/200',
    url: 'https://example.com/item1',
    date: '2023-05-15',
    time_posted: '14:30',
    price: '45.00',
    href: 'https://example.com/item1',
    location: 'London',
    site: 'trashnothing.com',
    lat: 51.5074,
    lon: -0.1278,
    town: 'London',
    region: 'Greater London',
    country: 'United Kingdom',
    _geoloc: {
      lat: 51.5074,
      lng: -0.1278,
    },
  },
  {
    objectID: '2',
    name: 'IKEA Desk',
    description: 'IKEA desk in good condition, barely used',
    image_url: 'https://picsum.photos/id/2/300/200',
    url: 'https://example.com/item2',
    date: '2023-05-16',
    time_posted: '10:15',
    price: '30.00',
    href: 'https://example.com/item2',
    location: 'Manchester',
    site: 'trashnothing.com',
    lat: 53.4808,
    lon: -2.2426,
    town: 'Manchester',
    region: 'Greater Manchester',
    country: 'United Kingdom',
    _geoloc: {
      lat: 53.4808,
      lng: -2.2426,
    },
  },
  {
    objectID: '3',
    name: 'Bicycle',
    description: 'Mountain bike, needs new tires but otherwise good condition',
    image_url: 'https://picsum.photos/id/3/300/200',
    url: 'https://example.com/item3',
    date: '2023-05-17',
    time_posted: '16:45',
    price: '75.00',
    href: 'https://example.com/item3',
    location: 'Birmingham',
    site: 'trashnothing.com',
    lat: 52.4862,
    lon: -1.8904,
    town: 'Birmingham',
    region: 'West Midlands',
    country: 'United Kingdom',
    _geoloc: {
      lat: 52.4862,
      lng: -1.8904,
    },
  },
  {
    objectID: '4',
    name: 'Bookshelf',
    description: 'Wooden bookshelf, 5 shelves, good condition',
    image_url: 'https://picsum.photos/id/4/300/200',
    url: 'https://example.com/item4',
    date: '2023-05-18',
    time_posted: '09:30',
    price: '25.00',
    href: 'https://example.com/item4',
    location: 'Leeds',
    site: 'trashnothing.com',
    lat: 53.8008,
    lon: -1.5491,
    town: 'Leeds',
    region: 'West Yorkshire',
    country: 'United Kingdom',
    _geoloc: {
      lat: 53.8008,
      lng: -1.5491,
    },
  },
  {
    objectID: '5',
    name: 'Coffee Table',
    description: 'Glass coffee table, modern design',
    image_url: 'https://picsum.photos/id/5/300/200',
    url: 'https://example.com/item5',
    date: '2023-05-19',
    time_posted: '11:20',
    price: '50.00',
    href: 'https://example.com/item5',
    location: 'Glasgow',
    site: 'trashnothing.com',
    lat: 55.8642,
    lon: -4.2518,
    town: 'Glasgow',
    region: 'Scotland',
    country: 'United Kingdom',
    _geoloc: {
      lat: 55.8642,
      lng: -4.2518,
    },
  },
  {
    objectID: '6',
    name: 'Sofa',
    description: 'Three-seater sofa, blue fabric, very comfortable',
    image_url: 'https://picsum.photos/id/6/300/200',
    url: 'https://example.com/item6',
    date: '2023-05-20',
    time_posted: '13:45',
    price: '120.00',
    href: 'https://example.com/item6',
    location: 'Edinburgh',
    site: 'trashnothing.com',
    lat: 55.9533,
    lon: -3.1883,
    town: 'Edinburgh',
    region: 'Scotland',
    country: 'United Kingdom',
    _geoloc: {
      lat: 55.9533,
      lng: -3.1883,
    },
  },
  {
    objectID: '7',
    name: 'Dining Table',
    description: 'Wooden dining table with 4 chairs',
    image_url: 'https://picsum.photos/id/7/300/200',
    url: 'https://example.com/item7',
    date: '2023-05-21',
    time_posted: '09:15',
    price: '85.00',
    href: 'https://example.com/item7',
    location: 'Bristol',
    site: 'trashnothing.com',
    lat: 51.4545,
    lon: -2.5879,
    town: 'Bristol',
    region: 'South West England',
    country: 'United Kingdom',
    _geoloc: {
      lat: 51.4545,
      lng: -2.5879,
    },
  },
  {
    objectID: '8',
    name: 'Washing Machine',
    description: 'Bosch washing machine, 2 years old, good working condition',
    image_url: 'https://picsum.photos/id/8/300/200',
    url: 'https://example.com/item8',
    date: '2023-05-22',
    time_posted: '14:30',
    price: '150.00',
    href: 'https://example.com/item8',
    location: 'Liverpool',
    site: 'trashnothing.com',
    lat: 53.4084,
    lon: -2.9916,
    town: 'Liverpool',
    region: 'Merseyside',
    country: 'United Kingdom',
    _geoloc: {
      lat: 53.4084,
      lng: -2.9916,
    },
  },
  {
    objectID: '9',
    name: 'Microwave Oven',
    description: 'Samsung microwave, barely used',
    image_url: 'https://picsum.photos/id/9/300/200',
    url: 'https://example.com/item9',
    date: '2023-05-23',
    time_posted: '11:00',
    price: '40.00',
    href: 'https://example.com/item9',
    location: 'Newcastle',
    site: 'trashnothing.com',
    lat: 54.9783,
    lon: -1.6178,
    town: 'Newcastle upon Tyne',
    region: 'North East England',
    country: 'United Kingdom',
    _geoloc: {
      lat: 54.9783,
      lng: -1.6178,
    },
  },
  {
    objectID: '10',
    name: 'Desk Lamp',
    description: 'Adjustable desk lamp, LED bulb included',
    image_url: 'https://picsum.photos/id/10/300/200',
    url: 'https://example.com/item10',
    date: '2023-05-24',
    time_posted: '16:20',
    price: '15.00',
    href: 'https://example.com/item10',
    location: 'Cardiff',
    site: 'trashnothing.com',
    lat: 51.4816,
    lon: -3.1791,
    town: 'Cardiff',
    region: 'Wales',
    country: 'United Kingdom',
    _geoloc: {
      lat: 51.4816,
      lng: -3.1791,
    },
  },
];

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Define an interface for your items
interface Item {
  objectID: string;
  name: string;
  description: string;
  image_url: string;
  url: string;
  date: string;
  time_posted: string;
  price: string;
  href: string;
  location: string;
  site: string;
  lat: number;
  lon: number;
  town: string;
  region: string;
  country: string;
  _geoloc: {
    lat: number;
    lng: number;
  };
  distance?: number; // Make distance optional
}

// Update the fetchTrashNothingItems function to handle the new response format
async function fetchTrashNothingItems(query: string, userLat?: number, userLng?: number, radius?: number): Promise<Item[]> {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/trash-nothing`);
    url.searchParams.append('query', query);
    
    if (userLat && userLng) {
      url.searchParams.append('latitude', userLat.toString());
      url.searchParams.append('longitude', userLng.toString());
      url.searchParams.append('radius', (radius ? radius * 1000 : 10000).toString()); // Convert km to meters
    }
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      console.error('Error fetching from Trash Nothing API');
      return [];
    }
    
    const data = await response.json();
    
    // Transform Trash Nothing data to match your Item interface
    // The response format is different from what we expected before
    return data.posts.map((post: any) => ({
      objectID: post.post_id.toString(),
      name: post.title,
      description: post.content,
      image_url: post.photos && post.photos.length > 0 ? post.photos[0].url : '',
      url: post.url,
      date: post.date.split('T')[0], // Format date from ISO string
      time_posted: new Date(post.date).toLocaleTimeString(),
      price: '0.00', // Most items on Trash Nothing are free
      href: post.url,
      location: post.location_text || extractLocationFromTitle(post.title),
      site: 'trashnothing.com',
      lat: post.latitude,
      lon: post.longitude,
      town: extractLocationFromTitle(post.title),
      region: '',
      country: post.country || 'United Kingdom',
      _geoloc: {
        lat: post.latitude,
        lng: post.longitude,
      },
      // If we have user coordinates, calculate distance
      distance: userLat && userLng ? 
        calculateDistance(userLat, userLng, post.latitude, post.longitude) : 
        undefined
    }));
  } catch (error) {
    console.error('Error in fetchTrashNothingItems:', error);
    return [];
  }
}

// Helper function to extract location from title (many Trash Nothing posts include location in parentheses)
function extractLocationFromTitle(title: string): string {
  const locationMatch = title.match(/\(([^)]+)\)/);
  return locationMatch ? locationMatch[1] : '';
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') || '';
  const postcode = searchParams.get('postcode') || '';
  const radius = parseInt(searchParams.get('radius') || '10', 10);
  const sites = searchParams.get('sites')?.split(',') || [];
  
  // Get coordinates from postcode if provided
  let userLat: number | null = null;
  let userLng: number | null = null;
  
  if (postcode) {
    try {
      const postcodeResponse = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`);
      if (postcodeResponse.ok) {
        const postcodeData = await postcodeResponse.json();
        if (postcodeData.result) {
          userLat = postcodeData.result.latitude;
          userLng = postcodeData.result.longitude;
        }
      }
    } catch (error) {
      console.error('Error fetching postcode data:', error);
    }
  }

  // Create a new ReadableStream
  const stream = new ReadableStream({
    async start(controller) {
      // Send the response headers
      controller.enqueue('event: open\ndata: Connection established\n\n');

      // Filter items based on search query (simple contains check)
      let filteredItems = [...dummyItems];
      
      // If trashnothing.com is in the sites list, fetch real data
      if (sites.includes('trashnothing.com')) {
        try {
          const trashNothingItems = await fetchTrashNothingItems(
            query, 
            userLat || undefined, 
            userLng || undefined,
            radius
          );
          
          // Add the real items to our filtered items
          if (trashNothingItems.length > 0) {
            // Replace dummy items with real ones for trashnothing.com
            filteredItems = filteredItems.filter(item => item.site !== 'trashnothing.com');
            filteredItems = [...filteredItems, ...trashNothingItems];
          }
        } catch (error) {
          console.error('Error fetching Trash Nothing items:', error);
        }
      }
      
      if (query) {
        filteredItems = filteredItems.filter(item => 
          item.name.toLowerCase().includes(query.toLowerCase()) || 
          item.description.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      if (sites.length > 0) {
        filteredItems = filteredItems.filter(item => sites.includes(item.site));
      }
      
      // Add distance if we have user coordinates
      if (userLat !== null && userLng !== null) {
        filteredItems = filteredItems.map(item => {
          const distance = calculateDistance(
            userLat as number,
            userLng as number,
            item._geoloc.lat,
            item._geoloc.lng
          );
          
          return {
            ...item,
            distance
          };
        });
        
        // Filter by radius if specified
        if (radius > 0) {
          filteredItems = filteredItems.filter((item: Item) => 
            item.distance !== undefined && item.distance <= radius
          );
        }
      }

      // Simulate streaming by sending items with a delay
      for (let i = 0; i < filteredItems.length; i++) {
        const item = filteredItems[i];
        
        // Add artificial delay to simulate real-time streaming
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Send the item as a server-sent event
        controller.enqueue(`event: result\ndata: ${JSON.stringify(item)}\n\n`);
      }
      
      // Send completion event
      controller.enqueue(`event: complete\ndata: Search complete\n\n`);
      
      // Close the stream
      controller.close();
    }
  });

  // Return the stream as a response
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
} 