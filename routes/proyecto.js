const express = require("express");
const ProyectoControlador = require("../controllers/proyecto");
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../proyectos'));
    },
    filename: function (req, file, cb) {
        // Puedes incluir lógica para personalizar el nombre del archivo aquí
        cb(null, Date.now() + path.extname(file.originalname)); // Prefijo con la fecha actual para evitar nombres duplicados
    }
});

const upload = multer({ storage: storage });


// Rutas de pruebas
router.get("/ruta-de-prueba", ProyectoControlador.prueba);

// Ruta util
router.post("/crear_proyecto", ProyectoControlador.crear_proyecto);
router.get("/proyectos/:ultimos?", ProyectoControlador.listar_proyecto);
router.get("/proyecto/:id", ProyectoControlador.uno);
router.delete("/proyecto/:id", ProyectoControlador.borrar);
router.put("/proyecto/:id", ProyectoControlador.editar);
router.get("/buscar/:busqueda", ProyectoControlador.buscador);
router.get("/kpi-tasa-finalizacion-proyectos", ProyectoControlador.getKPITasaFinalizacionProyectos);
router.put("/actualizar_estado/:id", ProyectoControlador.actualizarEstado);
router.get('/proyectos-por-estado', ProyectoControlador.getProyectosPorEstado);
router.put('/proyecto/modificar/:id', ProyectoControlador.actualizarProyecto);
router.post('/subir', upload.array('archivos', 5), ProyectoControlador.subirArchivos);
router.get('/proyecto/:id/archivos', ProyectoControlador.obtenerArchivosProyecto);
router.delete('/proyecto/:proyectoId/archivo/:archivoId', ProyectoControlador.eliminarArchivo);
router.post('/rechazar/:id', ProyectoControlador.rechazarProyecto);
router.get('/datos-desviacion-presupuesto', ProyectoControlador.getDatosDesviacionPresupuesto);




module.exports = router;


