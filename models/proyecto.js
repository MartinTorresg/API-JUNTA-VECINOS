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
        enum: ["Por Revisar", "En Proceso", "Finalizado", "Rechazado"], // Añadir más estados según sea necesario
        default: "Por Revisar"
    },
    presupuesto: {
        type: Number,
        default: 0 // Valor por defecto es 0
    },
    presupuestoGastado: {
        type: Number,
        default: 0 // Valor por defecto es 0
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    archivos: [{
        nombre: { type: String, required: true },
        path: { type: String, required: true },
        mimetype: { type: String, required: true },
        size: { type: Number, required: true }
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

});

module.exports = model("Proyecto", ProyectoSchema, "proyectos");
                      // articulos 