import { memo, useMemo } from 'react';
import { InlineGrid } from '@shopify/polaris';
import ProductCard from '~/components/block/product/card';
import EmptySections from '~/components/block/emptyState';
import { SectionListProvider } from '~/context';
import QuickViewSlider from '~/components/QuickViewSectionModal/slider';
import InstallModal from '~/components/block/product/installModal';

function ProductList({ items, columns, isSimple = true }) {
  console.log('re-render-productList');

  // const keys = useMemo(() => {
  //   if (!items.length) return [];
  //   return items.map(item => item.url_key);
  // }, [items]);
  if (!items.length) {
    return <EmptySections heading={'No result'} content={'Try changing the filters or search term.'} />;
  }

  return (
    <SectionListProvider>
      <InlineGrid columns={columns} gap='600'>
        {items.map(item => (
          <ProductCard key={item.id} item={item} />
        ))}

        <QuickViewSlider type={'normal'} />
        <InstallModal />
      </InlineGrid>
    </SectionListProvider>
  );
}

export default memo(ProductList);
