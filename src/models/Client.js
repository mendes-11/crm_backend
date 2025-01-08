const mongoose = require("mongoose");

const Client = mongoose.model(
    "Client",
    new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['Prospect', 'Visitado', 'Negociação', 'Fechado'],
            default: 'Prospect',
        },
        visible: {
            type: Boolean,
            required: true
        },
        observations: [
            {
                note: String,
                date: {
                    type: Date,
                    default: Date.now
                },
            },
        ],
        properties: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Enterprise'
            },
        ]
    }, 
    { timestamps: true }
));

module.exports = Client;
