import { useQuery } from '@apollo/client';
import { SECTIONS_QUERY } from '~/queries/section-builder/product.gql';
import { useMemo } from 'react';
import type { GraphQlQueryResponse, Section } from '~/@types';
import { isEmpty } from '~/utils/isEmpty';

export const useTopSellProducts = () => {
  const { data, loading, error } = useQuery<GraphQlQueryResponse<Section>>(SECTIONS_QUERY, {
    fetchPolicy: "cache-and-network",
    variables: {
      sort: { column: 'entity_id', order: 'desc' },
      pageSize: 12,
      currentPage: 1
    }
  });
  const products: Section[] | [] = useMemo(() => {
    if (data === undefined) return [];
    if (isEmpty(data.getSections)) return [];
    return data.getSections.items ?? []; // use ?? to prevent items null or undefined
  }, [data]);
  const loadingWithoutData = useMemo(() => loading && products === undefined, [loading, products]);
  return {
    products,
    loading,
    error,
    loadingWithoutData,
  };
};
