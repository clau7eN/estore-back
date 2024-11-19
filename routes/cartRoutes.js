const express = require('express');
const { protect } = require('../controllers/userController.js')
const { addToCart, deleteFromCart, viewCart, clearCart } = require('../controllers/cartController.js')
const router = express.Router();

router.post('/cart', protect('buyer'), addToCart)
router.delete('/cart', protect('buyer'), deleteFromCart)
router.get('/cart', protect('buyer'), viewCart)
router.delete('/cart', protect('buyer'), clearCart)

module.exports = router;