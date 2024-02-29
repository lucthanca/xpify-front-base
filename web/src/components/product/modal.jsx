import {Badge, BlockStack, Box, Button, CalloutCard, Card, Frame, Grid, Icon, InlineGrid, InlineStack, Modal, SkeletonBodyText, SkeletonDisplayText, SkeletonTabs, Text, Tooltip} from '@shopify/polaris';
import {useState, useCallback, memo, useEffect} from 'react';
import {
  PaymentIcon,
  BillIcon,
  CashDollarIcon,
  UploadIcon,
  WrenchIcon,
  ViewIcon,
  CheckIcon
} from '@shopify/polaris-icons';
import GallerySlider from '~/components/splide/gallery';
import {gql, useQuery, useMutation} from "@apollo/client";

import BannerDefault from '~/components/banner/default';

const graphQlRedirectPurchase = gql`
  mutation Purchase($name: String!, $interval: PricingPlanInterval!, $is_plan: Boolean!) {
    redirectBillingUrl(name: $name, interval: $interval, is_plan: $is_plan) {
      message
      tone
    }
  }
`;

function ModalProduct({productMore, currentProduct, isShowPopup, setIsShowPopup}) {
  const product = {...currentProduct, ...productMore?.getSection};
  const [bannerAlert, setBannerAlert] = useState(undefined); 
  const handleChange = useCallback(() => {
    setIsShowPopup(!isShowPopup);
    setBannerAlert(undefined);
  }, [isShowPopup]);
  const [redirectPurchase, { data:purchase, loading:purchaseL, error:purchaseE }] = useMutation(graphQlRedirectPurchase);

  const handlePurchase = useCallback(async () => {
    await redirectPurchase({ 
        variables: {
            name: currentProduct?.url_key,
            interval: 'ONE_TIME',
            is_plan: false
        }
     });
  }, [currentProduct]);

  useEffect(() => {
    if (purchase?.redirectBillingUrl?.message) {
      setBannerAlert({
        'title': purchase.redirectBillingUrl.message,
        'tone': purchase?.redirectBillingUrl?.tone ?? "critical"
      });
    }
    if (purchaseE?.graphQLErrors?.length) {
      setBannerAlert({
        'title': purchaseE.message,
        'tone': 'critical',
        'content': purchaseE.graphQLErrors
      });
    }
  }, [purchase, purchaseE]);

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
                    (product.categories !== undefined || product.tags !== undefined)
                    ? (product.categories || product.tags) &&
                    <InlineStack gap="200" blockAlign="start">
                      {
                        product.categories &&
                        product.categories.map(item => (
                          <Tooltip key={item} content="Category">
                            <Badge tone="success">{item}</Badge>
                          </Tooltip>
                        ))
                      }
                      {
                        product.tags &&
                        product.tags.map(item => (
                          <Tooltip key={item} content="Tag">
                            <Badge tone="info">#{item}</Badge>
                          </Tooltip>
                        ))
                      }
                    </InlineStack>
                    : <SkeletonBodyText lines={1}/>
                  }
                  
                  <Text variant="bodyMd" as="p">Version: {product.version}</Text>
                  <BannerDefault bannerAlert={bannerAlert} setBannerAlert={setBannerAlert} />
                  {
                    product.actions
                    ? <>
                      {
                        product.actions?.purchase &&
                        <Button 
                          loading={purchaseL} 
                          icon={<Icon source={PaymentIcon} tone="base" />} 
                          size="large"
                          fullWidth 
                          onClick={() => handlePurchase()}
                        >
                          Purchase ${product.price}
                        </Button>
                      }
                      <Button
                        size="large"
                        fullWidth 
                        onClick={() => {}}
                      >
                        {product.actions?.install ? 'Install Now' : 'Go to product page'}
                      </Button>
                    </>
                    : <SkeletonDisplayText maxWidth='true'></SkeletonDisplayText>
                  }

                </BlockStack>
              </Card>
              {
                product.pricing_plan
                ? <Card title="Plan">
                  <BlockStack gap="200">
                    <Text variant="headingMd" as="h2">Plan {product.pricing_plan?.name}</Text>
                    {
                      product.pricing_plan.prices &&
                      <Text variant="bodySm" as="h2" tone='subdued' fontWeight='regular'>
                        As low as {'$' + Math.min(...product.pricing_plan.prices.map(item => item.amount))}
                      </Text>
                    }
                    {
                      product.pricing_plan?.description &&
                      product.pricing_plan.description.split('\n').map((item, key) => {
                        return (
                          <InlineStack key={key} gap="200" blockAlign="start">
                            <div>
                              <Icon
                                source={CheckIcon}
                                tone="info"
                              />
                            </div>
                            <Text>{item}</Text>
                          </InlineStack>
                        );
                      })
                    }
                    <Button
                      size="large"
                      fullWidth 
                      onClick={() => {}}
                    >
                      Upgrade Now
                    </Button>
                  </BlockStack>
                </Card>
                : product.plan_id && <Card>
                  <BlockStack gap="400">
                    <SkeletonDisplayText size='small'></SkeletonDisplayText>
                    <SkeletonBodyText lines={5}></SkeletonBodyText>
                    <SkeletonDisplayText size='small' maxWidth='true'></SkeletonDisplayText>
                  </BlockStack>
                </Card>
              }
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
                      <Icon source={UploadIcon} tone="base" />
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