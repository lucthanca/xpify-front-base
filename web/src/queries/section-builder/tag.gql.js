import { gql } from '@apollo/client';

export const TAGS_QUERY = gql`
  query Get {
    getTags {
      id
      entity_id
      name
    }
  }
`;