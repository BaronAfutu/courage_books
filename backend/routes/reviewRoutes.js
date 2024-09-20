const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/ReviewController');

router.get('/:bookId',reviewController.getReviews);
// only registered users can add reviews
router.post('/', reviewController.addReview);
router.post('/rate', reviewController.addRating);
router.post('/:reviewId',reviewController.updateReview);
router.delete('/:bookId/:reviewId/delete',reviewController.deleteReview);

module.exports = router;
