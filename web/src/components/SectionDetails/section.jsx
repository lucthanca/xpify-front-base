import { memo, useCallback, useState } from 'react';
import {
  Badge,
  Banner,
  BlockStack,
  Box,
  Button,
  Card,
  InlineGrid,
  InlineStack,
  Layout,
  List,
  Page,
  Select,
  Text
} from '@shopify/polaris';
import { PaymentIcon, ViewIcon, LockIcon } from '@shopify/polaris-icons';
import { useBackPage, useRedirectPlansPage } from '~/hooks/section-builder/redirect';
import BadgeTag from '~/components/block/badge/tag';
import BadgeStatusSection from '~/components/block/badge/statusSection';
import ModalInstallSection from '~/components/product/manage';
import BannerWarningNotPurchase from '~/components/block/banner/warningPurchase';
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
  const handleRedirectPlansPage = useRedirectPlansPage();
  const [isShowPopupManage, setIsShowPopupManage] = useState(false);
  const [bannerAlert, setBannerAlert] = useState(undefined);
  const handleShowPopup = useCallback(() => setIsShowPopupManage(prev => !prev), []);

  if (sectionError?.graphQLErrors?.[0]?.extensions?.category === 'graphql-no-such-entity') {
    return <NotFound />;
  }

  return (
    <>
      {sectionLoading && <Loading />}
      <Page
        backAction={{content: 'Products', onAction: () => handleBackPage()}}
        title={section.name}
        titleMetadata={
          <InlineStack gap={200}>
            <BadgeStatusSection item={section} key={sectionLoading} />
            {
              section?.tags &&
              <BadgeTag tags={section.tags} />
            }
          </InlineStack>
        }
        subtitle={"version " + section.version}
        compactTitle
        primaryAction={{
          content: 'Purchase',
          disabled: true
        }}
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
                <BannerWarningNotPurchase
                  section={section}
                  config={
                    {
                      title: "You cann't use this section now!",
                      tone: 'warning',
                      action: {
                        content: 'Purchase $' + section.price,
                        icon: PaymentIcon,
                        loading: purchaseLoading,
                        onAction: handlePurchase,
                        disabled: sectionLoading || purchaseLoading
                      },
                      secondaryAction: {
                        content: 'View Plans',
                        icon: ViewIcon,
                        onAction: handleRedirectPlansPage
                      }
                    }
                  }
                />
              }

              {/* <BannerDefault bannerAlert={bannerAlert} setBannerAlert={setBannerAlert} /> */}

              <ModalInstallSection section={section} themes={themes} reloadSection={reloadSection} fullWith={false} />

              <Box>
                {section.description && (
                  <Card title="Description"> 
                    <Text variant="headingMd">Description</Text>
                    <Box padding="200">
                      <div dangerouslySetInnerHTML={{__html: section.description}}></div>
                    </Box>
                  </Card>
                )}
              </Box>

              <Box>
                <SectionGallery images={section?.images || []} />
              </Box>
              
              <Box>
                {section.release_note && (
                  <Card title="Release Note">
                    <Text variant="headingMd">Release Note</Text>
                    <Box padding="200">
                      <div dangerouslySetInnerHTML={{__html: section.release_note}}></div>
                    </Box>
                  </Card>
                )}
              </Box>

              <RelatedProducts products={relatedProducts} />
            </BlockStack>
          </Layout.Section>
        </Layout>
      </Page>
    </>
  );
};

export default memo(SectionFullpageDetails);
