const express = require("express");
const ProyectoControlador = require("../controllers/proyecto");

const router = express.Router();


// Rutas de pruebas
router.get("/ruta-de-prueba", ProyectoControlador.prueba);

// Ruta util
router.post("/crear_proyecto", ProyectoControlador.crear_proyecto);
router.get("/proyectos/:ultimos?", ProyectoControlador.listar_proyecto);
router.get("/proyecto/:id", ProyectoControlador.uno);
router.delete("/proyecto/:id", ProyectoControlador.borrar);
router.put("/proyecto/:id", ProyectoControlador.editar);
router.get("/buscar/:busqueda", ProyectoControlador.buscador);



module.exports = router;


