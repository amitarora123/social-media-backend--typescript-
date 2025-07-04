import GraphQLUpload, { FileUpload } from 'graphql-upload/GraphQLUpload.mjs';
import path from 'path';
import fs from 'fs';

export const fileResolver = {
  Upload: GraphQLUpload,
  Mutation: {
    uploadFile: async (_: any, { file }: { file: Promise<FileUpload> }) => {
      try {
        console.log(file);
        const { createReadStream, filename } = await file;
        const stream = createReadStream();
        const outPath = path.join('uploads', filename);
        await new Promise<void>((resolve, reject) =>
          stream
            .pipe(fs.createWriteStream(outPath))
            .on('finish', () => resolve())
            .on('error', (error) => reject(error)),
        );
        return true;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
