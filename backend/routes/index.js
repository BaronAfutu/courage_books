var express = require('express');
var router = express.Router();
const AuthController = require('../controllers/AuthController');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
})

router.get('/books/', (req, res) => {
  res.render('books', { title: 'Books' });
})
router.get('/books/:category/:slug', (req, res) => {
  res.render('book', { title: req.params.slug });
})

router.get('/cart', (req, res) => {
  res.render('cart', { title: 'Cart' });
})

router.get('/checkout', (req, res) => {
  res.render('checkout', { title: 'Checkout' })
})

router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact' })
})

router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.post('/signin', AuthController.signin); // returns page and keys

module.exports = router;
