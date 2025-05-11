import { Injectable } from '@nestjs/common';
import { Multer } from 'multer';
import { Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  private storage: Storage;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.storage = new Storage({
      projectId: this.configService.get('GCS_PROJECT_ID'),
      credentials: {
        client_email: this.configService.get('GCS_CLIENT_EMAIL'),
        private_key: this.configService.get('GCS_PRIVATE_KEY').replace(/\\n/g, '\n'),
      },
    });
    this.bucketName = this.configService.get('GCS_BUCKET_NAME')?? 'edu-nexus-iut.appspot.com';
  }

  async uploadFile(file: Multer.File) {
    const fileName = `${Date.now()}-${file.originalname}`;
    const fileStream = this.storage.bucket(this.bucketName).file(fileName);

    await fileStream.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });

    await fileStream.makePublic();

    return {
      fileUrl: `https://storage.googleapis.com/${this.bucketName}/${fileName}`,
      fileKey: fileName,
    };
  }

  async deleteFile(fileKey: string) {
    await this.storage.bucket(this.bucketName).file(fileKey).delete();
  }
}