import { gql } from '@apollo/client';
import { commonSectionFragment } from './product.gql';

export const CATEGORIES_QUERY_KEY = 'categories';
export const CATEGORIES_QUERY = gql`
  query GetCategories {
    ${CATEGORIES_QUERY_KEY} {
      items { id name }
    }
  }
`;

export const CATEGORIES_QUERY_V2 = gql`
  query GetCategoryCollection($filter: CategoryFilterInput, $pageSize: Int = 20, $currentPage: Int = 1) {
    ${CATEGORIES_QUERY_KEY}(filters: $filter, pageSize: $pageSize, currentPage: $currentPage) {
      page_info {
        current_page
        page_size
        total_pages
      }
      items {
        id
        name
        sections(
          pageSize: 5
          currentPage: 1
        ) {
          items {
            ...CommonSectionFragment
          }
          page_info {
            current_page
            page_size
            total_pages
          }
        }
      }
    }
  }
  ${commonSectionFragment}
`;
