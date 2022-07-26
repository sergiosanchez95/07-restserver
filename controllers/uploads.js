const path = require('path');
const fs = require('fs');
const { response } = require("express");
const { model } = require("mongoose");
const { subirArchivo } = require("../helpers");

const {Usuario, Producto} = require('../models')

const cargarArchivo = async(req, res = response) =>{

    try {
      // Imagenes
      const nombre = await subirArchivo(req.files, undefined, 'imgs');
      // const nombre = await subirArchivo(req.files, ['txt','md'], 'textos');
      res.json({
        nombre
      });
    } catch (error) {
      res.status(400).json({msg: error})
    }
   
}

const actualizarArchivo = async(req, res = response) =>{
  
  const {id, coleccion} = req.params;

  let modelo;
  switch (coleccion) {
    case 'usuarios':
        modelo = await Usuario.findById(id);
        if(!modelo){
            return res.status(400).json({
              msg: `No existe un usuario con el id ${id}`
            })
        }
    break;
    case 'productos':
        modelo = await Producto.findById(id);
        if(!modelo){
          return res.status(400).json({
            msg: `No existe un producto con el id ${id}`
          });
        }
    break;
  
    default:
      return res.status(500).json({msg: 'Seme olvido validar esto'})
  }

  // Limpiar imagenes previas, evitar que se acumulen las imagenes subidas en el servidor. Se sube la nueva imagen y se borra la anterior.
  if (modelo.img){
    // Hay que borrar la imagen del servidor
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
    if(fs.existsSync(pathImagen)){
      fs.unlinkSync(pathImagen);
    }
  }

  const nombre = await subirArchivo(req.files, undefined, coleccion);
  modelo.img = nombre;
  
  await modelo.save();

  res.json(modelo);

}

const mostrarImagen = async(req, res = response) =>{

  const {id, coleccion} = req.params;

  let modelo;
  switch (coleccion) {
    case 'usuarios':
        modelo = await Usuario.findById(id);
        if(!modelo){
            return res.status(400).json({
              msg: `No existe un usuario con el id ${id}`
            })
        }
    break;
    case 'productos':
        modelo = await Producto.findById(id);
        if(!modelo){
          return res.status(400).json({
            msg: `No existe un producto con el id ${id}`
          });
        }
    break;
  
    default:
      return res.status(500).json({msg: 'Seme olvido validar esto'})
  }

  //Obtener imagen guardada
  if (modelo.img){
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
    if(fs.existsSync(pathImagen)){
      return res.sendFile(pathImagen);
    }
  }

  const noImagen = path.join(__dirname, '../assets', '', 'no-image.jpg');
  res.sendFile(noImagen);

}

module.exports = {
    cargarArchivo,
    actualizarArchivo,
    mostrarImagen
}