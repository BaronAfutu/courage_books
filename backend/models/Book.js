// Books.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  subtitle: { type: String, trim: true, default: "" },
  slug: { type: String, required: true, trim: true },
  authors: { type: [String], required: true }, // An array of author names
  isbn: { type: String, required: true, unique: true },
  publisher: { type: String, trim: true, default: "" },
  publicationDate: { type: Date, default: Date.now },
  language: { type: String, trim: true, default: 'English' },
  numberOfPages: { type: Number, default: 0 },
  genres: { type: [String], index: true, default: [] },// An array of genres// Indexing for faster searches
  category: { type: String, default: "" },
  format: { type: String, trim: true, default: 'eBook' },// e.g., Hardcover, Paperback, eBook
  dimensions: { height: Number, width: Number, thickness: Number },
  weight: { type: Number, },// Weight in grams
  edition: { type: String, trim: true, default: "" },
  description: { type: String, trim: true, required: true },
  chapter1: { type: String, trim: true, default:"" },
  bookfileUrl: { type: String, required: true },
  coverImageUrl: { type: String, trim: true, required: true },
  rating: {
    averageRating: { type: Number, min: 0, max: 5, default: 0 },
    numberOfRatings: { type: Number, default: 0 }
  },
  reviews: [{ // user can type own name or stay annonymous in reviews
    reviewer: { type: String, trim: true }, //You should not be able to click back to a user from the review.
    reviewDate: { type: Date, default: Date.now },
    reviewText: { type: String, trim: true },
    rating: { type: Number, min: 0, max: 5 }
  }],
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 }, // Discounted Price, if any
  stock: { type: Number, required: true, min: 0 },
  // sold: {type: Number,default: 0}
  tags: { type: [String], index: true }, // Tags for easier searching
  featured: { type: Boolean, default: false },
  status:{type:Number, default:1}
}, { timestamps: true });


// Adding text index to support text search on multiple fields
bookSchema.index({ title: 'text', subtitle: 'text', description: 'text', authors: 'text', tags: 'text' });

// // Adding compound index to support queries
// bookSchema.index({ price: 1, stock: -1 });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;


/*
// Find episodes that aired on this exact date
return Episode.find({ airedAt: new Date('1987-10-26') }).
  then(episodes => {
    episodes[0].title; // "Where No One Has Gone Before"
    // Find episodes within a range of dates, sorted by date ascending
    return Episode.
      find({ airedAt: { $gte: '1987-10-19', $lte: '1987-10-26' } }).
      sort({ airedAt: 1 });
  }).
  then(episodes => {
    episodes[0].title; // "The Last Outpost"
    episodes[1].title; // "Where No One Has Gone Before"
  });
*/
