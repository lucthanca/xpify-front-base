import { memo, useCallback, useEffect, useState } from 'react';
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
import NavCard from '~/components/block/card/nav';
import { useQuery } from "@apollo/client";
import { MY_SHOP } from '~/queries/section-builder/other.gql';
import Footer from '~/components/block/footer';
import { Loading } from '@shopify/app-bridge-react';
import { useFreshChat } from '~/components/providers/freshchat';
// import { BestSeller, LatestRelease } from '~/components/hompage';
// import { useRedirectGroupsPage, useRedirectMyLibraryPage, useRedirectSectionsPage } from '~/hooks/section-builder/redirect';

function HomePage() {
  const { data: myShop, loading: myShopLoading } = useQuery(MY_SHOP, {
    fetchPolicy: "cache-and-network",
  });

  // const handleRedirectSectionsPage = useRedirectSectionsPage();
  // const handleRedirectGroupsPage = useRedirectGroupsPage();
  // const handleRedirectMyLibraryPage = useRedirectMyLibraryPage();
  const [loading, setLoading] = useState(false);

  const { open: openChat, initialized: freshchatInitialized } = useFreshChat();
  useEffect(() => {
    const handleReauthorization = () => {
      setLoading(true);
    };
    document.addEventListener('xpify:request-reauthorization', handleReauthorization);
    return () => {
      document.removeEventListener('xpify:request-reauthorization', handleReauthorization)
    };
  }, []);

  return (
    <>
      {myShopLoading || loading && <Loading />}
      <Page title="Welcome to Omni Themes: Theme Sections!">
        <Layout>
          <Layout.Section>
            <BlockStack gap={600}>
              <Box>
                <Card>
                  <BlockStack gap={200}>
                  <Text as="p" variant="bodyMd">
                    Hi {myShop?.myShop?.shop_owner}, welcome to our fresh batch of sections to jazz up your Shopify theme!
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
                  <InlineGrid gap="400" columns="1">
                    <NavCard
                      title='Support'
                      content='Need a helping hand? Check our FAQs or chat directly with our support agents for quick and friendly support.'
                      actions={<Button disabled={loading || !freshchatInitialized} onClick={openChat}>Open live chat</Button>}
                    />
                  </InlineGrid>
                </BlockStack>
              </Box>

              {/*<BestSeller />*/}
              {/*<LatestRelease />*/}
            </BlockStack>
          </Layout.Section>
        </Layout>
        <Footer hasCaughtUp={true} />
      </Page>
    </>
  )
}

export default memo(HomePage);
