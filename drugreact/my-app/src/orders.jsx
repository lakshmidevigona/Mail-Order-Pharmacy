import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './orders.css';

export function Orders() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    // Fetch orders from API
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:3000/orders');
                console.log(response.data); // Check the structure of the response
                if (response.data.orders) {
                    setOrders(response.data.orders); // Ensure 'orders' exists in the response
                } else {
                    setError("No orders found.");
                }
            } catch (err) {
                setError("Error fetching orders. Please try again.");
                console.error(err);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div className="orders-container">
            <h2>Order List</h2>
            {error && <p className="error-message">{error}</p>}
            <table className="orders-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Delivery Boy Email</th>
                        <th>Drug Name</th>
                        <th>Drug Cost</th>
                        <th>User Email</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <tr key={order.orderId}>
                                <td>{order.orderId}</td>
                                <td>{order.deliveryBoyEmail}</td>
                                <td>{order.drugName}</td>
                                <td>{order.cost}</td>
                                <td>{order.userEmail}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No orders available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
