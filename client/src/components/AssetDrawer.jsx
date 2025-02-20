import React from 'react';

const AssetDrawer = ({closeLeftDrawer,onSelectAsset, activeTab, selectedTab }) => {
  const statusColors = {
    poweringon: "black",
    poweredoff: "grey",
    unmanaged: "yellow",
    ready: "green",
    error: "red",
  };

  const selectAsset = (asset) => {
    // closeLeftDrawer()
    onSelectAsset(asset);
  };

  return (
    <div className="left-drawer-content">
      <h2>{activeTab}</h2>
        <div className="category-container">
          {selectedTab?.map(({ category, items }) => (
            <div key={category} className="asset-category">
              <h3 className="category-title">{category}</h3>
              <div className="asset-items">
                {items.map((asset) => (
                  <div className="asset-items-holder" key={asset.name}>
                    <div className={`asset-card ${asset.status}`}>
                      <div className={`status-dot ${statusColors[asset.status]}`}></div>
                      <img
                        style={window.innerWidth < 768 && asset.name.startsWith('Submarine') ? { width: '60px' } : {}}
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
    </div>
  );
};

export default AssetDrawer;