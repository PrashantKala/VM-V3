import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import CustomCard from './CustomCard';
import { createRoot } from 'react-dom/client';
import ImageModal from './Modal';

function MapBox({
  toggleDrawer2,
  assets,
  setIsDrawerOpen,
  isVisible,
  isDrawerOpen,
  selectedServiceInfo,
  setSelectedServiceInfo,
  setIsCustomCard,
  setWhoIsActive,
  whoIsActive,
  setResetCall,
  resetCall,
  reset,
  setIsVisible,
  selectedTabs, // Add selectedTabs prop
  onSelectAsset,
  selectedAsset,
  openDrawer,
  closeDrawer,
}) {
  const [itemImages, setItemImages] = useState([]);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const initializeMap = () => {
    if (!mapRef.current) {
      const map = L.map('map', {
        minZoom: 3,
        maxZoom: 13,
        zoomControl: false,
        maxBounds: [
          [-90, -180],
          [90, 180],
        ],
        maxBoundsViscosity: 1.0,
      }).setView([39.8283, -98.5795], 4);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        noWrap: true,
      }).addTo(map);
    }
  };

  const createMarker = (item, map, key) => {
    if (!item.longitude || !item.latitude) return;

    const popupContent = document.createElement('div');
    popupContent.classList.add('popup-container');
    popupContent.innerHTML = `<div id="popup-${item.name.replace(/\s+/g, '-')}"></div>`;

    const statusColors = {
      poweringon: 'black',
      poweredoff: 'grey',
      unmanaged: 'yellow',
      ready: 'green',
      error: 'red',
    };
    const isError = item.status === 'error';
    const marker = L.marker([item.latitude, item.longitude], {
      icon: L.divIcon({
        html: `
          <div class="marker-wrapper">
            ${isError ? '<div class="radiation-effect"></div>' : ''}                    
            <div style="
              position: relative;
              background: ${item.name.startsWith('Submarine') ? 'transparent' : 'white'};
              border-radius: 50%; 
              width: 50px; 
              height: 50px; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              z-index: 10000;
            ">
              <img src="${item.icon}" style="z-index: 10000; width: ${item.name.startsWith('Submarine') ? '100px' : '40px'}; height: 40px; border-radius: 50%;" />
              <div style="
                position: absolute;
                top: -3px;
                left: -3px;
                width: 15px;
                height: 15px;
                border-radius: 50%;
                background-color: ${statusColors[item.status] || 'grey'};
                border: 2px solid white;
              "></div>
            </div>
            <div style="
              z-index: 100; 
              position: fixed; 
              bottom: -25px; 
              left: 70%; 
              border-radius: 0% 0% 50% 50%;  
              display: ${item.name.startsWith('Submarine') ? 'none' : 'flex'};
              width: 5px; 
              height: 20px; 
              background-color: white;
            "></div>
          </div>`,
        className: '',
        iconSize: [30, 30],
      }),
    }).addTo(map);

    marker.bindPopup(popupContent);
    markersRef.current[item.name] = marker;

    marker.on('popupopen', () => handlePopupOpen(item, key, marker));
    marker.on('popupclose', () => handlePopupClose(marker));
  };

  const addMarkers = (selectedTabs, assets, map) => {
    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    if (selectedTabs.length === 0) {
      // If no tabs are selected, show all assets
      for (const key in assets) {
        assets[key].forEach((category) => {
          category.items.forEach((item) => createMarker(item, map, key));
        });
      }
    } else {
      // Show assets for selected tabs
      selectedTabs.forEach((tab) => {
        if (assets[tab]) {
          assets[tab].forEach((category) => {
            category.items.forEach((item) => createMarker(item, map, tab));
          });
        }
      });
    }
  };

  const handlePopupOpen = (item, key, marker) => {
    setItemImages(item.images);
    const rootElement = document.getElementById(`popup-${item.name.replace(/\s+/g, '-')}`);
    if (rootElement) {
      const root = createRoot(rootElement);
      root.render(
        <CustomCard
          toggleDrawer2={toggleDrawer2}
          setIsImageModalOpen={setIsImageModalOpen}
          selectedServiceInfo={selectedServiceInfo}
          key={key}
          reset={reset}
          setIsVisible={setIsVisible}
          openDrawer={openDrawer}
          name={item.name}
          status={item.status}
          services={item.services}
          icon={item.icon}
          setSelectedServiceInfo={setSelectedServiceInfo}
          isDrawerOpen={isDrawerOpen}
          closeDrawer={closeDrawer}
          isVisible={isVisible}
          setIsDrawerOpen={setIsDrawerOpen}
        />
      );
      marker.reactRoot = root;
    }

    onSelectAsset(item);

    if (whoIsActive !== key) {
      setWhoIsActive(key);
    }

    setIsCustomCard(true);
  };

  const handlePopupClose = (marker) => {
    if (marker.reactRoot) {
      setTimeout(() => marker.reactRoot.unmount(), 500);
    }
    setIsCustomCard(false);
  };

  useEffect(() => {
    initializeMap();
    addMarkers(selectedTabs, assets, mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [selectedTabs, assets]); // Add selectedTabs to the dependency array

  useEffect(() => {
    if (selectedAsset && mapRef.current) {
      const marker = markersRef.current[selectedAsset.name];
      if (marker && resetCall) {
        closeDrawer();
        mapRef.current.setView([selectedAsset.latitude, selectedAsset.longitude], 13);
        marker.openPopup();
        setTimeout(() => {
          mapRef.current.panBy([0, window.innerWidth > 768 ? -210 : -50]);
        }, 1000);
        setResetCall(0);
      } else if (marker) {
        closeDrawer();
        mapRef.current.flyTo([selectedAsset.latitude, selectedAsset.longitude], 13, {
          animate: true,
          duration: 1,
        });
        marker.openPopup();
        setTimeout(() => {
          mapRef.current.panBy([0, window.innerWidth > 768 ? -210 : -150]);
        }, 1000);
      }
    }
  }, [selectedAsset]);

  return (
    <div className="app-container">
      <div id="map" className="map-container" />
      {isImageModalOpen && (
        <ImageModal
          images={itemImages}
          onClose={() => setIsImageModalOpen(false)}
        />
      )}
    </div>
  );
}

export default MapBox;