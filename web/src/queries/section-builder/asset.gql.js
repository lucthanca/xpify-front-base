import { gql } from '@apollo/client';

/* Asset in Store */
export const UPDATE_ASSET_MUTATION = gql`
  mutation Update($theme_id: String!, $key: String!) {
    updateAsset(theme_id: $theme_id, key: $key) {
      id
      name
      entity_id
      actions {
        purchase
        install
        plan
      }
      installed {
        id
        theme_id
        product_version
      }
    }
  }
`;
export const UNINSTALL_SECTION_MUTATION = gql`
  mutation UninstallSectionFromTheme($theme_id: String!, $key: String!) {
    deleteAsset(theme_id: $theme_id, key: $key) {
      id
      name
      entity_id
      actions {
        purchase
        install
        plan
      }
      installed {
        id
        theme_id
        product_version
      }
    }
  }
`;
