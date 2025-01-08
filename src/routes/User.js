const express = require("express");
const UserController = require("../controllers/UserController");
const router = express.Router();

router
    .post("/register", UserController.register)
    .post("/login", UserController.login)
    .get("/:id", UserController.getUser)
    .put("/:id", UserController.updateUser)
    .delete("/:id", UserController.deleteUser)

module.exports = router;
