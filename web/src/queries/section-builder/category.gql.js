import { gql } from '@apollo/client';

export const CATEGORIES_QUERY = gql`
  query Get {
    getCategories {
      entity_id
      name
    }
  }
`;

export const CATEGORIES_QUERY_V2 = gql`
  query GetCategoryCollection($filter: CategoryFilterInput, $pageSize: Int = 20, $currentPage: Int = 1) {
    categories(filter: $filter, pageSize: $pageSize, currentPage: $currentPage) {
      id
      name
    }
  }
`;
