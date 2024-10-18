import { useCallback, useRef, useState } from 'react';
import { ApolloCache, DefaultContext, MutationOptions, OperationVariables, useApolloClient } from '@apollo/client';

export function useAbortableMutation<
  TData = any,
  TVariables extends OperationVariables = OperationVariables,
  TContext extends Record<string, any> = DefaultContext,
  TCache extends ApolloCache<any> = ApolloCache<any>,
>(
  mutation: any,
): [
  (options: Omit<MutationOptions<TData, TVariables, TContext>, 'mutation'>) => Promise<void>,
  { data?: TData | null; error?: Error; loading: boolean },
  () => void,
] {
  const client = useApolloClient();
  const controller = useRef(new window.AbortController());
  const [data, setData] = useState<TData | null>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(false);

  const request = useCallback(
    async (options: Omit<MutationOptions<TData, TVariables, TContext>, 'mutation'>) => {
      try {
        setLoading(true);
        controller.current = new window.AbortController();
        const res = await client.mutate<TData, TVariables, TContext, TCache>({
          ...options,
          mutation,
          context: { ...options.context, fetchOptions: { signal: controller.current.signal } } as unknown as TContext,
          errorPolicy: 'all',
        });
        setData(res.data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [client, mutation],
  );

  const abort = useCallback(() => {
    if (!controller.current.signal.aborted) {
      controller.current.abort();
      setLoading(false);
    }
  }, [controller]);

  return [request, { data, error, loading }, abort];
}
