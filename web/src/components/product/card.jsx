import { BlockStack, Box, Button, Card, Icon, Image, SkeletonBodyText, SkeletonDisplayText, Spinner, Text } from '@shopify/polaris';
import { ViewIcon } from '@shopify/polaris-icons';
import { memo, useState } from 'react';

function ProductCard({item, handleShowModal, setCurrentProduct, lazyLoadImg = true}) {
  console.log('re-render-productCard');

  const handleQuickView = (item) => {
    handleShowModal();
    setCurrentProduct(item);
  }

  return (
    item && 
    <Card padding={0}>
      <div className='pointer' onClick={() => handleQuickView(item)}>
        <img
          src={item.images[0]?.src}
          alt={item.name}
          loading={lazyLoadImg ? "lazy" : "eager"}
        />
      </div>

      <Box background="bg-surface-secondary" padding="400">
        <BlockStack gap={200}>
          <Text variant="headingMd" as="h2">{item.name}</Text>
          <Text as="p" variant="bodyMd">
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
  );
}

export default memo(ProductCard);