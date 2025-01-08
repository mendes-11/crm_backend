const express = require("express");
const ClientController = require("../controllers/ClientController")
const router = express.Router();

router
    .post("/clients", ClientController.registerClient)
    .get("/clients", ClientController.getAllClients)
    .get("/clients/:id", ClientController.getClientById)
    .put('/clients/:id', ClientController.updateClient)
    .delete('/clients/:id', ClientController.deleteClient)

    .post('/clients/:id/observations', ClientController.addObservation)
    .delete('/clients/:id/observations/:observationId', ClientController.removeObservation)

    .post('/clients/:clientId/enterprises/:enterpriseId', ClientController.associateEnterprise)
    .delete('/clients/:clientId/enterprises/:enterpriseId', ClientController.removeEnterprise)

module.exports = router;