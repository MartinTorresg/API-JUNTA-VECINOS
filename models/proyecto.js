const { Schema, model } = require("mongoose");

const ProyectoSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        default: "por revisar"
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = model("Proyecto", ProyectoSchema, "proyectos");
                      // articulos 