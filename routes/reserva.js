const express = require("express");
const router = express.Router();
const ReservaController = require("../controllers/reserva"); // Asegúrate de que la ruta sea correcta

// Rutas de reservas
router.post("/reservas", ReservaController.crearReserva);
router.get("/reservas/usuario/:userId", ReservaController.listarReservasPorUsuario);
router.delete("/reservas/:id/cancelar", ReservaController.cancelarReserva);
router.get('/reservas-historial', ReservaController.listarTodasLasReservas); // Temporalmente abierto para todos
router.get('/reservas/detalle/:id', ReservaController.obtenerDetalleReserva);
router.get('/reservas-pendientes', ReservaController.listarReservasPendientes);
router.patch('/confirmar/:id', ReservaController.confirmarReserva);


// Exportar router
module.exports = router;
