const { response, json } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/user');

const validarJWT = async(req, res = response, next) =>{

    const token =  req.header('x-token');
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }

    try {
        // la verificacion del token pide (token, secretORpublicKey). la key se guardo en el .env
        const {uid}= jwt.verify(token, process.env.SECRETPRIVATKEY);
        // console.log(payload);
        
        // leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);

        //verificar si el usuario se encuentra registrado en la bd
        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe en BD'
            });
        }

        //verificar si el uid tiene estado en true
        // con esto verificamos que el usuario se encuentre activo, de no ser asi no se debe poder usar su token
        if (!usuario.state) {
            return res.status(401).json({
                msg: 'Token no valido - usuario con estado: false'
            });
        }

        req.usuario = usuario;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg:'Token no valido'
        })
    }

    // console.log(token);
    
    next();

}

module.exports = {
    validarJWT
}