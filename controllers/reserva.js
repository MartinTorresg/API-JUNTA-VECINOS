// reservasController.js
const Reserva = require('../models/reserva'); // Asegúrate de tener este modelo creado
const Espacio = require('../models/espacio');

// Crear una nueva reserva
const crearReserva = async (req, res) => {
    try {
        // Aquí iría la lógica para verificar la disponibilidad antes de crear la reserva
        const nuevaReserva = new Reserva(req.body);
        await nuevaReserva.save();
        res.status(201).json({ mensaje: 'Reserva creada con éxito', reserva: nuevaReserva });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear la reserva", error });
    }
};

// Listar reservas de un usuario
const listarReservasPorUsuario = async (req, res) => {
    try {
        const reservas = await Reserva.find({ usuario: req.params.userId }).populate('espacio');
        res.status(200).json(reservas);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener las reservas", error });
    }
};

// Cancelar una reserva
const cancelarReserva = async (req, res) => {
    try {
        const reservaCancelada = await Reserva.findByIdAndUpdate(req.params.id, { estadoReserva: 'cancelada' }, { new: true });
        if (!reservaCancelada) {
            return res.status(404).json({ mensaje: 'Reserva no encontrada' });
        }
        res.status(200).json({ mensaje: 'Reserva cancelada con éxito', reserva: reservaCancelada });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al cancelar la reserva", error });
    }
};

const listarTodasLasReservas = async (req, res) => {
    try {
        const reservas = await Reserva.find().populate('usuario').populate('espacio');
        res.status(200).json(reservas);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener las reservas", error });
    }
};

module.exports = {
    crearReserva,
    listarReservasPorUsuario,
    cancelarReserva,
    listarTodasLasReservas
};
