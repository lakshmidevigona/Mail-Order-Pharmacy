// models/Order.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import the uuid function

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        default: uuidv4, // Generate a new UUID by default
        unique: true // Ensure that the orderId is unique
    },
    drugName: {
        type: String,
        required: true
    },
    cost : 
    { type:Number,
        required:true},

    userEmail: {
        type: String,
        required: true
    },
    userAddress: {
        type: String,
        required: true
    },
    deliveryBoyEmail: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Ordered', // Initial status
        enum: ['Ordered', 'Accepted', 'Delivered'], // Possible statuses
    },
},
 { timestamps: true });



module.exports = mongoose.model('Order', orderSchema);
