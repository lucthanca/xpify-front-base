import { memo, useCallback, useState } from 'react';
import { BlockStack, Box, Text } from '@shopify/polaris';
import LazyProductCarousel from '~/components/LazyProductCarousel';
import { SECTIONS_QUERY } from '~/queries/section-builder/product.gql';
import ProductCard, { Skeleton } from '~/components/product';
import ModalProduct from '~/components/product/modal.jsx';

const topSellProducts = props => {
  const [currentProduct, setCurrentProduct] = useState(undefined);
  const [isShowPopup, setIsShowPopup] = useState(undefined);
  const renderProduct = useCallback((item) => {
    console.log('RENDER item');
    return <ProductCard
      debug={true}
      key={item.entity_id}
      item={item}
      setSection={setCurrentProduct}
      setIsShowPopup={setIsShowPopup}
      lazyLoadImg={false}
    />
  }, [])
  return (
    <Box padding='600'>
      <BlockStack gap='200'>
        <Text variant="headingMd" as="h2">Top Sells</Text>
        <LazyProductCarousel renderItem={renderProduct} fetchQuery={SECTIONS_QUERY} queryRootKey={'getSections'} skeletonLoader={<Skeleton total={1} />} />
      </BlockStack>
      <ModalProduct section={currentProduct} isShowPopup={isShowPopup} setIsShowPopup={setIsShowPopup} />
    </Box>
  );
}

export default memo(topSellProducts);
