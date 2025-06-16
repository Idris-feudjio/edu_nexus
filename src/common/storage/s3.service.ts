import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
 
@Injectable()
export class S3Service implements IStorage {
  private client: S3Client;
  private bucketName:string
  private readonly logger=new Logger(S3Service.name)
 
  constructor(
    private readonly configService: ConfigService, 
  ) {
    const s3_region = this.configService.get('S3_REGION');
    const  bucketName = this.configService.get('S3_BUCKET_NAME');
 
    if (!s3_region) {
      this.logger.error("S3_REGION not found in environment variables")
      throw new Error('S3_REGION not found in environment variables');
    }
 
    const accessKeyId = this.configService.get<string>('S3_ACCESS_KEY');
    const secretAccessKey = this.configService.get<string>('S3_SECRET_ACCESS_KEY');

    if (!accessKeyId || !secretAccessKey) {
      this.logger.error("S3_ACCESS_KEY or S3_SECRET_ACCESS_KEY not found in environment variables")
      throw new Error('S3_ACCESS_KEY or S3_SECRET_ACCESS_KEY not found in environment variables');
    }

    this.client = new S3Client({
      region: s3_region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true,
    });
 
  }


  // methods inside DmsService class
async uploadFile(file: Express.Multer.File, isPublic: boolean = true): Promise<{ isPublic?: boolean; fileUrl: string; fileKey: string; message?: string }> {
  try {
    const fileKey = `${uuidv4()}`;
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: isPublic ? 'public-read' : 'private',

      Metadata: {
        originalName: file.originalname,
      },
    });

    await this.client.send(command);

    return {
      fileKey,
      isPublic,
      fileUrl: isPublic
        ? (await this.getFileUrl(fileKey)).url
        : (await this.getPresignedSignedUrl(fileKey)).url,
    };
  } catch (error) {
    throw new InternalServerErrorException(error);
  }
}
 
  async getFileUrl(key: string) {
    return { url: `https://${this.bucketName}.s3.amazonaws.com/${key}` };
  }

  
 
 async getPresignedSignedUrl(key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
 
      const url = await getSignedUrl(this.client, command, {
        expiresIn: 60 * 60 * 24, // 24 hours
      });
 
      return { url };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }



  async deleteFile(key: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
 
      await this.client.send(command);
 
      return { message: 'File deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }




// I need a method to download file

async downloadFile(key: string): Promise<string | null> {
  this.logger.log("Downloading file from S3 bucket");
  try {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    const response = await this.client.send(command);

    if (!response.Body) {
      throw new InternalServerErrorException('File not found or empty');
    }

    // Read the stream and convert it to a string (assuming text file)
    const streamToString = (stream: any): Promise<string> =>
      new Promise((resolve, reject) => {
        const chunks: any[] = [];
        stream.on('data', (chunk: any) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
      });

    const data = await streamToString(response.Body);
    return data;
  } catch (error) {
    throw new InternalServerErrorException(error);
  }
}

 async updateFile(key: string, file: Express.Multer.File): Promise<{ message: string; }> {
   try {
     const command = new PutObjectCommand({
       Bucket: this.bucketName,
       Key: key,
       Body: file.buffer,
       ContentType: file.mimetype,
       Metadata: {
         originalName: file.originalname,
       },
     });
     await this.client.send(command);
     return { message: 'File updated successfully' };
   } catch (error) {
     throw new InternalServerErrorException(error);
   }
 }









}