import { gql } from '@apollo/client';
export const GET_SHOP_OVERVIEW_QUERY = gql`
  query GetShopOverview {
    shop: myShop {
      installed_sections {id}
      available_sections_count
    }
  }
`;
