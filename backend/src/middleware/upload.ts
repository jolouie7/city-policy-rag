import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Sanitize filename and add timestamp
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const timestamp = Date.now();
    cb(null, `${timestamp}-${sanitized}`);
  },
});

// File filter - only accept PDFs
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'));
  }
};

// Configure multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB || '10')) * 1024 * 1024, // Default 10MB
  },
});
