// src/types/index.d.ts

import { PrismaClient } from '@prisma/client';
import { FileUpload } from 'graphql-upload/processRequest.d.mts';
import { z } from 'zod';

interface User {
  id: number;
  email: string;
  name: string;
}
interface MyContext {
  prisma: PrismaClient;
  user?: User | null;
}

const createUserSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

interface LoginUserInput {
  email: string;
  password: string;
}
type createUserInput = z.infer<typeof createUserSchema>;

// Example: Custom global type
type UserRole = 'admin' | 'user' | 'moderator';

interface CreatePostArgs {
  file: Promise<FileUpload>;
  title: string;
  content: string;
  commentsEnabled?: boolean;
  published?: boolean;
  scheduleAt: Date;
}

interface updatePostArgs {
  postId: number;
  file: Promise<FileUpload>;
  title?: string;
  content?: string;
  commentsEnabled?: boolean;
  published?: boolean;
  scheduleAt: Date;
}
