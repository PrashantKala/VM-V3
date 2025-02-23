import React, { useState, useEffect } from "react";
import AssetDrawer from "./AssetDrawer";
import Drawer from "./Drawer";

const CombinedDrawer = ({
  setDrawer1,
  toggleDrawer1,
  toggleDrawer2,
  drawer1,
  drawer2,
  seed,
  isDrawerOpen,
  selectedAsset,
  isVisible,
  openDrawer,
  isLeftDrawerOpen,
  openLeftDrawer,
  setSelectedAsset,
  closeLeftDrawer,
  selectedTabs, // Use selectedTabs instead of activeTab
  assets,
  toggleDisplay,
  closeDrawer,
  selectedServiceInfo,
  setIsDrawerOpen,
}) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isLeftDrawerOpen) {
      setDrawer1(true);
    } else {
      setDrawer1(false);
    }
  }, [isLeftDrawerOpen]);

  const DrawerToggleButton = ({ isOpen, toggle }) => (
    <button className={isOpen ? "drawer-close" : "drawer-open"} onClick={toggle}>
      {isDesktop ? (isOpen ? "<" : ">") : isOpen ? "v" : "^"}
    </button>
  );

  const LeftDrawerToggleButton = ({ isOpen, toggle }) => (
    <button className={isOpen ? "asset-drawer-close" : "asset-drawer-open"} onClick={toggle}>
      {isDesktop ? (isOpen ? "<" : ">") : isOpen ? "v" : "^"}
    </button>
  );

  const renderDrawerContent = () => {
    if (drawer1) {
      return selectedTabs.length > 0 ? (
        <AssetDrawer
          onSelectAsset={setSelectedAsset}
          closeLeftDrawer={closeLeftDrawer}
          selectedTabs={selectedTabs} // Pass selectedTabs
          assets={assets} // Pass assets
        />
      ) : (
        <h2>Please select a tab</h2>
      );
    }
    if (drawer2) {
      return selectedAsset ? (
        <Drawer
          key={seed}
          selectedServiceInfo={selectedServiceInfo}
          selectedAsset={selectedAsset}
        />
      ) : (
        <h2>Please select an asset</h2>
      );
    }
    return null;
  };

  return (
    <>
      <div className="buttons-container">
        <DrawerToggleButton
          isOpen={drawer2}
          toggle={() => {
            toggleDrawer2();
            setIsDrawerOpen((prev) => !prev);
          }}
        />
        <LeftDrawerToggleButton
          isOpen={drawer1}
          toggle={() => {
            toggleDrawer1();
            setIsDrawerOpen((prev) => !prev);
          }}
        />
      </div>

      {isDesktop || (!isDesktop && selectedAsset != null) ? (
        <div
          style={!isDesktop ? { display: isVisible ? "flex" : "none" } : {}}
          className={`drawer ${drawer1 || drawer2 ? "open" : ""}`}
        >
          {renderDrawerContent()}
        </div>
      ) : null}
    </>
  );
};

export default CombinedDrawer;