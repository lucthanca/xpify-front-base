import { memo, useCallback, useState } from 'react';
import {
  BlockStack,
  Box,
  Button,
  Card,
  InlineGrid,
  Layout,
  Page,
  Text
} from "@shopify/polaris";
import GuideCard from '~/components/block/card/guide';
import TitleBlock from '~/components/block/title';
import NavCard from '~/components/block/card/nav';
import { useRedirectGroupsPage, useRedirectHelpCenterPage, useRedirectMyLibraryPage, useRedirectSectionsPage } from '~/hooks/section-builder/redirect';
import { useQuery } from "@apollo/client";
import { MY_SHOP } from '~/queries/section-builder/other.gql';
import { BestSeller, LatestRelease } from '~/components/hompage';
import Footer from '~/components/block/footer';
import { Loading } from '@shopify/app-bridge-react';
import { useFreshChat } from '~/components/providers/freshchat';

function HomePage() {
  const { data: myShop, loading: myShopLoading } = useQuery(MY_SHOP, {
    fetchPolicy: "cache-and-network",
  });

  const handleRedirectSectionsPage = useRedirectSectionsPage();
  const handleRedirectGroupsPage = useRedirectGroupsPage();
  const handleRedirectMyLibraryPage = useRedirectMyLibraryPage();

  const { open: openChat } = useFreshChat();

  return (
    <>
      {myShopLoading && <Loading />}
      <Page title="Welcome to Omni Themes Section Builder!">
        <Layout>
          <Layout.Section>
            <BlockStack gap={600}>
              <Box>
                <Card>
                  <BlockStack gap={200}>
                  <Text as="p" variant="bodyMd">
                    Hi {myShop?.myShop?.shop_owner}, welcome to your fresh batch of sections and templates to jazz up your Shopify theme!
                  </Text>
                  <Text as="p" variant="bodyMd">
                    Once you've got these installed, just hop into the theme editor, and keep an eye out for 'OT' in the search box.
                  </Text>
                  <Text as="p" variant="bodyMd">
                    Happy customizing!
                  </Text>
                  </BlockStack>
                </Card>
              </Box>

              <Box>
                <GuideCard />
              </Box>

              <Box>
                <BlockStack gap={400}>
                  <InlineGrid gap="400" columns={{ xs: 1, sm: 2 }}>
                    <NavCard
                      title='Sections'
                      content='Select your missing parts to complete your store!'
                      actions={<Button onClick={handleRedirectSectionsPage}>Browse Sections</Button>}
                    />
                    <NavCard
                      title='Groups'
                      content="Don't know where to start? Select a whole pack of solution for your store!"
                      actions={<Button onClick={handleRedirectGroupsPage}>Browse Groups</Button>}
                    />
                    <NavCard
                      title='My Library'
                      content='All your added sections in one place, ready to tailor your store.'
                      actions={<Button onClick={handleRedirectMyLibraryPage}>Open My Library</Button>}
                    />
                    <NavCard
                      title='Support'
                      content='Need a helping hand? Check our FAQs or chat directly with our support agents for quick and friendly support.'
                      actions={<Button onClick={openChat}>Open live chat</Button>}
                    />
                  </InlineGrid>
                </BlockStack>
              </Box>

              <BestSeller />
              <LatestRelease />
            </BlockStack>
          </Layout.Section>
        </Layout>
        <Footer hasCaughtUp={true} />
      </Page>
    </>
  )
}

export default memo(HomePage);
