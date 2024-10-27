const express = require('express');
const router = express.Router();
const orderController = require('../controllers/ordercontroller');

// Route to place an order
router.post('/placeOrder', orderController.placeOrder);
router.get("/",orderController.getAllOrders)
module.exports = router;