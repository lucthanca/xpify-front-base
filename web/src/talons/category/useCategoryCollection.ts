import { CATEGORIES_QUERY_V2, CATEGORIES_QUERY_KEY } from "~/queries/section-builder/category.gql";
import { useQuery } from '@apollo/client';
import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useCategoryCollection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(() => {
    if (searchParams.has('page')) {
      return parseInt(searchParams.get('page') || '1');
    }
    return 1;
  });
  const handlePageChange = useCallback((inputPage: number) => {
    let page = inputPage;
    if (page === undefined || page === null) page = 1;
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
  }, []);
  const { data, loading, error } = useQuery(CATEGORIES_QUERY_V2, {
    fetchPolicy: 'cache-and-network',
    variables: {
      pageSize: 1,
      currentPage: 1,
    },
  });
  const categories = useMemo(() => {
    return data?.[CATEGORIES_QUERY_KEY]?.items || [];
  }, [data]);
  const pageInfo = useMemo(() => {
    return data?.[CATEGORIES_QUERY_KEY]?.page_info || {};
  }, [data]);

  return {
    categories,
    currentPage,
    handlePageChange,
    loading,
    error,
    pageInfo,
  };
};
