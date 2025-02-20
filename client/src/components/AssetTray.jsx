import React, { useState,useEffect } from "react";
// import asset from "../assets.json";
import logo from "/images/logo.png"
import mobile_logo from "/images/480_logo.png"
import _ from 'lodash';
import axios from "axios";
const Navbar = ({assets, openLeftDrawer ,setWhoIsActive, activeTab, closeTab, closing, tabs,setinfoSelectedAsset,onSelectAsset, openDrawer,closeDrawer }) => {

  const [hovered, setHovered] = useState(false);


  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const selectAsset = (asset) => {
    // openDrawer();
    closeDrawer()
    onSelectAsset(asset);
  };

  const statusColors = {
    poweringon: "black",
    poweredoff: "grey",
    unmanaged: "yellow",
    ready: "green",
    error: "red",
  };

  const infoClicked=(asset)=>{
    console.log("clicked");
    onSelectAsset(null);
    setinfoSelectedAsset(asset);
    openDrawer();
    console.log("clicked");
  }


  return (
    <div className="navbar">
      <div className="navbar-logo">
        <img src={window.innerWidth>768?logo:mobile_logo} alt="Company Logo" className="logo-img" />
      </div>

      <div
        className="layer1"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        Layer-1 ▼
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
              className={`tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => {
                closeTab(tab);
                setWhoIsActive(activeTab === tab ? null : tab);
                if(activeTab===null)  openLeftDrawer()
              }}
            >
              <img src={`/images/${tab.toLowerCase()}.png`} alt={tab} className="tab-image" />
              <span className="tab-name">{tab}</span>
            </div>
          ))}
        </div>
      </div>


      <button  className={`logout-button`} onClick={handleLogout}>Log Out</button>

    </div>
  );
};

export default Navbar;