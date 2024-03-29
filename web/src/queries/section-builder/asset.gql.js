import { gql } from '@apollo/client';

/* Asset in Store */
export const UPDATE_ASSET_MUTATION = gql`
  mutation Update($theme_id: String!, $key: String!) {
    updateAsset(theme_id: $theme_id, key: $key) {
      key
      value
      public_url
      created_at
      updated_at
      content_type
      size
      checksum
      theme_id
      errors
      name
    }
  }
`;
export const DELETE_ASSET_MUTATION = gql`
  mutation Delete($theme_id: String!, $key: String!) {
    deleteAsset(theme_id: $theme_id, key: $key) {
      message
    }
  }
`;
