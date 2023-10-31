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
    if(!params.nombre || !params.email){
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar",
        });
    }

        // Control usuarios duplicados
        Inscripcion.find({ 
            $or: [
                {email: params.email.toLowerCase()},
                {run: params.run.toLowerCase()}
            ]
        }).exec(async(error, inscripciones) => {

            if(error) return res.status(500).json({status: "error", message: "Error en la consulta de Inscripcion"});

            if(inscripciones && inscripciones.length >= 1){
                return res.status(200).send({
                    status: "success",
                    message: "La Inscripcion ya existe"
                });

            }

            //Crear objeto de usuario
            let inscripcion_to_save = new Inscripcion(params);

            // Guardar usuario en la bbdd
            inscripcion_to_save.save((error, inscripcionStored) => {
                if(error || !inscripcionStored) return res.status(500).send({status: "error", "message": "Error al guardar la inscripcion"});
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
    .select({password: 0, role: 0})
    .exec((error, inscripcionProfile) => {
        if(error || !inscripcionProfile){
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
    // Recoger un id por la url
    let id = req.params.id;

    // Buscar el articulo
    Inscripcion.findById(id, (error, inscripcion) => {

        // Si no existe devolver error
        if (error || !inscripcion) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se han encontrado la inscripcion"
            });
        }

        // Devolver resultado
        return res.status(200).json({
            status: "success",
            inscripcion
        });

    });
}


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



// Exportar acciones
module.exports = {
    pruebaInscripcion,
    register,
    profile,
    listar_inscripciones,
    uno
}