import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import cors from 'cors';
import express, { Request } from 'express';
import { MyContext, MyPayload, User } from '../types';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { userSchema } from './schemas/user.schema';
import { userResolver } from './resolvers/user.resolver';
import { verifyToken } from '../utils/jwt';
import prisma from '../config/prisma';
import { postResolver } from './resolvers/post.resolver';
import { postSchema } from './schemas/post.schema';
import { followSchema } from './schemas/follow.schema';
import { followResolver } from './resolvers/follow.resolver';
import { commentSchema } from './schemas/comments.schema';
import { likeSchema } from './schemas/likes.schema';
import { likeResolver } from './resolvers/like.resolver';
import { commentResolver } from './resolvers/comments.resolver';
import { fileResolver } from './resolvers/file.resolver';
import { fileSchema } from './schemas/file.schema';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
const app = express();

const mergedTypeDefs = mergeTypeDefs([
  userSchema,
  postSchema,
  followSchema,
  likeSchema,
  commentSchema,
  fileSchema,
]);
const mergedResolver = mergeResolvers([
  userResolver,
  postResolver,
  followResolver,
  likeResolver,
  commentResolver,
  fileResolver,
]);

export const startGraphqlServer = async (port: number) => {
  const server = new ApolloServer<MyContext>({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolver,
  });
  await server.start();
  app.use(graphqlUploadExpress());
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers['authorization'];

        let user: User | null = null;
        if (token) {
          try {
            user = verifyToken(token) as MyPayload;
          } catch (error) {
            console.log('Invalid token');
          }
        }
        return {
          prisma: prisma,
          user: user ? (user as User) : null,
        };
      },
    }),
  );
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server ready at:${port}`);
  });
};
