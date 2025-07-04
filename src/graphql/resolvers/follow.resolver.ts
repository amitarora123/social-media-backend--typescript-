import { FollowService } from '../../services/follow.service';

export const followResolver = {
  Mutation: {
    followUser: FollowService.followUser,
    unFollowUser: FollowService.unfollowUser,
  },
};
