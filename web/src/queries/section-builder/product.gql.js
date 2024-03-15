import { gql } from '@apollo/client';

const CommonSectionField = gql`
  fragment CommonSectionField on SectionInterface {
    entity_id
    is_enable
    name
    url_key
    price
    description
    demo_link
    images { src }
    type_id
    tags
  }
`;
const SectionActionsFragment = gql`
  fragment SectionActionsFragment on Section {
    actions {
      install
      purchase
      plan
    }
  }
`;
const PricingPlanFragment = gql`
  fragment PricingPlanFragment on Section {
    pricing_plan {
      name code prices { interval amount } description
    }
  }
`;
const SectionInstalledFragment = gql`
  fragment SectionInstalledFragment on Section {
    installed {
      theme_id
      product_version
    }
  }
`;

/* Simple Product */
export const SECTIONS_QUERY = gql`
  query GetSectionCollection(
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
        __typename
        ...CommonSectionField
        ... on GroupSection {
          child_ids
        }
        ... on Section {
          version release_note src plan_id
          ...PricingPlanFragment
          ...SectionActionsFragment
          ...SectionInstalledFragment
        }
        entity_id
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
  ${PricingPlanFragment}
  ${SectionActionsFragment}
  ${SectionInstalledFragment}
`;
export const SECTION_QUERY = gql`
  query GetSectionByKey($key: String!) {
    getSection(key: $key) {
      __typename
      entity_id
      ...CommonSectionField
      ... on Section { plan_id src version release_note ...PricingPlanFragment ...SectionActionsFragment ...SectionInstalledFragment }
      categories
    }
  }
  ${CommonSectionField}
  ${PricingPlanFragment}
  ${SectionActionsFragment}
  ${SectionInstalledFragment}
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
      ...on Section { version ...SectionInstalledFragment }
    }
  }
  ${CommonSectionField}
  ${SectionInstalledFragment}
`;
