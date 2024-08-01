import { SECTION_V2_QUERY, SECTION_V2_QUERY_KEY } from '~/queries/section-builder/product.gql';
import { useQuery } from '@apollo/client';
import type { ApolloError, DocumentNode } from '@apollo/client';
import { useMemo, useState } from 'react';
import type { Section } from '~/@types';

type QueryData = {
  [key: string]: Section,
}

type UseSectionProps = {
  key: string | undefined;
  query?: DocumentNode;
  queryKey?: string;
};

export type UseSectionTalon = {
  section: Section | undefined,
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
  const [prevSection, setPrevSection] = useState<Section | undefined>(undefined);
  const { data, loading, error } = useQuery<QueryData>(query, {
    fetchPolicy: 'cache-and-network',
    variables: { key },
    skip: !key,
    onCompleted: (data) => {
      if (data?.[queryKey]) {
        setPrevSection(data[queryKey]);
      }
    },
  });

  const section: Section | undefined = useMemo(() => {
    return data?.[queryKey] || prevSection;
  }, [data]);

  return {
    section,
    loadingWithoutData: loading && !data,
    loading,
    error,
  };
};
