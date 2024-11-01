var express = require('express');
var router = express.Router();
const AuthController = require('../controllers/AuthController');
const jwt = require('jsonwebtoken');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const { testMail } = require('../config/email');

// Streamline the token passing later
/* GET home page. */
router.get('/', function (req, res, next) {

  res.render('index', {
    title: 'Home',
    user: req.session.user || undefined,
    token: req.session.user ? jwt.sign(req.session.user, process.env.SECRET) : ''
  });
});

router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
    user: req.session.user || undefined,
    token: req.session.user ? jwt.sign(req.session.user, process.env.SECRET) : ''
  });
})

router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/');
  if (typeof req.query.next == 'undefined') {
    return res.render('login', {
      title: 'Login',
      formData: req.body,
      user: req.session.user || undefined,
      token: req.session.user ? jwt.sign(req.session.user, process.env.SECRET) : ''
    });
  } else { // shouldn't have to reach here
    return res.render('login', {
      title: 'Login',
      status: {
        form: 'login',
        status: 'danger',
        message: "Login to continue!"
      },
      formData: req.body,
      user: req.session.user || undefined,
      token: req.session.user ? jwt.sign(req.session.user, process.env.SECRET) : ''
    })
  }
})

router.get('/books/', (req, res) => {
  res.render('books', {
    title: 'Books',
    user: req.session.user || undefined,
    token: req.session.user ? jwt.sign(req.session.user, process.env.SECRET) : ''
  });
})
router.get('/books/:category/:slug', (req, res) => {
  res.render('book', {
    title: req.params.slug,
    user: req.session.user || undefined,
    token: req.session.user ? jwt.sign(req.session.user, process.env.SECRET) : ''
  });
})

router.get('/cart', (req, res) => {
  res.render('cart', {
    title: 'Cart',
    user: req.session.user || undefined,
    token: req.session.user ? jwt.sign(req.session.user, process.env.SECRET) : ''
  });
})

router.get('/checkout', async (req, res) => {
  // stripe checkout
  // const session = await stripe.checkout.sessions.create({
  //   line_items:[
  //     {
  //       price_data:{
  //         currency: 'usd',
  //       }

  //     }
  //   ],
  //   mode: 'payment', // 'subscription'
  //   success_url: 'http://localhost:3000/complete',
  //   cancel_url: 'http://localhost:3000/cancel'
  // })
  // manual checkout
  res.render('checkout', {
    title: 'Checkout',
    user: req.session.user || undefined,
    token: req.session.user ? jwt.sign(req.session.user, process.env.SECRET) : ''
  });
})

router.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact',
    user: req.session.user || undefined,
    token: req.session.user ? jwt.sign(req.session.user, process.env.SECRET) : ''
  });
})


// TEMP ROUTES
router.get('/dashboard', (req, res) => {
  res.render('user_reading', {
    title: 'Dashboard',
    user: req.session.user || undefined,
    token: req.session.user ? jwt.sign(req.session.user, process.env.SECRET) : ''
  });
})
// END TEMP ROUTES

router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.post('/signin', AuthController.signin); // returns page and keys
router.get('/logout', (req, res) => {
  return req.session.destroy(err => {
    res.redirect('/');
  })
  return res.redirect('/');
})

router.get('/verify', AuthController.verifyEmailCode);

router.get('/test-email', async (req, res) => {
  await testMail().catch(e => {
    console.log(e);
  });
  return res.status(200).json({ message: "hi" });
})
module.exports = router;
