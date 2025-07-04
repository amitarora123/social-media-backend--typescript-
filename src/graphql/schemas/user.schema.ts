export const userSchema = `#graphql

    type User {
        id: ID!
        name: String!
        email: String!
        createdAt: String!
        updatedAt: String!
        posts: [Post!]
        followers: [User!]
        following: [User!]
        likedPosts: [Post!]
        history: [Post!]
        userComments: [Comment!]
        totalAccountLikes: Int
        totalAccountViews: Int
    }
    
    type AuthPayload {
        token: String
        user: User!
    }

    type Query {
        users: [User!]!
        login(email: String!, password: String!): AuthPayload!
        getCurrentUser: User,
        searchUser(name: String!): [User!],
        getUserById(userId: ID!): User,
    }

    type Mutation {
        register(username: String!, email: String!, password: String!): AuthPayload!
    }

`;
