const express =  require('express');
const cors = require('cors');
const {dbConnection}= require('../database/config');
const fileUpload = require('express-fileupload');

class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths ={
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            usuarios: '/api/usuarios',
            uploads: '/api/uploads'
        }
        // this.usuariosPath = '/api/usuarios';
        // this.authPath = '/api/auth';

        // Conectar a base de datos
        this.conectarDB()
        // Middleware
        this.middlewares()
        // Rutas de aplicacion
        this.routes()
    }

    async conectarDB(){
        await dbConnection()
    }

    middlewares(){
        // CORS
        this.app.use(cors());

        // Parseo y lectura del body
        this.app.use(express.json());

        // directorio publico
        this.app.use(express.static('public'));

        // Fileupload - carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath : true
        }))
    }

    // Definir rutas
    routes(){
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.categorias, require('../routes/categories'));
        this.app.use(this.paths.productos, require('../routes/products'));
        this.app.use(this.paths.usuarios, require('../routes/users'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
    }



    listen(){
        this.app.listen(this.port, ()=>{
            console.log('Servidor corriendo en puerto ', this.port);
        });
    }

}

module.exports = Server;