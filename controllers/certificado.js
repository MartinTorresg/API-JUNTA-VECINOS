// Importar modelos
const Certificado = require("../models/certificado");
const nodemailer = require('nodemailer');
const PdfPrinter = require('pdfmake');


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

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'not.timmy49@gmail.com',
        pass: 'abyi wpap zbfp lamo'
    },
    tls: {
        rejectUnauthorized: false // Aceptar certificados autofirmados
    }
});

// Función para generar PDF
const generarPDF = async (datos) => {
    const fonts = {
        Helvetica: {
            normal: 'Helvetica',
            bold: 'Helvetica-Bold',
            italics: 'Helvetica-Oblique',
            bolditalics: 'Helvetica-BoldOblique'
        }
    };
    const printer = new PdfPrinter(fonts);
    const docDefinition = {
        content: [
            {
                image: 'E:/logo.png',
                width: 595, // Ancho del PDF en puntos (tamaño A4)
                height: 842, // Altura del PDF en puntos (tamaño A4)
                absolutePosition: { x: 0, y: 0 } // Posición en la esquina superior izquierda
            },
            { text: 'Certificado', style: 'header' },
            { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 2 }] },
            {
                columns: [
                    { width: '50%', text: `Nombre: ${datos.nombre}`, style: 'dataStyle' },
                    { width: '50%', text: `RUT: ${datos.rut}`, style: 'dataStyle' }
                ]
            },
            {
                columns: [
                    { width: '50%', text: `Dirección: ${datos.direccion}`, style: 'dataStyle' },
                    { width: '50%', text: `Región: ${datos.region}`, style: 'dataStyle' }
                ]
            },
            {
                columns: [
                    { width: '100%', text: `Comuna: ${datos.comuna}`, style: 'dataStyle' }
                ]
            }
        ],
        defaultStyle: {
            font: 'Helvetica',
            margin: [20, 0, 20, 0]
        },
        styles: {
            header: {
                fontSize: 22,
                bold: true,
                alignment: 'center',
                margin: [0, 20, 0, 20]
            },
            dataStyle: {
                fontSize: 12,
                margin: [0, 5]
            }
        }
    };
    ;

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    let chunks = [];
    let result;

    return new Promise((resolve, reject) => {
        pdfDoc.on('data', (chunk) => chunks.push(chunk));
        pdfDoc.on('end', () => {
            result = Buffer.concat(chunks);
            resolve(result);
        });
        pdfDoc.on('error', reject);
        pdfDoc.end();
    });
};

// Función para enviar el certificado por correo electrónico
const enviar_certificado = async (req, res) => {
    try {
        // Sanear y validar los datos de entrada
        const { nombre, rut, direccion, region, comuna, email } = req.body;
        if (!nombre || !rut || !direccion || !region || !comuna || !email) {
            return res.status(400).send('Datos incompletos o inválidos');
        }

        // Generar el PDF
        const pdfBuffer = await generarPDF({ nombre, rut, direccion, region, comuna });

        // Configuración del correo
        const mailOptions = {
            from: 'not.timmy49@gmail.com',
            to: email,
            subject: 'Tu Certificado',
            text: 'Aquí está tu certificado.',
            attachments: [
                {
                    filename: 'Certificado.pdf',
                    content: pdfBuffer,
                },
            ],
        };

        // Enviar el correo
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.error(error);
                res.status(500).send('Error al enviar el email');
            } else {
                console.log('Email enviado: ' + info.response);
                res.status(200).send('Email enviado con éxito');
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Exportar acciones
module.exports = {
    pruebaCertificado,
    crear_certificado,
    uno_certificado,
    listar_certificados,
    borrar_certificado,
    enviar_certificado 
};