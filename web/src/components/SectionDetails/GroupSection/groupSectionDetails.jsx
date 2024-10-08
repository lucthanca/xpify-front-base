import { memo, useCallback } from 'react';
import { PaymentIcon, HeartIcon } from '@shopify/polaris-icons';
import { BlockStack, Box, Card, InlineStack, Layout, Page, Text } from '@shopify/polaris';
import { useBackPage } from '~/hooks/section-builder/redirect';
import ModalInstallSection from '~/components/block/product/manage';
import GallerySlider from '~/components/splide/gallery';
import CardUSP from '~/components/block/card/usp';
import BannerWarningNotPurchase from '~/components/block/banner/warningPurchase';
import BadgeStatusSection from '~/components/block/badge/statusSection';
import { Loading } from '@shopify/app-bridge-react';
import NotFound from '~/pages/NotFound.jsx';
import RelatedProducts from '../RelatedProducts/relatedProducts';
import DocInstall from '~/components/block/card/docInstall';
import VideoGuideInstall from '~/components/block/card/videoInstall';
import CollapsibleCard from "~/components/block/collapsible/card";
import Badges from '~/components/block/product/badge/bagList.jsx';
import Footer from "~/components/block/footer";
import ChildSections from './childSections';
// import ProductList from '~/components/block/product/list';
// import SkeletonProduct from '~/components/block/product/skeleton';
// import { useWishlist } from '~/hooks/section-builder/wishlist';

const GroupSectionDetails = props => {
  const handleBackPage = useBackPage();
  const tagBadgeItemRender = useCallback((item) => `${item.name}`, []);
  const {
    groupSectionLoading: sectionLoading,
    groupSection,
    childSections,
    purchaseLoading,
    handlePurchase,
    groupSectionError,
  } = props;
  // const { handleUpdate:addWishlist, dataUpdateLoading:addWishlistLoading, handleDelete:deleteWishlist, dataDeleteLoading:deleteWishlistLoading } = useWishlist(groupSection);

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
          <InlineStack gap='200'>
            <BadgeStatusSection item={groupSection} key={sectionLoading} />
            {/* {
              groupSection?.tags &&
              <BadgeTag tags={groupSection.tags} />
            } */}
          </InlineStack>
        }
        subtitle={groupSection.version}
        compactTitle
        // primaryAction={{
        //   icon: HeartIcon,
        //   destructive: !!groupSection?.is_in_wishlist,
        //   loading: !groupSection?.is_in_wishlist ? addWishlistLoading : deleteWishlistLoading,
        //   onAction: () => {!groupSection?.is_in_wishlist ? addWishlist() : deleteWishlist()},
        //   primary: !!groupSection?.is_in_wishlist,
        //   helpText: !groupSection?.is_in_wishlist ? 'Like' : 'Unlike',
        // }}
      >
        <Layout>
          <Layout.Section>
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

              {(groupSection?.categoriesV2?.length || groupSection?.tags?.length)
                ? <Card title='Information'>
                  <Text variant="headingMd" as="h2">General Information</Text>
                  <Box paddingInlineStart={200} paddingBlockStart="200" as='div'>
                    <BlockStack gap={200}>
                      {groupSection?.categoriesV2?.length > 0 && (
                        <Badges items={groupSection.categoriesV2} isSimpleSection={!groupSection?.child_ids?.length} searchKey={'category'} title={'Categories'} onClick={() => {}} />
                      )}
                      {groupSection?.tags?.length > 0 &&
                        <Badges items={groupSection.tags} isSimpleSection={!groupSection?.child_ids?.length} searchKey={'tags'} itemContentRenderer={tagBadgeItemRender} title={'Tags'} onClick={() => {}} />
                      }
                    </BlockStack>
                  </Box>
                </Card>
                : <></>
              }

              {groupSection.actions?.install
                && !(groupSection?.special_status === 'coming_soon')
                &&
                <Box paddingInline='400'>
                  <ModalInstallSection section={groupSection} fullWith={false} />
                </Box>
              }

              {groupSection?.short_description && (
                <Box>
                  <CardUSP short_description={groupSection.short_description} />
                </Box>
              )}

              {groupSection.description && (
                <Box>
                  <CollapsibleCard title={"Description"} content={groupSection.description} />
                </Box>
              )}

              <Card title='Gallery' padding='0'>
                <div className='quickViewModal__gallery__root aspect-[16/9] bg-white'>
                  <GallerySlider gallery={groupSection?.images || []} />
                </div>
              </Card>

              <Box>
                <ChildSections childIds={groupSection.child_ids} />
              </Box>

              <Box>
                <VideoGuideInstall />
              </Box>

              <Box>
                <DocInstall />
              </Box>

              <RelatedProducts section={groupSection} />

              {
                childSections.length > 0 &&
                childSections.some(item => item.release_note) && (
                  <CollapsibleCard title='Release Note' content={
                    <>
                      {childSections.map(item => (
                        item.release_note &&
                        <Box key={item.id}>
                          <Text variant="headingSm" as='h3'>{item.name}:</Text>
                          <Box paddingInline='200'>
                            <Text as="div" variant="bodyMd">
                              <div dangerouslySetInnerHTML={{__html: item.release_note}}></div>
                            </Text>
                          </Box>
                        </Box>
                      ))}
                    </>
                  } isOpen={true} isJsx={true}/>
                )
              }
            </BlockStack>
          </Layout.Section>
        </Layout>

        <Footer hasCaughtUp={true} />
      </Page>
    </>
  );
};

export default memo(GroupSectionDetails);
