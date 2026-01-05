import { singleton } from 'tsyringe';

@singleton()
export class UploadService {
  async uploadToCloudinary(file: any) {
    // Implementation for cloudinary upload
    return { url: 'uploaded-url' };
  }

  async deleteFromCloudinary(publicId: string) {
    // Implementation for deleting from cloudinary
    return true;
  }
}