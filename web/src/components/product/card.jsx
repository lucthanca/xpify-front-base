import {
  BlockStack,
  Box,
  Button,
  Card,
  Icon,
  Text
} from '@shopify/polaris';
import { ViewIcon } from '@shopify/polaris-icons';
import { memo, useCallback } from 'react';
import { useRedirectSectionPage } from '~/hooks/section-builder/redirect';

function ProductCard({item, setCurrentProduct, setIsShowPopup, lazyLoadImg = true}) {
  console.log('re-render-productCard');

  const handleQuickView = useCallback((item) => {
    setIsShowPopup(prev => !prev);
    setCurrentProduct(item);
  }, []);

  const handleRedirectProductPage = useRedirectSectionPage();

  return (
    item && 
    <>
      <Card padding={0}>
        <div className='pointer' onClick={() => handleRedirectProductPage(item.url_key)}>
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
    </>
  );
}

export default memo(ProductCard);