const {Schema, model} = require("mongoose");

const InscripcionSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: String,
    run: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    fecha_nacimiento: {
        type: Date,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        enum: ['Aprobada', 'En Espera', 'Rechazada'],
        default: 'En Espera'
    }
});

module.exports = model("Inscripcion", InscripcionSchema, "inscripciones");