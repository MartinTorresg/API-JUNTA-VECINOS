// Importar dependencias y módulos
const mongoosePagination = require("mongoose-pagination");

// Importar modelos
const Actividad = require("../models/actividad");

// Acciones de prueba
const pruebaActividad = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controllers/actividad.js",
        actividad: req.actividad
    });
}

// Registrar actividad
const crear_actividad = (req, res) => {
    // Recoger datos de la petición
    let parametros = req.body;

    // Comprobar que se envíen los datos necesarios (+ validación)
    if (!parametros.nombre || !parametros.fecha || !parametros.lugar || !parametros.cupo) {
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar",
        });
    }

    // Crear objeto de actividad
    let actividad = new Actividad(parametros);

    // Guardar la actividad en la base de datos
    actividad.save((error, actividadGuardada) => {
        if (error || !actividadGuardada) {
            return res.status(500).send({ status: "error", message: "Error al guardar la actividad" });
        }
        // Devolver resultado
        return res.status(200).json({
            status: "success",
            message: "Actividad registrada correctamente",
            actividad: actividadGuardada
        });
    });
}

const uno = (req, res) => {
    // Recoger un ID por la URL
    let id = req.params.id;

    // Buscar la actividad
    Actividad.findById(id, (error, actividad) => {
        // Si no existe, devolver error
        if (error || !actividad) {
            return res.status(404).json({
                status: "error",
                message: "No se ha encontrado la actividad"
            });
        }
        // Devolver resultado
        return res.status(200).json({
            status: "success",
            actividad
        });
    });
}

const listar_actividades = (req, res) => {
    let consulta = Actividad.find({});

    if (req.params.ultimos) {
        consulta.limit(3);
    }

    consulta.sort({ fecha: -1 })
        .exec((error, actividades) => {
            if (error || !actividades) {
                return res.status(404).json({
                    status: "error",
                    message: "No se han encontrado actividades"
                });
            }
            return res.status(200).send({
                status: "success",
                contador: actividades.length,
                actividades
            });
        });
}

// Exportar acciones
module.exports = {
    pruebaActividad,
    crear_actividad,
    uno,
    listar_actividades
};
