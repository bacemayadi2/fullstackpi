const multer = require('multer');
const path = require('path');

// Configure storage for CVs and motivation letters
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Different folders for different types of files
        if (file.fieldname === 'cv') {
            cb(null, 'uploads/cvs/');
        } else if (file.fieldname === 'motivationLetter') {
            cb(null, 'uploads/motivationLetters/');
        }
    },
    filename: (req, file, cb) => {
        // Ensure a unique filename
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// File validation
const fileFilter = (req, file, cb) => {
    // Allow only PDFs
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

// Upload limits (e.g., 2MB)
const limits = {
    fileSize: 2 * 1024 * 1024 // 2MB
};

// Set up multer instance
const upload = multer({ storage, fileFilter, limits });

// Export middleware to handle uploading both CV and motivation letter
const uploadFiles = upload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'motivationLetter', maxCount: 1 }
]);

module.exports = uploadFiles;
