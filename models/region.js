const { Schema, model } = require("mongoose");

const RegionSchema = Schema({
    nombre: {
        type: String,
        required: true
    }
});

module.exports = model("Region", RegionSchema, "regiones");
