const express = require("express");
const CertificadoControlador = require("../controllers/certificado");

const router = express.Router();

// Ruta de prueba
router.get("/ruta-de-prueba", CertificadoControlador.pruebaCertificado);

// Rutas para certificados
router.post("/crear_certificado", CertificadoControlador.crear_certificado);
router.get("/certificados", CertificadoControlador.listar_certificados);
router.get("/certificado/:id", CertificadoControlador.uno_certificado);
router.delete("/borrar_certificado/:id", CertificadoControlador.borrar_certificado);
router.post('/enviar_certificado', CertificadoControlador.enviar_certificado);

module.exports = router;
