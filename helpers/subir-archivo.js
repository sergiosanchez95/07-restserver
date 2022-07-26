const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif', 'jfif'], carpeta = '') =>{

    return new Promise((resolve, reject)=>{

        const {archivo} = files;
        // split corta el estring (en este caso detecta donde haya un punto, corta el string y los guarda en un array)
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];
    
        // Validar la extension
        if(!extensionesValidas.includes(extension)){
            return reject(`La extension ${extension} no es permitida, ${extensionesValidas}`);
        }
        // res.json({extension});
    
        // generar nuevo nombre a archivo
        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join( __dirname, '../uploads/', carpeta, nombreTemp);
      
        archivo.mv(uploadPath, (err)=> {
          if (err) {
            return reject(err);
          }
      
          resolve(nombreTemp);
        });

    })

}

module.exports = {
    subirArchivo
}