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
  "gifts-occasions": "Gifts & Occasions",
};

// List of words that should remain lowercase in titles
const minorWords = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "but",
  "by",
  "for",
  "in",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
]);

export const getIndexCategory = (urlCategory: string): string => {
  // First try the explicit mapping
  if (urlToCategoryMap[urlCategory]) {
    return urlToCategoryMap[urlCategory];
  }

  // Replace any non-alphabetic characters (except &) with spaces and split
  return urlCategory
    .replace(/[^a-zA-Z&]+/g, " ") // Replace any non-letter (except &) with space
    .split(" ")
    .filter((word) => word.length > 0) // Remove empty strings
    .map((word) => {
      if (word === "&") return "&"; // Keep & as is
      return word.charAt(0).toUpperCase() + word.toLowerCase().slice(1);
    })
    .join(" ");
};
