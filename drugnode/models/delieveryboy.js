const mongoose = require('mongoose');

const deliveryBoySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    deliveryCount: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('DeliveryBoy', deliveryBoySchema);
