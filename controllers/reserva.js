// reservaController.js

const Reserva = require('../models/reserva');
const Espacio = require('../models/espacio');

const crearReserva = async (req, res) => {
    const { usuarioId, espacioId, duracion, fecha, hora } = req.body;

    console.log('Inicio de la función crearReserva con los datos:', { usuarioId, espacioId, duracion, fecha, hora });

    try {
        console.log(`Buscando espacio con id: ${espacioId}`);
        const espacio = await Espacio.findById(espacioId);
        console.log('Espacio encontrado:', espacio);

        if (!espacio) {
            console.log('No se encontró un espacio con el id proporcionado.');
            return res.status(404).json({ message: "Espacio no encontrado" });
        }

        console.log('Verificando disponibilidad para la fecha y hora proporcionadas.');
        const esDisponible = espacio.horariosDisponibles.some(horario => {
            const disponible = !horario.reservado && horario.inicio <= hora && horario.fin >= hora;
            console.log(`Horario: ${horario.inicio} - ${horario.fin}, Disponible: ${disponible}`);
            return disponible;
        });

        if (!esDisponible) {
            console.log('El espacio no está disponible para la hora seleccionada.');
            return res.status(400).json({ message: "Espacio no disponible para la hora seleccionada" });
        }

        const fechaInicio = new Date(`${fecha}T${hora}`);
        const fechaFin = new Date(fechaInicio.getTime() + duracion * 60 * 60 * 1000);
        console.log(`Fecha de inicio: ${fechaInicio.toISOString()}, Fecha de fin: ${fechaFin.toISOString()}`);

        const reserva = new Reserva({
            usuario: usuarioId,
            espacio: espacioId,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin,
            costoTotal: duracion * espacio.costoPorHora,
        });

        console.log('Reserva creada (antes de guardar):', reserva);
        await reserva.save();
        console.log('Reserva guardada con éxito.');

        // Aquí necesitas una lógica para actualizar el subdocumento apropiado en "horariosDisponibles"
        // ...

        res.status(201).json(reserva);
    } catch (error) {
        console.error('Se ha producido un error al crear la reserva:', error);
        res.status(500).json({ message: "Error al crear la reserva", error });
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
        // Filtra solo las reservas confirmadas
        const reservasConfirmadas = await Reserva.find({ estadoReserva: 'confirmada' })
            .populate('usuario')
            .populate('espacio');

        // Calcula el total de ganancias de las reservas confirmadas
        const totalGanancias = reservasConfirmadas.reduce((total, reserva) => {
            return total + reserva.costoTotal;
        }, 0);

        console.log("Reservas Confirmadas encontradas:", reservasConfirmadas);
        console.log("Total Ganancias:", totalGanancias);
        res.status(200).json({
            reservas: reservasConfirmadas,
            totalGanancias: totalGanancias
        });
    } catch (error) {
        console.error("Error al obtener las reservas confirmadas:", error);
        res.status(500).json({ mensaje: "Error al obtener las reservas confirmadas", error });
    }
};


const obtenerDetalleReserva = async (req, res) => {
    try {
        const reservaId = req.params.id;
        console.log("Buscando detalles de la reserva con ID:", reservaId); // Log para ver el ID buscado

        const reserva = await Reserva.findById(reservaId).populate('espacio usuario');
        console.log("Detalle de la reserva encontrada:", reserva); // Log para ver la información de la reserva

        if (!reserva) {
            console.log("No se pudo encontrar la reserva con el ID:", reservaId); // Log si la reserva no se encuentra
            return res.status(404).json({ mensaje: "Reserva no encontrada" });
        }

        res.status(200).json(reserva);
    } catch (error) {
        console.error("Error al obtener el detalle de la reserva con ID:", reservaId, error); // Log para ver el error
        res.status(500).json({ mensaje: "Error al procesar la solicitud", error });
    }
};


module.exports = {
    crearReserva,
    listarReservasPorUsuario,
    cancelarReserva,
    listarTodasLasReservas,
    obtenerDetalleReserva
};