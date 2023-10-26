// Importar modelos
const Certificado = require("../models/certificado");

// Acciones de prueba
const pruebaCertificado = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controllers/certificado.js",
        certificado: req.certificado
    });
}

// Registrar certificado
const crear_certificado = (req, res) => {
    // Recoger datos de la petición
    let parametros = req.body;

    // Comprobar que se envíen los datos necesarios (+ validación)
    if (!parametros.nombre || !parametros.rut || !parametros.direccion || !parametros.region || !parametros.comuna) {
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar",
        });
    }

    // Crear objeto de certificado
    let certificado = new Certificado(parametros);

    // Guardar el certificado en la base de datos
    certificado.save((error, certificadoGuardado) => {
        if (error || !certificadoGuardado) {
            return res.status(500).send({ status: "error", message: "Error al guardar el certificado" });
        }
        // Devolver resultado
        return res.status(200).json({
            status: "success",
            message: "Certificado registrado correctamente",
            certificado: certificadoGuardado
        });
    });
}

const uno_certificado = (req, res) => {
    // Recoger un ID por la URL
    let id = req.params.id;

    // Buscar el certificado
    Certificado.findById(id, (error, certificado) => {
        // Si no existe, devolver error
        if (error || !certificado) {
            return res.status(404).json({
                status: "error",
                message: "No se ha encontrado el certificado"
            });
        }
        // Devolver resultado
        return res.status(200).json({
            status: "success",
            certificado
        });
    });
}

const listar_certificados = (req, res) => {
    Certificado.find({}, (error, certificados) => {
        if (error || !certificados) {
            return res.status(404).json({
                status: "error",
                message: "No se han encontrado certificados"
            });
        }
        return res.status(200).send({
            status: "success",
            contador: certificados.length,
            certificados
        });
    });
}

const borrar_certificado = (req, res) => {
    let certificadoId = req.params.id;

    Certificado.findOneAndDelete({ _id: certificadoId }, (error, certificadoBorrado) => {
        if (error || !certificadoBorrado) {
            return res.status(500).json({
                status: "error",
                mensaje: "Error al borrar el certificado"
            });
        }

        return res.status(200).json({
            status: "success",
            certificado: certificadoBorrado,
            mensaje: "Certificado eliminado correctamente"
        });
    });
};

// Exportar acciones
module.exports = {
    pruebaCertificado,
    crear_certificado,
    uno_certificado,
    listar_certificados,
    borrar_certificado
};
