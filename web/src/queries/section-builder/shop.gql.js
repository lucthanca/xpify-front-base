import { gql } from '@apollo/client';
export const GET_SHOP_OVERVIEW_QUERY = gql`
  query GetShopOverview {
    shop: myShop {
      id
      installed_sections_count
      available_sections_count
    }
  }
`;

export const GET_SHOP_RECENT_INSTALLED_QUERY = gql`
  query GetShopRecentInstalled {
    shop: myShop {
      id
      installed_sections(sort: {field: created_at, dir: DESC}) {
        items {
          id
          section { id name url_key type_id }
          theme { id name }
        }
      }
    }
  }
`;
