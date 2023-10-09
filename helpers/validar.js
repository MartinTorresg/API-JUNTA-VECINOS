const validator = require("validator");

const validarArticulo = (parametros) => {
    
    let validar_titulo = !validator.isEmpty(parametros.titulo) && 
                            validator.isLength(parametros.titulo, {min: 5, max: undefined});
    let validar_contenido = !validator.isEmpty(parametros.contenido);

    if(!validar_titulo || ! validar_contenido){
        throw new Error("No se ha validado la información !!");
    }
}

const validarProyecto = (parametros) => {
    
    let validar_nombre = !validator.isEmpty(parametros.nombre) && 
                            validator.isLength(parametros.nombre, {min: 5, max: undefined});
    let validar_descripcion = !validator.isEmpty(parametros.descripcion);

    if(!validar_nombre || ! validar_descripcion){
        throw new Error("No se ha validado la información !!");
    }
}

module.exports = {
    validarArticulo,
    validarProyecto
}