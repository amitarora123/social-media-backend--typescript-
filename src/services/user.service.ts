import { hashPassword, comparePassword } from '../utils/bcrypt';
import { createUserInput, LoginUserInput, MyContext } from '../types';
import { createToken } from '../utils/jwt';

export class UserService {
  public static async registerUser(
    _: any,
    { username, email, password }: createUserInput,
    context: MyContext,
  ) {
    const hashedPassword = await hashPassword(password);
    const user = await context.prisma.user.create({
      data: {
        name: username,
        email,
        password: hashedPassword,
      },
    });

    const token = createToken(user);
    return { token, user };
  }
  public static async loginUser(
    _: any,
    { email, password }: LoginUserInput,
    context: MyContext,
  ) {
    console.log("inside the login user mutation")
    const user = await context.prisma.user.findFirst({
      where: {
        email: {
          equals: email,
        },
      },
    });

    if (!user) {
      return 'Invalid Credentials';
    }

    const isValid = await comparePassword(password, user?.password);
    if (!isValid) {
      throw new Error('Invalid Credentials');
    }

    const token = await createToken(user);
    return { token, user };
  }
  public static async getAllUsers(_: any, __: any, context: MyContext) {
    return await context.prisma.user.findMany({ include: { posts: true } });
  }
  public static async getCurrentUser(
    _: any,
    __: any,
    { user, prisma }: MyContext,
  ) {
    if (!user) return null;
    const currUser = await prisma.user.findFirst({
      select: {
        email: true,
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        posts: {
          select: {
            id: true,
            title: true,
            content: true,
            author: true,
            Likes: true,
            Views: {
              include: {
                author: true,
              },
            },
            comments: true,
          },
        },
      },

      where: {
        id: {
          equals: user.id,
        },
      },
    });
    return currUser;
  }
  public static async searchUser(
    _: any,
    { name }: { name: string },
    { prisma }: MyContext,
  ) {
    const user = await prisma.user.findMany({
      where: {
        name: {
          contains: name,
        },
      },
    });
    return user;
  }

  public static async getUserById(
    _: any,
    { userId }: { userId: number },
    { prisma }: MyContext,
  ) {
    return await prisma.user.findFirst({
      where: {
        id: Number(userId),
      },
    });
  }
  public static async getPostAuthor(
    parent: any,
    _: any,
    { prisma }: MyContext,
  ) {
    const userId = parent.id;

    return await prisma.user.findUnique({
      where: { id: userId },
    });
  }
}
