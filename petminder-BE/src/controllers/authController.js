const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const existingUser = await userModel.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const userId = await userModel.createUser(username, email, hashedPassword, role);

        if (role === 'owner') {
            await userModel.createOwnerRow(userId);
          } else if (role === 'minder') {
            await userModel.createMinderRow(userId);
        }        

        res.status(201).json({ userId });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}; 

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        console.log("JWT_SECRET:", process.env.JWT_SECRET);
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const { password: _, ...userWithoutPassword } = user;
        res.status(200).json({ token, user: userWithoutPassword });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        await userModel.updatePassword(user.id, hashedPassword);

        res.status(200).json({ message: "Password updated successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

