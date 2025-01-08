const mongoose = require("mongoose");

const Enterprise = mongoose.model(
    "Enterprise",
    new mongoose.Schema({
        title: {
            type: String,
            required: true
        },
        location: String,
        price: Number,
        description: String,
        status: {
            type: String,
            enum: ['Disponível', 'Em Negociação', 'Vendido'],
            default: 'Disponível'
        },
       
    },
    { timestamps: true }
));


module.exports = Enterprise;
