const { Schema, model } = require("mongoose");

const ActividadSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    hora: {
        type: String
    },
    lugar: {
        type: String,
        required: true
    },
    cupo: {
        type: String,
        required: true
    }
});

module.exports = model("Actividad", ActividadSchema, "actividades");
                      // articulos 