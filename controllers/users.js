const {response, request} = require('express');
const Usuario = require('../models/user');
const bcrypt = require('bcryptjs');

const usersGet = async(req = request, res = response) =>{
    // res.send('Hola mundo')
    // const {q, nombre ='no name', apikey} = req.query;
    // res.status(403).json({
    //     msg:'get API - controlador',
    //     q, 
    //     nombre, 
    //     apikey
    // });

    /**
     * URL DE BUSQUEDA
     * http://localhost:8080/api/usuarios?desde=1&limite=3
     */
    const {limite = 1, desde = 0} = req.query;
    const query = {state: true};

    // const usuarios = await Usuario.find(query)
    //     .skip(Number(desde))
    //     .limit(Number(limite));
    // const total = await Usuario.countDocuments(query);


    /*  mandar arreglo con todas las promesas a ejecutar
        Cambiar las promesas al siguiente metodo para que ambas promesas se ejecuten por igual, y no de una por una (evitar tiempo de espera de ejecucion de promesas)
        el siguiente metodo ejecuta ambas promesas a la vez, y ejecutara las dos hasta que funcionen las dos*/
    // const [total, usuarios] desestructuracion de arreglos
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);
    
    res.json({
        total, 
        usuarios
    });
}

const usersPut = async(req, res = response) =>{
    // en el request viene el nombre del parametro del api(el llamado :id)
    const {ids} = req.params
    const {_id, password, google, ...resto} = req.body;

    //TODO validar contra base de datos
    if(password){
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(ids, resto);

    // res.status(403).json({
    //     msg:'put API - controlador',
    //     id
    // });
    res.json({
        msg:'put API - controlador',
        ids,
        usuario
    });
}

const usersPost = async(req, res = response) =>{


    const {name, email, password, role} = req.body;
    const usuario = new Usuario({name, email, password, role});
    // const body = req.body;
    // const usuario = new Usuario(body);

   
    // Encriptar contrasena ; Salt es un metodo que define que tan complicada sera la encriptacion (por defecto esta en 10)
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt); //hash es para encriptar en una sola via
    // Guardar en BD
    await usuario.save();

    res.status(201).json({
        msg:'post API - controlador',
        usuario
    });
}

const usersDelete = async(req, res = response) =>{
    // res.status(403).json({
    //     msg:'delete API - controlador'
    // });

    const {id} = req.params;

    // const uid = req.uid;

    /* Borrar registro fisicamente (permanente de la bd)
    const usuario = await Usuario.findByIdAndDelete(id); */

    const usuario = await Usuario.findByIdAndUpdate(id, {state:false});
    // const usuarioAutenticado = req.usuario;

    res.json({
        usuario,
        // usuarioAutenticado 
    });
}

module.exports = {
    usersGet,
    usersPut,
    usersPost,
    usersDelete
}