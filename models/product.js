const {Schema, model} = require('mongoose');

const ProductSchema = Schema({
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
    },
    price:{
        type: Number,
        default: 0,
    },
    category:{
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required:true
    },
    description:{type:String},
    available:{type:Boolean, default:true },
    img: {type:String}
});

// Remover los campos __v y password que se muestra al crear el usuario en la bd (para que estos datos no se muestren)
ProductSchema.methods.toJSON = function(){
    const {__v, state, ...data} = this.toObject();
    return data;
}

module.exports = model('Producto', ProductSchema);
