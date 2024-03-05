import { gql } from '@apollo/client';

export const CATEGORIES_QUERY = gql`
  query Get {
    getCategories {
      entity_id
      name
    }
  }
`;