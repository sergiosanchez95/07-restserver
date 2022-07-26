const {response, json} = require('express');
const {Producto} = require('../models');

const getProducts = async(req, res = response) =>{

    const query = {state:true};
    const productos = await Producto.find(query)
                                    .populate("user", "name")
                                    .populate("category", "name")

    res.json({
        productos
    })

}

const getProduct = async(req, res = response) =>{

    const id = req.params;
    // console.log(id);

    const {name, user} = await Producto.findOne({id}).populate("user", 'name');

    // console.log(user.name);

    res.json({
        msg:`El usuario ${user.name} dio de alta el producto ${name}`
    });

}

const createProduct = async(req, res = response) =>{

    const { state, user, ...body }= req.body;

    const productDB = await Producto.findOne({name: body.name})

    if(productDB){
        return res.status(400).json({
            msg: `El producto ${productDB.name}, ya existe`
        });
    }

    const data = {
        name: body.name.toUpperCase(),
        user: req.usuario._id,
        // price: req.body.price,
        // category: req.body.category,
        // description: req.body.description
        ...body
    }

    const producto = new Producto(data);

    await producto.save();

    res.json({
        data
    })

}

const udpateProduct = async(req, res = response) =>{

    const {id} = req.params;
    // Desestructuramos 
    const {state, user, ...dataUpdate} = req.body;

    if(dataUpdate.name){
        dataUpdate.name = dataUpdate.name.toUpperCase();
    }
    dataUpdate.user = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, dataUpdate, {new: true});

    res.json({
        // msg:'Datos actualizados',
        // id,
        producto
    });

}

const deleteProduct = async(req, res = response) =>{

    const {id} = req.params;
    const changeState = {state:false};

    const producto = await Producto.findByIdAndUpdate(id, changeState, {new: true});

    res.status(200).json({
        producto
    })

}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    udpateProduct,
    deleteProduct
}