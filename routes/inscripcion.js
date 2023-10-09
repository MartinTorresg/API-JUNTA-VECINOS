const express = require("express");
const router = express.Router();
const multer = require("multer");
const InscripcionController = require("../controllers/inscripcion");

// Definir rutas
router.get("/prueba-inscripcion", InscripcionController.pruebaInscripcion);
router.post("/register", InscripcionController.register)
router.get("/inscripcion/:id", InscripcionController.uno);
router.get("/profile/:id", InscripcionController.profile);
router.get("/inscripciones/:page?", InscripcionController.listar_inscripciones);

// Exportar router
module.exports = router;