const express = require("express");
const router = express.Router();
const ReservasController = require("../controllers/reserva");

// Rutas para Reservas
router.post("/reservas", ReservasController.crearReserva);
router.get("/reservas/usuario/:userId", ReservasController.listarReservasPorUsuario);
router.put("/reservas/:id/cancelar", ReservasController.cancelarReserva);
router.get('/reservas-historial', ReservasController.listarTodasLasReservas); // Temporalmente abierto para todos

module.exports = router;
