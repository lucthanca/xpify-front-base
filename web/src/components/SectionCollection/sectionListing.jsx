import { BlockStack, Box } from '@shopify/polaris';
import { useSectionListing } from '~/talons/section/useSectionCollection';
import Search from '~/components/block/input/search';
import { Loading } from '@shopify/app-bridge-react';
import SectionCollection from '~/components/SectionCollection/sectionCollection';
import Skeleton from '~/components/block/product/skeleton';
import { createPortal } from 'react-dom';
import Footer from '~/components/block/footer';

const SectionFooter = ({ show }) => {
  const footer = document.getElementById('xpify_sections_footer');
  if (!footer || !show) return null;
  return createPortal(<Footer hasCaughtUp={show} />, footer);
}

const SectionListing = ({ type, owned, pageSize }) => {
  const talonProps = useSectionListing({ type, owned, pageSize });
  const {
    handleFilterChange,
    sections,
    refetchSections,
    hasFilter,
    shouldPinTagFilter,
    handleSortChange,
    pageInfo,
    loading,
    loadingWithoutData,
    fetchNextPage,
  } = talonProps;
  const hasMore = pageInfo?.current_page < pageInfo?.total_pages;
  const reachedEnd = Object.keys(pageInfo).length > 0 && pageInfo?.current_page === pageInfo?.total_pages;

  return (
    <>
      <Box>
        {loading && <Loading />}
        <BlockStack>
          <Box>
            <Search shouldPinTagFilter={shouldPinTagFilter} onFilterChange={handleFilterChange} onSortChange={handleSortChange} />
          </Box>
          <Box padding='400'>
            <BlockStack gap='400'>
              <SectionCollection loading={loadingWithoutData} items={sections} refetch={refetchSections} fetchNextPage={fetchNextPage} />
              {hasMore && <Skeleton total={4} columns={{sm: 1, md: 2, lg: 4}}/>}
            </BlockStack>
          </Box>
        </BlockStack>
      </Box>
      <SectionFooter show={reachedEnd} />
    </>
  );
};

export default SectionListing;
