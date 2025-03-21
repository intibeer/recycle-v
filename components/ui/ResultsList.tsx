import { ResultItem } from './ResultItem';
import { SortDropdown } from './SortDropdown';
import { Marketplaces, ResultItem as ResultItemType } from '@/hooks/used-object-search';

type ResultsListProps = {
  loading: boolean;
  hasSearched: boolean;
  results: ResultItemType[];
  sortOption: string;
  setSortOption: (option: string) => void;
  marketplaces: Marketplaces;
  categoryName?: string;
};

export function ResultsList({
  loading,
  hasSearched,
  results,
  sortOption,
  setSortOption,
  marketplaces,
  categoryName
}: ResultsListProps) {
  // Filter out results without images
  const filteredResults = results.filter(item => item.image_url && item.image_url !== "/placeholder.svg");

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse">
          <img src="/placeholder.svg" width={120} height={120} alt="Loading..." className="opacity-70" />
        </div>
      </div>
    );
  }

  if (hasSearched && filteredResults.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">No results found :(</h2>
        <p className="text-gray-600 mb-4">Go again with a new search.</p>
      </div>
    );
  }

  if (filteredResults.length > 0) {
    return (
      <div className="space-y-4 pt-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">
            {categoryName ? categoryName : "Search Results"}
          </h2>
          <SortDropdown sortOption={sortOption} setSortOption={setSortOption} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {filteredResults.map((item) => (
            <ResultItem key={item.objectID} item={item} marketplaces={marketplaces} />
          ))}
        </div>
      </div>
    );
  }

  return null;
}