import { ApolloLink } from '@apollo/client';
import storage from '~/utils/storage';

const CLIENT_CACHE_KEY = 'x-otsb-data-version';

export default () => {
  return new ApolloLink((operation, forward) => {
    return forward(operation).map(response => {
      const context = operation.getContext();
      if (!context) return response;
      const { response: { headers }, cache } = context;
      const clientVer = storage.getItem(CLIENT_CACHE_KEY);
      const serverVer = headers.get(CLIENT_CACHE_KEY);
      if (clientVer !== serverVer) {
        const rootQuery = cache?.data?.data?.ROOT_QUERY;
        if (rootQuery === null || rootQuery === undefined || typeof rootQuery !== 'object') return response;

        Object.keys(rootQuery).forEach(key => {
          if (key.startsWith('getSections')) {
            cache.evict({ id: 'ROOT_QUERY', 'fieldName': key });
          }
        });
        cache.gc();
        storage.setItem(CLIENT_CACHE_KEY, serverVer);
      }
      return response;
    });
  })
}
