// I Need to create to
interface IStorage {
  uploadFile(file: Express.Multer.File,isPublic:boolean ): Promise<{
    isPublic?: boolean;
    fileUrl?: string;
    fileKey?: string;
    message?: string;
  }>;
  downloadFile(key: string): Promise<string | null>;
  updateFile(
    key: string,
    file: Express.Multer.File,
  ): Promise<{ message: string }>;
  deleteFile(
    key: string,
  ): Promise<{ message: string }>;
}
