import { useQuickView } from '~/talons/section/useQuickView';
import { lazy, memo, Suspense, useCallback } from 'react';
import {
  BlockStack, Box,
  Button,
  Card,
  Icon,
  InlineGrid,
  InlineStack,
  Scrollable,
  SkeletonDisplayText,
  Text,
} from '@shopify/polaris';
import GallerySlider from '~/components/splide/gallery';
import BadgeStatusSection from '~/components/block/badge/statusSection';
import BannerDefault from '~/components/block/banner/alert';
import CardUSP from '~/components/block/card/usp';
import ModalInstallSection from '~/components/block/product/manage';
import { SECTION_V2_QUERY } from '~/queries/section-builder/product.gql';
import { PaymentIcon } from '@shopify/polaris-icons';
import { PricingPlanSkeleton } from '~/components/QuickViewSectionModal';
import QuickViewContentSkeleton from '~/components/QuickViewSectionModal/quickViewContentShimmer';
const PricingPlan = lazy(() => import('~/components/QuickViewSectionModal/pricingPlan'));
import './style.scss';
import BannerAlert from '~/components/block/banner/alert';
import Badges from '~/components/block/product/badge/bagList.jsx';

const LazyQuickViewContent = props => {
  const { url_key, onClose } = props;
  const talonProps = useQuickView({ key: url_key, onClose });

  const {
    section,
    loadingWithoutData,
    handlePurchase,
    navigateToSectionPage,
    bannerAlert,
    setBannerAlert,
    purchaseLoading,
    loading: loadingInBackground,
  } = talonProps;
  const tagBadgeItemRender = useCallback((item) => `${item.name}`, []);

  if (loadingWithoutData) return <QuickViewContentSkeleton title={url_key} />;
  if (!section && !loadingWithoutData) {
    return (
      <>
        <div className='mt-4'><BannerAlert bannerAlert={{ content: [{ message: "Failed to load section. Please reload page!" }] }} /></div>
        <QuickViewContentSkeleton title={url_key} />
      </>
    );
  }
  return (
    <Scrollable className='quickViewModal__scrollable__content px-2 pl-4 pb-4'>
      <InlineGrid columns={{ sm: 1, md: ['twoThirds', 'oneThird'] }} gap='400'>
        <div className='h-full py-4'>
          <div className='sticky top-4'>
            <BlockStack gap={400}>
              <Card title='Gallery' padding='0'>
                <div className='quickViewModal__gallery__root aspect-[16/9] bg-[#eee] sticky'>
                  <GallerySlider gallery={section.images} />
                </div>
              </Card>
            </BlockStack>
          </div>
        </div>
        <div className='py-4'>
          <BlockStack gap='400'>
            <Card title='Infomation'>
              <BlockStack gap='200'>
                <InlineStack gap='200'>
                  <div className='cursor-pointer' onClick={navigateToSectionPage}>
                    <Text variant='headingMd' as='h2'>
                      {section.name}
                    </Text>
                  </div>
                  <BadgeStatusSection item={section} />
                </InlineStack>

                <Text variant='bodySm' as='p'>
                  Version: {section.version}
                </Text>
                {section?.categoriesV2?.length > 0 && (
                  <Badges items={section.categoriesV2} searchKey={'category'} title={'Categories'} onClick={onClose} />
                )}
                {section?.tags?.length > 0 &&
                  <Badges items={section.tags} searchKey={'tags'} itemContentRenderer={tagBadgeItemRender} title={'Tags'} onClick={onClose} />
                }

                <BannerDefault bannerAlert={bannerAlert} setBannerAlert={setBannerAlert} />

                {section.actions?.install && <ModalInstallSection section={section} refectQuery={SECTION_V2_QUERY} />}

                {section.actions ? (
                  <>
                    {section.actions?.purchase && (
                      <Button
                        loading={purchaseLoading}
                        icon={<Icon source={PaymentIcon} tone='base' />}
                        size='medium'
                        fullWidth
                        onClick={handlePurchase}
                      >
                        Purchase by ${section.price}
                      </Button>
                    )}
                    <Button size='medium' fullWidth url={section.demo_link} disabled={!Boolean(section.demo_link)}>
                      <Text>View demo store</Text>
                    </Button>
                  </>
                ) : (
                  <SkeletonDisplayText maxWidth='true'></SkeletonDisplayText>
                )}
              </BlockStack>
            </Card>

            {section?.plan_id && (
              <Suspense fallback={<PricingPlanSkeleton />}>
                <PricingPlan loading={loadingInBackground} plan={section?.pricing_plan}
                             subscribable={section?.actions.plan} />
              </Suspense>
            )}

            {section?.short_description && (
              <Box>
                <CardUSP short_description={section.short_description} />
              </Box>
            )}

            <Card>
              <iframe width="100%" className='aspect-video' src="https://www.youtube.com/embed/vn9LHDsK3V8?si=Shj5GFPlR-0BWJUz" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen={true}></iframe>
            </Card>
          </BlockStack>
        </div>
      </InlineGrid>
    </Scrollable>
  );
};
export default memo(LazyQuickViewContent);
