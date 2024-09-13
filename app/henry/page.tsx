"use client"

import React, { useState, useEffect } from 'react';


export const title = 'Henry The Recycling Bear';
export const description =
  'Ask the Henry, the recycling bear a question about recycling.';

export default function IframeLoader() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This ensures the iframe is rendered only on the client
    setIsClient(true);
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      {isClient && (
        <iframe
          src="https://henry.recycle.co.uk"
          title="Henry The Recycling Bear"
          style={{ width: '100%', height: '100%', border: 'none' }}
          allowFullScreen
          
        />
      )}
    </div>
  );
}
