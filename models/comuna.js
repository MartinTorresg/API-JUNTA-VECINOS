const { Schema, model } = require("mongoose");

const ComunaSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    region: {
        type: Schema.Types.ObjectId,
        ref: "Region", // Hace referencia al modelo de Región
        required: true
    }
});

module.exports = model("Comuna", ComunaSchema, "comunas");
