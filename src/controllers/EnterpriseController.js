const Enterprise = require('../models/Enterprise');

class EnterpriseController {

    static async registerEnterprise(req, res) {
        try {
            const { title, location, price, description, status } = req.body;

            if (!title || !price) {
                return res.status(400).json({ message: 'Title and price are mandatory!' });
            }

            const newEnterprise = new Enterprise({
                title,
                location,
                price,
                description,
                status
            });

            await newEnterprise.save();
            res.status(201).json({ message: 'Enterprise successfully registered', newEnterprise });
        } catch (error) {
            res.status(500).json({ message: 'Error registering enterprise', error: error.message });
        }
    }

    static async getAllEnterprises(req, res) {
        try {
            const enterprises = await Enterprise.find();
            res.status(200).json(enterprises);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching enterprises', error: error.message });
        }
    }

    static async getEnterpriseById(req, res) {
        try {
            const enterprise = await Enterprise.findById(req.params.id);
            if (!enterprise) {
                return res.status(404).json({ message: 'Enterprise not found!' });
            }
            res.status(200).json(enterprise);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching enterprise', error: error.message });
        }
    }

    static async updateEnterprise(req, res) {
        try {
            const enterprise = await Enterprise.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!enterprise) {
                return res.status(404).json({ message: 'Enterprise not found!' });
            }
            res.status(200).json({ message: 'Enterprise successfully updated', enterprise });
        } catch (error) {
            res.status(400).json({ message: 'Error updating enterprise', error: error.message });
        }
    }

    static async deleteEnterprise(req, res) {
        try {
            const enterprise = await Enterprise.findByIdAndDelete(req.params.id);
            if (!enterprise) {
                return res.status(404).json({ message: 'Enterprise not found!' });
            }
            res.status(200).json({ message: 'Enterprise successfully deleted!' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting enterprise', error: error.message });
        }
    }
}

module.exports = EnterpriseController;
