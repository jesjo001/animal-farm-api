"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultiple = exports.uploadSingle = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const env_1 = require("../config/env");
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, env_1.env.UPLOAD_PATH);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const fileFilter = (req, file, cb) => {
    // Allow images, documents, etc.
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx/;
    const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb(new Error('Invalid file type'));
    }
};
exports.upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: env_1.env.MAX_FILE_SIZE,
    },
    fileFilter,
});
const uploadSingle = (fieldName) => exports.upload.single(fieldName);
exports.uploadSingle = uploadSingle;
const uploadMultiple = (fieldName, maxCount = 5) => exports.upload.array(fieldName, maxCount);
exports.uploadMultiple = uploadMultiple;
//# sourceMappingURL=upload.middleware.js.map