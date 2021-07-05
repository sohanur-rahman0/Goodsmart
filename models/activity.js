const mongoose = require("mongoose");

//Activity schema
let ActivitySchema = mongoose.Schema(
    {
        username: {
            type: String,
            trim: true,
        },

        type: {
            type: String,
            trim: true,
            required: true,
        },

        description: {
            type: String,
            trim: true,
            required: true,
        }
    },
    { timestamps: true }
);

let Activity = (module.exports = mongoose.model("Activity", ActivitySchema));
