import React, { useState, useRef } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const ImageModal = ({ images, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scale, setScale] = useState(1); // State to manage zoom scale
  const imageRef = useRef(null); // Ref to the image element

  // Handle scroll events for zooming
  const handleWheel = (event) => {
    event.preventDefault();
    const newScale = scale + event.deltaY * -0.01; // Adjust scale based on scroll direction
    setScale(Math.min(Math.max(0.5, newScale), 3)); // Limit scale between 0.5x and 3x
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10000,
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        width: '90%',
        height: '90%',
        maxWidth: '1200px',
        maxHeight: '800px',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div>
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                style={{
                  marginRight: '10px',
                  padding: '5px 10px',
                  backgroundColor: activeIndex === index ? '#007bff' : '#f0f0f0',
                  color: activeIndex === index ? '#fff' : '#000',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Image {index + 1}
              </button>
            ))}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>
            &times;
          </button>
        </div>
        <div
          style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}
          onWheel={handleWheel} // Attach scroll event handler
        >
          <Zoom>
            <img
              ref={imageRef}
              src={images[activeIndex]}
              alt={`Image ${activeIndex + 1}`}
              style={{
                maxWidth: '100%',
                borderRadius: '4px',
                transform: `scale(${scale})`, // Apply zoom scale
                transition: 'transform 0.1s ease', // Smooth zoom transition
              }}
            />
          </Zoom>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;