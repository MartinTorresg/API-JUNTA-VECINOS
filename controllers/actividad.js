// Importar dependencias y módulos
const mongoosePagination = require("mongoose-pagination");
const nodemailer = require('nodemailer');

// Importar modelos
const Actividad = require("../models/actividad");

// Acciones de prueba
// Configuracion nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'not.timmy49@gmail.com', // Tu dirección de correo electrónico de Gmail
        pass: 'plus123asd', // Tu contraseña de Gmail
    },
});

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

const aprobarActividad = async (actividadId) => {
    try {
        // Lógica para aprobar la actividad (actualización en la base de datos, etc.)
        // Por ejemplo, puedes usar Mongoose para actualizar el estado de la actividad a "aprobada"
        const actividad = await Actividad.findByIdAndUpdate(actividadId, { estado: 'aprobada' }, { new: true });

        // Obtén el correo electrónico del usuario asociado a la actividad
        const usuarioEmail = actividad.user.email;

        // Envía el correo electrónico al usuario
        const mailOptions = {
            from: 'not.timmy49@gmail.com', // Tu dirección de correo electrónico de Gmail
            to: usuarioEmail, // La dirección de correo electrónico del usuario
            subject: 'Tu actividad ha sido aprobada',
            text: 'Tu actividad ha sido aprobada. ¡Esperamos verte pronto!',
        };

        await transporter.sendMail(mailOptions);
        console.log('Correo electrónico enviado correctamente al aprobar la actividad');
        
        // Devuelve la actividad actualizada o un mensaje de éxito según tu necesidad
        return actividad;
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir durante la aprobación o el envío del correo electrónico
        console.error('Error al aprobar la actividad o enviar el correo electrónico:', error);
        throw error; // Lanza el error para manejarlo en el nivel superior, si es necesario
    }
};

const eliminarActividad = async (req, res) => {
    try {
        // Lógica para eliminar la actividad, por ejemplo, usando el modelo de Mongoose
        const actividad = await Actividad.findByIdAndDelete(req.params.id);
        if (!actividad) {
            return res.status(404).json({ status: 'error', message: 'Actividad no encontrada' });
        }
        res.status(200).json({ status: 'success', message: 'Actividad eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar la actividad:', error);
        res.status(500).json({ status: 'error', message: 'Error al eliminar la actividad' });
    }
};

// Exportar acciones
module.exports = {
    pruebaActividad,
    crear_actividad,
    uno,
    listar_actividades,
    aprobarActividad,
    eliminarActividad
};
