import {Badge, BlockStack, Box, Button, CalloutCard, Card, Frame, Grid, Icon, InlineGrid, InlineStack, Modal, SkeletonBodyText, SkeletonDisplayText, SkeletonTabs, Text, Tooltip} from '@shopify/polaris';
import {useState, useCallback, memo} from 'react';
import {
  PaymentIcon,
  BillIcon,
  CashDollarIcon,
  UploadIcon,
  WrenchIcon,
  ViewIcon
} from '@shopify/polaris-icons';
import GallerySlider from '~/components/splide/gallery';

function ModalProduct({productMore, currentProduct, isShowPopup, setIsShowPopup}) {
  const product = {...currentProduct, ...productMore?.getSection};
  const handleChange = useCallback(() => setIsShowPopup(!isShowPopup), [isShowPopup]);

  return (
    product?.entity_id &&
    <div className='bss-modal'>
      <Modal
        size='large'
        open={isShowPopup}
        onClose={handleChange}
        title={product.name}
      >
        <Modal.Section>
          <InlineGrid columns={['twoThirds', 'oneThird']} gap={400}>
            <BlockStack>
              <Card title="Gallery" padding={0}>
                <div>
                  <GallerySlider gallery={product.images} height={'30rem'} />
                </div>
                {
                  product.description && 
                  <Box background="bg-surface-secondary" padding="400">
                    <BlockStack gap={200}>
                      <div dangerouslySetInnerHTML={{__html: product.description}}></div>
                    </BlockStack>
                  </Box>
                }
              </Card>
            </BlockStack>
            <BlockStack gap={400}>
              <Card title="Infomation">
                <BlockStack gap="200">
                  <Text variant="headingMd" as="h2">{product.name}</Text>
                  {
                    productMore || product?.categories || product?.tags
                    ? (product?.categories || product?.tags) &&
                    <InlineStack gap="200" blockAlign="start">
                      {
                        product.categories &&
                        product.categories.map(item => (
                          <Tooltip content="Category">
                            <Badge tone="success">{item}</Badge>
                          </Tooltip>
                        ))
                      }
                      {
                        product.tags &&
                        product.tags.map(item => (
                          <Tooltip content="Tag">
                            <Badge tone="info">#{item}</Badge>
                          </Tooltip>
                        ))
                      }
                    </InlineStack>
                    : <SkeletonBodyText lines={1}/>
                  }
                  
                  <Text variant="bodyMd" as="p">Version: {product.version}</Text>
                  <Button 
                    loading={false} 
                    icon={<Icon source={PaymentIcon} tone="base" />} 
                    size="large"
                    fullWidth 
                    onClick={() => {}}
                  >
                    Purchase ${product.price}
                  </Button>
                </BlockStack>
              </Card>
              <Card title="Feature">
                <BlockStack gap="200">
                  <InlineStack align="start" gap={200}>
                    <div>
                      <Icon
                        source={CashDollarIcon}
                        tone="base"
                      />
                    </div>
                    <p>One-time charge (never recurring)</p>
                  </InlineStack>
                  <InlineStack align="start" gap={200}>
                    <div>
                      <Icon
                        source={BillIcon}
                        tone="base"
                      />
                    </div>
                    <p>Buy once, own forever</p>
                  </InlineStack>
                  <InlineStack align="start" gap={200}>
                    <div>
                      <Icon
                        source={UploadIcon}
                        tone="base"
                      />
                    </div>
                    <p>Add section to any theme</p>
                  </InlineStack>
                </BlockStack>
              </Card>
              <CalloutCard
                title="Learn more"
                illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
                primaryAction={{
                  content: 'Try section',
                  icon: <Icon source={WrenchIcon} tone="base" />
                }}
                secondaryAction={{
                  content: 'View demo store',
                  icon: <Icon source={ViewIcon} tone="base" />,
                  url: product.demo_link,
                  target: '_blank'
                }}
              >
                <div dangerouslySetInnerHTML={{__html: product.release_note}}></div>
              </CalloutCard>
            </BlockStack>
          </InlineGrid>
        </Modal.Section>
      </Modal>
    </div>
  );
}

export default memo(ModalProduct);