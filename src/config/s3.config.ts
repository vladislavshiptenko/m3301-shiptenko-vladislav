import { registerAs } from '@nestjs/config';

export default registerAs('s3', () => ({
  accessKeyId: process.env.YC_ACCESS_KEY_ID,
  secretAccessKey: process.env.YC_SECRET_ACCESS_KEY,
  region: 'ru-central1',
  endpoint: 'https://storage.yandexcloud.net',
  bucket: process.env.YC_BUCKET_NAME,
}));
