import {useState, useCallback, memo, useEffect, useMemo} from 'react';
import {
  Badge,
  BlockStack,
  Box,
  Button,
  CalloutCard,
  Card,
  Icon,
  InlineGrid,
  InlineStack,
  Modal,
  SkeletonBodyText,
  SkeletonDisplayText,
  Text,
  Tooltip
} from '@shopify/polaris';
import {
  PaymentIcon,
  BillIcon,
  CashDollarIcon,
  UploadIcon,
  WrenchIcon,
  ViewIcon,
  CheckIcon
} from '@shopify/polaris-icons';
import { useQuery, useMutation } from "@apollo/client";
import ModalInstallSection from '~/components/product/manage'
import GallerySlider from '~/components/splide/gallery';
import BannerDefault from '~/components/block/banner';
import BadgeTag from '~/components/block/badge/tag';
import { SECTION_QUERY } from "~/queries/section-builder/product.gql";
import { REDIRECT_BILLING_PAGE_MUTATION } from "~/queries/section-builder/other.gql";
import { useRedirectPlansPage, useRedirectSectionPage } from '~/hooks/section-builder/redirect';

function ModalProduct({section, isShowPopup, setIsShowPopup}) {
  const { data:sectionDetail, refetch:reloadSectionDetail } = useQuery(SECTION_QUERY, {
    fetchPolicy: "cache-and-network",
    variables: {
      key: section?.url_key ?? '',
      skip: Boolean(!section?.url_key),
    }
  });
  const product = useMemo(() => {
    return {...section, ...sectionDetail?.getSection};
  }, [section, sectionDetail]);
  const [bannerAlert, setBannerAlert] = useState(undefined); 
  const handleChange = useCallback(() => {
    setIsShowPopup(!isShowPopup);
    setBannerAlert(undefined);
  }, [isShowPopup]);
  const [redirectPurchase, { data:purchase, loading:purchaseL, error:purchaseE }] = useMutation(REDIRECT_BILLING_PAGE_MUTATION);

  const handlePurchase = useCallback(async () => {
    await redirectPurchase({ 
        variables: {
            name: section?.url_key,
            interval: 'ONE_TIME',
            is_plan: false
        }
     });
  }, [section]);

  const handleRedirectProductPage = useRedirectSectionPage();
  const handleRedirectPlansPage = useRedirectPlansPage();

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
    <Modal
      size='large'
      open={isShowPopup}
      onClose={handleChange}
      title={product.name}
    >
      <Modal.Section>
        <InlineGrid columns={{sm: 1, md: ['twoThirds', 'oneThird']}} gap={400}>
          <BlockStack gap={400}>
            <Card title="Gallery" padding={0}>
              <GallerySlider gallery={product.images} />
            </Card>
            <InlineGrid columns={2} gap={400}>
              <Card>
                <Box>
                  <iframe width="100%" height="240" src="https://www.youtube.com/embed/EN6xKGnrGYw?si=KvHdD2IijxWuZ0sD" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                </Box>
              </Card>

              <Card>
                <Box>
                  <iframe width="100%" height="240" src="https://www.youtube.com/embed/EN6xKGnrGYw?si=KvHdD2IijxWuZ0sD" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                </Box>
              </Card>
            </InlineGrid>
          </BlockStack>
          <BlockStack gap={400}>
            <Card title="Infomation">
              <BlockStack gap="200">
                <InlineStack gap={200}>
                  <div className='pointer' onClick={() => handleRedirectProductPage(product.url_key)}>
                    <Text variant="headingMd" as="h2">{product.name}</Text>
                  </div>
                  {
                    product.actions?.install &&
                    <div>
                      <Badge tone='success'>Ready</Badge>
                    </div>
                  }
                </InlineStack>

                {
                  product?.tags &&
                  <BadgeTag tags={product.tags} />
                }
                
                <Text variant="bodyMd" as="p">Version: {product.version}</Text>

                <Text variant="bodyLg" as="p" fontWeight='bold'>${product.price}</Text>

                <BannerDefault bannerAlert={bannerAlert} setBannerAlert={setBannerAlert} />
                
                {
                  product.actions?.install &&
                  <ModalInstallSection section={section} reloadSection={reloadSectionDetail} />
                }

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
                        Purchase
                      </Button>
                    }
                    <Button
                      size="large"
                      fullWidth
                      url={product.demo_link}
                      disabled={!Boolean(product.demo_link)}
                    >
                      <Tooltip>View demo store</Tooltip>
                    </Button>
                  </>
                  : <SkeletonDisplayText maxWidth='true'></SkeletonDisplayText>
                }
              </BlockStack>
            </Card>

            {
              product.description && 
              <Card title="USP">
                <Box>
                  <BlockStack gap={200}>
                    <div dangerouslySetInnerHTML={{__html: product.description}}></div>
                  </BlockStack>
                </Box>
              </Card>
            }
          
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
                    disabled={!product.actions?.plan}
                    onClick={handleRedirectPlansPage}
                  >
                    {product.actions?.plan ? "Upgrade Now" : "Actived"}
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

            {/* <CalloutCard
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
            </CalloutCard> */}
          </BlockStack>
        </InlineGrid>
      </Modal.Section>
    </Modal>
  );
}

export default memo(ModalProduct);