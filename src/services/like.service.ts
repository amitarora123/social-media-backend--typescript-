import { MyContext } from '../types';

export class LikeService {
  public static async toggleLike(
    _: any,
    { postId }: { postId: number },
    { user, prisma }: MyContext,
  ) {
    if (!user)
      return {
        success: false,
        message: 'UNAUTHORIZED REQUEST',
      };

    const existingLike = await prisma.like.findUnique({
      where: {
        postId_authorId: {
          postId: Number(postId),
          authorId: user.id,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          postId_authorId: {
            postId: Number(postId),
            authorId: user.id,
          },
        },
      });

      return {
        success: true,
        message: 'post unliked successful',
      };
    } else {
      const like = await prisma.like.create({
        data: {
          author: {
            connect: { id: user.id },
          },
          post: {
            connect: { id: Number(postId) },
          },
        },
        include: {
          author: true,
          post: true,
        },
      });
      return {
        success: true,
        message: 'post liked successful',
      };
    }
  }
  public static async hasUserLikedPost(
    _: any,
    { postId }: { postId: number },
    { user, prisma }: MyContext,
  ) {
    if (!user) throw new Error('UNAUTHORIZED REQUEST');

    const like = await prisma.like.findUnique({
      where: {
        postId_authorId: {
          postId: Number(postId),
          authorId: user.id,
        },
      },
    });

    if (!like) return false;
    else return true;
  }
  public static async getUserLikedPost(
    parent: any,
    _: any,
    { prisma }: MyContext,
  ) {
    const userId = parent.id;
    const like = await prisma.like.findMany({
      where: {
        authorId: userId,
      },
      select: {
        post: true,
      },
    });

    return like.map((l) => l.post);
  }
  public static async getPostLikes(parent: any, _: any, { prisma }: MyContext) {
    const postId = parent.id;

    const likes = await prisma.like.count({
      where: {
        postId,
      },
    });
    return likes;
  }
  public static async getAccountLikes(
    parent: any,
    _: any,
    { prisma }: MyContext,
  ) {
    const userId = parent.id;

    const userPosts = await prisma.post.findMany({
      where: {
        authorId: userId,
      },
    });
    const postIds = userPosts.map((p) => p.id);

    return await prisma.like.count({
      where: {
        postId: {
          in: postIds,
        },
      },
    });
  }
}
