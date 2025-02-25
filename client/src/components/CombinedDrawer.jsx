import React, { useState, useEffect } from "react";
import AssetDrawer from "./AssetDrawer";
import Drawer from "./Drawer";
import asset_icon from "../images/assets_icon.png"
import properties_icon from "../images/properties_icon.png"

const CombinedDrawer = ({
  setDrawer1,
  toggleDrawer1,
  toggleDrawer2,
  drawer1,
  drawer2,
  seed,
  toggleTab,
  selectedAsset,
  isVisible,
  expandedTabs,
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
      {/* {isDesktop ? (isOpen ? "<" : ">") : isOpen ? "v" : "^"} */}
      <img src={asset_icon} style={{width:"20px"}} />
    </button>
  );

  const LeftDrawerToggleButton = ({ isOpen, toggle }) => (
    <button className={isOpen ? "asset-drawer-close" : "asset-drawer-open"} onClick={toggle}>
      {/* {isDesktop ? (isOpen ? "<" : ">") : isOpen ? "v" : "^"} */}
      <img src={properties_icon} style={{width:"20px"}} />
    </button>
  );

  const renderDrawerContent = () => {
    if (drawer1) {
      return selectedTabs.length > 0 ? (
        <AssetDrawer
        toggleTab={toggleTab}
          onSelectAsset={setSelectedAsset}
          closeLeftDrawer={closeLeftDrawer}
          selectedTabs={selectedTabs} // Pass selectedTabs
          assets={assets} // Pass assets
          expandedTabs={expandedTabs}
        />
      ) : (
        <h2 style={{margin:"auto"}} >Please select a tab</h2>
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
        <h2 style={{margin:"auto"}} >Please select an asset</h2>
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