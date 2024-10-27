import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DeliveryDashboard.css';

export const DeliveryDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const email = location.state?.email;
    const [orders, setOrders] = useState([]);
    const [acceptedOrders, setAcceptedOrders] = useState([]);
    const [showOrders, setShowOrders] = useState(false);
    const [showAcceptedOrders, setShowAcceptedOrders] = useState(false);

    useEffect(() => {
        if (!email) {
            console.error('Email not provided.');
        }
    }, [email]);

    const fetchOrders = async (email) => {
        try {
            const response = await axios.get(`http://localhost:3000/delivery?status=Ordered&deliveryBoyEmail=${email}`);
            console.log(response)
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const fetchAcceptedOrders = async (email) => {
        try {
            const response = await axios.get(`http://localhost:3000/delivery?status=Accepted&deliveryBoyEmail=${email}`);
            setAcceptedOrders(response.data);
        } catch (error) {
            console.error('Error fetching accepted orders:', error);
        }
    };

    const handleViewOrders = () => {
        fetchOrders(email);
        setShowOrders(true);
        setShowAcceptedOrders(false); // Hide accepted orders when viewing orders
    };

    const handleCheckStatus = () => {
        fetchAcceptedOrders(email);
        setShowAcceptedOrders(true);
        setShowOrders(false); // Hide regular orders when checking status
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await axios.patch(`http://localhost:3000/delivery/${orderId}`, { status: newStatus });
            if (newStatus === 'Accepted') {
                fetchOrders(email);
            } else {
                fetchAcceptedOrders(email);
            }
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    return (
        <div className="dashboard-container">
            <h1>Delivery Dashboard</h1>
            <div className="button-container">
                <button className='dashboardbutton' onClick={() => navigate('/user')}>Home</button>
                <button  className='dashboardbutton' onClick={handleViewOrders}>View Orders</button>
                <button  className='dashboardbutton'  onClick={handleCheckStatus}>Check Status</button>
            </div>

            {showOrders && (
                <>
                    <h2>Orders</h2>
                    {orders.length > 0 ? (
                        <div className="orders-list">
                            {orders.map(order => (
                                <div key={order._id} className="order-item">
                                    <p>{`Order ID: ${order._id}`}</p>
                                    <p>{`Email: ${order.userEmail}`}</p>
                                    <p>{`Address: ${order.userAddress}`}</p>
                                    <button className="dashboardbutton" onClick={() => updateOrderStatus(order._id, 'Accepted')}>✔️ Accept</button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No orders to display.</p>
                    )}
                </>
            )}

            {showAcceptedOrders && (
                <>
                    <h2>Accepted Orders</h2>
                    {acceptedOrders.length > 0 ? (
                        <div className="accepted-orders-list">
                            {acceptedOrders.map(order => (
                                <div key={order._id} className="order-item">
                                    <p>{`Order ID: ${order._id}`}</p>
                                    <p>{`Email: ${order.userEmail}`}</p>
                                    <p>{`Address: ${order.userAddress}`}</p>
                                    <button className="dashboardbutton" onClick={() => updateOrderStatus(order._id, 'Delivered')}>✅ Deliver</button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No accepted orders to display.</p>
                    )}
                </>
            )}
        </div>
    );
};
