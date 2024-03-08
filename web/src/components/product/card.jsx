import { BlockStack, Box, Button, Card, Icon, Image, SkeletonBodyText, SkeletonDisplayText, Spinner, Text } from '@shopify/polaris';
import { ViewIcon } from '@shopify/polaris-icons';
import { memo, useCallback, useState } from 'react';
import {useNavigate} from '@shopify/app-bridge-react';

import ModalProduct from '~/components/product/modal';

function ProductCard({item, lazyLoadImg = true}) {
  console.log('re-render-productCard');
  const navigate = useNavigate();
  const [isShowPopup, setIsShowPopup] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(undefined);

  const handleQuickView = useCallback((item) => {
    setIsShowPopup(!isShowPopup);
    setCurrentProduct(item);
  }, [currentProduct]);

  const handleRedirectProductPage = useCallback((url) => {
    navigate(`/section/${url}`);
    window.scrollTo(0,0);
  }, []);

  return (
    item && 
    <>
      <Card padding={0}>
        <div className='pointer' onClick={() => {handleRedirectProductPage(item.url_key)}}>
          <img
            src={item.images[0]?.src}
            alt={item.name}
            loading={lazyLoadImg ? "lazy" : "eager"}
          />
        </div>

        <Box background="bg-surface-secondary" padding="400">
          <BlockStack gap={200}>
            <Text variant="headingMd" as="h2">{item.name}</Text>
            <Text as="div" variant="bodyMd">
              Version: {item.version}
              <br></br>
              {item.price ? 'Price: $' + item.price : 'Free'}
            </Text>
            <Button 
              loading={false} 
              icon={<Icon source={ViewIcon} tone="base" />} 
              size="large" 
              fullWidth 
              onClick={() => handleQuickView(item)}
            >
              Quick view
            </Button>
          </BlockStack>
        </Box>
      </Card>

      {
        currentProduct && isShowPopup &&
        <ModalProduct currentProduct={currentProduct} isShowPopup={isShowPopup} setIsShowPopup={setIsShowPopup} />
      } 
    </>
  );
}

export default memo(ProductCard);