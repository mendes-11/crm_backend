const Client = require("../model/Client");
const Enterprise = require('../model/Enterprise');;

class ClientController {
    static async registerClient(req, res) {
        try {

            const { name, email, phone, status, observations, properties } = req.body;

            const requiredFields = ["name", "email", "phone", "status", "observations", "properties"];
            for (let field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(400).json({ message: `${field} it is mandatory!` });
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
            res.status(201).send({ message: "Customer successfully registered" });

        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Error when registering customer", error: error.message });
        }
    };

    static async getAllClients(req, res) {
        try {
            const clients = await Client.find().populate('properties');
            res.status(200).json(clients);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    static async getClientById(req, res) {
        try {
            const client = await Client.findById(req.params.id).populate('properties');
            if (!client) {
                return res.status(404).json({ message: 'Cliente não encontrado' });
            }
            res.status(200).json(client);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    static async updateClient(req, res) {
        try {
            const client = await Client.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!client) {
                return res.status(404).json({ message: 'Cliente não encontrado' });
            }
            res.status(200).json(client);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    static async deleteClient(req, res) {
        try {
            const client = await Client.findByIdAndDelete(req.params.id);
            if (!client) {
                return res.status(404).json({ message: 'Cliente não encontrado' });
            }
            res.status(200).json({ message: 'Cliente deletado com sucesso' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    static async addObservation(req, res) {
        const { id } = req.params;
        const { note } = req.body;

        try {
            const client = await Client.findById(id);
            if (!client) {
                return res.status(404).json({ message: 'Cliente não encontrado' });
            }

            client.observations.push({ note });  // Adiciona uma nova observação
            await client.save();

            res.status(200).json(client);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    static async associateEnterprise(req, res) {
        const { clientId, enterpriseId } = req.params;

        try {
            const client = await Client.findById(clientId);
            const enterprise = await Enterprise.findById(enterpriseId);

            if (!client || !enterprise) {
                return res.status(404).json({ message: 'Cliente ou empreendimento não encontrado' });
            }

            // Associa o empreendimento ao cliente
            client.properties.push(enterpriseId);
            enterprise.client = clientId;

            await client.save();
            await enterprise.save();

            res.status(200).json({ message: 'Empreendimento associado com sucesso', client });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    static async removeObservation(req, res) {
        const { id, observationId } = req.params;
    
        try {
            const client = await Client.findById(id);
            if (!client) {
                return res.status(404).json({ message: 'Cliente não encontrado' });
            }
    
            client.observations = client.observations.filter(obs => obs._id.toString() !== observationId);
            await client.save();
    
            res.status(200).json({ message: 'Observação removida com sucesso', client });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    
    static async removeEnterprise(req, res) {
        const { clientId, enterpriseId } = req.params;
    
        try {
            const client = await Client.findById(clientId);
            const enterprise = await Enterprise.findById(enterpriseId);
    
            if (!client || !enterprise) {
                return res.status(404).json({ message: 'Cliente ou empreendimento não encontrado' });
            }
    
            client.properties = client.properties.filter(
                prop => prop.toString() !== enterpriseId
            );
            enterprise.client = null;
    
            await client.save();
            await enterprise.save();
    
            res.status(200).json({ message: 'Empreendimento desassociado com sucesso' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

}

module.exports = ClientController;