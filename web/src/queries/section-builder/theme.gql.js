import { gql } from '@apollo/client';

/* Theme in Store */
export const THEMES_QUERY = gql`
  query Get {
    getThemes {
      id
      name
      created_at
      updated_at
      role
      theme_store_id
      previewable
      processing
      admin_graphql_api_id
      errors
    }
  }
`;