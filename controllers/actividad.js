const { validarActividad } = require("../helpers/validar");
const Actividad = require("../models/actividad");

const prueba = (req, res) => {
    return res.status(200).json({
        mensaje: "Soy una acción de prueba en mi controlador de actividades"
    });
};

const crearActividad = (req, res) => {
    let parametros = req.body;

    try {
        validarActividad(parametros);
    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        });
    }

    const actividad = new Actividad(parametros);

    actividad.save((error, actividadGuardada) => {
        if (error || !actividadGuardada) {
            return res.status(400).json({
                status: "error",
                mensaje: "No se ha guardado la actividad"
            });
        }

        return res.status(200).json({
            status: "success",
            actividad: actividadGuardada
        });
    });
};

const listarActividades = (req, res) => {
    let consulta = Actividad.find({});

    consulta.sort({ fecha: -1 })
        .exec((error, actividades) => {
            if (error || !actividades) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se han encontrado actividades"
                });
            }

            return res.status(200).json({
                status: "success",
                actividades
            });
        });
};

const obtenerActividad = (req, res) => {
    let id = req.params.id;

    Actividad.findById(id, (error, actividad) => {
        if (error || !actividad) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se ha encontrado la actividad"
            });
        }

        return res.status(200).json({
            status: "success",
            actividad
        });
    });
};

const eliminarActividad = (req, res) => {
    let actividadId = req.params.id;

    Actividad.findOneAndDelete({ _id: actividadId }, (error, actividadEliminada) => {
        if (error || !actividadEliminada) {
            return res.status(500).json({
                status: "error",
                mensaje: "Error al eliminar la actividad"
            });
        }

        return res.status(200).json({
            status: "success",
            actividad: actividadEliminada
        });
    });
};

const actualizarActividad = (req, res) => {
    let actividadId = req.params.id;
    let parametros = req.body;

    try {
        validarActividad(parametros);
    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        });
    }

    Actividad.findOneAndUpdate({ _id: actividadId }, req.body, { new: true }, (error, actividadActualizada) => {
        if (error || !actividadActualizada) {
            return res.status(500).json({
                status: "error",
                mensaje: "Error al actualizar la actividad"
            });
        }

        return res.status(200).json({
            status: "success",
            actividad: actividadActualizada
        });
    });
};

module.exports = {
    prueba,
    crearActividad,
    listarActividades,
    obtenerActividad,
    eliminarActividad,
    actualizarActividad
};
