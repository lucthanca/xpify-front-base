import { memo } from 'react';
import { ViewIcon } from '@shopify/polaris-icons';
import { BlockStack, Box, Card, Layout, Page, Text } from '@shopify/polaris';
import { useBackPage } from '~/hooks/section-builder/redirect';
import GallerySlider from '~/components/splide/gallery';
import ProductList from '~/components/product/list';
import SkeletonProduct from '~/components/product/skeleton';
import { Loading } from '@shopify/app-bridge-react';

const GroupSectionDetails = props => {
  const handleBackPage = useBackPage();
  const {
    groupSectionLoading: sectionLoading,
    groupSection,
    childSections,
    purchaseLoading,
    handlePurchase,
  } = props;
  console.log({ disable: sectionLoading || purchaseLoading || !groupSection?.actions?.purchase });

  return (
    <>
      {sectionLoading && <Loading />}
      <Page
        backAction={{content: 'Products', onAction: () => handleBackPage()}}
        title={groupSection.name}
        subtitle={groupSection.price ? `$${groupSection.price}` : 'Free'}
        compactTitle
        primaryAction={{
          content: !groupSection?.actions?.purchase ? 'Owned' : 'Purchase',
          disabled: sectionLoading || purchaseLoading || !groupSection?.actions?.purchase,
          helpText: 'Own forever this groupSection.',
          loading: sectionLoading || purchaseLoading,
          onAction: (!sectionLoading && !purchaseLoading) && handlePurchase,
        }}
        secondaryActions={[
          {
            content: 'View in demo site',
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
              <BlockStack gap='600'>
                <Box>
                  <Card title="Gallery" padding={0}>
                    <GallerySlider gallery={groupSection?.images || []} height={'30rem'} />
                  </Card>
                </Box>

                <Box>
                  <BlockStack gap='400'>
                    <BlockStack>
                      <Text variant="headingMd" as="h2">Group</Text>
                      <Text variant="bodyXs" as="p" tone="subdued">"{groupSection.name}" consists of {groupSection.child_ids.length} sections. Sections included in group:</Text>
                    </BlockStack>
                    {childSections.length > 0 ? (
                      <ProductList items={childSections} columns={{sm: 1, md: 2, lg: 3}} />
                    ) : (
                      <SkeletonProduct total={3} columns={{ sm: 1, md: 2, lg: 3 }} />
                    )}
                  </BlockStack>
                </Box>

                {groupSection.description && (
                  <Box paddingBlockEnd='600'>
                    <Card title="Description">
                      <Text variant="headingMd">Description</Text>
                      <Box padding="400">
                        <div dangerouslySetInnerHTML={{__html: groupSection.description}}></div>
                      </Box>
                    </Card>
                  </Box>
                )}
              </BlockStack>
            </Box>
          </Layout.Section>
        </Layout>
      </Page>
    </>
  );
};

export default memo(GroupSectionDetails);
