const express = require('express');
const { protect } = require('../controllers/userController.js')
const { addProduct, getProducts, deleteProduct, editProduct} = require('../controllers/productController.js')
const router = express.Router();

router.post('/createProduct', protect('seller'), addProduct);
router.get('/getProducts', getProducts);
router.delete('/deleteProduct', protect('seller'), deleteProduct);
router.put('/editProduct/:id', protect('seller'), editProduct)

module.exports = router;