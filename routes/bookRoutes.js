const express = require('express');
const router = express.Router();
const BookController = require('../controllers/BookController');

router.get('/',BookController.getBooks);
router.get('/search',BookController.searchBooks);
router.get('/:id',BookController.getBookById);
router.post('/',BookController.createBook);
router.post('/:id',BookController.updateBook);
router.delete('/:id/delete',BookController.deleteBook);

module.exports = router;
