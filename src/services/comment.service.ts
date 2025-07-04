import { MyContext } from '../types';
import { UNAUTHORIZED } from '../utils/constant';

export class CommentService {
  public static async createComment(
    _: any,
    {
      postId,
      content,
    }: {
      postId: number;
      content: string;
    },
    { prisma, user }: MyContext,
  ) {
    if (!user) throw new Error('UNAUTHORIZED REQUEST');

    const comments = await prisma.comment.create({
      data: {
        author: {
          connect: { id: user.id },
        },
        post: {
          connect: { id: Number(postId) },
        },
        content,
      },
      include: {
        author: true,
        post: true,
      },
    });
    return comments;
  }
  public static async updateComment(
    _: any,
    {
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    },
    { prisma, user }: MyContext,
  ) {
    if (!user) throw new Error('UNAUTHORIZED REQUEST');

    const comment = await prisma.comment.update({
      where: {
        id: Number(commentId),
        authorId: user.id,
      },
      data: {
        content,
      },
      include: {
        author: true,
        post: true,
      },
    });
    return comment;
  }
  public static async deleteComment(
    _: any,
    {
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    },
    { prisma, user }: MyContext,
  ) {
    if (!user) return UNAUTHORIZED;

    const isDeleted = await prisma.comment.delete({
      where: {
        authorId: user.id,
        id: Number(commentId),
      },
    });
    if (isDeleted)
      return {
        success: true,
        message: 'Comment deleted successfully',
      };
    else {
      return {
        success: false,
        message: "Comment couldn't be deleted",
      };
    }
  }
  public static async getUserComments(
    parent: any,
    _: any,
    { user, prisma }: MyContext,
  ) {
    const userId = parent.id;
    const comments = await prisma.comment.findMany({
      where: {
        authorId: userId,
      },
    });
    return comments;
  }
  public static async getPostComments(parent: any, _: any, { prisma }: MyContext) {
    const postId = parent.id;
    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
      },
    });
    return comments;
  }
}
