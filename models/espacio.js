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
    horariosDisponibles: [{
        inicio: {
            type: String, // o Date, si prefieres trabajar con objetos de fecha/hora
            required: true
        },
        fin: {
            type: String, // o Date
            required: true
        },
        reservado: {
            type: Boolean,
            default: false
        }
    }]
    // Otras propiedades que consideres necesarias
});

module.exports = model("Espacio", EspacioSchema, "espacios");
