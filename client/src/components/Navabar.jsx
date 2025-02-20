import React from "react";


export default function Navbar() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="navbar">
      {/* Left: Company Logo */}
      <div className="navbar-logo">
        <img
          src="public/images/logo.png" 
          alt="Company Logo"
          className="logo-img"
        />
      </div>

      {/* Right: Logout Button */}
      <button className="logout-button" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
}
