import React, { useEffect, useState, useRef } from 'react';
import Navbar from './AssetTray';
import MapBox from './MapBox';
import Drawer from './Drawer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Chatbot from './Chatbot';
import AssetDrawer from './AssetDrawer';
import CombinedDrawer from './CombinedDrawer';
import { io } from "socket.io-client";

const checkAndClearExpiredData = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - parsedUser.timestamp;

    if (timeDifference > 600000) {
      localStorage.removeItem('user');
      console.log("Stored data expired and was removed from localStorage");
    }
  }
};

const Homepage = () => {
  const [drawer1, setDrawer1] = useState(false);
  const [drawer2, setDrawer2] = useState(false);
  const [isCustomCard, setIsCustomCard] = useState(false);
  const [whoIsActive, setWhoIsActive] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [seed, setSeed] = useState(1);
  const [resetCall, setResetCall] = useState(0);
  const [selectedServiceInfo, setSelectedServiceInfo] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [infoSelectedAsset, setinfoSelectedAsset] = useState(false);
  const [closing, setClosing] = useState(false);
  const [selectedTabs, setSelectedTabs] = useState([]);
  const [tabs,setTabs]=useState([]);
  const [assets, setAssets] = useState({});
  const [isAssetChanged, setAssetChange] = useState(null);
  const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState(false);
  const count = useRef(0);
  const [tabImages,setTabImages]=useState([])

  const socket = io('https://geocybermind.com', {path: '/bot/socket.io/',transports: ['websocket', 'polling']});

  const fetchData = async () => {
    try {
      const response = await axios.get("/assets.json");
      setAssets(response.data.asset);
      setTabImages(response.data.assetImages);
      setAssetChange(response.data.change);
      setTabs(Object.keys(response.data.asset));
    } catch (error) {
      console.error("Error fetching assets data:", error);
    }
  };
    
  useEffect(() => {
    fetchData(); // Initial fetch

    // Listen for asset updates from backend via Socket.IO
    socket.on("asset_update", (data) => {
      console.log("Received asset update:", data);
      setAssets(data.asset);
      setTabImages(data.assetImages);
      setAssetChange(data.change);
      setTabs(Object.keys(data.asset));
      if (count.current === 0) {
        count.current = 1;
      } else {
        reset(1);
      }
    });

    return () => {
      socket.off("asset_update"); // Cleanup on unmount
    };
  }, []);

  const toggleTabSelection = (tab) => {
    setSelectedTabs(prev => 
      prev.includes(tab) ? prev.filter(t => t !== tab) : [...prev, tab]
    );
    setIsLeftDrawerOpen(true);
  };

  const reset = (val) => {
    setResetCall(val);
    setSelectedTabs([]);
    setSeed(Math.random());
  };

  const toggleDisplay = () => {
    setIsVisible((prev) => !prev);
  };

  const navigate = useNavigate();

  useEffect(() => {
    checkAndClearExpiredData();
    if (!localStorage.user) {
      navigate('/login');
    }
  }, []);

  const openDrawer = () => {
    setIsVisible(true);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setIsVisible(null);
  };

  const openLeftDrawer = () => {
    setIsLeftDrawerOpen(true);
  };

  const closeLeftDrawer = () => {
    setIsLeftDrawerOpen(false);
  };

  const toggleDrawer2 = () => {
    // setIsVisible((prev)=>!prev)
    setDrawer2((prev) => !prev);
    setDrawer1(false);
  };
  const toggleDrawer1 = () => {
    // setIsVisible((prev)=>!prev)
    setDrawer1((prev) => !prev);
    setDrawer2(false);
  };
  const [expandedTabs, setExpandedTabs] = useState({});
  const toggleTab = (tab) => {
    setExpandedTabs((prev) => ({
      ...prev,
      [tab]: !prev[tab], // Toggle the expanded state
    }));
  };


  return (
    <>
      <Navbar 
      setDrawer1={setDrawer1}
      setDrawer2={setDrawer2}
      drawer2={drawer2}
        assets={assets} 
        isCustomCard={isCustomCard} 
        whoIsActive={whoIsActive} 
        setWhoIsActive={setWhoIsActive} 
        closing={closing} 
        selectedTabs={selectedTabs} 
        toggleTabSelection={toggleTabSelection} 
        tabs={tabs} 
        setinfoSelectedAsset={setinfoSelectedAsset} 
        selectedAsset={selectedAsset} 
        onSelectAsset={setSelectedAsset} 
        openDrawer={openDrawer} 
        closeDrawer={closeDrawer} 
        openLeftDrawer={openLeftDrawer} 
        tabImages={tabImages}
        toggleTab={toggleTab}
      />
      <MapBox 
        assets={assets} 
        setIsDrawerOpen={setIsDrawerOpen} 
        isVisible={isVisible} 
        isDrawerOpen={isDrawerOpen} 
        selectedServiceInfo={selectedServiceInfo} 
        setSelectedServiceInfo={setSelectedServiceInfo} 
        setIsCustomCard={setIsCustomCard} 
        isCustomCard={isCustomCard} 
        setWhoIsActive={setWhoIsActive} 
        whoIsActive={whoIsActive} 
        resetCall={resetCall} 
        setResetCall={setResetCall} 
        reset={reset} 
        key={seed} 
        setIsVisible={setIsVisible} 
        selectedTabs={selectedTabs} 
        toggleTabSelection={toggleTabSelection} 
        selectedAsset={selectedAsset} 
        onSelectAsset={setSelectedAsset} 
        openDrawer={openDrawer} 
        closeDrawer={closeDrawer} 
        toggleDrawer2={toggleDrawer2} 
      />
      <CombinedDrawer 
      setIsVisible={setIsVisible}
        setDrawer1={setDrawer1} 
        drawer1={drawer1} 
        drawer2={drawer2} 
        toggleDrawer1={toggleDrawer1} 
        toggleDrawer2={toggleDrawer2} 
        setIsDrawerOpen={setIsDrawerOpen} 
        seed={seed} 
        isDrawerOpen={isDrawerOpen} 
        selectedAsset={selectedAsset} 
        isVisible={isVisible} 
        openDrawer={openDrawer} 
        isLeftDrawerOpen={isLeftDrawerOpen} 
        openLeftDrawer={openLeftDrawer} 
        setSelectedAsset={setSelectedAsset} 
        closeLeftDrawer={closeLeftDrawer} 
        selectedTabs={selectedTabs} 
        assets={assets} 
        toggleDisplay={toggleDisplay} 
        closeDrawer={closeDrawer} 
        selectedServiceInfo={selectedServiceInfo} 
        toggleTab={toggleTab}
        expandedTabs={expandedTabs}
      />
      <Chatbot assets={assets} />
    </>
  );
};

export default Homepage;