const {Router} = require('express');
const { check } = require('express-validator');
const {  
    getProducts,
    getProduct,
    createProduct,
    udpateProduct,
    deleteProduct
} = require('../controllers/products');

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');
const { categoryExists } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/productos
 */

router.get('/', getProducts);

router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    // check('id').custom(categoryExists),
    validarCampos
],
getProduct);

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validarJWT,
    validarCampos
],
createProduct);

router.put('/:id', [
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    // check('id').custom(categoryExists),
    check('ids', 'No es un ID valido').isMongoId(),
],
udpateProduct);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('ids', 'No es un ID valido').isMongoId(),
    validarCampos,
    // check('id').custom(categoryExists),
],
deleteProduct);


module.exports = router;