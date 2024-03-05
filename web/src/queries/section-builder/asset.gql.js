import { gql } from '@apollo/client';

/* Asset in Store */
export const UPDATE_ASSET_MUTATION = gql`
  mutation Update($theme_id: String!, $asset: String!, $value: String!) {
    updateAsset(theme_id: $theme_id, asset: $asset, value: $value) {
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
    }
  }
`;
export const DELETE_ASSET_MUTATION = gql`
  mutation Delete($theme_id: String!, $asset: String!) {
    deleteAsset(theme_id: $theme_id, asset: $asset) {
      message
    }
  }
`;