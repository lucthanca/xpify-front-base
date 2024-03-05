import { gql } from '@apollo/client';

export const TAGS_QUERY = gql`
  query Get {
    getTags {
      entity_id
      name
    }
  }
`;