import { ApolloLink } from '@apollo/client';

const AUTH_HEADER_NAME = 'x-auth-required';

class NoAuthLink extends ApolloLink {
  request(operation, forward) {
    const context = operation.getContext();
    const isNoAuth = context?.noAuth === true;
    if (isNoAuth) {
      operation.setContext(previousContext => {
        const { headers } = previousContext;
        const authNotRequiredHeader = {
          ...headers,
          [AUTH_HEADER_NAME]: '0',
        };

        return {
          ...previousContext,
          headers: authNotRequiredHeader,
        };
      });
    }
    return forward(operation);
  }
}

export const authNotRequiredLink = () => new NoAuthLink();
