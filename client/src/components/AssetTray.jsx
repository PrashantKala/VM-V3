import React, { useState } from "react";
import logo from "/app/images/logo.png";
import mobile_logo from "/app/images/480_logo.png";

const Navbar = ({setDrawer2,drawer2, setDrawer1,tabImages, toggleTab, setWhoIsActive, selectedTabs, toggleTabSelection, tabs, setinfoSelectedAsset, onSelectAsset, openDrawer, closeDrawer }) => {
  const [hovered, setHovered] = useState(false);

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

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <img src={window.innerWidth > 768 ? logo : mobile_logo} alt="Company Logo" className="logo-img" />
      </div>

      <div
        className="layer1"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        Layers {hovered ? "▲" : "▼"}
      </div>

      <div
        className={`asset-tray ${hovered ? "show" : ""}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="tabs">
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={`tab ${selectedTabs.includes(tab) ? "active" : ""}`}
              onClick={() => {
                toggleTab(tab)
                toggleTabSelection(tab);
                setWhoIsActive(selectedTabs.includes(tab) ? null : tab);
                if(drawer2) {
                  onSelectAsset(null)
                  setDrawer2(false)
                }
                if (selectedTabs.length !== 1) setDrawer1(true);
                // console.log(selectedTabs)
              }}
            >
            <img src={tabImages[index]} alt={tab} className="tab-image" />


              <span className="tab-name">{tab}</span>
            </div>
          ))}
        </div>
      </div>

      <button className={`logout-button`} onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default Navbar;