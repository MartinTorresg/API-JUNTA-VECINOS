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
        pass: 'abyi wpap zbfp lamo', // Tu contraseña de Gmail
    },
    tls: {
        rejectUnauthorized: false // Aceptar certificados autofirmados
    }
});

const pruebaActividad = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controllers/actividad.js",
        actividad: req.actividad
    });
}

// Registrar actividad
const crear_actividad = async (req, res) => {
    // Suponiendo que el ID del usuario se obtiene del objeto req, por ejemplo, de req.userId
    const { user,nombre, fecha, hora, lugar, cupo } = req.body;
    console.log('req.body:', req.body);
    console.log('Usuario ID:', user);

    console.log('Inicio de la función crear_actividad con los datos:', { user, nombre, fecha, lugar, cupo });

    try {
        // Aquí, puedes agregar verificaciones adicionales según sea necesario

        // Crear objeto de actividad
        const actividad = new Actividad({
            nombre,
            fecha,
            hora,
            lugar,
            cupo,
            user  // Asignar el ID del usuario a la actividad
        });

        console.log('Actividad creada (antes de guardar):', actividad);
        await actividad.save();
        console.log('Actividad guardada con éxito.');

        res.status(201).json(actividad);
    } catch (error) {
        console.error('Se ha producido un error al crear la actividad:', error);
        res.status(500).json({ message: "Error al crear la actividad", error });
    }
};


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

const aprobarActividad = async (req, res) => {
    try {
        const actividadId = req.params.id;

        // Encontrar la actividad y obtener detalles del usuario que creó la actividad
        const actividad = await Actividad.findById(actividadId).populate('user');
        if (!actividad) {
            return res.status(404).json({ status: 'error', message: 'Actividad no encontrada' });
        }

        // Actualizar el estado de la actividad a "aprobada"
        const actividadActualizada = await Actividad.findByIdAndUpdate(actividadId, { estado: 'aprobada' }, { new: true });

        // Obtener el correo electrónico del usuario asociado a la actividad
        const usuarioEmail = actividad.user.email;

        // Envía el correo electrónico al usuario
        const mailOptions = {
            from: 'not.timmy49@gmail.com', // Tu dirección de correo electrónico de Gmail
            to: usuarioEmail, // La dirección de correo electrónico del usuario
            subject: 'Tu actividad ha sido aprobada',
            text: 'Tu actividad ha sido aprobada. ¡Esperamos verte pronto!',
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ status: 'success', message: 'Actividad aprobada correctamente', actividad: actividadActualizada });
    } catch (error) {
        console.error('Error al aprobar la actividad:', error);
        res.status(500).json({ status: 'error', message: 'Error al aprobar la actividad' });
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

const actividadesPorFecha = (req, res) => {
    // Obtener la fecha de los parámetros de la ruta
    const fechaSolicitada = req.params.fecha;

    // Convertir la fecha a un objeto Date para comparación
    const fechaInicio = new Date(fechaSolicitada);
    fechaInicio.setHours(0, 0, 0, 0);

    const fechaFin = new Date(fechaSolicitada);
    fechaFin.setHours(23, 59, 59, 999);

    // Buscar solo actividades aprobadas que caigan en la fecha especificada
    Actividad.find({
        fecha: {
            $gte: fechaInicio,
            $lte: fechaFin
        },
        estado: 'aprobada' // Filtrar solo actividades aprobadas
    })
        .exec((error, actividades) => {
            if (error) {
                return res.status(500).json({
                    status: "error",
                    message: "Error al buscar actividades",
                    error: error
                });
            }
            if (!actividades || actividades.length === 0) {
                return res.status(404).json({
                    status: "success",
                    message: "No se encontraron actividades para la fecha especificada"
                });
            }
            return res.status(200).json({
                status: "success",
                actividades: actividades
            });
        });
};


// Exportar acciones
module.exports = {
    pruebaActividad,
    crear_actividad,
    uno,
    listar_actividades,
    aprobarActividad,
    eliminarActividad,
    actividadesPorFecha
};
