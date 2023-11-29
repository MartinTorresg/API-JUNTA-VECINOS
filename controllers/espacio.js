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

// Funciones auxiliares
const convertirAHoras = (horaStr) => {
    if (typeof horaStr !== 'string' || !horaStr.includes(':')) {
      throw new Error('Argumento inválido para convertirAHoras:', horaStr);
    }
  
    const [horas, minutos] = horaStr.split(':').map(Number);
    const fecha = new Date();
    fecha.setHours(horas, minutos, 0, 0);
    return fecha;
  };
  

const convertirAString = (fecha) => {
    return fecha.toTimeString().substring(0, 5);
};

const generarHorariosDisponibles = (horaInicioStr, horaFinStr) => {
    const horaInicio = convertirAHoras(horaInicioStr);
    const horaFin = convertirAHoras(horaFinStr);

    let horarios = [];
    let horaActual = new Date(horaInicio.getTime());

    while (horaActual < horaFin) {
        let horaBloqueFin = new Date(horaActual.getTime());
        horaBloqueFin.setHours(horaBloqueFin.getHours() + 1);

        if (horaBloqueFin > horaFin) {
            horaBloqueFin = new Date(horaFin.getTime());
        }

        horarios.push({
            inicio: convertirAString(horaActual),
            fin: convertirAString(horaBloqueFin),
        });

        horaActual.setHours(horaActual.getHours() + 1);
    }

    return horarios;
};

// Crear un nuevo espacio
const crearEspacio = async (req, res) => {
    try {
        console.log("Datos recibidos para crear espacio:", req.body);
        
        const { horarioInicio, horarioFin } = req.body;

        // Agrega un chequeo para asegurarte de que horarioInicio y horarioFin son cadenas de texto
        if (typeof horarioInicio !== 'string' || typeof horarioFin !== 'string') {
            return res.status(400).json({
                mensaje: 'Datos de horario inválidos',
            });
        }

        // Intenta generar los horarios disponibles
        try {
            req.body.horariosDisponibles = generarHorariosDisponibles(horarioInicio, horarioFin);
        } catch (error) {
            console.error("Error al generar horarios disponibles:", error);
            return res.status(400).json({
                mensaje: 'Error al procesar los horarios',
                detalle: error.message,
            });
        }

        const nuevoEspacio = new Espacio(req.body);
        await nuevoEspacio.save();
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
    eliminarEspacio,
    convertirAHoras,
    convertirAString,
    generarHorariosDisponibles

};
