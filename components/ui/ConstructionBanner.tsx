import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ConstructionBanner = () => {
  return (
    <div className="bg-custom-green text-white py-2 text-center font-medium relative">
      <div className="container mx-auto px-4 flex items-center justify-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        <p>Site Under Construction, check back soon.</p>
      </div>
    </div>
  );
};

export default ConstructionBanner; 