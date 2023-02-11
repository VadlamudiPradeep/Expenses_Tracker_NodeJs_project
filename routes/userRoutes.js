let express = require('express');

let router = express.Router();

let userControllers = require('../controllers/userControllers');

router.post('/signup' , userControllers.signup);

module.exports = router ; 