const { response } = require("express");
const { Usuario, Categoria, Producto } = require("../models");
const { ObjectId } = require('mongoose').Types;

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async(termino = '', res = response) =>{

    // Buscar usuario por UID
    const esMongoId = ObjectId.isValid(termino); //TRUE
    if(esMongoId){
        const usuario = await Usuario.findById(termino);
        return res.json({
            // si el usuario existe regreso el mismo, si no existe regresa un arreglo vacio (para no regresar null)
            results: (usuario) ? [usuario] : []
        })
    }

    // Expresion regular, para que la busqueda sea sensible a mayusculas/minusculas
    const regex = new RegExp(termino, 'i');

    // Buscar usuairo por nombre
    const usuarios = await Usuario.find({
        $or: [{name:regex}, {email: regex}],
        $and: [{state: true}]
    });

    res.json({
        results: usuarios
    })

}

const buscarCategorias = async(termino = '', res = response) =>{

    // Buscar usuario por UID
    const esMongoId = ObjectId.isValid(termino); //TRUE
    if(esMongoId){
        const categoria = await Categoria.findById(termino);
        return res.json({
            // si el usuario existe regreso el mismo, si no existe regresa un arreglo vacio (para no regresar null)
            results: (categoria) ? [categoria] : []
        })
    }

    // Expresion regular, para que la busqueda sea sensible a mayusculas/minusculas
    const regex = new RegExp(termino, 'i');

    // Buscar usuario por nombre
    const categorias = await Categoria.find({
        $and: [{name:regex}, {state: true}]
    });
    
    res.json({
        results: categorias
    })
}

const buscarProductos = async(termino = '', res = response) =>{

    // Buscar usuario por UID
    const esMongoId = ObjectId.isValid(termino); //TRUE
    if(esMongoId){
        const producto = await Producto.findById(termino)
                                    .populate('category', 'name');
        return res.json({
            // si el usuario existe regreso el mismo, si no existe regresa un arreglo vacio (para no regresar null)
            results: (producto) ? [producto] : []
        })
    }

    // Expresion regular, para que la busqueda sea sensible a mayusculas/minusculas
    const regex = new RegExp(termino, 'i');

    // Buscar usuario por nombre
    const productos = await Producto.find({
        $and: [{name:regex}, {state: true}]
    })                              .populate('category', 'name');
    
    res.json({
        results: productos
    })
}

const buscar = (req, res = response) =>{

    const { coleccion, termino } = req.params;

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res)
            break;
        case 'categorias':
            buscarCategorias(termino, res)
            break;
        case 'productos':
            buscarProductos(termino, res)
        break;
        default:
            res.status(500).json({
                msg: 'Ninguna busqueda'
            })
            
    }

}

module.exports = {
    buscar
}