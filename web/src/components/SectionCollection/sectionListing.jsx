import CategoryCollection from '~/components/SectionCollection/categoryCollection';
import { BlockStack, Box } from '@shopify/polaris';
import { useSectionListing } from '~/talons/section/useSectionCollection';
import Search from '~/components/block/input/search';
import { Loading } from '@shopify/app-bridge-react';
import SectionCollection from '~/components/SectionCollection/sectionCollection';
import Pagination from '~/components/Pagination/pagination';

const SectionListing = props => {
  const { disableCategory } = props;

  const talonProps = useSectionListing();
  const {
    handleFilterChange,
    sections,
    refetchSections,
    hasFilter,
    shouldPinTagFilter,
    handleSortChange,
    handlePageChange,
    pageInfo,
    loading,
    loadingWithoutData,
  } = talonProps;
  return (
    <>
      <Box padding={400}>
        {loading && hasFilter && <Loading />}
        <BlockStack gap='400'>
          <Search shouldPinTagFilter={shouldPinTagFilter} onFilterChange={handleFilterChange} onSortChange={handleSortChange} />
          <BlockStack gap='400'>
            {hasFilter && (<SectionCollection loading={loadingWithoutData} items={sections} refetch={refetchSections} onPageChange={handlePageChange} currentPage={pageInfo?.current_page} totalPages={pageInfo?.total_pages} />)}
            {(!hasFilter && !disableCategory && loadingWithoutData) && <CategoryCollection />}
          </BlockStack>
        </BlockStack>
      </Box>

      <Pagination onPageChange={handlePageChange} currentPage={pageInfo?.current_page} totalPages={pageInfo?.total_pages} />
    </>
  );
};

export default SectionListing;
