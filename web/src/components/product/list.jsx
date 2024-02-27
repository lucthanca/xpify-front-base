import { InlineGrid } from '@shopify/polaris';
import { memo } from 'react';
import ProductCard from '~/components/product/card';

function ProductList({items, handleShowModal, setCurrentProduct}) {
  console.log('re-render-productList');

  return (
    <InlineGrid columns={{sm: 1, md: 2, lg: 4}} gap={600}>
        {items.map((item, keyId) => {
            return <ProductCard key={item.entity_id} keyId={keyId} item={item} handleShowModal={handleShowModal} setCurrentProduct={setCurrentProduct} />
        })}
    </InlineGrid>
  );
}

export default memo(ProductList);