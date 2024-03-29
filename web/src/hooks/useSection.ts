import { SECTION_V2_QUERY, SECTION_V2_QUERY_KEY } from '~/queries/section-builder/product.gql';
import { ApolloError, DocumentNode, useQuery } from '@apollo/client';
import { SectionData } from '~/talons/section/useSection';
import { useMemo } from 'react';

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
};

export const useSection = (props: UseSectionProps): UseSectionTalon => {
  const {
    key,
    query = SECTION_V2_QUERY,
    queryKey = SECTION_V2_QUERY_KEY,
  } = props;
  const { data, loading, error } = useQuery<QueryData>(query, {
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
  };
};
