const mongoose = require("mongoose");

//User schema
let UserSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },

        password: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
            required: true,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        admin: {
            type: Number,
        },
    },
    { timestamps: true }
);

let User = (module.exports = mongoose.model("User", UserSchema));
