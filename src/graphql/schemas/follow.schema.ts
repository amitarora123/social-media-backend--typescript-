export const followSchema = `#graphql

    type FollowPayload{
        follower:User!,
        following:User,
    }

    type Mutation {
        followUser(userId: ID!): FollowPayload!,
        unFollowUser(userId: ID!): Response!
    }
`;
