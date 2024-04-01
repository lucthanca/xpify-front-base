import { SECTION_V2_QUERY, SECTION_V2_QUERY_KEY } from '~/queries/section-builder/product.gql';
import { useQuery } from '@apollo/client';
import type { ApolloError, DocumentNode } from '@apollo/client';
import { SectionData } from '~/talons/section/useSection';
import { useMemo } from 'react';
import type { ApolloQueryResult, OperationVariables } from '@apollo/client/core/types';

type QueryData = {
  [key: string]: SectionData,
}

type UseSectionProps = {
  key: string | undefined;
  query?: DocumentNode;
  queryKey?: string;
};

export type UseSectionTalon = {
  section: SectionData | undefined,
  loadingWithoutData: boolean,
  loading: boolean,
  error: ApolloError | undefined,
  refetch: (variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<QueryData>>,
};

export const useSection = (props: UseSectionProps): UseSectionTalon => {
  const {
    key,
    query = SECTION_V2_QUERY,
    queryKey = SECTION_V2_QUERY_KEY,
  } = props;
  const { data, loading, error, refetch } = useQuery<QueryData>(query, {
    fetchPolicy: 'cache-and-network',
    variables: { key },
    skip: !key,
  });

  const section: SectionData | undefined = useMemo(() => {
    return data?.[queryKey];
  }, [data]);

  return {
    section,
    loadingWithoutData: loading && !data,
    loading,
    error,
    refetch,
  };
};
