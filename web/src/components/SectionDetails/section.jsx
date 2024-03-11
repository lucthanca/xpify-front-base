import { memo, useCallback, useState } from 'react';
import {
  Badge,
  Banner,
  BlockStack,
  Box,
  Card,
  Layout,
  List,
  Page,
  Text
} from '@shopify/polaris';
import { PaymentIcon, ViewIcon } from '@shopify/polaris-icons';
import { useBackPage } from '~/hooks/section-builder/redirect';
import BannerDefault from '~/components/block/banner';
import ModalInstallSection from '~/components/product/manage';
import SectionGallery from '~/components/SectionDetails/gallery';
import RelatedProducts from '~/components/SectionDetails/RelatedProducts';
import { Loading } from '@shopify/app-bridge-react';
import NotFound from '~/pages/NotFound';

const SectionFullpageDetails = props => {
  const {
    section = {},
    purchaseLoading,
    sectionLoading,
    handlePurchase,
    themes,
    reloadSection,
    relatedProducts,
    sectionError,
  } = props;
  const handleBackPage = useBackPage();
  const [isShowPopupManage, setIsShowPopupManage] = useState(false);
  const [bannerAlert, setBannerAlert] = useState(undefined);
  const handleShowPopup = useCallback(() => setIsShowPopupManage(prev => !prev), []);

  const handleBack = useCallback(() => navigate('/sections'), [navigate]);
  const backAction = useMemo(() => ({
    content: 'Not Found',
    onAction: handleBack
  }), [handleBack]);

  if (sectionError?.graphQLErrors?.[0]?.extensions?.category === 'graphql-no-such-entity') {
    return <NotFound backAction={backAction} />;
  }

  return (
    <>
      {sectionLoading && <Loading />}
      <Page
        backAction={{content: 'Products', onAction: () => handleBackPage()}}
        title={section.name}
        titleMetadata={<Badge tone="success">v{section.version}</Badge>}
        subtitle={section.price ? `$${section.price} or update to ${section.pricing_plan?.name}` : 'Free'}
        compactTitle
        primaryAction={{ content: 'Manage Section', onAction: handleShowPopup, disabled: sectionLoading }}
        secondaryActions={[
          {
            content: 'View in demo site',
            icon: ViewIcon,
            url: section?.demo_link,
            disabled: !section?.demo_link || sectionLoading,
            helpText: !section?.demo_link ? 'This product has no demo yet.' : '',
            onAction: () => {}
          },
          {
            content: !section.actions?.purchase ? 'Owned' : 'Purchase',
            disabled: !section.actions?.purchase,
            helpText: section.actions?.purchase && 'Own forever this section.',
            loading: purchaseLoading || sectionLoading,
            onAction: section.actions?.purchase && handlePurchase
          }
        ]}
      >
        <Layout>
          <Layout.Section>
            <BlockStack gap='400'>
              {
                (!section.actions?.install) &&
                <Banner
                  title="You cann't use this section now!"
                  action={{
                    content: 'Purchase $' + section.price,
                    icon: PaymentIcon,
                    loading: purchaseLoading,
                    onAction: handlePurchase,
                    disabled: sectionLoading || purchaseLoading
                  }}
                  secondaryAction={section.actions?.plan ?? {
                    content: 'View Plan',
                    icon: ViewIcon,
                    disabled: sectionLoading || purchaseLoading
                  }}
                  tone='warning'
                >
                  <BlockStack gap='200'>
                    <Text variant="headingSm">How to use this section?</Text>
                    <List>
                      {
                        section.actions?.purchase &&
                        <List.Item>
                          <Text variant="bodySm">Own forever: Purchase once.</Text>
                        </List.Item>
                      }
                      {
                        section.actions?.plan &&
                        <List.Item>
                          <Text variant="bodySm">Periodic payments: Own all sections included in the plan ({section.pricing_plan.name})</Text>
                        </List.Item>
                      }
                    </List>
                  </BlockStack>
                </Banner>
              }

              <BannerDefault bannerAlert={bannerAlert} setBannerAlert={setBannerAlert} />
              <SectionGallery images={section?.images || []} />

              {section.description && (
                <Card title="Description"> 
                  <Text variant="headingMd">Description</Text>
                  <Box padding="200">
                    <div dangerouslySetInnerHTML={{__html: section.description}}></div>
                  </Box>
                </Card>
              )}
              {section.release_note && (
                <Card title="Release Note">
                  <Text variant="headingMd">Release Note</Text>
                  <Box padding="200">
                    <div dangerouslySetInnerHTML={{__html: section.release_note}}></div>
                  </Box>
                </Card>
              )}
              <RelatedProducts products={relatedProducts} />
            </BlockStack>
          </Layout.Section>

          {
            section &&
            <ModalInstallSection
              currentProduct={section}
              themes={themes}
              isShowPopup={isShowPopupManage}
              setIsShowPopup={setIsShowPopupManage}
              setBannerAlert={setBannerAlert}
              reloadProduct={reloadSection}
            />
          }
        </Layout>
      </Page>
    </>
  );
};

export default memo(SectionFullpageDetails);
