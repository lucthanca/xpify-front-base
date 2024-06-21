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
    images { src srcset }
    type_id
    categoriesV2 {
      name id
    }
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

export const QUERY_SECTION_COLLECTION_KEY = `getSections`;

/* Simple Product */
export const SECTIONS_QUERY = gql`
  query GetSectionCollection(
    $search: String,
    $filter: SectionFilterInputV2,
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
      ... on GroupSection { child_ids }
      categories
    }
  }
  ${CommonSectionField}
  ${PricingPlanFragment}
`;
export const RELATED_SECTIONS_QUERY = gql`
  query GET($key: String!) {
    getRelatedSections(key: $key) {
      ...CommonSectionField
      ... on GroupSection {
        child_ids
      }
      ... on Section {
        version release_note src plan_id
      }
    }
  }
  ${CommonSectionField}
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

export const commonSectionFragment = gql`
  fragment CommonSectionFragment on SectionInterface {
    ...CommonSectionField
    ... on Section { plan_id src version release_note }
    ... on GroupSection { child_ids }
    categoriesV2 { id name }
  }
  ${CommonSectionField}
`;
export const BEST_SELLER_QUERY_KEY = 'bestSeller';
export const BEST_SELLER_QUERY = gql`
  query GetBestSeller {
    ${BEST_SELLER_QUERY_KEY} {
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
      ... on GroupSection { child_ids }
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

export const TRY_SECTION_MUTATION_KEY = 'trySection';
export const TRY_SECTION_MUTATION = gql`
    mutation TrySection($id: ID!) {
      ${TRY_SECTION_MUTATION_KEY}(section_id: $id)
    }
`;
