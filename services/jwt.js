// Importar dependencias
const jwt = require("jwt-simple");
const moment = require("moment");

// Clave secreta
const secret = "CLAVE_SECRETA_del_proyecto_DE_LA_JUNTA_DE_VECINOS_181197";

// Crear una funcion para generar tokens
const createToken = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        rut: user.rut,
        email: user.email,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix
    };

    // Devolver jwt token codificado
    return jwt.encode(payload, secret);
}

module.exports = {
    secret,
    createToken
}

