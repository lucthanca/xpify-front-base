/**
 * Custom type policies that allow us to have more granular control
 * over how ApolloClient reads from and writes to the cache.
 *
 * https://www.apollographql.com/docs/react/caching/cache-configuration/#typepolicy-fields
 * https://www.apollographql.com/docs/react/caching/cache-field-behavior/
 */
import { QUERY_SECTION_COLLECTION_KEY } from '~/queries/section-builder/product.gql';

const typePolicies = {
  Query: {
    fields: {
      [QUERY_SECTION_COLLECTION_KEY]: {
        // Cache theo search, filter và sort thôi, không cache pagesize và current page vì sẽ merge hết vào nhau
        keyArgs: ['search', 'filter', 'sort'],
        merge(existing = {}, incoming = {}, { variables, ...restArgs }) {
          console.log({ variables, restArgs });
          if (variables.pageSize === null || !existing.items) {
            return incoming;
          }
          if (incoming.page_info.page_size !== existing.page_info.page_size || incoming.page_info.total_pages !== existing.page_info.total_pages) {
            return incoming;
          }
          const map = new Map();
          existing.items.forEach(item => map.set(item['__ref'], item));
          incoming.items.forEach(item => map.set(item['__ref'], { ...map.get(item['__ref']), ...item }));
          const items = Array.from(map.values());

          const page_info = { ...incoming.page_info };
          // merge pageInfo
          if (incoming.page_info.current_page < existing.page_info.current_page) {
            page_info.current_page = existing.page_info.current_page;
          }
          return {
            items,
            page_info,
          }
        },
      }
    }
  },
  StoreConfig: {
    keyFields: ['store_code'],
  },
  SectionInterface: {
    keyFields: 'url_key',
  },
  Section: {
    keyFields: ['url_key'],
  },
  GroupSection: {
    keyFields: 'url_key',
  },
  App: {
    keyFields: 'id',
  },
  PricingPlan: {
    keyFields: 'id',
  },
  Action: {
    keyFields: false,
  }
};

export default typePolicies;
