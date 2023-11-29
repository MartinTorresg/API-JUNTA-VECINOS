// reservasController.js
const Reserva = require('../models/reserva'); // Asegúrate de tener este modelo creado
const Espacio = require('../models/espacio');

// Crear una nueva reserva
const crearReserva = async (req, res) => {
    try {
        console.log("Ruta '/reservas' alcanzada");
        console.log("Datos recibidos para la reserva:", req.body);
        
        const nuevaReserva = new Reserva(req.body);
        console.log("ID del usuario para la reserva:", nuevaReserva.usuario);

        await nuevaReserva.save();
        res.status(201).json({ mensaje: 'Reserva creada con éxito', reserva: nuevaReserva });
    } catch (error) {
        console.error("Error al crear la reserva:", error);
        res.status(500).json({ mensaje: "Error al crear la reserva", error });
    }
};


// Listar reservas de un usuario
const listarReservasPorUsuario = async (req, res) => {
    try {
        console.log("Listando reservas para el usuario ID:", req.params.userId); // Mostrar el ID del usuario recibido

        const reservas = await Reserva.find({ usuario: req.params.userId }).populate('espacio');
        
        if (!reservas) {
            console.log("No se encontraron reservas para el usuario ID:", req.params.userId);
        } else {
            console.log(`Se encontraron ${reservas.length} reservas para el usuario ID: ${req.params.userId}`);
        }

        res.status(200).json(reservas);
    } catch (error) {
        console.error("Error al obtener las reservas:", error); // Mostrar el error en consola
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
