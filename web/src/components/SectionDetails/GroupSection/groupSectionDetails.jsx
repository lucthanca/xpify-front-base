import { memo } from 'react';
import { PaymentIcon, ViewIcon } from '@shopify/polaris-icons';
import { BlockStack, Box, Card, InlineStack, Layout, Page, Text } from '@shopify/polaris';
import { useBackPage, useRedirectPlansPage } from '~/hooks/section-builder/redirect';
import ProductList from '~/components/block/product/list';
import ModalInstallSection from '~/components/block/product/manage';
import SkeletonProduct from '~/components/block/product/skeleton';
import CardUSP from '~/components/block/card/usp';
import BannerWarningNotPurchase from '~/components/block/banner/warningPurchase';
import BadgeTag from '~/components/block/badge/tag';
import BadgeStatusSection from '~/components/block/badge/statusSection';
import { Loading } from '@shopify/app-bridge-react';
import NotFound from '~/pages/NotFound.jsx';
import RelatedProducts from '../RelatedProducts/relatedProducts';
import DocInstall from '~/components/block/card/docInstall';
import VideoGuideInstall from '~/components/block/card/videoInstall';
import Footer from "~/components/block/footer";

const GroupSectionDetails = props => {
  const handleBackPage = useBackPage();
  const handleRedirectPlansPage = useRedirectPlansPage();
  const {
    groupSectionLoading: sectionLoading,
    groupSection,
    childSections,
    purchaseLoading,
    handlePurchase,
    groupSectionError,
  } = props;

  if (groupSectionError?.graphQLErrors?.[0]?.extensions?.category === 'graphql-no-such-entity'
    || !groupSection?.child_ids
  ) {
    return <NotFound />;
  }

  return (
    <>
      {sectionLoading && <Loading />}
      <Page
        backAction={{content: 'Products', onAction: () => handleBackPage()}}
        title={groupSection.name}
        titleMetadata={
          <InlineStack gap={200}>
            <BadgeStatusSection item={groupSection} key={sectionLoading} />
            {/* {
              groupSection?.tags &&
              <BadgeTag tags={groupSection.tags} />
            } */}
          </InlineStack>
        }
        subtitle={groupSection.version}
        compactTitle
        primaryAction={{
          content: !groupSection?.actions?.purchase ? 'Owned' : 'Purchase',
          disabled: sectionLoading || purchaseLoading || !groupSection?.actions?.purchase,
          loading: sectionLoading || purchaseLoading,
          onAction: (!sectionLoading && !purchaseLoading) && handlePurchase,
        }}
        secondaryActions={[
          {
            content: 'View in demo store',
            icon: ViewIcon,
            url: groupSection?.demo_link,
            disabled: !groupSection?.demo_link,
            helpText: !groupSection?.demo_link ? 'This product has no demo yet.' : ''
          }
        ]}
      >
        <Layout>
          <Layout.Section>
            <Box>
              <BlockStack gap='400'>
                {
                  (!groupSection.actions?.install) &&
                  <BannerWarningNotPurchase
                    section={groupSection}
                    config={
                      {
                        title: "You cann't use this group section now!",
                        tone: 'warning',
                        action: {
                          content: 'Purchase by $' + groupSection.price,
                          icon: PaymentIcon,
                          loading: purchaseLoading,
                          onAction: handlePurchase,
                          disabled: sectionLoading || purchaseLoading
                        }
                      }
                    }
                  />
                }

                {groupSection.actions?.install &&
                  <Box>
                    <ModalInstallSection section={groupSection} fullWith={false} />
                  </Box>
                }

                {groupSection?.short_description && (
                  <Box>
                    <CardUSP short_description={groupSection.short_description} />
                  </Box>
                )}

                <Box>
                  <BlockStack gap='200'>
                    {childSections.length > 0 ? (
                      <ProductList items={childSections} columns={{sm: 1, md: 2}} />
                    ) : (
                      <SkeletonProduct total={2} columns={{ sm: 1, md: 2 }} />
                    )}
                  </BlockStack>
                </Box>

                {groupSection.description && (
                  <Box>
                    <Card title="Description">
                      <Text variant="headingMd">Description</Text>
                      <Box padding="400">
                        <div dangerouslySetInnerHTML={{__html: groupSection.description}}></div>
                      </Box>
                    </Card>
                  </Box>
                )}

                <Box>
                  <VideoGuideInstall />
                </Box>

                <Box>
                  <DocInstall />
                </Box>

                <RelatedProducts section={groupSection} />

                {childSections.length > 0 &&
                  <Box>
                    <BlockStack gap='400'>
                      <Card title="Release Note">
                      <Text variant="headingMd">Release Note</Text>
                      {childSections.map(item => (
                        item.release_note &&
                        <Box padding="200" key={item.id}>
                          <Text variant="headingSm">{item.name}:</Text>
                          <div dangerouslySetInnerHTML={{__html: item.release_note}}></div>
                        </Box>
                      ))}
                      </Card>
                    </BlockStack>
                  </Box>
                }
              </BlockStack>
            </Box>
          </Layout.Section>
        </Layout>

        <Footer />
      </Page>
    </>
  );
};

export default memo(GroupSectionDetails);
