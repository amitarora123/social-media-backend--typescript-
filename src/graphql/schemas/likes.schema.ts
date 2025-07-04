export const likeSchema = `#graphql

    type Like{
        author: User!,
        post: Post!
    }

    type Query {
        hasUserLikedPost(postId: ID!): Boolean!
        getUserLikedPost: [Post!]
    }
    
    type Mutation {
        toggleLike(postId: ID!): Response!
    }
`;
