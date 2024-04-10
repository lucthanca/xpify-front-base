import { CATEGORIES_QUERY_V2, CATEGORIES_QUERY_KEY } from "~/queries/section-builder/category.gql";
import { useApolloClient, useQuery } from '@apollo/client';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SectionData } from '~/talons/section/useSection';
import { SECTIONS_QUERY, QUERY_SECTION_COLLECTION_KEY } from '~/queries/section-builder/product.gql';

type SectionsQueryData = {
  items: SectionData[];
  page_info: {
    total_pages: number;
    current_page: number;
    page_size: number;
  }
}
type Category = {
  id: string;
  name: string;
  sections: SectionsQueryData;
}

export const useCategoryCollection = () => {
  const client = useApolloClient();
  const cache = client.cache;
  const initializedRef = useRef(false);
  const [stateCategories, setCategories] = useState<Category[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(() => {
    if (searchParams.has('page')) {
      const p = searchParams.get('page');
      if (p !== null && p !== undefined) {
        if (parseInt(p) > 0) {
          return parseInt(p);
        } else {
          // const searchParams = new URLSearchParams(window.location.search);
          searchParams.delete('page');
          setSearchParams(searchParams);
        }
      }
    }
    return 1;
  });
  const handlePageChange = useCallback((inputPage: number) => {
    let page = inputPage;
    if (page == 0) return;
    if (page === undefined || page === null) page = 1;
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
  }, []);
  const handleCacheSections = useCallback((categories: Category[]) => {
    if (initializedRef.current) return;
    // loop categories and write to cache
    for (const category of categories) {
      if (!category.sections?.items?.length) continue;
      cache.writeQuery({
        query: SECTIONS_QUERY,
        data: {
          [QUERY_SECTION_COLLECTION_KEY]: category.sections,
        },
        variables: {
          pageSize: 5,
          currentPage: 1,
          filter: { category_id: [category.id] }
        },
      })
    }
  }, []);
  const { data, loading, error } = useQuery(CATEGORIES_QUERY_V2, {
    fetchPolicy: 'cache-and-network',
    variables: {
      pageSize: 1,
      currentPage: currentPage,
    },
    onCompleted: (data) => {
      const comingCategories = data?.[CATEGORIES_QUERY_KEY]?.items || [];
      handleCacheSections(comingCategories);
      setCategories(comingCategories);
    },
  });
  const categories = useMemo(() => {
    return data?.[CATEGORIES_QUERY_KEY]?.items || stateCategories || [];
  }, [data, stateCategories]);
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
