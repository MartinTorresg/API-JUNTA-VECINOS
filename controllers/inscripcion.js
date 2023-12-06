// Importar dependencias y modulos
const mongoosePagination = require("mongoose-pagination");

// Importar modelos
const Inscripcion = require("../models/inscripcion");


// Acciones de prueba
const pruebaInscripcion = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controllers/inscripcion.js",
        inscripcion: req.inscripcion
    });
}

// Registro de usuarios
const register = (req, res) => {
    // Recoger datos de la peticion
    let params = req.body;

    // Comprobar que me llegan bien (+ validacion)
    if (!params.nombre || !params.email) {
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar",
        });
    }

    // Control usuarios duplicados
    Inscripcion.find({
        $or: [
            { email: params.email.toLowerCase() },
            { run: params.run.toLowerCase() }
        ]
    }).exec(async (error, inscripciones) => {

        if (error) return res.status(500).json({ status: "error", message: "Error en la consulta de Inscripcion" });

        if (inscripciones && inscripciones.length >= 1) {
            return res.status(200).send({
                status: "success",
                message: "La Inscripcion ya existe"
            });

        }

        //Crear objeto de usuario
        let inscripcion_to_save = new Inscripcion(params);

        // Guardar usuario en la bbdd
        inscripcion_to_save.save((error, inscripcionStored) => {
            if (error || !inscripcionStored) return res.status(500).send({ status: "error", "message": "Error al guardar la inscripcion" });
            //Devolver resultado
            return res.status(200).json({
                status: "success",
                message: "Inscripcion registrado correctamente",
                inscripcion: inscripcionStored
            });

        });
    });
}


const profile = (req, res) => {
    // Recibir el parametro del id de usuario por la url
    const id = req.params.id;

    // Consulta para sacar los datos del usuario
    //const userProfile = await User.findById(id)

    Inscripcion.findById(id)
        .select({ password: 0, role: 0 })
        .exec((error, inscripcionProfile) => {
            if (error || !inscripcionProfile) {
                return res.status(404).send({
                    status: "error",
                    message: "La Inscripcion no existe o hay un error"
                });
            }
            // Devolver el resultado
            return res.status(200).send({
                status: "success",
                inscripcion: inscripcionProfile
            });

        });


}

const uno = (req, res) => {
    let id = req.params.id;

    Inscripcion.findById(id)
        .populate('region')
        .populate('comuna')
        .exec((error, inscripcion) => {
            if (error || !inscripcion) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se han encontrado la inscripcion"
                });
            }
            return res.status(200).json({
                status: "success",
                inscripcion
            });
        });
};


const listar_inscripciones = (req, res) => {

    let consulta = Inscripcion.find({});

    if (req.params.ultimos) {
        consulta.limit(3);
    }

    consulta.sort({ fecha: -1 })
        .exec((error, inscripciones) => {

            if (error || !inscripciones) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se han encontrado inscripciones!!"
                });
            }

            return res.status(200).send({
                status: "success",
                contador: inscripciones.length,
                inscripciones
            });

        });

}

const cambiarEstado = async (req, res) => {
    const { id, nuevoEstado } = req.body;

    try {
        const inscripcionActualizada = await Inscripcion.findByIdAndUpdate(id, { estado: nuevoEstado }, { new: true });
        if (!inscripcionActualizada) {
            return res.status(404).send({ status: "error", message: "Inscripción no encontrada" });
        }

        res.status(200).send({ status: "success", inscripcion: inscripcionActualizada });
    } catch (error) {
        res.status(500).send({ status: "error", message: "Error al actualizar la inscripción" });
    }
};

// Asegúrate de importar Nodemailer
const nodemailer = require('nodemailer');

// Configuración de Nodemailer (usar tu configuración real)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'not.timmy49@gmail.com', // Reemplazar con tu correo electrónico real
        pass: 'gsli goni oztz vkzt' // Reemplazar con tu contraseña real
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Función para enviar correo electrónico de rechazo
const enviarCorreoRechazo = (email, mensaje) => {
    const mailOptions = {
        from: 'not.timmy49@gmail.com', // Tu correo electrónico
        to: email,
        subject: 'Inscripción Rechazada',
        text: `Hola,\n\nLamentamos informarte que tu inscripción ha sido rechazada por la siguiente razón: \n\n${mensaje}\n\nSi tienes preguntas o necesitas más información, por favor contáctanos.\n\nSaludos,\nEl Equipo`
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log('Error al enviar el correo de rechazo: ', error);
            return false;
        } else {
            console.log('Correo de rechazo enviado: ', info.response);
            return true;
        }
    });
};

const borrarInscripcion = (req, res) => {
    const id = req.params.id;
    const mensajeRechazo = req.body.mensajeRechazo;

    Inscripcion.findByIdAndRemove(id, (error, inscripcionBorrada) => {
        if (error) {
            return res.status(500).send({
                status: "error",
                message: "Error al borrar la inscripción"
            });
        }

        if (!inscripcionBorrada) {
            return res.status(404).send({
                status: "error",
                message: "No se ha encontrado la inscripción a borrar"
            });
        }

        // Asegúrate de que la dirección de correo electrónico exista
        if (inscripcionBorrada.email) {
            enviarCorreoRechazo(inscripcionBorrada.email, mensajeRechazo);
        } else {
            console.log('No se ha definido la dirección de correo electrónico');
        }

        return res.status(200).send({
            status: "success",
            inscripcion: inscripcionBorrada
        });
    });
};






// Exportar acciones
module.exports = {
    pruebaInscripcion,
    register,
    profile,
    listar_inscripciones,
    uno,
    cambiarEstado,
    enviarCorreoRechazo,
    borrarInscripcion
}