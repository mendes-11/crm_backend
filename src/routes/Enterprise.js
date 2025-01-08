const express = require("express");
const EnterpriseController = require("../controllers/EnterpriseController")
const router = express.Router();

router
    .post('/enterprises', EnterpriseController.registerEnterprise)
    .get('/enterprises', EnterpriseController.getAllEnterprises)       
    .get('/enterprises/:id', EnterpriseController.getEnterpriseById)
    .put('/enterprises/:id', EnterpriseController.updateEnterprise)
    .delete('/enterprises/:id', EnterpriseController.deleteEnterprise)
    

module.exports = router;