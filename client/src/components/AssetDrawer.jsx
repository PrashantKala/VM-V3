import React, { useState } from "react";

const AssetDrawer = ({ toggleTab, onSelectAsset, selectedTabs, assets, expandedTabs }) => {
  const statusColors = {
    poweringon: "black",
    poweredoff: "grey",
    unmanaged: "yellow",
    ready: "green",
    error: "red",
  };



  const selectAsset = (asset) => {
    onSelectAsset(asset);
  };

  return (
    <div className="left-drawer-content">
      {selectedTabs.map((tab) => (
        <div className="asset-dropdown" key={tab}>
          {/* Tab header with click handler to toggle dropdown */}
          <h2 onClick={() => toggleTab(tab)} style={{ cursor: "pointer" }}>
            {tab} {expandedTabs[tab] ? "▲" : "▼"}
          </h2>
          {/* Dropdown content */}
          {expandedTabs[tab] && (
            <div className="category-container">
              {assets[tab]?.map(({ category, items }) => (
                <div key={category} className="asset-category">
                  <h3 className="category-title">{category}</h3>
                  <div className="asset-items">
                    {items.map((asset) => (
                      <div className="asset-items-holder" key={asset.name}>
                        <div className={`asset-card ${asset.status}`}>
                          <div className={`status-dot ${statusColors[asset.status]}`}></div>
                          <img
                            style={
                              window.innerWidth < 768 && asset.name.startsWith("Submarine")
                                ? { width: "60px" }
                                : {}
                            }
                            src={asset.icon}
                            alt={asset.name}
                            className="asset-icon"
                            onClick={() => selectAsset(asset)}
                          />
                        </div>
                        <div className="asset-name">{asset.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AssetDrawer;