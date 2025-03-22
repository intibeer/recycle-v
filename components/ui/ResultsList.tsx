import { useState, useEffect } from 'react';
import { ResultItem } from '@/components/ui/ResultItem';
import { Marketplaces, ResultItem as ResultItemType } from '@/hooks/used-object-search';
import { Filter } from 'lucide-react';
import { SortDropdown } from '@/components/ui/SortDropdown';

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
  const [sortedResults, setSortedResults] = useState<ResultItemType[]>([]);
  
  // Update sorted results when results or sort option changes
  useEffect(() => {
    // Make a copy of the results to avoid mutating the original
    const newSortedResults = [...results];
    
    // Apply client-side sorting
    if (sortOption === 'price-low') {
      newSortedResults.sort((a, b) => {
        const priceA = parseFloat(a.price?.toString().replace(/[^0-9.]/g, '') || '0');
        const priceB = parseFloat(b.price?.toString().replace(/[^0-9.]/g, '') || '0');
        return priceA - priceB;
      });
    } else if (sortOption === 'price-high') {
      newSortedResults.sort((a, b) => {
        const priceA = parseFloat(a.price?.toString().replace(/[^0-9.]/g, '') || '0');
        const priceB = parseFloat(b.price?.toString().replace(/[^0-9.]/g, '') || '0');
        return priceB - priceA;
      });
    } else if (sortOption === 'date') {
      newSortedResults.sort((a, b) => {
        const dateA = new Date(a.date || 0).getTime();
        const dateB = new Date(b.date || 0).getTime();
        return dateB - dateA;
      });
    } else if (sortOption === 'distance' && results.some(item => item.distance !== undefined)) {
      newSortedResults.sort((a, b) => {
        const distanceA = a.distance || Infinity;
        const distanceB = b.distance || Infinity;
        return distanceA - distanceB;
      });
    }
    
    setSortedResults(newSortedResults);
  }, [results, sortOption]);

  // Handle sort change
  const handleSortChange = (newSortOption: string) => {
    console.log('Changing sort to:', newSortOption); // Debug log
    setSortOption(newSortOption);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading...</h3>
      </div>
    );
  }

  // Only show "No items found" when not loading and we have searched
  if (hasSearched && !loading && results.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No items found</h3>
        <p className="text-gray-500">
          {categoryName 
            ? `We couldn't find any ${categoryName} matching your search criteria.` 
            : "We couldn't find any items matching your search criteria."}
        </p>
        <p className="text-gray-500 mt-2">Try adjusting your search terms or filters.</p>
      </div>
    );
  }

  if (!hasSearched) {
    return null;
  }

  return (
    <div>
      {results.length > 0 && (
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center text-sm text-gray-600">
              <Filter size={16} className="mr-2" />
              <span>Sort by:</span>
            </div>
            <SortDropdown sortOption={sortOption} setSortOption={handleSortChange} />
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedResults.map((item) => (
          <ResultItem key={item.objectID} item={item} marketplaces={marketplaces} />
        ))}
      </div>
    </div>
  );
}