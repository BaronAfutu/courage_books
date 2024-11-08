const { upload, bookCoverUpload, profileImageUpload, bookUpload } = require('../helpers/fileUpload');


// Controller function to handle single file upload
const uploadSingleFile = (req, res) => {
    // 'file' is the name of the field in the form
    upload.single('file')(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: 'File upload failed', error: err.message });
        }
        // File upload was successful
        res.status(200).json({ message: 'File uploaded successfully', file: req.file });
    });
};

// Controller function to handle multiple file uploads
const uploadMultipleFiles = (req, res) => {
    // 'files' is the name of the field in the form
    upload.array('files', 10)(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: 'File upload failed', error: err.message });
        }
        // Files upload was successful
        res.status(200).json({ message: 'Files uploaded successfully', files: req.files });
    });
};




// TODO add book or userID to query for saving filepath into database

// Controller function for book cover upload
const uploadBookCover = (req, res, next) => {
    bookCoverUpload.single('bookCover')(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Image upload failed', error: err.message });
        }
        // res.status(200).json({ message: 'Image uploaded successfully', file: req.file, fileName: req.file.filename });
        next();
        // for middleware, next() comes here
    });
};

const testing = (req,res)=>{
    console.log(req.body);
    return res.json({filename: req.file.filename});
}

// Controller function for user profile upload
const uploadProfilePicture = (req, res) => {
    profileImageUpload.single('profilePic')(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Image upload failed', error: err.message });
        }
        // res.status(200).json({ message: 'Image uploaded successfully', file: req.file, fileName: req.file.filename });
        next()
        // for middleware, next() comes here
    });
};


// Controller function for PDF upload
const uploadPDFFile = (req, res) => {
    bookUpload.single('bookFile')(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: 'PDF upload failed', error: err.message });
        }
        res.status(200).json({ message: 'PDF uploaded successfully', file: req.file });
    });
};
module.exports = {
    uploadSingleFile,
    uploadMultipleFiles,
    uploadBookCover,
    uploadProfilePicture,
    uploadPDFFile,
    testing
};
