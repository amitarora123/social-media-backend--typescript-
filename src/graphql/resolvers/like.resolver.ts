import { LikeService } from '../../services/like.service';

export const likeResolver = {
  Query: {
    hasUserLikedPost: LikeService.hasUserLikedPost,
    getUserLikedPost: LikeService.getUserLikedPost
  },

  Mutation: {
    toggleLike: LikeService.toggleLike,
  },
};
