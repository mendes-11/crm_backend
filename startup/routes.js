const express = require("express");
const client = require("../src/routes/Client");
const enterprise = require("../src/routes/Enterprise");

module.exports = function (app) {
    app.use(express.json())
        .use("/client", client)
        .use("/enterprise", enterprise)
}