const { Schema, model } = require("mongoose");

const CertificadoSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    rut: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    region: {
        type: Schema.Types.ObjectId, // Cambiado para referenciar el modelo de Region
        ref: "Region",
        required: true
    },
    comuna: {
        type: Schema.Types.ObjectId, // Cambiado para referenciar el modelo de Comuna
        ref: "Comuna",
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

module.exports = model("Certificado", CertificadoSchema, "certificados");
