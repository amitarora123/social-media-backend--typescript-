export const fileSchema = `#graphql
    
    scalar Upload

    type File {
        filename: String!
        mimetype: String!
        encoding: String!
    }

    type Query {
        # This is only here to satisfy the requirement that at least one
        # field be present within the 'Query' type.  This example does not
        # demonstrate how to fetch uploads back.
        otherFields: Boolean!
    }

    type Mutation {
        # Multiple uploads are supported. See graphql-upload docs for details.
        uploadFile(file: Upload!): Boolean
    }
`;
