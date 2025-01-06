const express = require("express");
const client = require("../src/routes/Client");

module.exports = function (app) {
    app.use(express.json())
        .use("/client", client)
        //.use("/investments", enterprise)
}