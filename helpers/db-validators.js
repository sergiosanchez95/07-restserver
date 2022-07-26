// const { Categoria } = require('../models');
// const Role = require('../models/role');
// const Usuario = require('../models/user');
const {Categoria, Role, Usuario} = require('../models');


const esRoleValido = async(role = '')=>{
    const roleExist = await Role.findOne({role});
    if(!roleExist){
        throw new Error(`El rol ${role} no esta registrado en la BD`)
    }
}

const emailExist = async(email = '') =>{
    const emailExist = await Usuario.findOne({email});
    if(emailExist){
        throw new Error(`El correo ${email} ya se encuentra registrado`)
    }
}

const userByIdExist = async(id) =>{
    // si el usuario existe, deja pasar el id y se ejecuta la funcion
    console.log(id);
    const userExist = await Usuario.findById(id);
    // si no existe el id, se detiene y se lanza el siguiente error
    if(!userExist){
        throw new Error(`El id ${id} no existe`)
    }
}

const categoryExists = async(id) =>{
    console.log(id);

    const categoriaExiste = await Categoria.findById(id);

    if(!categoriaExiste){
        throw new Error(`El id ${id} no existe`) 
    }
}

/**
 * Validar colecciones permitidas (apis upload imagenes)
 */
const coleccionesPermitidas = (coleccion = '', colecciones = []) =>{

    const incluidad = colecciones.includes(coleccion);
    if(!incluidad){
        throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`)
    }

    return true;
}


module.exports = {
    esRoleValido,
    emailExist,
    userByIdExist,
    categoryExists,
    coleccionesPermitidas
}