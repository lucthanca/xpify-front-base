import { gql } from '@apollo/client';

export const INSTALL_SECTION_MUTATION_KEY = 'updateAsset';
export const APP_EMBED_VERIFY_QUERY_KEY = 'appEmbedVerify';
export const APP_EMBED_VERIFY_QUERY = gql`
  query AppEmbedVerify($themeId: String!) {
    ${APP_EMBED_VERIFY_QUERY_KEY}(theme_id: $themeId)
  }
`;
/* Asset in Store */
export const UPDATE_ASSET_MUTATION = gql`
  mutation InstallSectionToTheme($theme_id: String!, $key: String!) {
    ${INSTALL_SECTION_MUTATION_KEY}(theme_id: $theme_id, key: $key) {
      id
      name
      entity_id
      url_key
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
export const UNINSTALL_SECTION_MUTATION_KEY = 'deleteAsset';
export const UNINSTALL_SECTION_MUTATION = gql`
  mutation UninstallSectionFromTheme($theme_id: String!, $key: String!) {
    ${UNINSTALL_SECTION_MUTATION_KEY}(theme_id: $theme_id, key: $key) {
      id
      name
      url_key
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
