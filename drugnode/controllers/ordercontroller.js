// controllers/orderController.js
const  Order  = require('../models/order');
const DeliveryBoy =require('../models/delieveryboy')
const nodemailer = require('nodemailer');

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '21kb1a0552@nbkrist.org',
        pass: '21kb1a0552'
    }
});
const  placeOrder = async (req, res) => {
    try {
        const { drug, user } = req.body;

        // Find the delivery boy with the fewest deliveries
        const deliveryBoy = await DeliveryBoy.findOne().sort({ deliveryCount: 1 });
        
        if (!deliveryBoy) {
            return res.status(404).json({ success: false, message: "No delivery boys available." });
        }
     // Create the order in the database
        const newOrder = await Order.create({
            drugName: drug.drugName,
            userEmail: user.email,
            userAddress: user.address,
            deliveryBoyEmail: deliveryBoy.email,
            cost:drug.Cost
        });

        // Update the delivery boy's delivery count
        await deliveryBoy.updateOne({ $inc: { deliveryCount: 1 } });

        // Send email notification to the delivery boy
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: deliveryBoy.email,
            subject: 'New Order Assigned',
            text: `Hello ${deliveryBoy.name}, a new order has been assigned to you. Please check your dashboard for details.`
        };
        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: "Order placed and delivery boy notified." });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ success: false, message: "Error placing order." });
    }
};


// Controller function to get all orders
const getAllOrders = async (req, res) => {
    try {
        // Fetch all orders from the database
        const orders = await Order.find({});
        
        // Send orders in response
        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({
            success: false,
            message: "Unable to fetch orders. Please try again later.",
            error: error.message
        });
    }
};

module.exports = {
    getAllOrders,
    placeOrder
};

