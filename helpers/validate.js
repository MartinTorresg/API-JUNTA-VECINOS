const validator = require("validator");

const validate = (params) => {
    let name = !validator.isEmpty(params.name) &&
        validator.isLength(params.name, { min: 3, max: undefined }) &&
        validator.isAlpha(params.name, "es-ES");

    let surname = !validator.isEmpty(params.surname) &&
        validator.isLength(params.surname, { min: 3, max: undefined }) &&
        validator.isAlpha(params.surname, "es-ES");

    let rut = !validator.isEmpty(params.rut) &&
        validator.isLength(params.rut, { min: 2, max: undefined });

    let email = !validator.isEmpty(params.email) &&
        validator.isEmail(params.email);

    let password = !validator.isEmpty(params.password);

    if (!name || !surname || !rut || !email || !password) {
        throw new Error("No se ha superado la validación");
    } else {
        console.log("validacion superada");
    }
}

module.exports = validate
