import { graphqlRequest } from '@shopify/cli-kit/node/api/graphql';
import { gql } from 'graphql-request';

const LIGHT_APP_QUERY = gql `
    query App($appName: String!) {
        app (field: name, value: $appName) {
            id
        }
    }
`;

export async function verifyToken(token, appName) {
    const url = new URL('/graphql', process.env.XPIFY_BACKEND_URL).href;

    try {
        await graphqlRequest({
            query: LIGHT_APP_QUERY,
            api: 'XpifyApp',
            url,
            token,
            variables: {
                appName,
            },
        });
    } catch (error) {
        if (error.constructor.name === 'GraphQLClientError') {

            if (error.errors?.[0]?.extensions?.category === 'graphql-authorization') {
                throw new Error('x-graphql-authorization');
            }
        }
    }
}
