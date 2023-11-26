const express = require("express");
const router = express.Router();
const multer = require("multer");
const UserController = require("../controllers/user");
const check = require("../middlewares/auth");

// Definir rutas
router.post("/register", UserController.register)
router.post("/login", UserController.login);
router.get("/profile/:id", check.auth, UserController.profile);
router.get("/list/:page?", check.auth, UserController.list);
router.put("/update", check.auth, UserController.update);
router.post("/cambiar-contrasena", check.auth, UserController.cambiarContraseña);
router.get("/total-users", UserController.getTotalUsers);
router.get("/kpi-registro-vecinos", UserController.getKPIRegistroVecinos);
router.get("/descargar-certificado", check.auth, UserController.descargarCertificadoUsuario);


// Exportar router
module.exports = router;