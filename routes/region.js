const express = require("express");
const router = express.Router();
const RegionController = require("../controllers/region"); // Asegúrate de que la ruta sea correcta


// Rutas de regiones
router.get("/regiones", RegionController.obtenerRegiones);
// Añadir más rutas de regiones según sea necesario

// Exportar router
module.exports = router;
