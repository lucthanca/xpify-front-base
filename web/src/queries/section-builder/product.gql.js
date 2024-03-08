import { gql } from '@apollo/client';

/* Simple Product */
export const SECTIONS_QUERY = gql`
  query GET(
    $search: String,
    $filter: SectionFilterInput,
    $sort: SectionSortInput,
    $pageSize: Int = 20,
    $currentPage: Int = 1
  ) {
    getSections(
      search: $search,
      filter: $filter,
      sort: $sort,
      pageSize: $pageSize,
      currentPage: $currentPage
    ) {
      items {
        entity_id
        is_enable
        plan_id
        name
        images {
          src
        }
        url_key
        price
        src
        version
        description
        release_note
        demo_link
        pricing_plan {
          name
          code
          prices {
            interval
            amount
          }
          description
        }
        categories
        tags
        actions {
          install
          purchase
          plan
        }
        installed {
          theme_id
          product_version
        }
      }
      total_count
      page_info {
        current_page
        page_size
        total_pages
      }
    }
  }
`;
export const SECTION_QUERY = gql`
  query GET($key: String!) {
    getSection(key: $key) {
      entity_id
      is_enable
      plan_id
      name
      images {
        src
      }
      url_key
      price
      src
      version
      description
      release_note
      demo_link
      pricing_plan {
        name
        code
        prices {
          interval
          amount
        }
        description
      }
      categories
      tags
      actions {
        install
        purchase
        plan
      }
      installed {
        theme_id
        product_version
      }
    }
  }
`;
export const RELATED_SECTIONS_QUERY = gql`
  query GET($key: String!) {
    getRelatedSections(key: $key) {
      entity_id
      is_enable
      plan_id
      name
      images {
        src
      }
      url_key
      price
      src
      version
      description
      release_note
      demo_link
      pricing_plan {
        name
        code
        prices {
          interval
          amount
        }
        description
      }
      categories
      tags
      actions {
        install
        purchase
        plan
      }
      installed {
        theme_id
        product_version
      }
    }
  }
`;

/* Group Product */
export const GROUP_SECTIONS_QUERY = gql`
  query GET {
    getGroupSections {
      entity_id
      is_enable
      name
      child_ids
      url_key
      price
      description
      demo_link
      images {
        src
      }
      actions {
        install
        purchase
        plan
      }
    }
  }
`;
export const GROUP_SECTION_QUERY = gql`
  query GET($key: String!) {
    getGroupSection(key: $key) {
      entity_id
      is_enable
      name
      child_ids
      url_key
      price
      description
      demo_link
      images {
        src
      }
      actions {
        install
        purchase
        plan
      }
    }
  }
`;

/* Product Bought */
export const SECTIONS_BOUGHT_QUERY = gql`
  query GET {
    getSectionsBuy {
      product_id
      name
      price
      version
      url_key
      images {
        src
      }
    }
  }
`;

/* Product Installed */
export const SECTIONS_INSTALLED_QUERY = gql`
  query GET {
    getSectionsInstall {
      product_id
      name
      price
      version
      url_key
      images {
        src
      }
      installed {
        theme_id
        product_version
      }
    }
  }
`;