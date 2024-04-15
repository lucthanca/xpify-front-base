import { gql } from '@apollo/client';

export const TAGS_QUERY_KEY = 'getTags';
export const TAGS_QUERY = gql`
  query GetAllTags {
    ${TAGS_QUERY_KEY} {
      id
      entity_id
      name
    }
  }
`;
