import jwt from 'jsonwebtoken';
import { User } from '../types';

export const createToken = (user: User) => {
  const token = jwt.sign(user, process.env.JWT_SECRET_KEY!, {
    expiresIn: '7h',
  });
  return token;
};

export const verifyToken = (token: string) => {
  const decodedJwt = jwt.verify(token, process.env.JWT_SECRET_KEY!);
  return decodedJwt;
};
