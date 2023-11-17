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
        required: true,
        enum: ["Por Revisar", "En Proceso", "Finalizado"], // Añadir más estados según sea necesario
        default: "Por Revisar"
    },
    fecha: {
        type: Date,
        default: Date.now
    }

});

module.exports = model("Proyecto", ProyectoSchema, "proyectos");
                      // articulos 