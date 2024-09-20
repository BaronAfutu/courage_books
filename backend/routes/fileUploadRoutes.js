const express = require('express');
const router = express.Router();
const {addBookCover, addBookFile} = require('../controllers/BookController');
const uploadController = require('../controllers/FileUploadController');

// router.post('/file', uploadController.uploadSingleFile);
// router.post('/uploads', uploadController.uploadMultipleFiles);
router.use('/cover',uploadController.uploadBookCover);
router.post('/cover/:id',addBookCover);
router.post('/profile',uploadController.uploadProfilePicture);
router.use('/book',uploadController.uploadPDFFile);
router.post('/book/:id',addBookFile);

module.exports = router;