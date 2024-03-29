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
import { ViewIcon, PlusCircleIcon, CartSaleIcon } from '@shopify/polaris-icons';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import BadgeTag from '~/components/block/badge/tag';
import BadgeStatusSection from '~/components/block/badge/statusSection';
import { usePurchase } from '~/hooks/section-builder/purchase';
import { useRedirectGroupPage, useRedirectSectionPage } from '~/hooks/section-builder/redirect';
import { useSectionListContext } from '~/context';

const productType = {
  'simple': 1,
  'group': 2
};

const QuickViewButton = props => {
  const { item } = props;
  const [{ isQuickViewModalLoading }, { setActiveSection }] = useSectionListContext();
  const [localLoading, setLocalLoading] = useState(false);
  const handleQuickView = useCallback(() => {
    setLocalLoading(true);

    // make this set active section to another process
    setTimeout(() => {
      setActiveSection && setActiveSection(item);
    }, [0]);
  }, [item]);
  const loading = useMemo(() => {
    return localLoading;
  }, [isQuickViewModalLoading, localLoading]);
  useEffect(() => {
    setLocalLoading(isQuickViewModalLoading);
  }, [isQuickViewModalLoading]);
  return (
    <Button
      icon={<Icon source={ViewIcon} tone="base" />}
      size="large"
      onClick={handleQuickView}
      loading={loading}
    />
  );
};

function ProductCard({item, setSection, setIsShowPopup, setIsShowPopupInstall, lazyLoadImg = true}) {
  console.log('re-render-productCard');
  const handleInstall = useCallback((item) => {
    setIsShowPopupInstall && setIsShowPopupInstall(prev => !prev);
    setSection && setSection(item);
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
      <Card padding='0' background="bg-surface-secondary" className='h-full'>
        <div className='pointer aspect-video' onClick={() => handleRedirect(item)}>
          <img
            src={item.images[0]?.src}
            alt={item.name}
            loading={lazyLoadImg ? "lazy" : "eager"}
            className='object-cover w-full h-full'
          />
        </div>

        <Box padding={400}>
          <BlockStack gap={200}>
            <BlockStack>
              <InlineStack align='space-between'>
                <InlineStack gap={200}>
                  <div className='pointer' onClick={() => handleRedirect(item)}>
                    <Text variant="headingMd" as="h2">{item.name}</Text>
                  </div>
                  <InlineStack gap={200}>
                    <BadgeStatusSection item={item} />
                  </InlineStack>
                </InlineStack>
                <Text variant="bodyMd">${item.price}</Text>
              </InlineStack>
              {
                item.version &&
                <Text as="div" variant="bodyMd">
                  Version: {item.version}
                </Text>
              }
            </BlockStack>
            <InlineStack gap='200'>
              {parseInt(item.type_id) === parseInt(productType.simple) && (<QuickViewButton item={item} />)}
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
