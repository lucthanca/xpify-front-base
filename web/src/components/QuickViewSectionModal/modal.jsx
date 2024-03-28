import { memo } from 'react';
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
  Text,
  Tooltip,
} from '@shopify/polaris';
import GallerySlider from '~/components/splide/gallery.jsx';
import BadgeStatusSection from '~/components/block/badge/statusSection.jsx';
import BadgeTag from '~/components/block/badge/tag.jsx';
import BannerDefault from '~/components/block/banner/alert.jsx';
import ModalInstallSection from '~/components/product/manage.jsx';
import { PaymentIcon } from '@shopify/polaris-icons';
import { SECTION_V2_QUERY } from '~/queries/section-builder/product.gql.js';
import PricingPlan from '~/components/QuickViewSectionModal/pricingPlan.jsx';
import './style.scss';

const QuickViewModal = ({ url_key, show, onClose }) => {
  const talonProps = useQuickView({ key: url_key });
  const {
    section,
    loadingWithoutData,
    handlePurchase,
    handleRedirectProductPage,
    bannerAlert,
    setBannerAlert,
    purchaseLoading,
  } = talonProps;

  return (
    <Modal size='large' open={show} onClose={onClose} title={section?.name ?? 'Loading...'}>
      <Modal.Section>
        {show && !loadingWithoutData && (
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
                    <div className='pointer' onClick={() => handleRedirectProductPage(section.url_key)}>
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

              <PricingPlan plan={section?.pricing_plan} subscribable={section?.actions.plan} />
            </BlockStack>
          </InlineGrid>
        )}
      </Modal.Section>
    </Modal>
  );
};

export default memo(QuickViewModal);
