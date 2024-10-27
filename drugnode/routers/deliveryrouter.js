// routes/orderRoutes.js
const express = require('express');
const deliveryController = require('../controllers/deliverycontroller'); // Import the order controller
const router = express.Router();

// Fetch orders based on status and delivery boy's email
router.get('/', deliveryController.getOrders);

// Update order status
router.patch('/:id', deliveryController.updateOrderStatus);

module.exports = router;  
