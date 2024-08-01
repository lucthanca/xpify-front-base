import { memo, useEffect, useRef } from 'react';
import { InlineGrid } from '@shopify/polaris';
import ProductCard from '~/components/block/product/card';
import EmptySections from '~/components/block/emptyState';
import { SectionListProvider } from '~/context';
import QuickViewSlider from '~/components/QuickViewSectionModal/slider';
import InstallModal from '~/components/block/product/installModal';
import { useIntersection } from '~/hooks/use-intersection';

function ProductList({ items, refetch, columns, fetchNextPage }) {
  const lastItemRef = useRef(null);
  const {ref, entry} = useIntersection({
    root: lastItemRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (!entry) return;
    if (entry.isIntersecting) {
      fetchNextPage && fetchNextPage();
    }
  }, [entry]);

  if (!items.length) {
    return <EmptySections heading={'No result'} content={'Try changing the filters or search term.'} />;
  }

  return (
    <SectionListProvider>
      <InlineGrid columns={columns} gap='400'>
        {items.map((item, index) => (
          <div key={item.id} ref={index === items.length-1 ? ref : undefined} className='xpify-sb-section-card-root'>
            <ProductCard item={item}/>
          </div>
        ))}
        <QuickViewSlider refetch={refetch} type={'normal'} />
        <InstallModal refetch={refetch} />
      </InlineGrid>
    </SectionListProvider>
  );
}

export default memo(ProductList);
