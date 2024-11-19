const express = require('express');
const { protect } = require('../controllers/userController.js')
const { registration, auth } = require('../controllers/userController.js')
const router = express.Router();

router.post('/registration', registration);
router.post('/auth', auth)

module.exports = router;