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
import { usePurchase } from '~/hooks/section-builder/purchase';
import { useRedirectGroupPage, useRedirectSectionPage } from '~/hooks/section-builder/redirect';

const productType = {
  'simple': 1,
  'group': 2
};

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
  const handleRedirectGroupPage = useRedirectGroupPage();
  const handleRedirect = useCallback((product) => {
    if (product.type_id == productType.group) {
      return handleRedirectGroupPage(product.url_key);
    } else {
      return handleRedirectProductPage(product.url_key);
    }
  }, []);

  const { handlePurchase, purchaseLoading} = usePurchase();

  return (
    item && 
    <>
      <Card padding={0} background="bg-surface-secondary">
        <div className='pointer' onClick={() => handleRedirect(item)}>
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
                  <div className='pointer' onClick={() => handleRedirect(item)}>
                    <Text variant="headingMd" as="h2">{item.name}</Text>
                  </div>
                  {
                    item.actions?.install &&
                    <Badge tone='success'>Ready</Badge>
                  }
                </InlineStack>
                <Text variant="headingMd" as="h2">${item.price}</Text>
              </InlineStack>
              {
                item.version &&
                <Text as="div" variant="bodyMd">
                  Version: {item.version}
                </Text>
              }
            </BlockStack>
            <InlineStack gap={200}>
              {
                item.type_id == productType.simple &&
                <Button 
                  icon={<Icon source={ViewIcon} tone="base" />} 
                  size="large"
                  onClick={() => handleQuickView(item)}
                />
              }

              <Button
                icon={<Icon source={ArrowRightIcon} tone="base" />} 
                size="large"
                onClick={() => handleRedirect(item)}
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
                  loading={purchaseLoading} 
                  icon={<Icon source={CartSaleIcon} tone="base" />} 
                  size="large"
                  onClick={() => handlePurchase(item)}
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