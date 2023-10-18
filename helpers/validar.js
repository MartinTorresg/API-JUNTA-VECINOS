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
        validator.isLength(parametros.nombre, { min: 3, max: undefined });
    let validar_fecha = !validator.isEmpty(parametros.fecha) &&
        validator.isDate(parametros.fecha);
    let validar_lugar = !validator.isEmpty(parametros.lugar) &&
        validator.isLength(parametros.lugar, { min: 3, max: undefined });



    if (!validar_nombre || !validar_fecha || !validar_lugar) {
        throw new Error("No se ha validado la información de la actividad!!");
    }
};

module.exports = {
    validarArticulo,
    validarProyecto,
    validarActividad
}