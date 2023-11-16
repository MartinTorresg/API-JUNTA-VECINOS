const {Schema, model} = require("mongoose");

const UserSchema = Schema({
    name: {
        type: String,
        required: true
    },
    surname: String,
    rut: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "role_user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = model("User", UserSchema, "users");