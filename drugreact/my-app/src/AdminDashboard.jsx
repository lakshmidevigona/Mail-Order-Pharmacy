// src/components/AdminDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaPills, FaTruck ,FaClipboardList } from 'react-icons/fa'; // Import icons
import '../src/AdminDashboard.css';


export const AdminDashboard = () => {
  const navigate = useNavigate();

  // Navigation handlers
  const goToHome = () => navigate('/user');
  const goToDrugs = () => navigate('/drugs');
  const goToDeliveryBoys = () => navigate('/deliver');
  const goToOrders=()=>navigate('/orders')

  return (
    <div className="admin-dashboard"> {/* Add a unique class here */}
      <h1 className="header">Admin Dashboard</h1>
      <div className="button-container">
        <button className="dashboard-button" onClick={goToHome}>
          <FaHome className="icon" /> Home
        </button>
        <button className="dashboard-button" onClick={goToOrders}>
          <FaClipboardList className="icon" /> View Orders
        </button>

        <button className="dashboard-button" onClick={goToDrugs}>
          <FaPills className="icon" /> Manage Drugs
        </button>

        <button className="dashboard-button" onClick={goToDeliveryBoys}>
          <FaTruck className="icon" /> Manage Delivery Boys
        </button>
    
      </div>
    </div>
  );
};
