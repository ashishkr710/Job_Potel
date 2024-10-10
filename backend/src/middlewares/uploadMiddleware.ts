import multer from 'multer';
import path from 'path';

// Set Storage Engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'resume') {
            cb(null, 'uploads/resumes/');
        } else if (file.fieldname === 'profilePicture') {
            cb(null, 'uploads/profile_pictures/');
        } else {
            cb(null, 'uploads/others/');
        }
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// File Filter
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.fieldname === 'resume') {
        // Accept PDFs and Word documents
        if (file.mimetype === 'application/pdf' || file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type for resume. Only PDF and Word documents are allowed.'));
        }
    } else if (file.fieldname === 'profilePicture') {
        // Accept images
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type for profile picture. Only images are allowed.'));
        }
    } else {
        cb(new Error('Unknown field'));
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
});
