// config/site.ts

type IconConfig = {
    icon: string;
    apple: string;
    other: {
      rel: string;
      url: string;
      color?: string;
    }[];
  };

export const siteConfig = {
  name: "Recycle UK",
  url: "https://recycle.co.uk",
  organization: {
    name: "Recycle UK",
    logo: "https://www.recycle.co.uk/_next/image?url=%2Flogo.png&w=128&q=75",
    socialMedia: {
      twitter: "https://twitter.com/yourhandle",
      facebook: "https://facebook.com/yourpage",
    }
  },
  search: {
    endpoint: "/search",
    apiEndpoint: "/api/search",
  },
  metadata: {
    title: "Recycle.co.uk | Used Item Search Engine",
description: "Find used objects from various marketplaces all at once.",
    keywords: ["second hand", "used items", "marketplace", "aggregator", "recycle items"],
  },
  contact: {
    email: "inti@recycle.co.uk",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
    other: [
      {
        rel: "mask-icon",
        url: "/icons/safari-pinned-tab.svg",
        color: "#5bbad5"
      },
      {
        rel: "icon",
        url: "/icons/favicon-32x32.png"
      },
      {
        rel: "icon",
        url: "/icons/favicon-16x16.png"
      }
    ]
  } satisfies IconConfig,
} as const;

// Type definitions for the config
export type SiteConfig = typeof siteConfig;

// Helper function to get full URLs
export const getFullUrl = (path: string): string => {
  const baseUrl = siteConfig.url.replace(/\/$/, '');
  const cleanPath = path.replace(/^\//, '');
  return `${baseUrl}/${cleanPath}`;
};

// Export commonly used combinations
export const schemaDefaults = {
  homepage: {
    siteName: siteConfig.name,
    siteUrl: siteConfig.url,
    organizationName: siteConfig.organization.name,
    logo: siteConfig.organization.logo,
    searchUrl: getFullUrl(siteConfig.search.endpoint),
  },
  // Add more preset configurations as needed
} as const;



// Helper to generate head metadata for icons
export const generateIconLinks = () => {
    const links = [
      { rel: "icon", href: siteConfig.icons.icon },
      { rel: "apple-touch-icon", href: siteConfig.icons.apple },
      ...siteConfig.icons.other.map(icon => ({
        rel: icon.rel,
        href: icon.url,
        ...(icon.color ? { color: icon.color } : {})
      }))
    ];
  
    return links;
  };

