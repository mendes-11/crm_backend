const express = require("express");
const router = express.Router();
const ClientController = require("../controller/ClientController")

router
    .post("/register", ClientController.registerClient)
    .get("/getClients", ClientController.getAllClients)
    .get("/:id", ClientController.getClientById)



module.exports = router;