import { MyContext } from '../types';

export class FollowService {
  public static async followUser(
    _: any,
    { userId }: { userId: number },
    { user, prisma }: MyContext,
  ) {
    if (!user) throw new Error('UNAUTHORIZED REQUEST');

    const follow = await prisma.follower.create({
      data: {
        follower: {
          connect: { id: user.id },
        },
        following: {
          connect: { id: Number(userId) },
        },
      },
      include: {
        follower: true,
        following: true,
      },
    });

    return follow;
  }
  public static async unfollowUser(
    _: any,
    { userId }: { userId: number },
    { prisma, user }: MyContext,
  ) {
    if (!user)
      return {
        success: false,
        message: 'UNAUTHORIZED REQUEST',
      };

    await prisma.follower.delete({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: Number(userId),
        },
      },
    });

    return {
      success: true,
      message: 'Unfollowed Successfully',
    };
  }
  public static async searchUser(
    _: any,
    { name }: { name: string },
    { user, prisma }: MyContext,
  ) {
    return await prisma.user.findMany({
      where: {
        name: {
          contains: name,
        },
      },
    });
  }
  public static async getFollowing(parent: any, _: any, { prisma }: MyContext) {
    const userId = parent.id;

    const followings = await prisma.follower.findMany({
      where: {
        followerId: userId,
      },
      select: {
        following: true,
      },
    });
    return followings.map((f) => f.following);
  }
  public static async getFollowers(parent: any, _: any, { prisma }: MyContext) {
    const userId = parent.id;
    const followers = await prisma.follower.findMany({
      where: {
        followingId: userId,
      },
      include: {
        follower: true,
      },
    });
    return followers.map((f) => f.follower);
  }
}
