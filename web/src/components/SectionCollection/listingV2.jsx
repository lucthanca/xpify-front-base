import { memo, Fragment, useMemo, useCallback } from 'react';
import { BlockStack, Box } from '@shopify/polaris';
import Search from '~/components/block/input/search';
import { Loading } from '@shopify/app-bridge-react';
import CollectionV3 from './collectionV3';
import { SectionListProvider, useListingContext } from '~/context';
import Pagination from '~/components/Pagination/pagination';
import QuickViewSlider from '~/components/QuickViewSectionModal/slider';
import { useListingV2 } from '~/talons/section/useListingV2';

const ListingV2 = () => {
  const [{ pageInfo, displayPage, loading }, { handleFilterChange, handleSortChange, setDisplayPage }] = useListingContext();
  const { keys, handleSlideMove } = useListingV2();
  return (
    <SectionListProvider>
      <Box padding='400'>
        {loading && <Loading />}
        <BlockStack gap='400'>
          <Search onFilterChange={handleFilterChange} onSortChange={handleSortChange} />
          <CollectionV3 />
        </BlockStack>

        <QuickViewSlider keys={keys} onIndexChange={handleSlideMove} />
      </Box>

      <Pagination onPageChange={setDisplayPage} currentPage={displayPage} totalPages={pageInfo?.total_pages} />
    </SectionListProvider>
  );
};

export default memo(ListingV2);
