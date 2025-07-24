import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Dynamic directory creation
const getUploadDirectory = (type) => {
  const baseDir = 'uploads';
  const uploadDir = path.join(baseDir, type);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  return uploadDir;
};

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.query.type || 'general'; // Use query parameter to determine upload type
    const uploadDir = getUploadDirectory(type);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Multer upload middleware
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg, .jpeg, .webp, and .pdf formats are allowed!'), false);
    }
  },
});

// File upload route
router.post('/', upload.array('files', 5), (req, res) => {
  console.log('Uploaded Files:', req.files); // Debugging line

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }

  const filePaths = req.files.map((file) => `/uploads/${req.query.type || 'general'}/${file.filename}`);
  res.json({ success: true, files: filePaths });
});

export default router;