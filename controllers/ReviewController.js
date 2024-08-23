const Book = require('../models/Book');

// Add a review to a book
exports.addReview = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { reviewer, reviewText, rating } = req.body;

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const newReview = {
            reviewer: reviewer || req.user.name, // Assuming you are using authentication and have the reviewer's name
            reviewText,
            rating,
            reviewDate: new Date(),
        };

        // Add the review to the book's reviews array
        book.reviews.push(newReview);

        // Update the average rating and number of ratings
        book.rating.numberOfRatings += 1;
        book.rating.averageRating =
            (book.rating.averageRating * (book.rating.numberOfRatings - 1) + rating) /
            book.rating.numberOfRatings;

        await book.save();
        res.status(201).json({ message: 'Review added successfully', review: newReview });
    } catch (error) {
        res.status(500).json({ message: 'Error adding review', error });
    }
};

// Update a review for a book
exports.updateReview = async (req, res) => {
    try {
        const { bookId, reviewId } = req.params;
        const { reviewText, rating } = req.body;

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const review = book.reviews.id(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Update review details
        const oldRating = review.rating;
        review.reviewText = reviewText || review.reviewText;
        review.rating = rating || review.rating;
        review.reviewDate = new Date();

        // Update the average rating
        if (oldRating !== rating) {
            book.rating.averageRating =
                (book.rating.averageRating * book.rating.numberOfRatings - oldRating + rating) /
                book.rating.numberOfRatings;
        }

        await book.save();
        res.status(200).json({ message: 'Review updated successfully', review });
    } catch (error) {
        res.status(500).json({ message: 'Error updating review', error });
    }
};

// Delete a review from a book
exports.deleteReview = async (req, res) => {
    try {
        const { bookId, reviewId } = req.params;

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const review = book.reviews.id(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Remove the review and update the average rating and number of ratings
        const oldRating = review.rating;
        book.reviews.pull(reviewId);
        book.rating.numberOfRatings -= 1;

        if (book.rating.numberOfRatings > 0) {
            book.rating.averageRating =
                (book.rating.averageRating * (book.rating.numberOfRatings + 1) - oldRating) /
                book.rating.numberOfRatings;
        } else {
            book.rating.averageRating = 0; // No ratings left
        }

        await book.save();
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting review', error });
    }
};

// Get all reviews for a book
exports.getReviews = async (req, res) => {
    try {
        const { bookId } = req.params;

        const book = await Book.findById(bookId).select('reviews');
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json({ reviews: book.reviews });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving reviews', error });
    }
};
