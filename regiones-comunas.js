const mongoose = require("mongoose");
const connection = require("./database/connection"); // Asegúrate de tener la ruta correcta a tu archivo de conexión
const Region = require("./models/region"); // Asegúrate de tener la ruta correcta a tu modelo de Región
const Comuna = require("./models/comuna"); // Asegúrate de tener la ruta correcta a tu modelo de Comuna
const regionesData = require("./comunas-regiones.json").regiones; // Asume que tienes un archivo regiones.json en tu proyecto

const agregarRegionesYComunas = async () => {
    await connection(); // Establece la conexión a la base de datos

    try {
        for (const regionData of regionesData) {
            // Crear y guardar la región
            const region = new Region({ nombre: regionData.region });
            await region.save();

            // Crear y guardar las comunas asociadas a esta región
            for (const nombreComuna of regionData.comunas) {
                const comuna = new Comuna({ nombre: nombreComuna, region: region._id });
                await comuna.save();
            }
        }
        console.log('Regiones y Comunas agregadas exitosamente');
    } catch (error) {
        console.error('Error al agregar regiones y comunas:', error);
    } finally {
        mongoose.disconnect(); // Cierra la conexión a la base de datos
    }
};

agregarRegionesYComunas();
