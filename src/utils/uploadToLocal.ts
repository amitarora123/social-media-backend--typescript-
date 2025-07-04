import path from 'path';
import fs from 'fs';
import { FileUpload } from 'graphql-upload/processRequest.mjs';

export const uploadToLocal = async (file: Promise<FileUpload>) => {
  try {
    const { createReadStream, filename } = await file;
    const uploadDir = path.join(process.cwd(), 'uploads');

    // Ensure uploads directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const filePath = path.join(uploadDir, filename);
    const stream = createReadStream();

    // Save the file to disk
    const writeStream = fs.createWriteStream(filePath);
    await new Promise<void>((resolve, reject) => {
      stream.pipe(writeStream).on('finish', resolve).on('error', reject);
    });

    return filePath;
  } catch (error) {
    console.log(error);
    return null;
  }
};
