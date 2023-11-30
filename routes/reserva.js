const express = require("express");
const router = express.Router();
const ReservaController = require("../controllers/reserva"); // Asegúrate de que la ruta sea correcta

// Rutas de reservas
router.post("/reservas", ReservaController.crearReserva);
router.get("/reservas/usuario/:userId", ReservaController.listarReservasPorUsuario);
router.put("/reservas/:id/cancelar", ReservaController.cancelarReserva);
router.get('/reservas-historial', ReservaController.listarTodasLasReservas); // Temporalmente abierto para todos
router.get('/reservas/detalle/:id', ReservaController.obtenerDetalleReserva);


// Exportar router
module.exports = router;
