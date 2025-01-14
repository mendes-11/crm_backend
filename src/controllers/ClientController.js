const Client = require("../models/Client");
const Enterprise = require('../models/Enterprise');

class ClientController {

    static async findClientById(id, res) {
        const client = await Client.findById(id).populate('properties');
        if (!client) {
            res.status(404).json({ message: 'Client not found!' });
            return null;
        }
        return client;
    }

    static async registerClient(req, res) {
        try {
            const { name, email, phone, status, observations, properties } = req.body;
            const requiredFields = ["name", "email", "phone", "status", "observations", "properties"];
            
            for (let field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(400).json({ message: `${field} is mandatory!` });
                }
            }

            const newClient = new Client({
                name,
                email,
                phone,
                status,
                visible: true,
                observations,
                properties
            });

            await newClient.save();
            res.status(201).send({ message: 'Client successfully registered' });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Error registering client', error: error.message });
        }
    }

    static async getAllClients(req, res) {
        try {
            const clients = await Client.find().populate('properties');
            res.status(200).json(clients);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching clients', error: error.message });
        }
    }

    static async getClientById(req, res) {
        try {
            const client = await ClientController.findClientById(req.params.id, res);
            if (client) res.status(200).json(client);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching client', error: error.message });
        }
    }

    static async updateClient(req, res) {
        try {
            const client = await Client.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!client) {
                return res.status(404).json({ message: 'Client not found!' });
            }
            res.status(200).json(client);
        } catch (error) {
            res.status(400).json({ message: 'Error updating client', error: error.message });
        }
    }

    static async deleteClient(req, res) {
        try {
            const client = await Client.findByIdAndDelete(req.params.id);
            if (!client) {
                return res.status(404).json({ message: 'Client not found!' });
            }
            res.status(200).json({ message: 'Client successfully deleted!' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting client', error: error.message });
        }
    }

    static async addObservation(req, res) {
        const { id } = req.params;
        const { note } = req.body;

        try {
            const client = await ClientController.findClientById(id, res);
            if (client) {
                client.observations.push({ note });
                await client.save();
                res.status(200).json(client);
            }
        } catch (error) {
            res.status(500).json({ message: 'Error adding observation', error: error.message });
        }
    }

    static async associateEnterprise(req, res) {
        const { clientId, enterpriseId } = req.params;

        try {
            const client = await Client.findById(clientId);
            const enterprise = await Enterprise.findById(enterpriseId);

            if (!client || !enterprise) {
                return res.status(404).json({ message: 'Client or enterprise not found' });
            }

            client.properties.push(enterpriseId);
            enterprise.client = clientId;

            await client.save();
            await enterprise.save();

            res.status(200).json({ message: 'Enterprise successfully associated', client });
        } catch (error) {
            res.status(500).json({ message: 'Error associating enterprise', error: error.message });
        }
    }

    static async removeObservation(req, res) {
        const { id, observationId } = req.params;
    
        try {
            const client = await ClientController.findClientById(id, res);
            if (client) {
                client.observations = client.observations.filter(obs => obs._id.toString() !== observationId);
                await client.save();
                res.status(200).json({ message: 'Observation successfully removed', client });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error removing observation', error: error.message });
        }
    }
    
    static async removeEnterprise(req, res) {
        const { clientId, enterpriseId } = req.params;
    
        try {
            const client = await Client.findById(clientId);
            const enterprise = await Enterprise.findById(enterpriseId);
    
            if (!client || !enterprise) {
                return res.status(404).json({ message: 'Client or enterprise not found' });
            }
    
            client.properties = client.properties.filter(
                prop => prop.toString() !== enterpriseId
            );
            enterprise.client = null;
    
            await client.save();
            await enterprise.save();
    
            res.status(200).json({ message: 'Enterprise successfully dissociated' });
        } catch (error) {
            res.status(500).json({ message: 'Error dissociating enterprise', error: error.message });
        }
    }
}

module.exports = ClientController;