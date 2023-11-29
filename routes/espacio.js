const express = require("express");
const router = express.Router();
const EspaciosController = require("../controllers/espacio");

// Rutas para Espacios
router.get("/espacios", EspaciosController.listarEspacios); // Listar todos los espacios
router.get("/espacios/detalle/:id", EspaciosController.obtenerEspacio); // Obtener detalles de un espacio específico
router.post("/espacios", EspaciosController.crearEspacio); // Crear un nuevo espacio
router.put("/espacios/actualizar/:id", EspaciosController.actualizarEspacio); // Actualizar un espacio existente
router.delete("/espacios/eliminar/:id", EspaciosController.eliminarEspacio); // Eliminar un espacio

module.exports = router;
