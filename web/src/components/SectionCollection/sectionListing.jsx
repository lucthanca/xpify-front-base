import CategoryCollection from '~/components/SectionCollection/categoryCollection';
import { BlockStack } from '@shopify/polaris';
import { useSectionListing } from '~/talons/section/useSectionCollection';
import Search from '~/components/input/search';
import ProductList from '~/components/product/list';
import Pagination from '~/components/Pagination';
import { Loading } from '@shopify/app-bridge-react';

const SectionCollection = props => {
  const { items, onPageChange, currentPage, totalPages } = props;
  return (
    <>
      <ProductList items={items ?? []} columns={{sm: 1, md: 2, lg: 4}} />
      <Pagination onPageChange={onPageChange} currentPage={currentPage} totalPages={totalPages} />
    </>
  );
};

const SectionListing = props => {
  const { disableCategory } = props;

  const talonProps = useSectionListing();
  const {
    handleFilterChange,
    sections,
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
      {loading && hasFilter && <Loading />}
      <BlockStack gap='400'>
        <Search shouldPinTagFilter={shouldPinTagFilter} onFilterChange={handleFilterChange} onSortChange={handleSortChange} />
        <BlockStack gap='400'>
          {(hasFilter && !loadingWithoutData) && (<SectionCollection items={sections} onPageChange={handlePageChange} currentPage={pageInfo?.current_page} totalPages={pageInfo?.total_pages} />)}
          {(!hasFilter && !disableCategory && loadingWithoutData) && <CategoryCollection />}
        </BlockStack>
      </BlockStack>
    </>
  );
};

export default SectionListing;
