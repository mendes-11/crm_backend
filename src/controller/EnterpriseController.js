const Enterprise = require('../model/Enterprise');
const Client = require('../model/Client');  // Caso queira associar o empreendimento ao cliente


class EnterpriseController{
    static async registerEnterprise(req, res) {
        try {
            const enterprise = new Enterprise(req.body);
            await enterprise.save();
            res.status(201).json(enterprise);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    static async getAllEnterprises(req, res){
        try {
            const enterprises = await Enterprise.find().populate('client');
            res.status(200).json(enterprises);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    static async getEnterpriseById(req, res){
        try {
            const enterprise = await Enterprise.findById(req.params.id).populate('client');
            if (!enterprise) {
                return res.status(404).json({ message: 'Empreendimento não encontrado' });
            }
            res.status(200).json(enterprise);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    
    static async updateEnterprise(req, res){
        try {
            const enterprise = await Enterprise.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!enterprise) {
                return res.status(404).json({ message: 'Empreendimento não encontrado' });
            }
            res.status(200).json(enterprise);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };
    
    static async deleteEnterprise(req, res){
        try {
            const enterprise = await Enterprise.findByIdAndDelete(req.params.id);
            if (!enterprise) {
                return res.status(404).json({ message: 'Empreendimento não encontrado' });
            }
            res.status(200).json({ message: 'Empreendimento deletado com sucesso' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    
}
module.exports = EnterpriseController;

