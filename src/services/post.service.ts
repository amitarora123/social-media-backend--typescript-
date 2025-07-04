import { CreatePostArgs, updatePostArgs, MyContext } from '../types';
import { deleteFromCloudinary, uploadOnCloudinary } from '../utils/cloudinary';
import { UNAUTHORIZED } from '../utils/constant';
import { uploadToLocal } from '../utils/uploadToLocal';

export class PostService {
  public static async createPost(
    _: any,
    {
      content,
      title,
      commentsEnabled,
      published,
      scheduleAt,
      file,
    }: CreatePostArgs,
    { user, prisma }: MyContext,
  ) {
    if (!user) throw new Error('Invalid token | UNAUTHORIZED REQUEST');

    const localPath = await uploadToLocal(file);
    let mediaUrl = null;
    if (localPath) {
      mediaUrl = await uploadOnCloudinary(localPath);
      console.log(mediaUrl);
    }
    let isPublished: boolean;

    if (!scheduleAt || new Date(scheduleAt) <= new Date()) {
      if (published === null || published === undefined) {
        isPublished = true;
      } else isPublished = published;
    } else {
      isPublished = false;
    }

    const post = await prisma.post.create({
      data: {
        title,
        author: {
          connect: { id: user.id },
        },
        content,
        published: isPublished,
        commentsEnabled,
        scheduleAt,
        mediaUrl: mediaUrl?.url,
      },
      include: {
        author: true,
        Likes: true,
      },
    });

    return post;
  }

  public static async searchPosts(
    _: any,
    { content }: { content: string },
    { prisma }: MyContext,
  ) {
    const posts = await prisma.post.findMany({
      where: {
        AND: [
          {
            content: {
              contains: content || '',
            },
          },
          {
            OR: [
              { published: true },
              {
                scheduleAt: {
                  gte: new Date(),
                },
              },
            ],
          },
        ],
      },
      include: {
        Likes: true,
        author: true,
      },
    });
    return posts;
  }

  public static async getPostById(
    _: any,
    { postId }: { postId: number },
    { prisma }: MyContext,
  ) {
    return await prisma.post.findUnique({
      where: {
        id: Number(postId),
        OR: [
          { published: true },
          {
            scheduleAt: {
              gte: new Date(),
            },
          },
        ],
      },
      include: {
        author: true,
        Likes: true,
      },
    });
  }

  public static async getUserPosts(
    parent: any,
    { userId }: { userId: number },
    { prisma }: MyContext,
  ) {
    const id = userId || parent.id;

    const posts = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        posts: {
          where: {
            OR: [
              { published: true },
              {
                scheduleAt: {
                  gte: new Date(),
                },
              },
            ],
          },
        },
      },
    });

    return posts?.posts;
  }

  public static async removePost(
    _: any,
    { postId }: { postId: number },
    { prisma, user }: MyContext,
  ) {
    if (!user)
      return {
        success: false,
        message: 'UNAUTHORIZED REQUEST',
      };
    const isDeleted = await prisma.post.delete({
      where: {
        id: Number(postId),
        authorId: Number(user?.id),
      },
      include: {
        Likes: true,
      },
    });

    if (isDeleted)
      return {
        success: true,
        message: 'Post Deleted successfully',
      };
    else
      return {
        success: false,
        message: 'Post cannot be deleted',
      };
  }
  public static async updatePost(
    _: any,
    {
      postId,
      content,
      title,
      commentsEnabled,
      published,
      scheduleAt,
      file,
    }: updatePostArgs,
    { prisma, user }: MyContext,
  ) {
    if (!user) throw new Error('UNAUTHORIZED REQUEST');

    const post = await prisma.post.findUnique({
      where: { id: Number(postId) },
    });
    if (!post) {
      return {
        success: false,
        message: 'post not found',
      };
    }

    const localFilePath = await uploadToLocal(file);
    let mediaUrl;
    if (localFilePath) {
      if (post.mediaUrl) await deleteFromCloudinary(post.mediaUrl);
      const uploadObj = await uploadOnCloudinary(localFilePath);
      mediaUrl = uploadObj?.secure_url;
    } else {
      mediaUrl = post.mediaUrl;
    }

    const scheduledAt =
      !!post.scheduleAt && post.scheduleAt > new Date()
        ? scheduleAt
        : post.scheduleAt;

    let isPublished: boolean;

    if (!scheduledAt || new Date(scheduledAt) <= new Date()) {
      if (published === null || published === undefined) {
        isPublished = true;
      } else isPublished = published;
    } else {
      isPublished = false;
    }

    const update = await prisma.post.update({
      where: {
        id: Number(postId),
      },
      data: {
        content,
        title,
        commentsEnabled,
        published: isPublished,
        scheduleAt: scheduledAt,
        mediaUrl,
      },
      include: {
        author: true,
        Likes: true,
      },
    });

    if (update)
      return {
        success: true,
        message: 'Post updated successfully',
      };
    else {
      return {
        success: false,
        message: 'Post could not be updated',
      };
    }
  }
  public static async viewPost(
    _: any,
    { postId }: { postId: number },
    { prisma, user }: MyContext,
  ) {
    if (!user) return UNAUTHORIZED;
    await prisma.views.create({
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
      message: 'view added successfully',
    };
  }
  public static async getLastWatchedPost(
    parent: any,
    _: any,
    { prisma, user }: MyContext,
  ) {
    const userId = parent.id;

    const views = await prisma.views.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        post: true,
      },
    });
    return views.map((v) => v.post);
  }
  public static async getFeedPosts(
    _: any,
    { limit, page }: { limit: number; page: number },
    { user, prisma }: MyContext,
  ) {
    if (!user) throw new Error('UNAUTHORIZED REQUEST');

    const followings = await prisma.follower.findMany({
      where: {
        followerId: user.id,
      },
      select: { followingId: true },
    });
    const followingIds = followings.map((f) => f.followingId);

    const posts = await prisma.post.findMany({
      where: {
        authorId: {
          in: followingIds,
        },
        OR: [
          { published: true },
          {
            scheduleAt: {
              gte: new Date(),
            },
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit || 10,
      skip: page ? (page - 1) * limit : 0,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    console.log(posts);
    return posts;
  }
  public static async getPostViews(parent: any, _: any, { prisma }: MyContext) {
    const postId = parent.id;
    return await prisma.views.count({
      where: {
        postId,
      },
    });
  }
  public static async getTotalAccountViews(
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

    return await prisma.views.count({
      where: {
        postId: {
          in: postIds,
        },
      },
    });
  }
}
