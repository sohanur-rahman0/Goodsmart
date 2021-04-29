const mongoose = require("mongoose");

//Product schema
let ProductSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        slug: {
            type: String,
        },

        desc: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            required: true,
        },

        image: {
            type: String,
        },
    },
    { timestamps: true }
);

let Product = (module.exports = mongoose.model("Product", ProductSchema));
