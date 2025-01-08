const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { cpf } = require('cpf-cnpj-validator');
const User = require("../models/User");

class UserController {
    static async register(req, res) {
        try {
            const { name, email, password, confirmPassword, birthDate, cpf } = req.body;

            const requiredFields = ["name", "email", "password", "confirmPassword", "birthDate", "cpf"];
            for (let field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(400).json({ message: `${field} is required` });
                }
            }

            if (!isValidEmail(email)) return res.status(400).json({ message: "Invalid email" });
            const emailExist = await User.findOne({ email: email });
            if (emailExist) return res.status(422).json({ message: "Email already registered" });

            if (!cpf.isValid(cpf)) return res.status(400).json({ message: "Invalid cpf" });
            if (password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match" });

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                name,
                email,
                password: hashedPassword,
                birthDate,
                cpf
            });

            await newUser.save();
            res.status(201).send({ message: "User successfully registered" });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Error registering user", error: error.message });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
    
            if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
    
            const user = await User.findOne({ email: email });
            if (!user) return res.status(404).json({ message: "User not found" });
    
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) return res.status(401).json({ message: "Invalid password" });
    
            const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: 86400 });
    
            res.status(200).json({ message: "Login successful", token});
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error during login", error: error.message });
        }
    }


    static async getUser(req, res) {
        const { id } = req.params;
        try {
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User not found" })
            res.status(200).json(user);
        } catch (error) {
            return res.status(500).send({ message: "Error fetching user", error: error.message });
        }

    }

    static async updateUser(req, res) {
        const { id } = req.params;
        const updateFields = req.body;

        try {

            if (!id) return res.status(400).json({ message: "User ID is required for update" });

            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User not found" });
            Object.keys(updateFields).forEach(key => {
                user[key] = updateFields[key];
            });

            await user.save();

            res.status(200).json({ message: "User successfully updated", updatedUser: user });

        } catch (error) {
            res.status(500).send({ message: "Error updating user", error: error.message });
        }
    }


    static async deleteUser(req, res) {
        const { id } = req.params;
        try {
            const userID = await User.findById(id);
            if (!userID) return res.status(404).json({ message: "User not found" });

            await User.findByIdAndDelete(id);
            res.status(201).send({ message: "User deleted", userID });

        } catch (error) {
            return res.status(500).send({ message: "Error deleting user", error: error.message });
        }
    }
}

module.exports = UserController;

function isValidEmail(email) {
    return email.includes('@');
}