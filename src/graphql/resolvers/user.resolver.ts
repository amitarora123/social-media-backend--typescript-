import { CommentService } from '../../services/comment.service';
import { FollowService } from '../../services/follow.service';
import { LikeService } from '../../services/like.service';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';

export const userResolver = {
  Query: {
    users: UserService.getAllUsers,
    login: UserService.loginUser,
    getCurrentUser: UserService.getCurrentUser,
    searchUser: UserService.searchUser,
    getUserById: UserService.getUserById,
  },
  Mutation: {
    register: UserService.registerUser,
  },
  User: {
    followers: FollowService.getFollowers,
    following: FollowService.getFollowing,
    posts: PostService.getUserPosts,
    likedPosts: LikeService.getUserLikedPost,
    history: PostService.getLastWatchedPost,
    userComments: CommentService.getUserComments,
    totalAccountLikes: LikeService.getAccountLikes,
    totalAccountViews: PostService.getTotalAccountViews,
  },
};
