import { memo, useCallback } from 'react';
import {
  BlockStack,
  Box,
  Card,
  InlineStack,
  Layout,
  Page,
  Text,
} from '@shopify/polaris';
import { PaymentIcon, ViewIcon, HeartIcon } from '@shopify/polaris-icons';
import { useBackPage, useRedirectPlansPage } from '~/hooks/section-builder/redirect';
import Badges from '~/components/block/product/badge/bagList.jsx';
import CardUSP from '~/components/block/card/usp';
import BadgeStatusSection from '~/components/block/badge/statusSection';
import ModalInstallSection from '~/components/block/product/manage';
import BannerWarningNotPurchase from '~/components/block/banner/warningPurchase';
import GallerySlider from '~/components/splide/gallery';
import RelatedProducts from '~/components/SectionDetails/RelatedProducts';
import { Loading } from '@shopify/app-bridge-react';
import NotFound from '~/pages/NotFound';
import DocInstall from '~/components/block/card/docInstall';
import VideoGuideInstall from '~/components/block/card/videoInstall';
import Footer from "~/components/block/footer";
import CollapsibleCard from "~/components/block/collapsible/card";
import { useWishlist } from '~/hooks/section-builder/wishlist';

const SectionFullpageDetails = props => {
  const {
    section = {},
    purchaseLoading,
    sectionLoading,
    handlePurchase,
    sectionError,
  } = props;
  const tagBadgeItemRender = useCallback((item) => `${item.name}`, []);
  const handleBackPage = useBackPage();
  const handleRedirectPlansPage = useRedirectPlansPage();
  const { handleUpdate:addWishlist, dataUpdateLoading:addWishlistLoading, handleDelete:deleteWishlist, dataDeleteLoading:deleteWishlistLoading } = useWishlist(section);

  if (sectionError?.graphQLErrors?.[0]?.extensions?.category === 'graphql-no-such-entity'
    || !section?.name
  ) {
    return <NotFound />;
  }

  return (
    <>
      {sectionLoading && <Loading />}
      <Page
        backAction={{onAction: handleBackPage}}
        title={section.name}
        titleMetadata={
          <InlineStack gap={200}>
            <BadgeStatusSection item={section} key={sectionLoading} />
            {/* {
              section?.tags &&
              <BadgeTag tags={section.tags} />
            } */}
          </InlineStack>
        }
        //subtitle={"version " + section.version}
        compactTitle
        primaryAction={{
          icon: HeartIcon,
          destructive: !!section?.is_in_wishlist,
          loading: !section?.is_in_wishlist ? addWishlistLoading : deleteWishlistLoading,
          onAction: () => {!section?.is_in_wishlist ? addWishlist() : deleteWishlist()},
          primary: !!section?.is_in_wishlist,
          helpText: !section?.is_in_wishlist ? 'Like' : 'Unlike',
        }}
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
                        content: 'Purchase by $' + section.price,
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

              {(section.version || section?.categoriesV2?.length || section?.tags?.length)
                ? <Card title='Information'>
                  <Text variant="headingMd" as="h2">General Information</Text>
                  <Box paddingInlineStart={200} paddingBlockStart="200" as='div'>
                    <BlockStack gap={200}>
                      <Text variant='bodySm' as='p'>
                        Version: {section.version}
                      </Text>
                      {section?.categoriesV2?.length > 0 && (
                        <Badges items={section.categoriesV2} isSimpleSection={!section?.child_ids?.length} searchKey={'category'} title={'Categories'} onClick={() => {}} />
                      )}
                      {section?.tags?.length > 0 &&
                        <Badges items={section.tags} isSimpleSection={!section?.child_ids?.length} searchKey={'tags'} itemContentRenderer={tagBadgeItemRender} title={'Tags'} onClick={() => {}} />
                      }
                    </BlockStack>
                  </Box>
                </Card>
                : <></>
              }

              {section.actions?.install
              && !(section?.special_status === 'coming_soon')
              &&
                <Box>
                  <ModalInstallSection section={section} fullWith={false} />
                </Box>
              }

              {section?.short_description && (
                <Box>
                  <CardUSP short_description={section.short_description} />
                </Box>
              )}

              {section.description &&
                <Box>
                  <CollapsibleCard title={"Description"} content={section.description} />
                </Box>
              }

              <Card title='Gallery' padding='0'>
                <div className='quickViewModal__gallery__root aspect-[16/9] bg-[#eee]'>
                  <GallerySlider gallery={section?.images || []} />
                </div>
              </Card>

              <Box>
                <VideoGuideInstall />
              </Box>

              <Box>
                <DocInstall />
              </Box>
              <RelatedProducts section={section} />

              {section.release_note && (
                <Box>
                  <CollapsibleCard title='Release Note' content={section.release_note} isOpen={true}/>
                </Box>
              )}
            </BlockStack>
          </Layout.Section>
        </Layout>

        <Footer hasCaughtUp={true} />
      </Page>
    </>
  );
};

export default memo(SectionFullpageDetails);
