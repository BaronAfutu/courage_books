const { bookCoverUpload, profileImageUpload, bookUpload } = require('../helpers/fileUpload');


// TODO add book or userID to query for saving filepath into database

const uploadBookCover = (req, res, next) => {
    bookCoverUpload.single('bookCover')(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Image upload failed', error: err.message });
        }
        next();
        // res.status(200).json({ message: 'Image uploaded successfully', fileName: req.file.filename });
        // for middleware, next() comes here
    });
};

const uploadProfilePicture = (req, res) => {
    profileImageUpload.single('profilePic')(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Image upload failed', error: err.message });
        }
        res.status(200).json({ message: 'Image uploaded successfully', fileName: req.file.filename });
        // for middleware, next() comes here
    });
};


const uploadPDFFile = (req, res, next) => {
    bookUpload.single('bookFile')(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: 'PDF upload failed', error: err.message });
        }
        // res.status(200).json({ message: 'PDF uploaded successfully', fileName: req.file.filename });
        next();
    });
};

module.exports = {
    uploadBookCover,
    uploadProfilePicture,
    uploadPDFFile
};
