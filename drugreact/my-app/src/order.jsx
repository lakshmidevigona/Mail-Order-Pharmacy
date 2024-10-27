import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import axios from 'axios';
import animationData from './animation/Animation.json';
import './order.css';

export const Order = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { drug } = location.state || {};
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state for button

    const handlePlaceOrder = async () => {
        if (!address || !phone || !email) {
            alert("Please fill in all details before placing the order.");
            return;
        }
        
        setLoading(true); // Set loading to true when request starts

        try {
            const response = await axios.post("http://localhost:3000/orders/placeOrder", {
                drug,
                user: {
                    address,
                    phone,
                    email,
                }
            });
            
            if (response.data.success) {
                setOrderPlaced(true);
                setTimeout(() => setOrderPlaced(false), 8000);
                setAddress("");
                setPhone("");
                setEmail("");
            } else {
                alert(response.data.message || "Error placing the order.");
            }
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Something went wrong while placing the order.");
        } finally {
            setLoading(false); // Set loading back to false after request completes
        }
    };

    const closePopup = () => {
        setOrderPlaced(false);
    };

    return (
        <div className="order-container">
            <h1 className="order-title">Order Details</h1>
            {drug ? (
                <div className="drug-details1">
                    <img src={`http://localhost:3000/${drug.image}`} alt={drug.drugName} className="drug-image1" />
                    <div className="details">
                        <h2>{drug.drugName}</h2>
                        <p><strong>Cost:</strong> {drug.Cost}</p>
                        <p><strong>Capsules Per Pack:</strong> {drug.CapsulesPerPack}</p>
                        <p><strong>Company:</strong> {drug.Company}</p>
                    </div>
                </div>
            ) : (
                <p>No drug details available.</p>
            )}

            <div className="address-section">
                <h3>Enter Your Delivery Address</h3>
                <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="address-input"
                    placeholder="Enter your address here..."
                />

                <h3>Phone Number</h3>
                <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="contact-input"
                    placeholder="Enter your phone number..."
                />

                <h3>Email Address</h3>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="contact-input"
                    placeholder="Enter your email address..."
                />
            </div>

            <button
                className="place-order-button"
                onClick={handlePlaceOrder}
                disabled={loading} // Disable button while loading
            >
                {loading ? "Placing Order..." : "Place Order"}
            </button>

            {orderPlaced && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <Link to="/user"><button onClick={closePopup} className="close-button1">X</button></Link>
                        <Lottie
                            animationData={animationData}
                            autoPlay={true}
                            loop={false}
                            style={{ width: 300, height: 300 }}
                        />
                        <p className="blast-text">Your order has been placed! A confirmation email will be sent shortly.</p>
                    </div>
                </div>
            )}

            <p style={{ color: "#555", marginTop: "20px" }}>Only Cash on Delivery available. No online payments.</p>
        </div>
    );
};
