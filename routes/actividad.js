const express = require("express");
const ActividadControlador = require("../controllers/actividad");

const router = express.Router();

// Ruta de prueba
router.get("/ruta-de-prueba", ActividadControlador.pruebaActividad);

// Rutas para actividades
router.post("/crear_actividad", ActividadControlador.crear_actividad);
router.get("/actividades/:ultimos?", ActividadControlador.listar_actividades);
router.get("/actividad/:id", ActividadControlador.uno);
router.put("/aprobar/:id", ActividadControlador.aprobarActividad);
router.delete("/eliminar/:id", ActividadControlador.eliminarActividad);
router.get("/actividades/fecha/:fecha", ActividadControlador.actividadesPorFecha);


module.exports = router;
