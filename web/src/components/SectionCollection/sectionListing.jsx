import CategoryCollection from '~/components/SectionCollection/categoryCollection';;
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
  } = talonProps;
<<<<<<< HEAD
  const bestSellerSliderConfig = {
    perPage: 4,
    gap: '1rem',
    pagination: false,
    breakpoints:{
      425: { perPage: 1 },
      768: { perPage: 3, gap: '0.5rem' },
      2560: { perPage: 4 }
    },
  }
=======
>>>>>>> b4298023110480e04ede4f7cffe477860777bf45
  return (
    <>
      {loading && hasFilter && <Loading />}
      <BlockStack gap='400'>
        <Search shouldPinTagFilter={shouldPinTagFilter} onFilterChange={handleFilterChange} onSortChange={handleSortChange} />
        <BlockStack gap='400'>
          {hasFilter && (<SectionCollection items={sections} onPageChange={handlePageChange} currentPage={pageInfo?.current_page} totalPages={pageInfo?.total_pages} />)}
          {!hasFilter && !disableCategory && <CategoryCollection />}
        </BlockStack>
      </BlockStack>
    </>
  );
};

export default SectionListing;
