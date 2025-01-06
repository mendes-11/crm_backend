const mongoose = require("mongoose");

const user = mongoose.model(
    "user",
    new mongoose.Schema({
        name: {
            type: String,
            requerid: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
    },
    { timestamps: true }
));

module.exports = user;