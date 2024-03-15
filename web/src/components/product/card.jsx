import {
  Badge,
  BlockStack,
  Box,
  Button,
  Card,
  Icon,
  InlineGrid,
  InlineStack,
  Text
} from '@shopify/polaris';
import { ViewIcon, ArrowRightIcon, PlusCircleIcon, CartSaleIcon } from '@shopify/polaris-icons';
import { memo, useCallback } from 'react';
import BadgeTag from '~/components/block/badge/tag';
import { useRedirectSectionPage } from '~/hooks/section-builder/redirect';

function ProductCard({item, setSection, setIsShowPopup, setIsShowPopupInstall, lazyLoadImg = true}) {
  console.log('re-render-productCard');

  const handleQuickView = useCallback((item) => {
    setIsShowPopup(prev => !prev);
    setSection(item);
  }, []);
  const handleInstall = useCallback((item) => {
    setIsShowPopupInstall(prev => !prev);
    setSection(item);
  }, []);

  const handleRedirectProductPage = useRedirectSectionPage();

  return (
    item && 
    <>
      <Card padding={0} background="bg-surface-secondary">
        <div className='pointer' onClick={() => handleRedirectProductPage(item.url_key)}>
          <img
            src={item.images[0]?.src}
            alt={item.name}
            loading={lazyLoadImg ? "lazy" : "eager"}
          />
        </div>

        <Box padding="400">
          <BlockStack gap={200}>
            <BlockStack>
              <InlineStack align='space-between'>
                <InlineStack gap={200}>
                  <div className='pointer' onClick={() => handleRedirectProductPage(item.url_key)}>
                    <Text variant="headingMd" as="h2">{item.name}</Text>
                  </div>
                  {
                    item.actions?.install &&
                    <Badge tone='success'>Ready</Badge>
                  }
                </InlineStack>
                <Text variant="headingMd" as="h2">${item.price}</Text>
              </InlineStack>
              <Text as="div" variant="bodyMd">
                Version: {item.version}
              </Text>
            </BlockStack>
            <InlineStack gap={200}>
              <Button 
                icon={<Icon source={ViewIcon} tone="base" />} 
                size="large"
                onClick={() => handleQuickView(item)}
              />
              <Button
                icon={<Icon source={ArrowRightIcon} tone="base" />} 
                size="large"
                onClick={() => handleRedirectProductPage(item.url_key)}
              />
              {
                item.actions?.install &&
                <Button 
                  loading={false} 
                  icon={<Icon source={PlusCircleIcon} tone="base" />} 
                  size="large"
                  onClick={() => handleInstall(item)}
                />
              }
              {
                item.actions?.purchase &&
                <Button 
                  loading={false} 
                  icon={<Icon source={CartSaleIcon} tone="base" />} 
                  size="large"
                  onClick={() => handleQuickView(item)}
                />
              }
            </InlineStack>
            <Box paddingBlockStart={200}>
              {
                item?.tags &&
                <BadgeTag tags={item.tags} />
              }
            </Box>
          </BlockStack>
        </Box>
      </Card>
    </>
  );
}

export default memo(ProductCard);