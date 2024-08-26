import { gql } from '@apollo/client';

export const THEMES_QUERY_KEY = `getThemes`;
/* Theme in Store */
export const THEMES_QUERY = gql`
  query GetStoreThemes {
    ${THEMES_QUERY_KEY} {
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
