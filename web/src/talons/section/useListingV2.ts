import { useListingContext } from '~/context';
import { useCallback, useMemo } from 'react';

type SlideMoveParams = {
  index: number;
  key: string;
};

type ListingContextState = {
  displayPage: number;
  sliderKeys: {
    [key: number]: string[];
  };
};
type ListingContextActions = {
  setDisplayPage: (page: number) => void;
  handlePageChange: (page: number) => void;
};
type ListingContext = [ListingContextState, ListingContextActions];

export const useListingV2 = () => {
  const [{ displayPage, sliderKeys }, { setDisplayPage, handlePageChange: preloadPage }] = useListingContext() as unknown as ListingContext;

  const handleSlideMove = useCallback(({ index, key }: SlideMoveParams) => {
    console.log('Slide moved to index:', index, {slideLent: sliderKeys[displayPage].length });
    if (!sliderKeys || !sliderKeys[displayPage]) return;
    const shouldPreloadNextPage = index === sliderKeys[displayPage].length - 2 || index === sliderKeys[displayPage].length - 1;
    if (shouldPreloadNextPage) {
      preloadPage(displayPage + 1);
    }
    // check the key in which page
    const page = Object.keys(sliderKeys).find((page: string) => sliderKeys[Number(page)].includes(key));
    if (page) {
      setDisplayPage(Number(page));
    }
  }, [sliderKeys, displayPage, setDisplayPage, preloadPage]);
  const keys = useMemo(() => {
    // get all keys from all pages
    return Object.values(sliderKeys).reduce((acc, keys) => {
      return [...acc, ...keys];
    }, []);
  }, [sliderKeys]);

  return {
    keys,
    handleSlideMove,
  };
};
