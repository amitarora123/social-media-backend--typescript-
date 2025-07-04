export const postSchema = `#graphql
    scalar Upload

    type View {
        author: User,
        authorId: ID!
    }
    type Post {
        id: ID!
        title: String
        content: String
        mediaUrl: String
        published: Boolean
        createdAt: String
        author: User
        authorId: ID!
        totalLikes: Int
        totalViews: Int
        comments: [Comment!]
        scheduleAt: String
        commentsEnabled:Boolean
    }

    type Response {
        success: Boolean!,
        message: String
    }
    type Query {
        searchPosts(content: String): [Post!]
        getPostById(postId: ID!): Post
        getPostByUserId(userId: ID!): [Post!]
        getFeedPosts(limit:Int, page:Int): [Post!]
    }
    
    type Mutation {
        createPost(file: Upload!, title: String!, content: String!, published: Boolean, scheduleAt: String, commentsEnabled: Boolean ): Post
        deletePost(postId: ID!): Response!
        updatePost(file: Upload!, postId: ID!, content: String, published: Boolean, title: String, commentsEnabled: Boolean, scheduleAt: String): Response!
        viewPost(postId: ID!): Response!
    }
`;
