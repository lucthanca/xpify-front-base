/**
 * Custom type policies that allow us to have more granular control
 * over how ApolloClient reads from and writes to the cache.
 *
 * https://www.apollographql.com/docs/react/caching/cache-configuration/#typepolicy-fields
 * https://www.apollographql.com/docs/react/caching/cache-field-behavior/
 */

const typePolicies = {
  Query: {},
  StoreConfig: {
    keyFields: ['store_code'],
  },
  simpifyShop: {
    keyFields: 'uid',
  },
};

export default typePolicies;
