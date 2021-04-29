const mongoose = require("mongoose");

//Order schema
let OrderSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },

        trxID: {
            type: String,
        },
        delivery_status: {
            type: Boolean,
        },

        order: {
            type: [],
        },

        total_price: {
            type: Number,
        },
    },
    { timestamps: true }
);

let Order = (module.exports = mongoose.model("Order", OrderSchema));
