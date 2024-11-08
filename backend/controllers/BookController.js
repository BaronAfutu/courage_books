const Book = require('../models/Book');
const { BookValidation } = require('../helpers/validation');


const getBooks = async (req, res) => {
    const { error, value } = BookValidation.get.validate(req.body);
    if (error) return res.status(400).json({ status: false, errMsg: error.details[0].message });

    try {
        const { authors, genres, tags, page, limit, category, rating } = value;

        let query = { status: { $gt: 0 } };
        if (category) query['category'] = category;
        if (authors) query['authors'] = authors;
        if (genres.length > 0) query['genre'] = { $in: genres };
        if (tags.length > 0) query['tags'] = { $in: tags };
        if (rating) query['rating.averageRating'] = { $gte: rating };

        // console.log(query);

        const books = await Book.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('-bookfileUrl -reviews -chapter1')
            .exec();

        const count = await Book.countDocuments(query);

        res.status(200).json({
            books,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error fetching books', error });
    }
};

const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching book', error });
    }
};

const searchBooks = async (req, res) => {
    const { error, value } = BookValidation.search.validate(req.query);
    if (error) return res.status(400).json({ status: false, errMsg: error.details[0].message });

    try {
        const { q } = value;
        const regex = new RegExp(q, 'i');
        const books = await Book.find({
            $or: [
                { title: { $regex: regex } },
                { subtitle: { $regex: regex } },
                { author: { $regex: regex } },
                { description: { $regex: regex } }
            ],
            status: { $gt: 0 }
        }).select('-bookfileUrl -reviews -chapter1').exec();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error searching books', error });
    }
};


const createBook = async (req, res) => {
    const { error, value } = BookValidation.create.validate(req.body);
    if (error) return res.status(400).json({ status: false, errMsg: error.details[0].message });

    try {
        const book = new Book(value);
        await book.save();
        res.status(201).json({ message: 'Book created successfully', book });
    } catch (error) {
        res.status(400).json({ message: 'Error creating book', error });
    }
};


const addBookCover = async (req, res) => {
    try {
        const coverUrl = `/uploads/coverImages/${req.file.filename}`;
        const book = await Book.findByIdAndUpdate(req.params.id, { coverImageUrl: coverUrl });
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book cover saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving book cover', error });
    }
};

const addBookFile = async (req, res) => {
    try {
        const bookUrl = `/uploads/books/${req.file.filename}`;
        const book = await Book.findByIdAndUpdate(req.params.id, { bookfileUrl: bookUrl });
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book pdf saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving book pdf', error });
    }
};


const updateBook = async (req, res) => {
    const { error, value } = BookValidation.create.validate(req.body);
    if (error) return res.status(400).json({ status: false, errMsg: error.details[0].message });
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, value, {
            new: true,
            runValidators: true,
        });
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book updated successfully', book });
    } catch (error) {
        res.status(400).json({ message: 'Error updating book', error });
    }
};


const featureBook = async (req, res) => {
    const feature = req.body.feature || true;
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, { featured: feature });
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: `Book ${feature ? "featured" : "un-featured"} successfully` });
    } catch (error) {
        res.status(500).json({ message: `Error ${feature ? "featuring" : "un-featuring"} book`, error });
    }
};

const deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, { status: 0 });
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting book', error });
    }
};

module.exports = {
    getBooks,
    getBookById,
    searchBooks,
    createBook,
    updateBook,
    deleteBook,
    featureBook, // *
    addBookCover, // *
    addBookFile // *
};