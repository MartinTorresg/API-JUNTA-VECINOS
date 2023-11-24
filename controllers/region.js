// regionController.js
const Region = require('../models/region'); // Asegúrate de importar tu modelo de Region

// Obtener todas las regiones
const obtenerRegiones = async (req, res) => {
    try {
        const regiones = await Region.find();
        res.status(200).json(regiones);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener las regiones", error });
    }
};

// Exportar las funciones del controlador
module.exports = {
    obtenerRegiones
};
