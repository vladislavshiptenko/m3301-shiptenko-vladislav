import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

export interface UploadResult {
  key: string;
  url: string;
  bucket: string;
  size: number;
  contentType: string;
}

export interface UploadOptions {
  folder?: string;
  generateUniqueKey?: boolean;
  contentType?: string;
  metadata?: Record<string, string>;
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3Client: S3Client;
  private readonly bucket: string;

  constructor(private configService: ConfigService) {
    const s3Config = this.configService.get('s3');

    this.s3Client = new S3Client({
      region: s3Config.region,
      endpoint: s3Config.endpoint,
      credentials: {
        accessKeyId: s3Config.accessKeyId,
        secretAccessKey: s3Config.secretAccessKey,
      },
      forcePathStyle: true,
    });

    this.bucket = s3Config.bucket;

    this.logger.log(`Storage service initialized with bucket: ${this.bucket}`);
  }

  async uploadFile(
    file: Express.Multer.File,
    options: UploadOptions = {},
  ): Promise<UploadResult> {
    const key = this.generateFileKey(file.originalname, options);

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: options.contentType || file.mimetype,
      ContentDisposition: 'inline',
      Metadata: {
        originalName: file.originalname,
        uploadedAt: new Date().toISOString(),
        ...options.metadata,
      },
    });

    await this.s3Client.send(command);

    const url = `https://storage.yandexcloud.net/${this.bucket}/${key}`;

    this.logger.log(`File uploaded successfully: ${key}`);

    return {
      key,
      url,
      bucket: this.bucket,
      size: file.size,
      contentType: options.contentType || file.mimetype,
    };
  }

  private generateFileKey(
    originalName: string,
    options: UploadOptions,
  ): string {
    const ext = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, ext);

    let fileName: string;

    if (options.generateUniqueKey !== false) {
      const uuid = uuidv4();
      fileName = `${nameWithoutExt}_${uuid}${ext}`;
    } else {
      fileName = originalName;
    }

    if (options.folder) {
      return `${options.folder}/${fileName}`;
    }

    return fileName;
  }
}
