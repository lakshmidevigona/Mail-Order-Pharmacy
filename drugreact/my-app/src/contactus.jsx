// ContactUs.jsx
import React from 'react';
import './contactus.css';

export function ContactUs() {
    return (
        <div className="contactus">
            <h2>Contact Us</h2>
            <p>We’d love to hear from you! Reach out to us through the following:</p>

            <div className="contact-details">
                <div className="contact-item">
                    <h3>Email Us</h3>
                    <p>support@capsulecart.com</p>
                    <p>info@capsulecart.com</p>
                </div>

                <div className="contact-item">
                    <h3>Call Us</h3>
                    <p>Customer Support: +1-555-123-4567</p>
                    <p>Admin Office: +1-555-987-6543</p>
                </div>
            </div>
        </div>
    );
}
