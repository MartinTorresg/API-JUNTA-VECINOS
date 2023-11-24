// comunaController.js
const Comuna = require('../models/comuna'); // Importa tu modelo de Comuna

// Obtener todas las comunas
const obtenerComunas = async (req, res) => {
    try {
        const comunas = await Comuna.find();
        res.status(200).json(comunas);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener las comunas", error });
    }
};

// Obtener comunas por región
const obtenerComunasPorRegion = async (req, res) => {
    try {
        const { regionId } = req.params;
        const comunas = await Comuna.find({ region: regionId });
        res.status(200).json(comunas);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener las comunas", error });
    }
};

module.exports = {
    obtenerComunas,
    obtenerComunasPorRegion
};
