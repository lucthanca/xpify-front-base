import {
  Badge,
  BlockStack,
  Box,
  Button,
  Card,
  Icon,
  InlineGrid,
  InlineStack,
  Text,
  Tooltip
} from '@shopify/polaris';
import { ViewIcon, PlusCircleIcon, PaymentFilledIcon, ExternalIcon } from '@shopify/polaris-icons';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import BadgeTag from '~/components/block/badge/tag';
import Badges from '~/components/block/product/badge/bagList';
import BadgeStatusSection from '~/components/block/badge/statusSection';
import { usePurchase } from '~/hooks/section-builder/purchase';
import { useRedirectGroupPage, useRedirectSectionPage } from '~/hooks/section-builder/redirect';
import { useSectionListContext } from '~/context';

const productType = {
  'simple': 1,
  'group': 2
};

const QuickViewButton = props => {
  const { item, modalName = 'quickView', icon, tooltip } = props;
  const [{ modalLoading, modal }, { setActiveSection, setModal }] = useSectionListContext();
  const [localLoading, setLocalLoading] = useState(false);
  const handleQuickView = useCallback(() => {
    setLocalLoading(true);
    setModal(modalName);

    // make this set active section to another process
    setTimeout(() => {
      setActiveSection && setActiveSection(item);
    }, 0);
  }, [item]);
  const loading = useMemo(() => {
    return localLoading;
  }, [modalLoading, localLoading]);
  const btnIcon = useMemo(() => {
    return icon || (<Icon source={ViewIcon} tone="base" />);
  }, [icon]);
  useEffect(() => {
    if (modal !== modalName) return;
    if (!modalLoading) {
      setLocalLoading(false);
      return;
    }
    setLocalLoading(modalLoading && item.id === setActiveSection.id);
  }, [modalLoading]);
  return (
    <Tooltip content={tooltip}>
      <Button
        icon={btnIcon}
        size="large"
        onClick={handleQuickView}
        loading={loading}
      />
    </Tooltip>
  );
};
const InstallButton = props => {
  return (
    <QuickViewButton item={props.item} modalName={'install'} icon={<Icon source={PlusCircleIcon} tone="base" />} tooltip="Add to theme" />
  );
};

function ProductCard({item}) {
  console.log('re-render-productCard');
  // const handleInstall = useCallback((item) => {
  //   setIsShowPopupInstall && setIsShowPopupInstall(prev => !prev);
  //   setSection && setSection(item);
  // }, []);

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
  const tagBadgeItemRender = useCallback((item) => `${item.name}`, []);

  return (
    item &&
    <>
      <Card padding='0' background="bg-surface-secondary" className='h-full'>
        <div className='cursor-pointer aspect-video' onClick={() => handleRedirect(item)}>
          <img
            src={item.images[0]?.src}
            alt={item.name}
            loading="lazy"
            className='object-cover w-full h-full'
          />
        </div>

        <Box padding={400}>
          <BlockStack gap={200}>
            <BlockStack gap={200}>
              <InlineStack align='space-between'>
                <div className='cursor-pointer' onClick={() => handleRedirect(item)}>
                  <Text variant="headingMd" as="h2">{item.name}</Text>
                </div>
                {item.price > 0 &&
                  <Text variant="bodyLg" fontWeight='bold'>${item.price}</Text>
                }
              </InlineStack>
              <InlineStack gap={200}>
                <BadgeStatusSection item={item} />
              </InlineStack>
              {item.version &&
                <Text variant="bodySm">Version: {item.version}</Text>
              }
              {item?.categoriesV2?.length > 0 && (
                <Badges items={item.categoriesV2} searchKey={'category'} title={'Categories'} />
              )}
              {item?.tags?.length > 0 &&
                <Badges items={item.tags} searchKey={'tags'} itemContentRenderer={tagBadgeItemRender} title={'Tags'} />
              }
            </BlockStack>

            <InlineStack gap='200'>
              {parseInt(item.type_id) === parseInt(productType.simple) && (<QuickViewButton item={item} tooltip="View section" />)}
              {
                item?.demo_link &&
                <Tooltip content="View demo store">
                  <Button
                    icon={<Icon source={ExternalIcon} tone="base" />}
                    size="large"
                    url={item.demo_link}
                  />
                </Tooltip>
              }
              {item.actions?.install && <InstallButton item={item} />}
              {
                item.actions?.purchase &&
                <Tooltip content="Purchase now">
                  <Button
                    loading={purchaseLoading}
                    icon={<Icon source={PaymentFilledIcon} tone="base" />}
                    size="large"
                    onClick={() => handlePurchase(item)}
                  />
                </Tooltip>
              }
            </InlineStack>
          </BlockStack>
        </Box>
      </Card>
    </>
  );
}

export default memo(ProductCard);