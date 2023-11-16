const express = require("express");
const router = express.Router();
const multer = require("multer");
const InscripcionController = require("../controllers/inscripcion");

// Definir rutas
router.post("/register", InscripcionController.register)
router.get("/inscripcion/:id", InscripcionController.uno);
router.get("/profile/:id", InscripcionController.profile);
router.get("/inscripciones/:page?", InscripcionController.listar_inscripciones);
router.post('/cambiar-estado', InscripcionController.cambiarEstado);
router.delete('/borrar-inscripcion/:id', InscripcionController.borrarInscripcion);

// Exportar router
module.exports = router;