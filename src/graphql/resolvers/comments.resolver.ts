import { CommentService } from '../../services/comment.service';

export const commentResolver = {
  Mutation: {
    createComment: CommentService.createComment,
    updateComment: CommentService.updateComment,
    deleteComment: CommentService.deleteComment,
  },
};
