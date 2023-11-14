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
        type: String,
        required: true
    },
    comuna: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

module.exports = model("Certificado", CertificadoSchema, "certificados");