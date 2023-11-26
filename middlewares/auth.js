// Importar modulos
const jwt = require("jwt-simple");
const moment = require("moment");

// Importar clave secrete
const libjwt = require("../services/jwt");
const secret = libjwt.secret;

// MIDDLEWARE de autenticacion
exports.auth = (req, res, next) => {
    console.log("Ingreso al middleware de autenticación");

    if (!req.headers.authorization) {
        console.log("No se encontró la cabecera de autorización");
        return res.status(403).send({
            status: "error",
            message: "La petición no tiene la cabecera de autenticación"
        });
    }

    let token = req.headers.authorization.replace(/^Bearer\s+/, "");
    console.log("Token recibido en el servidor:", token);

    try {
        let payload = jwt.decode(token, secret);
        console.log("Payload del token:", payload);

        if (payload.exp <= moment().unix()) {
            console.log("Token expirado");
            return res.status(401).send({
                status: "error",
                message: "Token expirado"
            });
        }

        req.user = payload;
    } catch (error) {
        console.log("Error al decodificar el token:", error);
        return res.status(404).send({
            status: "error",
            message: "Token invalido",
            error
        });
    }

    next();
};
