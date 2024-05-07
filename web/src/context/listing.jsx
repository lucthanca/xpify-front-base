import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useSectionListing } from '~/talons/section/useSectionCollection';

const SectionListingContext = createContext(undefined);

const ListingProvider = ({ children }) => {
  const [sliderKeys, setSliderKeys] = useState({});
  const [pageItems, setItems] = useState([]);
  const getPageKey = useCallback((page) => {
    return `page_${page}`;
  }, []);
  const handleQueryCompleted = useCallback((responseData) => {
    const { page_info } = responseData;
    const currentPage = page_info?.current_page || 1;
    const keys = responseData.items.map(item => item.url_key);
    setItems(prev => {
      return {
        ...prev,
        [getPageKey(Number(currentPage))]: responseData.items
      }
    });
    setSliderKeys(prev => {
      return {
        ...prev,
        [Number(currentPage)]: keys
      }
    })
  }, []);
  const collectionTalonProps = useSectionListing(handleQueryCompleted);
  const {
    handleFilterChange,
    sections,
    handleSortChange,
    handlePageChange,
    pageInfo,
    loading,
    loadingWithoutData,
  } = collectionTalonProps;
  const [displayPage, setDisplayPage] = useState(pageInfo?.current_page || 1);
  const items = useMemo(() => {
    return pageItems[getPageKey(displayPage)] || [];
  }, [displayPage, pageItems]);
  const keys = useMemo(() => {
    if (!sections.length) return [];
    return sections.map(item => item.url_key);
  }, [sections]);
  const handleSetDisplayPage = useCallback((page) => {
    if (pageItems[getPageKey(page)] === undefined) {
      if (page === 0) return;
      handlePageChange(page);
    }
    setDisplayPage(Number(page));
  }, [pageItems, handlePageChange]);
  const [page, setPage] = useState(1);
  const state = useMemo(() => ({ displayPage, sliderKeys, keys, loading, loadingWithoutData, page, items, pageInfo }), [displayPage, sliderKeys, keys, loading, loadingWithoutData, page, items, pageInfo]);
  const api = useMemo(() => ({ setDisplayPage: handleSetDisplayPage, setPage, handleFilterChange, handleSortChange, handlePageChange }), [handleSetDisplayPage, setDisplayPage, setPage, handleFilterChange, handleSortChange, handlePageChange]);
  const ctxValue = useMemo(() => ([state, api]), [state, api]);
  return (
    <SectionListingContext.Provider value={ctxValue} children={children} />
  );
};
export default ListingProvider;
export const useListingContext = () => useContext(SectionListingContext);
