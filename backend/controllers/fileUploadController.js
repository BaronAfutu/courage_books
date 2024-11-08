const { bookCoverUpload, profileImageUpload, bookUpload } = require('../helpers/fileUpload');


// TODO add book or userID to query for saving filepath into database

const uploadBookCover = (req, res, next) => {
    bookCoverUpload.single('bookCover')(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Image upload failed', error: err.message });
        }
        // res.status(200).json({ message: 'Image uploaded successfully', fileName: req.file.filename });
        next();
    });
};

const uploadProfilePicture = (req, res, next) => {
    if(typeof req.params.id === 'undefined') return res.status(400).json({message:'user id required'});
    profileImageUpload.single('profilePic')(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Image upload failed', error: err.message });
        }
        // res.status(200).json({ message: 'Image uploaded successfully', fileUrl: `/uploads/profilepics/${req.file.filename}` });
        next();
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
