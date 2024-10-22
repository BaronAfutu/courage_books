var express = require('express');
var router = express.Router();
const AuthController = require('../controllers/AuthController');
const jwt = require('jsonwebtoken');

// Streamline the token passing later
/* GET home page. */
router.get('/', function (req, res, next) {

  res.render('index', {
    title: 'Home',
    user: req.session.user || undefined,
    token: req.session.user? jwt.sign(req.session.user,process.env.SECRET):''
  });
});

router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
    user: req.session.user || undefined,
    token: req.session.user? jwt.sign(req.session.user,process.env.SECRET):''
  });
})

router.get('/login',(req,res)=>{
  if(req.session.user) return res.redirect('/');
  if (typeof req.query.next == 'undefined') {
    return res.render('login', {
      title: 'Login',
      formData: req.body,
      user: req.session.user || undefined,
      token: req.session.user? jwt.sign(req.session.user,process.env.SECRET):''
    });
  }else{ // shouldn't have to reach here
    return res.render('login', {
      title: 'Login',
      status: {
        form: 'login',
        status: 'danger',
        message: "Login to continue!"
      },
      formData: req.body,
      user: req.session.user || undefined,
      token: req.session.user? jwt.sign(req.session.user,process.env.SECRET):''
    })
  }
})

router.get('/books/', (req, res) => {
  res.render('books', {
    title: 'Books',
    user: req.session.user || undefined,
    token: req.session.user? jwt.sign(req.session.user,process.env.SECRET):''
  });
})
router.get('/books/:category/:slug', (req, res) => {
  res.render('book', {
    title: req.params.slug,
    user: req.session.user || undefined,
    token: req.session.user? jwt.sign(req.session.user,process.env.SECRET):''
  });
})

router.get('/cart', (req, res) => {
  res.render('cart', {
    title: 'Cart',
    user: req.session.user || {},
    token: req.session.user? jwt.sign(req.session.user,process.env.SECRET):''
  });
})

router.get('/checkout', (req, res) => {
  res.render('checkout', {
    title: 'Checkout',
    user: req.session.user || undefined,
    token: req.session.user? jwt.sign(req.session.user,process.env.SECRET):''
  });
})

router.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact',
    user: req.session.user || undefined,
    token: req.session.user? jwt.sign(req.session.user,process.env.SECRET):''
  });
})

router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.post('/signin', AuthController.signin); // returns page and keys
router.get('/logout', (req, res) => {
  return req.session.destroy(err => {
    res.redirect('/');
  })
  return res.redirect('/');
})
module.exports = router;
