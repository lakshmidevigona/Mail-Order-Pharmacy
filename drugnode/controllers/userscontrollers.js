const User = require("../models/users");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const DeliveryBoy = require("../models/delieveryboy");

const getAllUsers = async (req, res) => {
    try {
        let users = await User.find();
        if (users && users.length > 0) {
            return res.status(200).send(users);
        } else {
            return res.status(204).send({ message: "No Users" });
        }
    } catch (err) {
        return res.status(500).send(err);
    }
}
const createUser = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user in the User table
        const user = new User({
            username,
            email,
            password: hashedPassword,
            role
        });
        const savedUser = await user.save();

        // If the role is "delivery boy", add to the DeliveryBoy table as well
        if (role === "deliveryboy") {
            const deliveryBoy = new DeliveryBoy({
                name: username,
                email,
                deliveryCount: 0// Default to 0 on creation
            });
            await deliveryBoy.save();
        }

        res.status(201).send(savedUser);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};


const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        let user = await User.findOne({ email });

        // If user is not found, send error response
        if (!user) {
            return res.status(400).send({ message: 'Invalid Credentials. User not found.' });
        }
        console.log(user)

        // Compare the password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            // Create a token based on user's email and role
            const token = await jwt.sign(
                { email: user.email, role: user.role },  // Include email and role in the payload
                process.env.SECRET_KEY,  // Use your secret key from the environment variable
                { expiresIn: '1h', algorithm: 'HS512' }  // Set expiration and algorithm
            );

            // Send success response with token
            res.status(200).send({
                email: user.email,
                role: user.role,
                token: token,
                message: "Logged in Successfully"
            });
        } else {
            // Password doesn't match
            res.status(400).send({ message: 'Invalid Credentials. Incorrect password.' });
        }
    } catch (err) {
        // Send error response
        res.status(500).send({ message: err.message });
    }
}


module.exports = {
    createUser,
    getAllUsers,
    login
};
