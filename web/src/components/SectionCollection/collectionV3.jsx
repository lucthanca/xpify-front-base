import { memo } from 'react';
import Skeleton from '~/components/block/product/skeleton';
import { useListingContext } from '~/context';
import ProductCard from '~/components/block/product/card';
import InstallModal from '~/components/block/product/installModal';
import { InlineGrid } from '@shopify/polaris';

/**
 * This component use context to get the data and render the product list
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const SectionCollection = () => {
  const [{ loading, items }] = useListingContext();
  if (loading) {
    return <Skeleton total={12} columns={{sm: 1, md: 2, lg: 4}}/>
  }
  return (
    <InlineGrid columns={{sm: 1, md: 2, lg: 4}} gap='600'>
      {items.map(item => (
        <ProductCard key={item.id} item={item} />
      ))}

      <InstallModal />
    </InlineGrid>
  );
};

export default memo(SectionCollection);
