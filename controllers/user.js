// UserController.js
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("../services/jwt");
const nodemailer = require('nodemailer');
const Inscripcion = require("../models/inscripcion");

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'not.timmy49@gmail.com', // Reemplazar con tu correo electrónico
        pass: 'abyi wpap zbfp lamo' // Reemplazar con tu contraseña
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Función para enviar correo electrónico de confirmación
const enviarCorreoConfirmacion = (email, nombreUsuario, password) => {
    const mailOptions = {
        from: 'not.timmy49@gmail.com', // Tu correo electrónico
        to: email,
        subject: 'Registro Exitoso en la Junta de Vecinos',
        text: `Hola ${nombreUsuario},\n\nTu cuenta ha sido creada con éxito. Puedes iniciar sesión usando tu correo electrónico y la siguiente contraseña: ${password}\n\nPor favor, cambia tu contraseña después de iniciar sesión por primera vez por motivos de seguridad.\n\nSaludos,\nEquipo de la Junta de Vecinos`
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log('Error al enviar el correo: ', error);
        } else {
            console.log('Correo de confirmación enviado: ', info.response);
        }
    });
};

// Registro de usuarios
// Método de registro actualizado en UserController.js
const register = async (req, res) => {
    let params = req.body;

    if (!params.name || !params.email || !params.password) {
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar",
        });
    }

    try {
        const userExist = await User.findOne({ email: params.email.toLowerCase() });
        if (userExist) {
            return res.status(409).json({
                status: "error",
                message: "El usuario ya está registrado",
            });
        }

        // Verificar si la inscripción existe
        if (params.idInscripcion) {
            const inscripcion = await Inscripcion.findById(params.idInscripcion);
            if (!inscripcion) {
                return res.status(404).send({
                    status: "error",
                    message: "Inscripción no encontrada"
                });
            }
        }

        // Cifrar la contraseña y crear el usuario
        const pwd = await bcrypt.hash(params.password, 10);
        const user = new User({ ...params, password: pwd });
        const userStored = await user.save();

        // Cambiar el estado de la inscripción si existe
        if (params.idInscripcion) {
            await Inscripcion.findByIdAndUpdate(params.idInscripcion, { estado: 'Aprobada' });
        }

        // Enviar correo de confirmación
        await enviarCorreoConfirmacion(userStored.email, userStored.name);

        res.status(200).json({
            status: "success",
            user: userStored
        });
    } catch (error) {
        console.error(error); // Imprimir el error en consola para depuración
        res.status(500).send({ status: "error", message: "Error al procesar la solicitud" });
    }
};



const login = (req, res) => {
    // Recoger parametros body
    let params = req.body;

    if(!params.email || !params.password){
        return res.status(400).send({
            status: "error",
            message: "Faltan datos por enviar"
        });
    }

    // Buscar en la bbdd si existe
    User.findOne({email: params.email})
        //.select({"password": 0})
        .exec((error, user) => {
        if(error || !user) return res.status(404).send({status: "error", message: "No existe el usuario"});
    
        // Comprobar su contraseña
        let pwd = bcrypt.compareSync(params.password, user.password);

        if(!pwd){
            return res.status(400).send({
                status: "error",
                message: "No te has identificado correctamente"
            });
        }

        // Conseguir Token
        const token = jwt.createToken(user);

        // Devolver Datos del usuario

        return res.status(200).send({
            status: "success",
            message: "Te has identificado correctamente",
            user: {
                id: user._id,
                name: user.name,
                rut: user.rut
            },
            token
        });

    });

    
}

const profile = (req, res) => {
    // Recibir el parametro del id de usuario por la url
    const id = req.params.id;

    // Consulta para sacar los datos del usuario
    //const userProfile = await User.findById(id)

    User.findById(id)
    .select({password: 0, role: 0})
    .exec((error, userProfile) => {
        if(error || !userProfile){
            return res.status(404).send({
                status: "error",
                message: "El usuario no existe o hay un error"
            });
        }
        // Devolver el resultado
        return res.status(200).send({
            status: "success",
            user: userProfile
        });

    });

    
}


const list = (req, res) => {
    // Controlar en que pagina estamos
    let page = 1;
    if(req.params.page){
        page = req.params.page;
    }
    page = parseInt(page);
    // Consulta con mongoose paginate
    let itemsPerPage = 5;

    User.find().sort('_id').paginate(page, itemsPerPage, (error, users, total) => {
          if(error || !users){
            return res.status(404).send({
                status: "error",
                message: "No hay usuarios disponibles",
                error
            });
          }
        // Devolver el resultado 
        return res.status(200).send({
            status: "success",
            users,
            page,
            itemsPerPage,
            total,
            pages: Math.ceil(total/itemsPerPage)
        });
    });

    
}

const update = (req, res) => {
    // Recoger info del usuario a actualizar
    let userIdentity = req.user;
    let userToUpdate = req.body;

    // Eliminar campos sobrantes
    delete userToUpdate.iat;
    delete userToUpdate.exp;

    // Comprobar si el usuario ya existe
    User.find({
        $or: [
            { email: userToUpdate.email.toLowerCase() },
            { rut: userToUpdate.rut.toLowerCase() }
        ]
    }).exec(async (error, users) => {

        if (error) return res.status(500).json({ status: "error", message: "Error en la consulta de usuarios" });

        let userIsset = false;
        users.forEach(user => {
            if (user && user._id != userIdentity.id) userIsset = true;
        });

        if (userIsset) {
            return res.status(200).send({
                status: "success",
                message: "El usuario ya existe"
            });
        }

        // Cifrar la contraseña
        if (userToUpdate.password) {
            let pwd = await bcrypt.hash(userToUpdate.password, 10);
            userToUpdate.password = pwd;

            //añadido
        }else{
            delete userToUpdate.password;
        }

        // Buscar y actualizar 
        try {
            let userUpdated = await User.findByIdAndUpdate({ _id: userIdentity.id }, userToUpdate, { new: true });

            if (!userUpdated) {
                return res.status(400).json({ status: "error", message: "Error al actualizar" });
            }

            // Devolver respuesta
            return res.status(200).send({
                status: "success",
                message: "Metodo de actualizar usuario",
                user: userUpdated
            });

        } catch (error) {
            return res.status(500).send({
                status: "error",
                message: "Error al actualizar",
            });
        }

    });
}

// Método para cambiar la contraseña
const cambiarContraseña = async (req, res) => {
    const userId = req.user.id; // Asumiendo que el ID del usuario viene del token de autenticación
    const { passwordActual, nuevaPassword } = req.body;

    if (!passwordActual || !nuevaPassword) {
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar",
        });
    }

    try {
        // Buscar el usuario por ID
        const usuario = await User.findById(userId);

        if (!usuario) {
            return res.status(404).json({
                status: "error",
                message: "Usuario no encontrado",
            });
        }

        // Verificar la contraseña actual
        const passwordCorrecta = await bcrypt.compare(passwordActual, usuario.password);
        if (!passwordCorrecta) {
            return res.status(400).json({
                status: "error",
                message: "La contraseña actual es incorrecta",
            });
        }

        // Cifrar la nueva contraseña
        const passwordCifrada = await bcrypt.hash(nuevaPassword, 10);

        // Actualizar la contraseña del usuario
        usuario.password = passwordCifrada;
        await usuario.save();

        return res.status(200).json({
            status: "success",
            message: "Contraseña cambiada con éxito",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "error",
            message: "Error en el servidor",
        });
    }
};


// Exportar acciones
module.exports = {
    register,
    login,
    profile,
    list,
    update,
    cambiarContraseña
}