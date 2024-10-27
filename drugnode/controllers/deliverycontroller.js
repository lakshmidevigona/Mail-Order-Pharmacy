const Order = require('../models/order');
const nodemailer = require('nodemailer');

// Configure Nodemailer (replace with your email service provider settings)
const transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., 'gmail', 'outlook', etc.
    auth: {
        user: '21kb1a0552@nbkrist.org', // your email
        pass: '21kb1a0552' // your email password or app-specific password
    }
});

// Fetch orders based on status and delivery boy's email
exports.getOrders = async (req, res) => {
    const { status, deliveryBoyEmail } = req.query;
    console.log(status);
    console.log(deliveryBoyEmail)
    try {
        const orders = await Order.find({ status, deliveryBoyEmail });
        console.log(orders);
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching orders.', error: error.message });
    }
};

// Send confirmation email
const sendConfirmationEmail = async (userEmail, orderId, drugName) => {
    const mailOptions = {
        from: '21kb1a0552@nbkrist.org',
        to: userEmail,
        subject: 'Order Confirmation',
        text: `Your order with ID ${orderId} for the drug "${drugName}" has been accepted and is being processed.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }
        // If the order status is updated to "Accepted", send the confirmation email
        if (status === 'Accepted') {
            // Assuming 'drugName' is a field in your Order model
            await sendConfirmationEmail(order.userEmail, order._id, order.drugName);
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status.', error: error.message });
    }
};
