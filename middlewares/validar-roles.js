const { response } = require("express")


const esAdminRole = (req, res =  response, next) =>{

    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        });
    }

    const {role, name} = req.usuario;
    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${name} no es un usuario ADMIN - No puede realizar la accion disparada`
        });
    }

    next();
}

// al colocar ...roles, recibimos todos los parametros introducidos a la funcion, y este ...roles los convierte en un arreglo con el mismo nombre
const tieneRole = ( ...roles ) =>{
    return (req, res =  response, next) =>{
        // console.log(roles);
        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            });
        }

        if(!roles.includes(req.usuario.role)){
            return res.status(401).json({
                msg: `El servicio requiere uno de estos ${roles}`
            });
        }

        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRole
}