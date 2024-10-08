import { memo, useCallback, useEffect, useState } from 'react';
import {
  BlockStack,
  Box,
  Button,
  Card,
  InlineGrid,
  Layout,
  Page,
  Text,
  Icon, InlineStack,
} from '@shopify/polaris';
import { XIcon } from '@shopify/polaris-icons';
// import GuideCard from '~/components/block/card/guide';
import NavCard from '~/components/block/card/nav';
import Footer from '~/components/block/footer';
import { Loading } from '@shopify/app-bridge-react';
import { useFreshChat } from '~/components/providers/freshchat';
import './style.scss';
import { WelcomeMsg, Guide } from '~/components/hompage/blocks';

function HomePage() {
  // const { data: myShop, loading: myShopLoading } = useQuery(MY_SHOP, {
  //   fetchPolicy: "cache-and-network",
  // });

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
      {loading && <Loading />}
      <Page title="Welcome to Omni Themes: Theme Sections!">
        <Layout>
          <Layout.Section>
            <BlockStack gap='600'>
              <WelcomeMsg />

              <Guide />

              <Box>
                <BlockStack gap='400'>
                  <InlineGrid gap="400" columns="1">
                    <NavCard
                      title='Support'
                      content='Need a helping hand? Check our FAQs or chat directly with our support agents for quick and friendly support.'
                      actions={<Button disabled={loading || !freshchatInitialized} onClick={openChat}>Open live chat</Button>}
                    />
                  </InlineGrid>
                </BlockStack>
              </Box>

              <Card background="bg-surface-secondary" roundedAbove="md">
                <InlineGrid columns={{ xs: "1fr auto" }} alignItems='center'>
                  <InlineStack wrap={true} gap='200'>
                    <Text as='h2' tone='subdued' variant='bodyMd'>You’ve dismissed this card.</Text>
                    <Button id='btn-undo-1' variant='plain' onClick={() => console.log('Reopen card')}>Undo</Button>
                  </InlineStack>
                  <Button variant='plain' icon={<Icon source={XIcon} />} tone='base' />
                </InlineGrid>
              </Card>

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
