const { validarProyecto } = require("../helpers/validar");
const Proyecto = require("../models/proyecto");
const fs = require('fs');
const nodemailer = require('nodemailer');

const prueba = (req, res) => {

    return res.status(200).json({
        mensaje: "Soy una acción de prueba en mi controlador de proyectos"
    });
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'not.timmy49@gmail.com', // Tu dirección de correo electrónico de Gmail
        pass: 'abyi wpap zbfp lamo', // Tu contraseña de Gmail
    },
    tls: {
        rejectUnauthorized: false // Aceptar certificados autofirmados
    }
});


const crear_proyecto = async (req, res) => {
    console.log('Inicio de crear_proyecto con los datos recibidos:', req.body);

    // Desestructurar req.body para obtener los datos, incluyendo el ID del usuario
    const { user, nombre, descripcion, estado, presupuesto, presupuestoGastado, archivos } = req.body;

    // Puedes agregar más campos si tu modelo de Proyecto los requiere

    console.log('Datos extraídos de req.body:', { user, nombre, descripcion, estado, presupuesto, presupuestoGastado, archivos });

    // Validar datos (asegúrate de que tu función validarProyecto maneje todos los campos necesarios)
    try {
        validarProyecto(req.body);
    } catch (error) {
        console.error('Error de validación:', error);
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar o datos inválidos",
            error: error.message
        });
    }

    // Crear el objeto a guardar con los datos desestructurados
    const proyecto = new Proyecto({
        user, // Esto asignará el ID del usuario al proyecto, asumiendo que tu modelo Proyecto tiene un campo 'user'
        nombre,
        descripcion,
        estado,
        presupuesto,
        presupuestoGastado,
        archivos // Asegúrate de que tu modelo maneje este campo si es necesario
    });

    console.log('Proyecto a guardar:', proyecto);

    // Intentar guardar el proyecto en la base de datos
    try {
        const proyectoGuardado = await proyecto.save();
        console.log('Proyecto guardado con éxito:', proyectoGuardado);
        res.status(201).json({
            status: "success",
            proyecto: proyectoGuardado,
            mensaje: "Proyecto creado con éxito"
        });
    } catch (error) {
        console.error('Error al guardar el proyecto:', error);
        res.status(500).json({
            status: "error",
            mensaje: "Error al guardar el proyecto",
            error: error
        });
    }
};


const subirArchivos = async (req, res) => {
    if (!req.files || req.files.length === 0) {
        console.log('No se recibieron archivos en la solicitud.');
        return res.status(400).send('No se subieron archivos.');
    }

    console.log('Archivos recibidos:', req.files);
    const proyectoId = req.body.proyectoId;
    if (!proyectoId) {
        console.log('No se proporcionó proyectoId en la solicitud.');
        return res.status(400).send('Falta proyectoId en la solicitud.');
    }

    try {
        console.log('Buscando proyecto con ID:', proyectoId);
        const proyecto = await Proyecto.findById(proyectoId);
        if (!proyecto) {
            console.log('Proyecto no encontrado con ID:', proyectoId);
            return res.status(404).send('Proyecto no encontrado.');
        }

        const archivosSubidos = req.files.map(file => ({
            nombre: file.originalname,
            path: file.path,
            mimetype: file.mimetype,
            size: file.size
        }));

        console.log('Archivos a subir:', archivosSubidos);

        if (proyecto.archivos && Array.isArray(proyecto.archivos)) {
            proyecto.archivos.push(...archivosSubidos);
        } else {
            proyecto.archivos = archivosSubidos;
        }

        await proyecto.save();
        console.log('Archivos subidos y guardados con éxito para el proyecto:', proyectoId);
        res.json({ message: 'Archivos subidos con éxito' });
    } catch (error) {
        console.error('Error al subir archivos:', error);
        res.status(500).send('Error al guardar los archivos en la base de datos.');
    }
};

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
    Proyecto.find({
        "$or": [
            { "nombre": { "$regex": busqueda, "$options": "i" } },
            { "descripcion": { "$regex": busqueda, "$options": "i" } },
        ]
    })
        .sort({ fecha: -1 })
        .exec((error, proyectosEncontrados) => {

            if (error || !proyectosEncontrados || proyectosEncontrados.length <= 0) {
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

const getKPITasaFinalizacionProyectos = async (req, res) => {
    try {
        const totalProyectos = await Proyecto.countDocuments();
        const proyectosCompletados = await Proyecto.countDocuments({ estado: 'Finalizado' });
        const tasaFinalizacion = (proyectosCompletados / totalProyectos) * 100;

        res.status(200).json({
            status: "success",
            tasaFinalizacion: tasaFinalizacion.toFixed(2) // Redondea a dos decimales
        });
    } catch (error) {
        res.status(500).send({
            status: "error",
            message: "Error al calcular la tasa de finalización de proyectos",
            error
        });
    }
};

const actualizarEstado = (req, res) => {
    const proyectoId = req.params.id;
    const nuevoEstado = req.body.estado;

    Proyecto.findByIdAndUpdate(proyectoId, { estado: nuevoEstado }, { new: true }, (error, proyectoActualizado) => {
        if (error || !proyectoActualizado) {
            return res.status(500).json({
                status: "error",
                mensaje: "Error al actualizar el estado del proyecto"
            });
        }
        res.status(200).json({
            status: "success",
            proyecto: proyectoActualizado
        });
    });
};

const getProyectosPorEstado = async (req, res) => {
    try {
        // Contar proyectos por cada estado
        const porRevisarCount = await Proyecto.countDocuments({ estado: 'Por Revisar' });
        const enProcesoCount = await Proyecto.countDocuments({ estado: 'En Proceso' });
        const finalizadoCount = await Proyecto.countDocuments({ estado: 'Finalizado' });

        // Construir la respuesta
        const datos = {
            porRevisar: porRevisarCount,
            enProceso: enProcesoCount,
            finalizado: finalizadoCount
        };

        // Enviar la respuesta
        res.status(200).json({
            status: "success",
            datos
        });
    } catch (error) {
        res.status(500).send({
            status: "error",
            message: "Error al obtener la cantidad de proyectos por estado",
            error: error.message
        });
    }
};

const actualizarProyecto = async (req, res) => {
    const { id } = req.params;
    // Asegúrate de incluir todos los campos que esperas actualizar desde el frontend
    const { descripcion, presupuesto, estado, presupuestoGastado } = req.body;

    try {
        const datosActualizados = {
            descripcion,
            presupuesto,
            // Solo actualiza el estado y el presupuesto gastado si se proporcionan
            ...(estado && { estado }),
            ...(presupuestoGastado && { presupuestoGastado }),
        };

        // Encuentra el proyecto por ID y actualiza
        const proyectoActualizado = await Proyecto.findByIdAndUpdate(id, datosActualizados, { new: true });

        if (!proyectoActualizado) {
            console.log(`Proyecto con id ${id} no encontrado.`);
            return res.status(404).json({ status: 'error', message: 'Proyecto no encontrado' });
        }

        console.log(`Proyecto con id ${id} ha sido actualizado.`);
        res.json({ status: 'success', proyecto: proyectoActualizado });
    } catch (error) {
        console.error(`Error al actualizar el proyecto con id ${id}:`, error);
        res.status(500).json({ status: 'error', message: 'Error al actualizar el proyecto' });
    }
};


const obtenerArchivosProyecto = async (req, res) => {
    try {
        const proyectoId = req.params.id;
        console.log(`Obteniendo archivos para el proyecto con ID: ${proyectoId}`);

        const proyecto = await Proyecto.findById(proyectoId).select('archivos');

        if (!proyecto) {
            console.log(`Proyecto no encontrado con ID: ${proyectoId}`);
            return res.status(404).send('Proyecto no encontrado.');
        }

        console.log(`Archivos encontrados para el proyecto:`, proyecto.archivos);
        res.status(200).json({
            status: 'success',
            archivos: proyecto.archivos
        });
    } catch (error) {
        console.error('Error al obtener archivos del proyecto:', error);
        res.status(500).send('Error al obtener archivos del proyecto.');
    }
};

const eliminarArchivo = async (req, res) => {
    const { archivoId, proyectoId } = req.params; // Asumiendo que envías el ID del archivo y del proyecto

    try {
        // Encuentra el proyecto y el archivo
        const proyecto = await Proyecto.findById(proyectoId);
        if (!proyecto) {
            return res.status(404).send('Proyecto no encontrado.');
        }

        const archivo = proyecto.archivos.id(archivoId);
        if (!archivo) {
            return res.status(404).send('Archivo no encontrado.');
        }

        // Eliminar archivo del sistema de archivos
        fs.unlink(archivo.path, (err) => {
            if (err) {
                console.error('Error al eliminar el archivo del sistema de archivos:', err);
                return res.status(500).send('Error al eliminar el archivo del sistema de archivos.');
            }

            // Eliminar la referencia del archivo en la base de datos
            archivo.remove();
            proyecto.save((err) => {
                if (err) {
                    console.error('Error al actualizar el proyecto:', err);
                    return res.status(500).send('Error al actualizar el proyecto.');
                }
                res.send('Archivo eliminado con éxito.');
            });
        });
    } catch (error) {
        console.error('Error al eliminar archivo:', error);
        res.status(500).send('Error al eliminar archivo.');
    }
};

const rechazarProyecto = async (req, res) => {
    try {
        const proyectoId = req.params.id;
        const { motivo } = req.body; // Recibir el motivo del rechazo

        // Encontrar el proyecto y obtener detalles del usuario que creó el proyecto
        const proyecto = await Proyecto.findById(proyectoId).populate('user');
        if (!proyecto) {
            return res.status(404).json({ status: 'error', message: 'Proyecto no encontrado' });
        }

        // Actualizar el estado del proyecto a "rechazado"
        proyecto.estado = "Rechazado";
        await proyecto.save();
        console.log(`Proyecto con id ${proyectoId} ha sido actualizado a rechazado.`);

        // Obtener el correo electrónico del usuario asociado al proyecto
        const usuarioEmail = proyecto.user.email;

        // Preparar y enviar el correo electrónico al usuario
        const mailOptions = {
            from: 'not.timmy49@gmail.com', // Tu dirección de correo electrónico de Gmail
            to: usuarioEmail, // La dirección de correo electrónico del usuario
            subject: 'Tu proyecto ha sido rechazado',
            text: `Tu proyecto ha sido rechazado por el siguiente motivo: ${motivo}`,
        };

        await transporter.sendMail(mailOptions);

        // Opcional: Eliminar el proyecto si es lo que deseas
        await Proyecto.findByIdAndRemove(proyectoId);
        console.log(`Proyecto con id ${proyectoId} ha sido eliminado.`);

        res.status(200).json({ status: 'success', message: 'Proyecto rechazado correctamente' });
    } catch (error) {
        console.error('Error al rechazar el proyecto:', error);
        res.status(500).json({ status: 'error', message: 'Error al rechazar el proyecto' });
    }
};

const getDatosDesviacionPresupuesto = async (req, res) => {
    try {
        // Obtener solo los proyectos con estado "Finalizado"
        const proyectosFinalizados = await Proyecto.find({ estado: "Finalizado" });

        // Calcular la desviación para cada proyecto finalizado y la desviación total
        let sumaDesviacion = 0;
        let sumaPresupuestoPlanificado = 0;

        const proyectosConDesviacion = proyectosFinalizados.map(proyecto => {
            const desviacion = proyecto.presupuestoGastado - proyecto.presupuesto;
            sumaDesviacion += desviacion;
            sumaPresupuestoPlanificado += proyecto.presupuesto;

            return {
                nombre: proyecto.nombre,
                desviacion: (desviacion / proyecto.presupuesto) * 100 // Porcentaje de desviación
            };
        });

        // Calcular la desviación promedio
        const desviacionPromedio = sumaPresupuestoPlanificado > 0
            ? (sumaDesviacion / sumaPresupuestoPlanificado) * 100
            : 0; // Evita división por cero

        res.status(200).json({
            desviacion: desviacionPromedio.toFixed(2), // Redondear a dos decimales
            proyectos: proyectosConDesviacion
        });
    } catch (error) {
        console.error('Error al obtener los datos de desviación del presupuesto:', error);
        res.status(500).json({ status: 'error', message: 'Error al obtener los datos de desviación del presupuesto' });
    }
};

module.exports = {
    prueba,
    crear_proyecto,
    subirArchivos,
    listar_proyecto,
    uno,
    borrar,
    editar,
    buscador,
    getKPITasaFinalizacionProyectos,
    actualizarEstado,
    getProyectosPorEstado,
    actualizarProyecto,
    obtenerArchivosProyecto,
    eliminarArchivo,
    rechazarProyecto,
    getDatosDesviacionPresupuesto
}