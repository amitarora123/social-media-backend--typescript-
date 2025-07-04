import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { CommentService } from '../../services/comment.service';
import { LikeService } from '../../services/like.service';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';

export const postResolver = {
  Upload: GraphQLUpload,
  Query: {
    searchPosts: PostService.searchPosts,
    getPostById: PostService.getPostById,
    getPostByUserId: PostService.getUserPosts,
    getFeedPosts: PostService.getFeedPosts
  },
  Mutation: {
    createPost: PostService.createPost,
    deletePost: PostService.removePost,
    updatePost: PostService.updatePost,
    viewPost: PostService.viewPost,
  },
  Post: {
    comments: CommentService.getPostComments,
    totalLikes: LikeService.getPostLikes,
    totalViews: PostService.getPostViews,
    author: UserService.getPostAuthor
  },
};
