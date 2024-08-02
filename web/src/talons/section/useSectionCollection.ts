import { useCallback, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { SECTIONS_QUERY, QUERY_SECTION_COLLECTION_KEY } from '~/queries/section-builder/product.gql';
import {
  CATEGORY_FILTER_KEY,
  PLAN_FILTER_KEY,
  PRICE_FILTER_KEY,
  TAG_FILTER_KEY,
  QUERY_SEARCH_KEY,
  SORT_OPTION_NONE,
} from '~/components/block/input/search';
import { isEmpty } from '~/utils/isEmpty';
import type { PageInfo, Section, CollectionQueryResponse, CollectionQueryData } from '~/@types';
import { SECTION_TYPE_SIMPLE } from '~/constants';

const FILTER_FIELDS_MAPPING: { [key: string]: string } = {
  [TAG_FILTER_KEY]: 'tag_id',
  [PLAN_FILTER_KEY]: 'plan_id',
  [CATEGORY_FILTER_KEY]: 'category_id',
  [PRICE_FILTER_KEY]: 'price',
};

type SectionListingTalonProps = {
  onQueryCompleted?: (data: CollectionQueryData<Section>) => void;
  type?: number;
  owned?: boolean;
  pageSize?: number | undefined;
};

type FilterPart = {
  [key: string]: string;
}

export const useSectionListing = ({ onQueryCompleted, type = SECTION_TYPE_SIMPLE, owned = false, pageSize }: SectionListingTalonProps) => {
  const [filterParts, setFilterParts] = useState<FilterPart>({});
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [sort, setSort] = useState<string[]>([SORT_OPTION_NONE]);
  const isSortNone = useMemo<boolean>(() => !sort || sort[0] === SORT_OPTION_NONE, [sort]);

  const hasFilter = useMemo<boolean>(() => {
    return !isEmpty(filterParts) || !!searchFilter || !isSortNone;
  }, [filterParts, searchFilter, isSortNone]);

  const { data, loading, refetch: refetchSections, fetchMore } = useQuery<CollectionQueryResponse<Section>>(SECTIONS_QUERY, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
    variables: {
      search: searchFilter,
      filter: {
        ...filterParts,
        type_id: type,
        owned,
      },
      sort: (([column, order]) => ({ column, order }))(sort[0].split(' ')),
      pageSize,
      currentPage: 1
    },
    onCompleted: (data) => {
      const responseData = data?.[QUERY_SECTION_COLLECTION_KEY] || {};
      if (onQueryCompleted) {
        onQueryCompleted(responseData);
      }
    },
    // skip: !hasFilter,
  });

  const handleFilterChange = useCallback((type: string, value: any) => {
    if (type === QUERY_SEARCH_KEY) {
      setSearchFilter(value);
      return;
    }
    if (!type || FILTER_FIELDS_MAPPING[type] === undefined) return;
    setFilterParts(prevState => {
      let tValue = value;
      if (type === PRICE_FILTER_KEY) {
        if (Array.isArray(value) && value.length === 2) {
          tValue = { min: value[0], max: value[1] };
        } else {
          return prevState;
        }
      }
      const newState: FilterPart = {
        ...prevState,
        [FILTER_FIELDS_MAPPING[type]]: tValue,
      };

      // remove the key if the value is empty
      if (isEmpty(tValue)) {
        delete newState[FILTER_FIELDS_MAPPING[type]];
      }

      return newState;
    });
  }, []);
  const handleSortChange = useCallback((value: any) => {
    setSort(value);
  }, []);
  const sections = useMemo<Section[]>(() => {
    return data?.[QUERY_SECTION_COLLECTION_KEY]?.items || [];
  }, [data]);

  const lastPageInfo = useMemo<PageInfo>(() => {
    return data?.[QUERY_SECTION_COLLECTION_KEY]?.page_info || {
      current_page: 1,
      total_pages: 1,
      page_size: pageSize || 1,
    };
  }, [data]);
  const loadingWithoutData = loading && !data;
  const fetchNextPage = useCallback(() => {
    if (!Object.keys(lastPageInfo).length) return;
    if (lastPageInfo.current_page < lastPageInfo.total_pages) {
      fetchMore({
        variables: {
          currentPage: lastPageInfo.current_page + 1,
        },
      });
    }
  }, [lastPageInfo]);

  return {
    handleFilterChange,
    sections,
    refetchSections,
    hasFilter,
    handleSortChange,
    pageInfo: lastPageInfo,
    loading,
    loadingWithoutData,
    fetchNextPage,
  };
};
