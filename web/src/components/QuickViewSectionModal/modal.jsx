import { lazy, memo, Suspense } from 'react';
import { useQuickView } from '~/talons/section/useQuickView';
import {
  BlockStack,
  Box,
  Button,
  Card,
  Icon,
  InlineGrid,
  InlineStack,
  Modal,
  SkeletonDisplayText,
  SkeletonTabs,
  SkeletonBodyText,
  Text,
  Tooltip,
} from '@shopify/polaris';
import GallerySlider from '~/components/splide/gallery.jsx';
import BadgeStatusSection from '~/components/block/badge/statusSection.jsx';
import BadgeTag from '~/components/block/badge/tag.jsx';
import BannerDefault from '~/components/block/banner/alert.jsx';
import ModalInstallSection from '~/components/block/product/manage.jsx';
import { PaymentIcon } from '@shopify/polaris-icons';
import { SECTION_V2_QUERY } from '~/queries/section-builder/product.gql.js';
import './style.scss';
import { PricingPlanSkeleton } from '~/components/QuickViewSectionModal';
const PricingPlan = lazy(() => import('~/components/QuickViewSectionModal/pricingPlan'));

const QuickViewModal = ({ url_key, show, onClose }) => {
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

  const showContent = show && !!section;

  return (
    <Modal size='large' open={show} onClose={onClose} title={section?.name ?? 'Loading...'}>
      <Modal.Section>
        {showContent && (
          <InlineGrid columns={{ sm: 1, md: ['twoThirds', 'oneThird'] }} gap='400'>
            <div className='h-full'>
              <div className='sticky top-4'>
                <Card title='Gallery' padding='0'>
                  <div className='quickViewModal__gallery__root aspect-[16/9] bg-[#eee] sticky'>
                    <GallerySlider gallery={section.images} />
                  </div>
                </Card>
              </div>
            </div>
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

                  {section?.tags && <BadgeTag section={section} afterClick={onClose} />}

                  <Text variant='bodyMd' as='p'>
                    Version: {section.version}
                  </Text>

                  <Text variant='bodyLg' as='p' fontWeight='bold'>
                    ${section.price}
                  </Text>

                  <BannerDefault bannerAlert={bannerAlert} setBannerAlert={setBannerAlert} />

                  {section.actions?.install && <ModalInstallSection section={section} />}

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
                        <Tooltip>View demo store</Tooltip>
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
                  <PricingPlan loading={loadingInBackground} plan={section?.pricing_plan} subscribable={section?.actions.plan} />
                </Suspense>
              )}
            </BlockStack>
          </InlineGrid>
        )}
      </Modal.Section>
    </Modal>
  );
};

export default memo(QuickViewModal);
