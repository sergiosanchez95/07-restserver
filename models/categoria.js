const {Schema, model} = require('mongoose');

const CategorySchema = Schema({
    name:{
        type:String,
        required:[true, 'El nombre es obligatorio'],
        unique: true
    },
    state:{
        type:Boolean,
        default:true,
        required:true
    },
    user:{
        type: Schema.Types.ObjectId, //Objeto que ya existe en mongo
        ref:'Usuario',
        required:true
    }
    
});

// Remover los campos __v y password que se muestra al crear el usuario en la bd (para que estos datos no se muestren)
CategorySchema.methods.toJSON = function(){
    const {__v, state, ...data} = this.toObject();
    return data;
}

module.exports = model('Categoria', CategorySchema);
