import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image'; // Import Next.js Image component

const styles = {
  slotMachineRecipeMask: {
    width: '100px',
    height: '100px',
    overflow: 'hidden',
    position: 'relative',
    display: 'inline-block',
  },
  slotMachineRecipeItemsContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    transition: 'top 0.5s ease-in-out', // Smooth transition
  },
  slotMachineRecipeItem: {
    minHeight: '100px',
    maxHeight: '100px',
    margin: 0,
    padding: 0,
    backgroundSize: 'contain',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

// Define image paths for each word
const wordImages = {
  'Gumtree.com': '/gumtree.png',
  'Freecycle.org': '/freecycle.png',
  'Preloved.co.uk': '/preloved.png',
  'Facebook': '/facebook.png',
  'Ebay': '/ebay.png',
};

function buildSlotItem(imageSrc, altText) {
  return (
    <div
      key={altText}
      className='min-h-[100px] max-h-[100px] m-0 p-0 bg-contain flex items-center justify-center'
    > 
      <Image
        src={imageSrc}
        alt={altText}
        width={100}
        height={100}
        style={{ objectFit: 'contain' }}
      />
    </div>
  );
}

function SlotText() {
  const [items, setItems] = useState([]);
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();

    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      const initializeItems = () => {
        const allItems = [...Object.entries(wordImages)];
        setItems(allItems.map(([altText, imageSrc]) => buildSlotItem(imageSrc, altText)));
      };

      initializeItems();

      const intervalId = setInterval(() => {
        animate();
      }, 2000);

      return () => clearInterval(intervalId);
    }
  }, [isMobile]); // Removed 'currentIndex' from dependencies

  const resetPosition = () => {
    if (containerRef.current) {
      containerRef.current.style.transition = 'none';
      containerRef.current.style.top = '0';
      setTimeout(() => {
        containerRef.current.style.transition = 'top 0.5s ease-in-out';
      }, 20); // Delay to reset the transition
    }
  };

  const rotateContents = () => {
    setItems(prevItems => {
      const newItems = [...prevItems.slice(1), prevItems[0]];
      return newItems;
    });
    resetPosition();
  };

  const animate = () => {
    if (containerRef.current) {
      const newTop = `-${100}px`; // Move by one item height (100px)
      containerRef.current.style.top = newTop;

      setTimeout(() => {
        rotateContents(); // After animation, reset the items
      }, 500); // Matches the CSS transition duration
    }
  };

  if (isMobile) {
    return null;
  }

  return (
    <div className='mx-auto flex px-4'>
      <div style={styles.slotMachineRecipeMask}>
        <div
          ref={containerRef}
          style={styles.slotMachineRecipeItemsContainer}
          className='sm:text-sm grayscale brightness-0 contrast-200'
        >
          {items}
        </div>
      </div>
    </div>
  );
}

export default SlotText;
