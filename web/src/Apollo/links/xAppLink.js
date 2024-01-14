// X-Xpify-App
import { setContext } from '@apollo/client/link/context';

export const xAppLink = () => {
  return setContext((_, { headers }) => {
    if (!process.env.XPIFY_APP_ID) {
      return { headers };
    }

    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        'x-xpify-app': process.env.XPIFY_APP_ID,
      },
    };
  });
};
