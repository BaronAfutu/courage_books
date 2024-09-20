const multer = require('multer');
const path = require('path');

// Configure storage options
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/'); // Directory to save the uploaded files
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// STORAGES
const profileImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/profilePics/'); // Directory for image uploads
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const bookCoverStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/coverImages/'); // Directory for image uploads
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + req.query.slug || Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const bookFileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/books/'); // Directory for image uploads
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + req.query.slug || Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});


// FILTERS
const imageFileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|svg|webp/;
    const mimeType = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimeType && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only images are allowed'));
    }
};

const pdfFileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'));
    }
};




// UPLOADERS
const profileImageUpload = multer({
    storage: profileImageStorage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
    fileFilter: imageFileFilter
});

const bookCoverUpload = multer({
    storage: bookCoverStorage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
    fileFilter: imageFileFilter
});

const bookUpload = multer({
    storage: bookFileStorage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB file size limit
    fileFilter: pdfFileFilter
});

module.exports = {
    profileImageUpload,
    bookCoverUpload,
    bookUpload,
    upload
};