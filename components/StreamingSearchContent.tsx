'use client';

import { useSearchParams } from 'next/navigation';
import StreamingSearch from '@/components/ui/StreamingSearch';

export default function StreamingSearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const postcode = searchParams.get('postcode') || '';
  const radius = searchParams.get('radius') ? parseInt(searchParams.get('radius') || '10') : 10;
  const sites = searchParams.get('sites')?.split(',') || ['trashnothing.com'];

  return (
    <StreamingSearch 
      query={query}
      postcode={postcode}
      radius={radius}
      sites={sites}
    />
  );
} 