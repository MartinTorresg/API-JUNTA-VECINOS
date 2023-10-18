const express = require("express");
const ActividadControlador = require("../controllers/actividad");

const router = express.Router();

// Rutas de pruebas
router.get("/ruta-de-prueba", ActividadControlador.prueba);

// Rutas útiles
router.post("/crear_actividad", ActividadControlador.crearActividad);
router.get("/actividades", ActividadControlador.listarActividades);
router.get("/actividad/:id", ActividadControlador.obtenerActividad);
router.delete("/actividad/:id", ActividadControlador.eliminarActividad);
router.put("/actividad/:id", ActividadControlador.actualizarActividad);

module.exports = router;
