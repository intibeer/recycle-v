// lib/algolia.ts
import algoliasearch from 'algoliasearch';

export const searchClient = algoliasearch(
  "LCJ8YL7RLE",
  "ec319a204d0b72f8d17a4611a96aaa46"
);

export const ALGOLIA_INDEX_NAME = 'used-objects'