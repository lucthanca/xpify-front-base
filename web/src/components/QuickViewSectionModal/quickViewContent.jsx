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
  Tooltip,
} from '@shopify/polaris';
import GallerySlider from '~/components/splide/gallery';
import BadgeStatusSection from '~/components/block/badge/statusSection';
import BannerDefault from '~/components/block/banner/alert';
import CardUSP from '~/components/block/card/usp';
import ModalInstallSection from '~/components/block/product/manage';
import { SECTION_V2_QUERY } from '~/queries/section-builder/product.gql';
import { PaymentIcon, HeartIcon } from '@shopify/polaris-icons';
import { PricingPlanSkeleton } from '~/components/QuickViewSectionModal';
import QuickViewContentSkeleton from '~/components/QuickViewSectionModal/quickViewContentShimmer';
const PricingPlan = lazy(() => import('~/components/QuickViewSectionModal/pricingPlan'));
import './style.scss';
import BannerAlert from '~/components/block/banner/alert';
import Badges from '~/components/block/product/badge/bagList.jsx';
import { useWishlist } from '~/hooks/section-builder/wishlist';

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
  const { handleUpdate:addWishlist, dataUpdateLoading:addWishlistLoading, handleDelete:deleteWishlist, dataDeleteLoading:deleteWishlistLoading } = useWishlist(section);
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
    <Scrollable className='quickViewModal__scrollable__content p-4'>
      <InlineGrid columns={{ sm: 1, md: ['twoThirds', 'oneThird'] }} gap='400'>
        <div className='h-full'>
          <div className='sticky top-0'>
            <BlockStack gap={400}>
              <Card title='Gallery' padding='0'>
                <div className='quickViewModal__gallery__root aspect-[16/9] bg-[#eee] sticky'>
                  <GallerySlider gallery={section.images} imgSizes="(min-width: 768px) calc((90vw - 1rem) * 2/3), 100vw" />
                </div>
              </Card>
            </BlockStack>
          </div>
        </div>
        <div>
          <BlockStack gap='400'>
            <Card title='Infomation'>
              <BlockStack gap='200'>
                <InlineStack align='space-between' gap={200}>
                  <div>
                    <InlineStack gap='200'>
                      <div className='cursor-pointer' onClick={navigateToSectionPage}>
                        <Text variant='headingMd' as='h2'>
                          {section.name}
                        </Text>
                      </div>
                      <BadgeStatusSection item={section} />
                    </InlineStack>
                  </div>
                  {!section?.is_in_wishlist
                  ? <Tooltip content="Like">
                    <Button
                      loading={addWishlistLoading}
                      icon={<Icon source={HeartIcon} tone="base" />}
                      size="medium"
                      onClick={() => addWishlist()}
                    />
                  </Tooltip>
                  : <Tooltip content="Unlike">
                    <Button
                      loading={deleteWishlistLoading}
                      icon={<Icon source={HeartIcon} tone="base" />}
                      size="medium"
                      onClick={() => deleteWishlist()}
                      tone='critical'
                      variant='primary'
                    />
                  </Tooltip>
                  }
                </InlineStack>

                <Text variant='bodySm' as='p'>
                  Version: {section.version}
                </Text>
                {section?.categoriesV2?.length > 0 && (
                  <Badges items={section.categoriesV2} isSimpleSection={!section?.child_ids?.length} searchKey={'category'} title={'Categories'} onClick={onClose} />
                )}
                {section?.tags?.length > 0 &&
                  <Badges items={section.tags} isSimpleSection={!section?.child_ids?.length} searchKey={'tags'} itemContentRenderer={tagBadgeItemRender} title={'Tags'} onClick={onClose} />
                }

                <BannerDefault bannerAlert={bannerAlert} setBannerAlert={setBannerAlert} />


                {section.actions?.install 
                && !(section?.special_status === 'coming_soon')
                && <ModalInstallSection section={section} refectQuery={SECTION_V2_QUERY} />
                }

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
              <BlockStack gap='200'>
                <Text variant="headingMd" as="h2">How to add sections to your theme</Text>
                <BlockStack gap='100'>
                  <Text as='span'>1. Click on "Install to theme" button.</Text>
                  <Text as='span'>2. Go to theme editor. Navigate to the places you want to add sections.</Text>
                  <Text as='span'>3. Click "Add section" and look for "OT" in the search box.</Text>
                </BlockStack>
              </BlockStack>
            </Card>


            {/*<Card>*/}
            {/*  <iframe width="100%" className='aspect-[16/9]' src="https://www.youtube.com/embed/vn9LHDsK3V8?si=Shj5GFPlR-0BWJUz" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen={true}></iframe>*/}
            {/*</Card>*/}
          </BlockStack>
        </div>
      </InlineGrid>
    </Scrollable>
  );
};
export default memo(LazyQuickViewContent);
