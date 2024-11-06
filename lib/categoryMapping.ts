// utils/categoryMapping.ts
export const urlToCategoryMap: Record<string, string> = {
    "baby-kids": "Baby & Kids",
    "sports-leisure": "Sports & Leisure",
    "home-decor": "Home Décor",
    "garden-outdoor": "Garden & Outdoor",
    "home-improvement": "Home Improvement",
    "clothing-footwear": "Clothing & Footwear",
    "home-appliances": "Home Appliances",
    "travel-luggage": "Travel & Luggage",
    "collectibles-memorabilia": "Collectibles & Memorabilia",
    "toys-games": "Toys & Games",
    "books-media": "Books & Media",
    "office-supplies": "Office Supplies",
    "gifts-occasions": "Gifts & Occasions"
  };
  
  export const getIndexCategory = (urlCategory: string): string => {
    // First try the explicit mapping
    if (urlToCategoryMap[urlCategory]) {
      return urlToCategoryMap[urlCategory];
    }
  
    // Fallback to transformation
    return urlCategory
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };