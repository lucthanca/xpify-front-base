import { CATEGORIES_QUERY_V2 } from "~/queries/section-builder/category.gql";
import { useQuery } from '@apollo/client';
import { useCallback, useState } from 'react';
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
      pageSize: 5,
      currentPage: 1,
    },
  });
  return {
    currentPage,
    handlePageChange,
  };
};
