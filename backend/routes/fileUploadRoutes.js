const express = require('express');
const router = express.Router();
const {addBookCover, addBookFile} = require('../controllers/BookController');
const { updateProfilePic } = require('../controllers/UserController');
const uploadController = require('../controllers/FileUploadController');

// router.post('/file', uploadController.uploadSingleFile);
// router.post('/uploads', uploadController.uploadMultipleFiles);
router.use('/cover',uploadController.uploadBookCover);
router.post('/cover/:id',addBookCover);

router.use('/profile/:id',uploadController.uploadProfilePicture);
router.post('/profile/:id',updateProfilePic);

router.use('/book',uploadController.uploadPDFFile);
router.post('/book/:id',addBookFile); //req.query.slug required

module.exports = router;