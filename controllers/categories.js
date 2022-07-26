const {response} = require('express');
const {Categoria} = require('../models');

// obtenerCategorias - paginado - total - populate(mongoose)
const getCategories = async(req, res = response) =>{

    const query = {state:true};

    const categorias = await Categoria.find(query).populate("user", 'name');
    const total = await Categoria.countDocuments(query);

    res.json({
        categorias,
        total
    });
}

// obtenerCategoria - populate(mongoose)
const getCategory = async(req, res = response) =>{
    const id = req.params;
    // console.log(id);

    const {name, user} = await Categoria.findOne({id}).populate("user", 'name');

    // console.log(user.name);

    res.json({
        msg:`El usuario ${user.name} dio de alta la categoria ${name}`
    });
}

const categoriesPost = async(req, res = response) =>{

    const name = req.body.name.toUpperCase();

    const categoriaDB = await Categoria.findOne({name});

    if(categoriaDB){
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        });
    }

    // generar la data a guardar
    const data = {
        name,
        user: req.usuario._id
    }

    const categoria = new Categoria(data);

    // Guardar en DB
    await categoria.save();

    res.status(201).json(categoria);

}

// actualizarCategoria
const updateCategory = async(req, res = response) =>{

    const {id} = req.params;
    // Desestructuramos 
    const {state, user, ...dataUpdate} = req.body;

    dataUpdate.name = dataUpdate.name.toUpperCase();
    dataUpdate.user = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, dataUpdate, {new: true});

    res.json({
        // msg:'Datos actualizados',
        // id,
        categoria
    });

}

// borrarCategoria
const deleteCategorie = async(req, res =  response) =>{
    const {id} = req.params;
    const changeState = {state:false};

    const categoria = await Categoria.findByIdAndUpdate(id, changeState, {new: true});

    res.status(200).json({
        categoria
    })
}

module.exports = {
    categoriesPost,
    getCategory,
    getCategories,
    updateCategory,
    deleteCategorie
}