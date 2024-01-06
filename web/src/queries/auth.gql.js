import { gql } from '@apollo/client';

export const AUTHENTICATE_SESSION_QUERY = gql`
  query authenticateSession($query: String!) {
    authenticateSession(query: $query) {
      token
    }
  }
`;
