import React, { useState } from 'react';
import ImageModal from './Modal'; // Adjust the import path as necessary

const CustomCard = ({ toggleDrawer2,setIsImageModalOpen, isDrawerOpen, setIsDrawerOpen, selectedServiceInfo, setSelectedServiceInfo, reset, setIsVisible, openDrawer, name, status, services, icon, itemImages }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  // const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const relode = () => {
    reset(1);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
    setIsVisible((prev) => !prev);
  };

  const handleRowClick = (index, serviceName) => {
    if (window.innerWidth > 768) {
      setSelectedRow(index);
      setSelectedServiceInfo(serviceName);
      setIsDrawerOpen(true);
    }
  };

  return (
    <div className="card">
      <button style={{ position: "absolute", border: "none", cursor: "pointer", top: "8px", left: "8px", fontSize: "1rem" }} onClick={relode}>↺ </button>
      <div className="header">
        <img style={(window.innerWidth < 768 && name.startsWith('Submarine')) ? { width: '80px' } : (name.startsWith('Submarine')) ? { width: '120px' } : {}} src={icon} onClick={() => { setSelectedRow(null); setSelectedServiceInfo(null) }} />
        <div className="header-content">
          <div></div>
          <h2 style={{ cursor: "pointer" }} onClick={() => { setSelectedRow(null); setSelectedServiceInfo(null) }}>{name}</h2>
          <div className='moreDetailsBtns' style={{ display: "flex", flexDirection: "column" }}>
            <button style={!name.startsWith('Submarine')?{display:"none"}:{}} onClick={() => setIsImageModalOpen(true)}>Show Diagrams</button>
            <button onClick={()=>{toggleDrawer2();setIsVisible(true);}}>More Details</button>
          </div>
        </div>
      </div>
      <div className="status">
        <span>Status:</span> <span className={`state-${status.toLowerCase()}`}>{status}</span>
      </div>
      <table className='custom_card_table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>State</th>
            <th>Url</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service, index) => (
            <tr key={index}
              style={{
                backgroundColor: selectedRow === index ? '#E0E0E0' : 'transparent',
              }}
              onClick={() => handleRowClick(index, service.name)}>
              <td style={{ cursor: 'pointer' }} onClick={() => { setSelectedServiceInfo(service.name); setIsDrawerOpen(true) }}>{service.name}</td>
              <td className={`state-${service.state.toLowerCase()}`}>{service.state}</td>
              <td>
                {service.url.startsWith('http') ? (
                  <a href={service.url} target="_blank" rel="noopener noreferrer">
                    {service.url}
                  </a>
                ) : (
                  service.url
                )}
              </td>
              <td>{service.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* {isImageModalOpen && (
        <ImageModal
          images={itemImages}
          onClose={() => setIsImageModalOpen(false)} // Close the modal without affecting the card
        />
      )} */}
    </div>
  );
};

export default CustomCard;