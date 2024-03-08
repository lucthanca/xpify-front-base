import { ApolloError, useQuery } from '@apollo/client';
import { GROUP_SECTIONS_QUERY } from '~/queries/section-builder/product.gql';
import { useMemo } from 'react';
import { SectionDataInterface } from '~/talons/section/useSection';

export type GroupData = SectionDataInterface & {
  child_ids: string[];
};

export type GroupCollectionTalon = {
  groups: GroupData[];
  loading: boolean;
  loadingWithoutData: boolean;
  error: ApolloError | undefined;
};

export const useGroupCollection = (): GroupCollectionTalon => {
  const { data, loading, error } = useQuery(GROUP_SECTIONS_QUERY, {
    fetchPolicy: 'cache-and-network',
  });
  const groups: GroupData[] = useMemo(() => data?.getGroupSections || [], [data]);
  const loadingWithoutData = useMemo(() => loading && !groups.length, [loading, groups]);

  return {
    groups,
    loading,
    loadingWithoutData,
    error,
  }
};
