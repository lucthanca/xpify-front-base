import { useQuery } from '@apollo/client';
import { SECTIONS_QUERY } from '~/queries/section-builder/product.gql';
import { SectionData } from '~/talons/section/useSection';
import { useMemo } from 'react';

export interface CollectionQueryData {
  [key: string]: {
    items: SectionData[];
  };
}

export const useTopSellProducts = () => {
  const { data, loading, error } = useQuery<CollectionQueryData>(SECTIONS_QUERY, {
    fetchPolicy: "cache-and-network",
    variables: {
      sort: { column: 'qty_sold', order: 'desc' },
      pageSize: 12,
      currentPage: 1
    }
  });
  const products: SectionData[] | null | undefined = useMemo(() => {
    return data?.getSections?.items;
  }, [data]);
  const loadingWithoutData = useMemo(() => loading && products === undefined, [loading, products]);
  return {
    products,
    loading,
    error,
    loadingWithoutData,
  };
};
