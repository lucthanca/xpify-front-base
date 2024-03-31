import { gql } from '@apollo/client';

const CommonSectionField = gql`
  fragment CommonSectionField on SectionInterface {
    id
    entity_id
    is_enable
    name
    url_key
    price
    short_description
    description
    demo_link
    images { src }
    type_id
    tags {
      name id
    }
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
`;
const PricingPlanFragment = gql`
  fragment PricingPlanFragment on Section {
    pricing_plan {
      id name code prices { interval amount } description
    }
  }
`;

const QUERY_SECTION_COLLECTION_KEY = `getSections`;

/* Simple Product */
export const SECTIONS_QUERY = gql`
  query GetSectionCollection(
    $search: String,
    $filter: SectionFilterInput,
    $sort: SectionSortInput,
    $pageSize: Int = 20,
    $currentPage: Int = 1
  ) {
    ${QUERY_SECTION_COLLECTION_KEY}(
      search: $search,
      filter: $filter,
      sort: $sort,
      pageSize: $pageSize,
      currentPage: $currentPage
    ) {
      items {
        ...CommonSectionField
        ... on GroupSection {
          child_ids
        }
        ... on Section {
          version release_note src plan_id
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
  ${CommonSectionField}
`;
export const SECTION_QUERY = gql`
  query GetSectionByKey($key: String!) {
    getSection(key: $key) {
      __typename
      ...CommonSectionField
      ... on Section { plan_id src version release_note ...PricingPlanFragment }
      categories
    }
  }
  ${CommonSectionField}
  ${PricingPlanFragment}
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
      tags { id name }
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
  query GetGroupSections {
    getGroupSections {
      __typename
      entity_id
      ...CommonSectionField
      ... on GroupSection {
        child_ids
      }
    }
  }
  ${CommonSectionField}
`;
export const GROUP_SECTION_QUERY = gql`
  query GetGroupSection($key: String!) {
    getGroupSection(key: $key) {
      __typename
      entity_id
      ...CommonSectionField
      ...on GroupSection {
        child_ids
        actions { purchase }
      }
    }
  }
  ${CommonSectionField}
`;

/* Product Bought */
export const SECTIONS_BOUGHT_QUERY = gql`
  query GET {
    getSectionsBuy {
      ...CommonSectionField
      ...on Section { version }
    }
  }
  ${CommonSectionField}
`;

/* Product Installed */
export const SECTIONS_INSTALLED_QUERY = gql`
  query GET {
    getSectionsInstall {
      ...CommonSectionField
      ...on Section { version }
    }
  }
  ${CommonSectionField}
`;

const commonSectionFragment = gql`
  fragment CommonSectionFragment on SectionInterface {
    ...CommonSectionField
    ... on Section { plan_id src version release_note }
    categoriesV2 { id name }
  }
  ${CommonSectionField}
`;
export const BEST_SELLER_QUERY = gql`
  query GetBestSeller {
    bestSeller {
      ...CommonSectionFragment
    }
  }
  ${commonSectionFragment}
`;
export const SECTION_V2_QUERY_KEY = 'section';
export const SECTION_V2_QUERY = gql`
  query GetSectionByKeyV2($key: String!) {
    ${SECTION_V2_QUERY_KEY}(key: $key) {
      ...CommonSectionFragment
      ...on Section {
        ...PricingPlanFragment
      }
    }
  }
  ${commonSectionFragment}
  ${PricingPlanFragment}
`;

export const LATEST_RELEASE_QUERY_KEY = 'recentlyUpdated';
export const LATEST_RELEASE_QUERY = gql`
  query GetLatestRelease {
    ${LATEST_RELEASE_QUERY_KEY} {
      ...CommonSectionFragment
    }
  }
  ${commonSectionFragment}
`;
