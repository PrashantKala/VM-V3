import React, { useState, useRef } from 'react';

const ImageModal = ({ images, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scale, setScale] = useState(1); // State to manage zoom scale
  const [position, setPosition] = useState({ x: 0, y: 0 }); // State to manage image position
  const [isDragging, setIsDragging] = useState(false); // State to track if dragging is active
  const dragStartPos = useRef({ x: 0, y: 0 }); // Ref to store initial drag position

  // Handle scroll events for zooming
  const handleWheel = (event) => {
    event.preventDefault();
    const newScale = scale + event.deltaY * -0.01; // Adjust scale based on scroll direction
    setScale(Math.min(Math.max(0.5, newScale), 3)); // Limit scale between 0.5x and 3x
  };

  // Handle mouse down event to start dragging
  const handleMouseDown = (event) => {
    setIsDragging(true);
    dragStartPos.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    };
  };

  // Handle mouse move event to drag the image
  const handleMouseMove = (event) => {
    if (isDragging) {
      setPosition({
        x: event.clientX - dragStartPos.current.x,
        y: event.clientY - dragStartPos.current.y,
      });
    }
  };

  // Handle mouse up event to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
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
          <div
            onMouseDown={handleMouseDown} // Start dragging on mouse down
            onMouseMove={handleMouseMove} // Drag the image on mouse move
            onMouseUp={handleMouseUp} // Stop dragging on mouse up
            onMouseLeave={handleMouseUp} // Stop dragging if mouse leaves the area
            style={{
              cursor: isDragging ? 'grabbing' : 'grab', // Change cursor based on dragging state
            }}
          >
            <img
              src={images[activeIndex]}
              alt={`Image ${activeIndex + 1}`}
              style={{
                maxWidth: '60%',
                borderRadius: '4px',
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`, // Apply zoom scale and position
                transition: isDragging ? 'none' : 'transform 0.1s ease', // Smooth transition only when not dragging
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;