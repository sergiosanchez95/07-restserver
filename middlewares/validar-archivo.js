const { response } = require("express");
const { model } = require("mongoose")

const validarArchivoSubir = (req, res = response, next) =>{
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({msg:'No hay archivos en la peticion - validarArchivoSubir'});
      }
    
    next();
}

module.exports = {
    validarArchivoSubir,
}