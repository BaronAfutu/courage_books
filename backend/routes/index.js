var express = require('express');
var router = express.Router();
const AuthController = require('../controllers/AuthController');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.post('/signin', AuthController.signin); // returns page and keys

module.exports = router;
