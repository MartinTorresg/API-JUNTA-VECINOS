const { validarProyecto } = require("../helpers/validar");
const Proyecto = require("../models/proyecto");

const prueba = (req, res) => {

    return res.status(200).json({
        mensaje: "Soy una acción de prueba en mi controlador de proyectos"
    });
}


const crear_proyecto = (req, res) => {

    // Recoger parametros por post a guardar
    let parametros = req.body;

    // Validar datos
    try {
        validarProyecto(parametros);

    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        });
    }

    // Crear el objeto a guardar
    const proyecto = new Proyecto(parametros);

    // Asignar valores a objeto basado en el modelo (manual o automatico)
    //proyecto.nombre = parametros.nombre;

    // Guardar el proyecto en la base de datos
    proyecto.save((error, proyectoGuardado) => {

        if (error || !proyectoGuardado) {
            return res.status(400).json({
                status: "error",
                mensaje: "No se ha guardado el artículo"
            });
        }

        // Devolver resultado
        return res.status(200).json({
            status: "success",
            proyecto: proyectoGuardado,
            mensaje: "Proyecto creado con exito!!"
        })

    });

}

const listar_proyecto = (req, res) => {

    let consulta = Proyecto.find({});

    if (req.params.ultimos) {
        consulta.limit(3);
    }

    consulta.sort({ fecha: -1 })
        .exec((error, proyectos) => {

            if (error || !proyectos) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se han encontrado proyectos!!"
                });
            }

            return res.status(200).send({
                status: "success",
                contador: proyectos.length,
                proyectos
            });

        });

}

const uno = (req, res) => {
    // Recoger un id por la url
    let id = req.params.id;

    // Buscar el articulo
    Proyecto.findById(id, (error, proyecto) => {

        // Si no existe devolver error
        if (error || !proyecto) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se han encontrado el proyecto"
            });
        }

        // Devolver resultado
        return res.status(200).json({
            status: "success",
            proyecto
        });

    });
}

const borrar = (req, res) => {

    let proyectoId = req.params.id;

    Proyecto.findOneAndDelete({ _id: proyectoId }, (error, proyectoBorrado) => {

        if (error || !proyectoBorrado) {
            return res.status(500).json({
                status: "error",
                mensaje: "Error al borrar el proyecto"
            });
        }

        return res.status(200).json({
            status: "success",
            proyecto: proyectoBorrado,
            mensaje: "Metodo de borrar"
        });

    });

}

const editar = (req, res) => {
    // Recorger id articulo a editar
    let proyectoId = req.params.id;

    // Recoger datos del body
    let parametros = req.body;

    // Validar datos
    try {
        validarProyecto(parametros);

    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        });
    }

    // Buscar y actualizar proyecto
    Proyecto.findOneAndUpdate({ _id: proyectoId }, req.body, { new: true }, (error, proyectoActualizado) => {

        if (error || !proyectoActualizado) {
            return res.status(500).json({
                status: "error",
                mensaje: "Error al actualizar"
            });
        }

        // Devolver respuesta
        return res.status(200).json({
            status: "success",
            proyecto: proyectoActualizado
        })
    });

}

const buscador = (req, res) => {
    // Sacar el string de busqueda
    let busqueda = req.params.busqueda;

    // Find OR 
    Proyecto.find({ "$or": [
        { "nombre": { "$regex": busqueda, "$options": "i"}},
        { "descripcion": { "$regex": busqueda, "$options": "i"}},
    ]})
    .sort({fecha: -1})
    .exec((error, proyectosEncontrados) => {

        if(error || !proyectosEncontrados || proyectosEncontrados.length <= 0){
            return res.status(404).json({
                status: "error",
                mensaje: "No se han encontrado proyectos"
            });
        }


        return res.status(200).json({
            status: "success",
            proyectos: proyectosEncontrados
        })
    });
}

module.exports = {
    prueba,
    crear_proyecto,
    listar_proyecto,
    uno,
    borrar,
    editar,
    buscador
}