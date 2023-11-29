// espaciosController.js
const Espacio = require('../models/espacio'); // Asegúrate de tener este modelo creado

// Listar todos los espacios
const listarEspacios = async (req, res) => {
    try {
        const espacios = await Espacio.find();
        res.status(200).json(espacios);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los espacios", error });
    }
};

// Obtener detalles de un espacio específico
const obtenerEspacio = async (req, res) => {
    try {
        console.log("Buscando espacio con ID:", req.params.id);
        const espacio = await Espacio.findById(req.params.id);
        if (!espacio) {
            console.log("Espacio no encontrado con ID:", req.params.id);
            return res.status(404).json({ mensaje: 'Espacio no encontrado' });
        }
        console.log("Espacio encontrado:", espacio);
        res.status(200).json(espacio);
    } catch (error) {
        console.error("Error al obtener el espacio con ID:", req.params.id, error);
        res.status(500).json({ mensaje: "Error al obtener el espacio", error });
    }
};


// Crear un nuevo espacio
const crearEspacio = async (req, res) => {
    try {
        console.log("Creando espacio con datos:", req.body);
        const nuevoEspacio = new Espacio(req.body);
        await nuevoEspacio.save();
        console.log("Espacio creado con éxito:", nuevoEspacio);
        res.status(201).json({ mensaje: 'Espacio creado con éxito', espacio: nuevoEspacio });
    } catch (error) {
        console.error("Error al crear el espacio:", error);
        res.status(500).json({ mensaje: "Error al crear el espacio", error });
    }
};


// Actualizar un espacio existente
const actualizarEspacio = async (req, res) => {
    try {
        console.log("Actualizando espacio con ID:", req.params.id, "y datos:", req.body);
        const espacioActualizado = await Espacio.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!espacioActualizado) {
            console.log("Espacio no encontrado para actualizar:", req.params.id);
            return res.status(404).json({ mensaje: 'Espacio no encontrado' });
        }
        console.log("Espacio actualizado con éxito:", espacioActualizado);
        res.status(200).json({ mensaje: 'Espacio actualizado con éxito', espacio: espacioActualizado });
    } catch (error) {
        console.error("Error al actualizar el espacio:", error);
        res.status(500).json({ mensaje: "Error al actualizar el espacio", error });
    }
};


// Eliminar un espacio
const eliminarEspacio = async (req, res) => {
    try {
        const espacioEliminado = await Espacio.findByIdAndDelete(req.params.id);
        if (!espacioEliminado) {
            return res.status(404).json({ mensaje: 'Espacio no encontrado' });
        }
        res.status(200).json({ mensaje: 'Espacio eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar el espacio", error });
    }
};

module.exports = {
    listarEspacios,
    obtenerEspacio,
    crearEspacio,
    actualizarEspacio,
    eliminarEspacio
};
