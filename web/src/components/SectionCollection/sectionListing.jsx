import CategoryCollection from '~/components/SectionCollection/categoryCollection';;
import { BlockStack } from '@shopify/polaris';
import { useSectionListing } from '~/talons/section/useSectionCollection';
import Search from '~/components/input/search';
import ProductList from '~/components/product/list.jsx';

const SectionListing = props => {
  const { disableCategory } = props;

  const talonProps = useSectionListing();
  const {
    handleFilterChange,
    sections,
    hasFilter,
    shouldPinTagFilter,
    handleSortChange,
  } = talonProps;
  return (
    <BlockStack gap='400'>
      <Search shouldPinTagFilter={shouldPinTagFilter} onFilterChange={handleFilterChange} onSortChange={handleSortChange} />
      <BlockStack gap='400'>
        {hasFilter && (<ProductList items={sections ?? []} columns={{sm: 1, md: 2, lg: 4}} /> )}
        {!hasFilter && !disableCategory && <CategoryCollection />}
      </BlockStack>
    </BlockStack>
  );
};

export default SectionListing;
