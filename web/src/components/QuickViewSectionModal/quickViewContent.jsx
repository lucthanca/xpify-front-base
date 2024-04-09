import { useQuickView } from '~/talons/section/useQuickView';
import { lazy, memo, Suspense } from 'react';
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
  Tooltip,
} from '@shopify/polaris';
import GallerySlider from '~/components/splide/gallery';
import BadgeStatusSection from '~/components/block/badge/statusSection';
import BadgeTag from '~/components/block/badge/tag';
import BannerDefault from '~/components/block/banner/alert';
import ModalInstallSection from '~/components/product/manage';
import { SECTION_V2_QUERY } from '~/queries/section-builder/product.gql';
import { PaymentIcon } from '@shopify/polaris-icons';
import { PricingPlanSkeleton } from '~/components/QuickViewSectionModal';
import QuickViewContentSkeleton from '~/components/QuickViewSectionModal/quickViewContentShimmer';
const PricingPlan = lazy(() => import('~/components/QuickViewSectionModal/pricingPlan'));
import './style.scss';
import BannerAlert from '~/components/block/banner/alert';

const LazyQuickViewContent = props => {
  const { url_key } = props;
  const talonProps = useQuickView({ key: url_key });
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
            <Card title='Gallery' padding='0'>
              <div className='quickViewModal__gallery__root aspect-[16/9] bg-[#eee] sticky'>
                <GallerySlider gallery={section.images} />
              </div>
            </Card>
          </div>
        </div>
        <div className='py-4'>
          <BlockStack gap='400'>
            <Card title='Infomation'>
              <BlockStack gap='200'>
                <InlineStack gap='200'>
                  <div className='pointer' onClick={navigateToSectionPage}>
                    <Text variant='headingMd' as='h2'>
                      {section.name}
                    </Text>
                  </div>
                  <BadgeStatusSection item={section} />
                </InlineStack>

                {section?.tags && <BadgeTag tags={section.tags} />}

                <Text variant='bodyMd' as='p'>
                  Version: {section.version}
                </Text>

                <Text variant='bodyLg' as='p' fontWeight='bold'>
                  ${section.price}
                </Text>

                <BannerDefault bannerAlert={bannerAlert} setBannerAlert={setBannerAlert} />

                {section.actions?.install && <ModalInstallSection section={section} refectQuery={SECTION_V2_QUERY} />}

                {section.actions ? (
                  <>
                    {section.actions?.purchase && (
                      <Button
                        loading={purchaseLoading}
                        icon={<Icon source={PaymentIcon} tone='base' />}
                        size='large'
                        fullWidth
                        onClick={handlePurchase}>
                        Purchase
                      </Button>
                    )}
                    <Button size='large' fullWidth url={section.demo_link} disabled={!Boolean(section.demo_link)}>
                      <Tooltip content={'View demo store'} />
                    </Button>
                  </>
                ) : (
                  <SkeletonDisplayText maxWidth='true'></SkeletonDisplayText>
                )}
              </BlockStack>
            </Card>

            {section.description && (
              <Card title='USP'>
                <Box>
                  <BlockStack gap='200'>
                    <div dangerouslySetInnerHTML={{ __html: section.description }}></div>
                  </BlockStack>
                </Box>
              </Card>
            )}

            {section?.plan_id && (
              <Suspense fallback={<PricingPlanSkeleton />}>
                <PricingPlan loading={loadingInBackground} plan={section?.pricing_plan}
                             subscribable={section?.actions.plan} />
              </Suspense>
            )}
          </BlockStack>
        </div>
      </InlineGrid>
    </Scrollable>
  );
};
export default memo(LazyQuickViewContent);
