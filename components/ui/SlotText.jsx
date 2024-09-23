import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const styles = {
  slotMachineRecipeMask: {
    width: '80px',
    height: '80px',
    overflow: 'hidden',
    position: 'relative',
    display: 'inline-block',
  },
  slotMachineRecipeItemsContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    transition: 'top 0.5s ease-in-out',
  },
  slotMachineRecipeItem: {
    minHeight: '80px',
    maxHeight: '80px',
    margin: 0,
    padding: 0,
    backgroundSize: 'contain',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

const wordImages = {
  'Gumtree.com': '/gumtree.png',
  'Freecycle.org': '/freecycle.png',
  'Preloved.co.uk': '/preloved.png',
  'Facebook': '/facebook.png',
  'Ebay': '/ebay.png',
  'Preworm': '/preworn.webp',
};

function buildSlotItem(imageSrc, altText) {
  return (
    <div
      key={altText}
      className='min-h-[80px] max-h-[80px] m-0 p-0 bg-contain flex items-center justify-center'
    > 
      <Image
        src={imageSrc}
        alt={altText}
        width={80}
        height={80}
        style={{ objectFit: 'contain' }}
      />
    </div>
  );
}

function SlotText() {
  const [items, setItems] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const initializeItems = () => {
      const allItems = [...Object.entries(wordImages)];
      setItems(allItems.map(([altText, imageSrc]) => buildSlotItem(imageSrc, altText)));
    };

    initializeItems();

    const intervalId = setInterval(() => {
      animate();
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  const resetPosition = () => {
    if (containerRef.current) {
      containerRef.current.style.transition = 'none';
      containerRef.current.style.top = '0';
      setTimeout(() => {
        containerRef.current.style.transition = 'top 0.5s ease-in-out';
      }, 20);
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
      const newTop = `-${80}px`;
      containerRef.current.style.top = newTop;

      setTimeout(() => {
        rotateContents();
      }, 500);
    }
  };

  return (
    <div className='mx-auto flex px-2 my-auto'>
      <div style={styles.slotMachineRecipeMask}>
        <div
          ref={containerRef}
          style={styles.slotMachineRecipeItemsContainer}
          className='grayscale brightness-0 contrast-200'
        >
          {items}
        </div>
      </div>
    </div>
  );
}

export default SlotText;