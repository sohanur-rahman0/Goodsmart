const mongoose = require("mongoose");

//Category schema
let CategorySchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        slug: {
            type: String,
        },
    },
    { timestamps: true }
);

let Category = (module.exports = mongoose.model("Category", CategorySchema));
