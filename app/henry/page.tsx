"use client"

import React, { useState, useEffect } from 'react';


export default function Henry() {
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
