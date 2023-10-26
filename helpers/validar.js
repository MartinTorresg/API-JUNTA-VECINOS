const validator = require("validator");

const validarArticulo = (parametros) => {

    let validar_titulo = !validator.isEmpty(parametros.titulo) &&
        validator.isLength(parametros.titulo, { min: 5, max: undefined });
    let validar_contenido = !validator.isEmpty(parametros.contenido);

    if (!validar_titulo || !validar_contenido) {
        throw new Error("No se ha validado la información !!");
    }
};

const validarProyecto = (parametros) => {

    let validar_nombre = !validator.isEmpty(parametros.nombre) &&
        validator.isLength(parametros.nombre, { min: 5, max: undefined });
    let validar_descripcion = !validator.isEmpty(parametros.descripcion);

    if (!validar_nombre || !validar_descripcion) {
        throw new Error("No se ha validado la información !!");
    }
};

const validarActividad = (parametros) => {
    let validar_nombre = !validator.isEmpty(parametros.nombre) &&
        validator.isLength(parametros.nombre, { min: 5, max: undefined });

    let validar_fecha = validator.isDate(parametros.fecha);

    let validar_lugar = !validator.isEmpty(parametros.lugar);

    let validar_cupo = !validator.isEmpty(parametros.cupo) &&
        validator.isInt(parametros.cupo, { min: 1 });

    if (!validar_nombre || !validar_fecha || !validar_lugar || !validar_cupo) {
        throw new Error("No se ha validado la información de la actividad!!");
    }
};

const validarCertificado = (parametros) => {
    let validar_nombre = !validator.isEmpty(parametros.nombre) &&
        validator.isLength(parametros.nombre, { min: 5, max: undefined });

    let validar_rut = !validator.isEmpty(parametros.rut) &&
        // Agrega aquí la lógica de validación específica para los números de RUT si es necesario
        true; // Reemplaza true con la lógica real de validación del RUT

    let validar_direccion = !validator.isEmpty(parametros.direccion);

    let validar_region = !validator.isEmpty(parametros.region);

    let validar_comuna = !validator.isEmpty(parametros.comuna);

    if (!validar_nombre || !validar_rut || !validar_direccion || !validar_region || !validar_comuna) {
        throw new Error("No se ha validado la información del certificado!!");
    }
};

module.exports = {
    validarArticulo,
    validarProyecto,
    validarActividad,
    validarCertificado
}