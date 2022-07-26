const {Router} = require('express');
const { check } = require('express-validator');

const { 
    usersGet, 
    usersPut, 
    usersPost, 
    usersDelete 
} = require('../controllers/users');
const { 
    esRoleValido, 
    emailExist, 
    userByIdExist 
} = require('../helpers/db-validators');

// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');
const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares/index');

const router = Router();

router.get('/', usersGet);

router.put('/:ids', [
    check('ids', 'No es un ID valido').isMongoId(),
    check('ids').custom(userByIdExist),
    check('role').custom( esRoleValido ),
    validarCampos
],usersPut);

router.post('/', [
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('email','El correo no es valido').isEmail(),
    check('email').custom( emailExist ),
    check('password','El password debe contener 6 o mas caracteres').isLength({min:6}),
    // check('role','No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom( esRoleValido ),
    validarCampos
],usersPost);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(userByIdExist),
    validarCampos
],usersDelete);


module.exports = router;