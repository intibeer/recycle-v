import { Suspense } from 'react';
import StreamingSearchContent from '@/components/StreamingSearchContent';

export default function StreamingSearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading search...</div>}>
      <StreamingSearchContent />
    </Suspense>
  );
} 