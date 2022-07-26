const {Router} = require('express');
const { check } = require('express-validator');
const { categoriesPost, getCategory, getCategories, updateCategory, deleteCategorie } = require('../controllers/categories');

// const { validarCampos } = require('../middlewares/validar-campos');
// const {validarJWT} = require('../middlewares/validar-jwt');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');
const { categoryExists } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/categorias
 */

// Obtener todas las categorias - publico
router.get('/', getCategories);

// Obtener una categoria - publico
router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(categoryExists),
    validarCampos
],
getCategory);

// Crear categoria - privado - cualquier persona con un token valido
router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validarJWT,
    validarCampos
], 
categoriesPost);

// Actualizar categoria - privado - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(categoryExists),
    check('ids', 'No es un ID valido').isMongoId(),
],updateCategory);

// Borrar categoria - privado - admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('ids', 'No es un ID valido').isMongoId(),
    validarCampos,
    check('id').custom(categoryExists),
],
deleteCategorie);

module.exports = router;