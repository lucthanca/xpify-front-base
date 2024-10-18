import { gql } from '@apollo/client';

/* Pricing plan App */
export const PRICING_PLAN_QUERY_KEY = 'pricingPlans';
export const PRICING_PLANS_QUERY = gql`
  query GetPricingPlans {
    ${PRICING_PLAN_QUERY_KEY} {
      id status code name
      prices { interval amount }
      currency
      description
      sort_order
      information {
        name
        currentPeriodEnd
        trialDays
      }
    }
  }
`;

export const SORT_OPTIONS_QUERY_KEY = 'getSortOptions';
/* Sort options use */
export const SORT_OPTIONS_QUERY = gql`
  query GetSortOptions {
    ${SORT_OPTIONS_QUERY_KEY} {
      label
      value
      directionLabel
    }
  }
`;

export const PURCHASE_SECTION_MUTATION_KEY = 'purchaseSection';

export const PURCHASE_SECTION_MUTATION = gql`
  mutation Purchase($id: ID!) {
    ${PURCHASE_SECTION_MUTATION_KEY}(id: $id) {
      entity_id
    }
  }
`;
export const SUBSCRIBE_PLAN_MUTATION_KEY = 'subscribePricingPlan';
export const SUBSCRIBE_PLAN_MUTATION = gql`
  mutation Subscribe($input: SubscribePricingPlanInput!) {
    ${SUBSCRIBE_PLAN_MUTATION_KEY}(input: $input) {
      id code name price interval created_at
    }
  }
`;
/* Redirect to page billing of Shopify */
export const REDIRECT_BILLING_PAGE_MUTATION = gql`
  mutation Purchase($name: String!, $interval: PricingPlanInterval!, $is_plan: Boolean!) {
    redirectBillingUrl(name: $name, interval: $interval, is_plan: $is_plan) {
      message
      tone
    }
  }
`;

/* Cancel plan subcribed */
export const CANCEL_PLAN_MUTATION = gql`
  mutation Cancel($name: String!) {
    cancelPlan(name: $name) {
      message
      tone
    }
  }
`;


/* Sort options use */
export const MY_SHOP = gql`
  query GetShop {
    myShop {
      id
      email
      name
      shop_owner
      domain
      home_blocks {
        id dismissed
      }
    }
  }
`;

export const DISMISS_HOME_BLOCK_MUTATION = gql`
  mutation DismissBlock($id: String!, $undo: Boolean) {
    dismissHomeBlock(id: $id, undo: $undo) {
      id dismissed
    }
  }
`;
