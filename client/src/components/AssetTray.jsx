import React, { useState, useEffect } from "react";
import logo from "/app/images/logo.png";
import mobile_logo from "/app/images/480_logo.png";

const Navbar = ({
  setDrawer2,
  drawer2,
  setDrawer1,
  tabImages,
  toggleTab,
  setWhoIsActive,
  selectedTabs,
  toggleTabSelection,
  tabs,
  setinfoSelectedAsset,
  onSelectAsset,
  openDrawer,
  closeDrawer,
}) => {
  const [hovered, setHovered] = useState(false);
  const [mobileTrayVisible, setMobileTrayVisible] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);

  // Handle window resize to detect mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const selectAsset = (asset) => {
    closeDrawer();
    onSelectAsset(asset);
  };

  const statusColors = {
    poweringon: "black",
    poweredoff: "grey",
    unmanaged: "yellow",
    ready: "green",
    error: "red",
  };

  const infoClicked = (asset) => {
    onSelectAsset(null);
    setinfoSelectedAsset(asset);
    openDrawer();
  };

  const toggleMobileTray = () => {
    setMobileTrayVisible((prev) => !prev);
  };

  const handleLayerClick = () => {
    if (isMobileView) {
      toggleMobileTray();
    }
  };

  const handleMouseEnter = () => {
    if (!isMobileView) {
      setHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobileView) {
      setHovered(false);
    }
  };

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <img
          src={isMobileView ? mobile_logo : logo}
          alt="Company Logo"
          className="logo-img"
        />
      </div>

      <div
        className="layer1"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleLayerClick}
      >
        Layers {hovered || mobileTrayVisible ? "▲" : "▼"}
      </div>

      <div
        className={`asset-tray ${
          (hovered || mobileTrayVisible) && "show"
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="tabs">
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={`tab ${selectedTabs.includes(tab) ? "active" : ""}`}
              onClick={() => {
                toggleTab(tab);
                toggleTabSelection(tab);
                setWhoIsActive(selectedTabs.includes(tab) ? null : tab);
                if (drawer2) {
                  onSelectAsset(null);
                  setDrawer2(false);
                }
                if (selectedTabs.length !== 1) setDrawer1(true);
              }}
            >
              <img src={tabImages[index]} alt={tab} className="tab-image" />
              <span className="tab-name">{tab}</span>
            </div>
          ))}
        </div>
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
};

export default Navbar;