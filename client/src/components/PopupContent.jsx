import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import CustomCard from './CustomCard';

const PopupContent = ({ item, key, selectedServiceInfo, setSelectedServiceInfo, reset, setIsVisible, openDrawer, closeDrawer, isDrawerOpen, setIsDrawerOpen, isVisible, onSelectAsset, setWhoIsActive, whoIsActive, closeTab, setIsCustomCard }) => {
  useEffect(() => {
    const rootElement = document.getElementById(`popup-${item.name.replace(/\s+/g, '-')}`);
    if (rootElement) {
      const root = createRoot(rootElement);
      root.render(
        <CustomCard
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

      return () => {
        root.unmount();
      };
    }
  }, [item, key, selectedServiceInfo, setSelectedServiceInfo, reset, setIsVisible, openDrawer, closeDrawer, isDrawerOpen, setIsDrawerOpen, isVisible]);

  return null;
};

export default PopupContent;