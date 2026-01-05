"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const tsyringe_1 = require("tsyringe");
let UploadService = class UploadService {
    async uploadToCloudinary(file) {
        // Implementation for cloudinary upload
        return { url: 'uploaded-url' };
    }
    async deleteFromCloudinary(publicId) {
        // Implementation for deleting from cloudinary
        return true;
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, tsyringe_1.singleton)()
], UploadService);
//# sourceMappingURL=upload.service.js.map