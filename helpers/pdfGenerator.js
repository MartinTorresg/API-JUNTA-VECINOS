// Importar modelos
const PdfPrinter = require('pdfmake');

// Función para generar PDF
const generarPDF = async (datos) => {
    console.log("Datos recibidos para PDF:", datos);
    const regionNombre = datos.region || 'Región no especificada';
    const comunaNombre = datos.comuna || 'Comuna no especificada';
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
                    { width: '50%', text: `Región: ${regionNombre}`, style: 'dataStyle' }
                ]
            },
            {
                columns: [
                    { width: '100%', text: `Comuna: ${comunaNombre}`, style: 'dataStyle' }
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

module.exports = { generarPDF };
