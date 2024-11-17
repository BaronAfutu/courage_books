const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

router.get('/', userController.getAllUsers);

router.get('/dashboard', (req, res) => {
    res.render('user_reading', {
        title: 'Dashboard',
        user: req.session.user
    });
})

router.get('/profile',(req,res)=>{
    res.render('user_profile',{
        title: 'Profile',
        user: req.session.user
    })
})

router.get('/library',(req,res)=>{
    res.render('user_library',{
        title: 'Library',
        user: req.session.user
    })
})

router.get('/books/:id/:slug', (req, res) => {
    res.render('user_reading', {
      title: req.params.slug,
      user: req.session.user
    });
  })



router.get('/:id', userController.getUserById);
router.post('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);


module.exports = router;
