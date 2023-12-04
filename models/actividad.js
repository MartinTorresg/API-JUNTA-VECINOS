const { Schema, model } = require("mongoose");

const estadosValidos = ['pendiente', 'aprobada', 'cancelada'];

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
        type: Number,
        required: true
    },
    estado: {
        type: String,
        enum: estadosValidos,
        default: 'pendiente'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = model("Actividad", ActividadSchema, "actividades");
                      // articulos 