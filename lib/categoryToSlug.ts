// utils/categoryUtils.ts

// Convert readable category name to URL-friendly slug
export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/\s*&\s*/g, '-and-') // Replace & with -and-
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '') // Remove any other special characters
    .replace(/-+/g, '-') // Replace multiple consecutive hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Convert URL-friendly slug back to readable category name
export function slugToCategory(slug: string): string {
  return slug
    .split('-')
    .map(word => {
      // Special case for "and"
      if (word.toLowerCase() === 'and') return '&';
      // Capitalize first letter of each word
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

// Type guard to ensure string is a valid category slug
export function isValidCategorySlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug);
}