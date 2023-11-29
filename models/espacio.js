const { Schema, model } = require("mongoose");

const EspacioSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    costoPorHora: {
        type: Number,
        required: true
    },
    horariosDisponibles: {
        type: Map,
        of: Boolean, // Puede ser un mapa que indica la disponibilidad por horas/días
        required: true
    },
    // Otras propiedades que consideres necesarias
});

module.exports = model("Espacio", EspacioSchema, "espacios");
