const { Schema, model } = require("mongoose");

const ReservaSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    espacio: {
        type: Schema.Types.ObjectId,
        ref: "Espacio",
        required: true
    },
    fechaInicio: {
        type: Date,
        required: true
    },
    fechaFin: {
        type: Date,
        required: true
    },
    costoTotal: {
        type: Number,
        required: true
    },
    estadoReserva: {
        type: String,
        enum: ['pendiente', 'confirmada', 'cancelada'],
        default: 'pendiente'
    },
    // Otras propiedades que consideres necesarias
});

module.exports = model("Reserva", ReservaSchema, "reservas");
