import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';

// Ensure upload directory exists
const uploadDir = '/tmp/plugin-uploads';
fs.ensureDirSync(uploadDir);

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `plugin-${uniqueSuffix}${ext}`);
  },
});

// File filter - only allow .zip files
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (ext !== '.zip') {
    return cb(new Error('Only .zip files are allowed'));
  }
  
  cb(null, true);
};

// Configure multer
export const uploadPlugin = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
  },
});

export default uploadPlugin;
