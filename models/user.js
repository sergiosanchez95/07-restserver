const {Schema, model} = require('mongoose');

const UsuarioSchema = Schema({
    name:{
        type:String,
        required:[true,'El nombre es obligatorio']
    },
    email:{
        type:String,
        required:[true,'El correo es obligatorio'],
        unique: true
    },
    password:{
        type:String,
        required:[true,'La contrasena es obligatorio'],
    },
    img:{
        type:String,
    },
    role:{
        type:String,
        required:true,
        emun:['ADMIN_ROLE', 'USER_ROLE']
    },
    state:{
        type:Boolean,
        default:true
    },
    google:{
        type:Boolean,
        default:false
    }
});

// Remover los campos __v y password que se muestra al crear el usuario en la bd (para que estos datos no se muestren)
UsuarioSchema.methods.toJSON = function(){
    const {__v, password, _id,...usuario} = this.toObject();
    // cambiar el nombre de _id a uid de manera grafica
    usuario.uid = _id;
    return usuario;
}

module.exports = model('Usuario', UsuarioSchema);