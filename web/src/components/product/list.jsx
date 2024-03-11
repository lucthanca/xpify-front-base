import { memo, useState } from 'react';
import { InlineGrid } from '@shopify/polaris';
import ProductCard from '~/components/product/card';
import ModalProduct from '~/components/product/modal';

function ProductList({items, columns}) {
  console.log('re-render-productList');
  const [isShowPopup, setIsShowPopup] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(undefined);

  return (
    <InlineGrid columns={columns} gap={600}>
      {
        items.map(item => {
          return <ProductCard key={item.entity_id} item={item} setCurrentProduct={setCurrentProduct} setIsShowPopup={setIsShowPopup} />
        })
      }

      <ModalProduct currentProduct={currentProduct} isShowPopup={isShowPopup} setIsShowPopup={setIsShowPopup} />
    </InlineGrid>
  );
}

export default memo(ProductList);