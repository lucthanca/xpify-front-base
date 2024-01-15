import { RetryLink } from '@apollo/client/link/retry';

export const retryLink = () => {
  return new RetryLink({
    delay: {
      initial: 300,
      max: Infinity,
      jitter: true
    },
    attempts: {
      max: 5,
      retryIf: (error, _operation) => !!error && error?.statusCode >= 500 && navigator.onLine,
    }
  });
};
