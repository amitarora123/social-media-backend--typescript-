export const commentSchema = `#graphql

    type Comment{
        id: ID!
        content: String!
        createdAt: String!
        updateAt: String!
        author: User!
        post: Post!
    }

    
    type Mutation {
        createComment(content: String!, postId: ID!): Comment!
        updateComment(content: String!, commentId: ID!): Comment!
        deleteComment(commentId: ID!): Response!
    }

`;
