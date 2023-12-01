// UserController.js
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("../services/jwt");
const nodemailer = require('nodemailer');
const Inscripcion = require("../models/inscripcion");
const PdfPrinter = require('pdfmake');
const { generarPDF } = require('../helpers/pdfGenerator');

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

    // Verificar si faltan datos esenciales
    if (!params.name || !params.email) {
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar",
        });
    }

    try {
        // Verificar si el usuario ya existe
        const userExist = await User.findOne({ email: params.email.toLowerCase() });
        if (userExist) {
            return res.status(409).json({
                status: "error",
                message: "El usuario ya está registrado",
            });
        }

        // Generar la contraseña automáticamente
        const generatedPassword = params.name.substring(0, 3) + params.surname.substring(0, 3) + params.rut.substring(params.rut.length - 3);
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);

        // Crear el usuario
        const user = new User({
            name: params.name,
            surname: params.surname,
            rut: params.rut,
            email: params.email,
            password: hashedPassword,
            region: params.region,
            comuna: params.comuna
            // Añadir otros campos si es necesario
        });

        const userStored = await user.save();

        // Cambiar el estado de la inscripción si existe
        if (params.idInscripcion) {
            await Inscripcion.findByIdAndUpdate(params.idInscripcion, { estado: 'Aprobada' });
        }

        // Enviar correo de confirmación con la contraseña generada
        enviarCorreoConfirmacion(userStored.email, userStored.name, generatedPassword);

        res.status(200).json({
            status: "success",
            user: userStored
        });
    } catch (error) {
        res.status(500).send({ status: "error", message: "Error al guardar el usuario" });
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
    console.log("Iniciando el proceso de cambio de contraseña");
    const userId = req.user.id; // Asumiendo que el ID del usuario viene del token de autenticación
    const { passwordActual, nuevaPassword } = req.body;

    if (!passwordActual || !nuevaPassword) {
        console.log("Error: Faltan datos por enviar");
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar",
        });
    }

    try {
        console.log(`Buscando usuario con ID: ${userId}`);
        // Buscar el usuario por ID
        const usuario = await User.findById(userId);

        if (!usuario) {
            console.log("Error: Usuario no encontrado");
            return res.status(404).json({
                status: "error",
                message: "Usuario no encontrado",
            });
        }

        console.log("Verificando la contraseña actual");
        // Verificar la contraseña actual
        const passwordCorrecta = await bcrypt.compare(passwordActual, usuario.password);
        if (!passwordCorrecta) {
            console.log("Error: La contraseña actual es incorrecta");
            return res.status(400).json({
                status: "error",
                message: "La contraseña actual es incorrecta",
            });
        }

        console.log("Cifrando la nueva contraseña");
        // Cifrar la nueva contraseña
        const passwordCifrada = await bcrypt.hash(nuevaPassword, 10);

        console.log("Actualizando la contraseña del usuario");
        // Actualizar la contraseña del usuario
        usuario.password = passwordCifrada;
        await usuario.save();

        console.log("Contraseña cambiada con éxito");
        return res.status(200).json({
            status: "success",
            message: "Contraseña cambiada con éxito",
        });

    } catch (error) {
        console.error("Error durante el proceso de cambio de contraseña", error);
        return res.status(500).json({
            status: "error",
            message: "Error en el servidor",
        });
    }
};


const getTotalUsers = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalVecinos = 500; // Este es un valor de ejemplo. Puedes obtenerlo de una fuente más dinámica si es necesario.
        const tasaRegistro = (totalUsers / totalVecinos) * 100;

        res.status(200).json({
            status: "success",
            tasaRegistro
        });
    } catch (error) {
        res.status(500).send({
            status: "error",
            message: "Error al obtener la tasa de registro",
            error
        });
    }
};

const getKPIRegistroVecinos = async (req, res) => {
    try {
        const totalVecinos = 500; // Sustituye este valor por el total real de vecinos de tu unidad territorial

        // Calcular el valor actual del KPI
        const totalUsuariosRegistrados = await User.countDocuments();
        const tasaRegistroActual = (totalUsuariosRegistrados / totalVecinos) * 100;

        // Obtener datos históricos
        const historial = await User.aggregate([
            {
                $group: {
                    _id: { 
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    month: "$_id.month",
                    count: 1
                }
            },
            { $sort: { year: 1, month: 1 } } // Ordenar los datos por año y mes
        ]);

        // Convertir el recuento a una tasa de registro
        const historialTasa = historial.map(item => ({
            fecha: `${item.year}-${item.month}`,
            tasa: (item.count / totalVecinos) * 100
        }));

        res.status(200).json({
            status: "success",
            valorActual: tasaRegistroActual.toFixed(2),
            historial: historialTasa
        });
    } catch (error) {
        res.status(500).send({
            status: "error",
            message: "Error al obtener los datos del KPI",
            error
        });
    }
};

const descargarCertificadoUsuario = async (req, res) => {
    try {
        console.log("Usuario obtenido del token:", req.user);
        const userId = req.user.id;
        const user = await User.findById(userId)
                                .populate('region', 'nombre') // Asegúrate de que 'nombre' es el campo correcto en tu modelo de Region
                                .populate('comuna', 'nombre');
        if (!user) {
            console.log("Usuario no encontrado en la base de datos");
            return res.status(404).send('Usuario no encontrado');
        }

        // Datos del usuario para el certificado
        const datosCertificado = {
            nombre: user.name,
            rut: user.rut,
            direccion: user.direccion, // Asegúrate de que estos campos existan en tu modelo de usuario
            region: user.region ? user.region.nombre : 'Región no especificada',
            comuna: user.comuna ? user.comuna.nombre : 'Comuna no especificada',
        };

        // Generar el PDF con la información del usuario
        const pdfBuffer = await generarPDF(datosCertificado);

        // Establecer los encabezados para la descarga del PDF
        res.setHeader('Content-Disposition', 'attachment; filename=Certificado.pdf');
        res.setHeader('Content-Type', 'application/pdf');

        // Enviar el PDF
        res.send(pdfBuffer);

    } catch (error) {
        console.log("Error en descargarCertificadoUsuario:", error);
        res.status(500).send('Error interno del servidor');
    }
};



// Exportar acciones
module.exports = {
    register,
    login,
    profile,
    list,
    update,
    cambiarContraseña,
    getTotalUsers,
    getKPIRegistroVecinos,
    descargarCertificadoUsuario,
    generarPDF
}