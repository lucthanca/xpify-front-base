import { gql } from '@apollo/client';

export const AUTHENTICATE_SESSION_QUERY = gql`
  query authenticateSession($query: String!) {
    authenticateSession(query: $query) {
      token
    }
  }
`;

export const ENSURE_INSTALLED_QUERY = gql`
    query ensureShopifyAppInstalled($query: String!) {
      ensureShopifyAppInstalled(_query: $query) {
        installed redirectQuery
      }
    }
`;
