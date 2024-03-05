import { InlineGrid } from '@shopify/polaris';
import { memo } from 'react';
import ProductCard from '~/components/product/card';

function ProductList({items, columns}) {
  console.log('re-render-productList');

  return (
    <InlineGrid columns={columns} gap={600}>
      {
        items.map(item => {
          return <ProductCard key={item.entity_id} item={item} />
        })
      }
    </InlineGrid>
  );
}

export default memo(ProductList);