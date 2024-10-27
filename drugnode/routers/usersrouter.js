const express = require("express");
const { createUser, getAllUsers,login } = require("../controllers/userscontrollers");
const User = require("../models/users");
const DeliveryBoy = require("../models/delieveryboy");
const {verifyToken} =require("../validators/validate")
const router = express.Router();

// Existing routes
router.post("/", createUser);
router.get("/", getAllUsers);

router.post("/login",login)
router.get("/verifyToken", verifyToken, (req, res) => {
    res.status(200).json({ success: true });
});

// Update user route with DeliveryBoy synchronization
router.put("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        const { username, email, password, role } = req.body; // Updated fields

        // If the user is a delivery boy, update DeliveryBoy table too
        if (user.role === "deliveryboy") {
            await DeliveryBoy.findOneAndUpdate(
                { email: user.email }, // Find delivery boy by old email
                { name: username, email }, // Update name and email
                { new: true, runValidators: true }
            );
        }

        // Update the user in the User table
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).send(updatedUser);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // If the role is "delivery boy", delete from DeliveryBoy table
        if (user.role === "deliveryboy") {
            await DeliveryBoy.findOneAndDelete({ email: user.email });
        }

        // Delete the user from the User table
        await User.findByIdAndDelete(req.params.id);

        res.status(200).send({ message: "User and associated delivery boy data deleted successfully" });
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;

