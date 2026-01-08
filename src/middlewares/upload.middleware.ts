import multer from 'multer';
import path from 'path';
import { Request, RequestHandler } from 'express'; // Import RequestHandler
import { env } from '../config/env';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
}

let storage: multer.StorageEngine;

if (env.CLOUDINARY_CLOUD_NAME) {
  // Use Cloudinary storage
  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'farmflow',
      allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx'],
      transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
    } as any,
  }) as any;
} else {
  // Use local disk storage
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, env.UPLOAD_PATH || 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
  });
}

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allow images, documents, etc.
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: env.MAX_FILE_SIZE || 5242880, // 5MB default
  },
  fileFilter: fileFilter as any,
});

export const uploadSingle = (fieldName: string): RequestHandler => upload.single(fieldName) as any;
export const uploadMultiple = (fieldName: string, maxCount: number = 5): RequestHandler =>
  upload.array(fieldName, maxCount) as any;