const {response, json} = require('express');
const { findOne } = require('../models/user');
const Usuario =  require('../models/user');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req, res =  response) =>{

    const {email, password} = req.body;

    // se usa try catch en caso que algo salga mal
    try {

        // Verificar si el email existe
        const usuario = await Usuario.findOne({email});
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son corretos - email'
            })
        }
        // verificar que el usuario se encuentre activo en la bd
        if (!usuario.state) {
            return res.status(400).json({
                msg: 'Usuario / Password no son corretos - estado: false'
            })
        }
        // verificar el password
        const validPassword = bcrypt.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario / Password no son corretos - password'
            })
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id)

        res.json({
            msg:'Login ok',
            usuario,
            token
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg:'Algo salio mal, hable con el desarrollador'
        })
    }

};

const googleSignIn = async(req, res =  response) =>{
    // recibir id_token desde el enlace fetch que se encuentra en el index
    const {id_token} = req.body;

    try {

        const {name, picture, email} = await googleVerify(id_token);
        // console.log(name, email);

        let usuario = await Usuario.findOne({email});
        console.log(usuario);

        if(!usuario){
            // si el usuario no existe, hay que crearlo
            const data = {
                name,
                email,
                password: ':P',
                // picture,
                google: true
            };
            usuario = new Usuario(data);
            await usuario.save();
        }

        // Si el usuario en BD se encuentra dado de baja
        if(!usuario.state){
            return res.status(401).json({
                msg: 'Usuario bloqueado, hable con el admin'
            })
        }

        // Generar jwt
        const token = await generarJWT(usuario.id)

        res.json({
            // msg: 'Todo bien',
            // id_token
            usuario,
            token
        })
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar' + error,
        })
    }


}

module.exports = {
    login,
    googleSignIn
}