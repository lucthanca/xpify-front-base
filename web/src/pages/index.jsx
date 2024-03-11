import {
  BlockStack,
  Box,
  Card,
  Icon,
  InlineGrid,
  InlineStack,
  Layout,
  List,
  Page,
  Text
} from "@shopify/polaris";
import {
  ProductIcon,
  HeartIcon,
  NotificationIcon,
  QuestionCircleIcon
} from '@shopify/polaris-icons';
import GuideCard from '~/components/block/card/guide';
import Tutorial from '~/components/media/tutorial';
import SectionList from '~/components/block/mySections';
import TitleBlock from '~/components/block/title';
import { useRedirectSectionsPage } from '~/hooks/section-builder/redirect';

function HomePage() {
  const handleRedirectSectionsPage = useRedirectSectionsPage();

  return (
    <Page
      title="Home page"
      primaryAction={{
        content: 'Start App',
        onAction: handleRedirectSectionsPage,
      }}
      secondaryActions={[
        {content: 'Latest release', icon: NotificationIcon},
        {content: 'Wishlist', icon: HeartIcon},
        {content: 'Your sections', icon: ProductIcon}
      ]}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap={600}>
            <Box>
              <GuideCard />
            </Box>

            <Box>
              <BlockStack gap={400}>
                <TitleBlock title='Overview' subTitle='Sections and Blocks that you have installed.' />

                <InlineGrid gap="400" columns={2}>
                  <Card>
                    <BlockStack gap="200">
                      <BlockStack inlineAlign="start">
                        <InlineStack gap="400">
                          <Icon source={QuestionCircleIcon} />
                          <Text as="h3" variant="headingSm">
                            Contact support
                          </Text>
                        </InlineStack>
                      </BlockStack>
                      <List>
                        <List.Item>Socks</List.Item>
                        <List.Item>Super Shoes</List.Item>
                        <List.Item>Super</List.Item>
                      </List>
                    </BlockStack>
                  </Card>
                  <Card>
                    <BlockStack gap="200">
                      <BlockStack inlineAlign="start">
                        <InlineStack gap="400">
                          <Icon source={QuestionCircleIcon} />
                          <Text as="h3" variant="headingSm">
                            Contact support
                          </Text>
                        </InlineStack>
                      </BlockStack>
                      <List>
                        <List.Item>Socks</List.Item>
                        <List.Item>Super Shoes</List.Item>
                        <List.Item>Super</List.Item>
                      </List>
                    </BlockStack>
                  </Card>
                </InlineGrid>
                <InlineGrid>
                  <SectionList />
                </InlineGrid>
              </BlockStack>
            </Box>

            <Box>
              <BlockStack gap={400}>
                <TitleBlock title='How It Works' subTitle='See a few examples of magically adding a theme section to your store in a few clicks.' />

                <InlineGrid gap="400" columns={{ sm: 1, md: 2, lg: 3 }}>
                  <div>
                    <Tutorial mediaCard={{
                      portrait: true,
                      title: "Quickstart 1",
                      primaryAction: {
                        content: 'Watch 1',
                        onAction: () => {},
                      }
                    }}
                    />
                  </div>
                  <div>
                    <Tutorial mediaCard={{
                      portrait: true,
                      title: "Quickstart 2",
                      primaryAction: {
                        content: 'Watch 2',
                        onAction: () => {},
                      }
                    }}
                  />
                  </div>
                  <div>
                    <Tutorial mediaCard={{
                      portrait: true,
                      title: "Quickstart 3",
                      primaryAction: {
                        content: 'Watch 3',
                        onAction: () => {},
                      }
                    }}
                  />
                  </div>
                </InlineGrid>
              </BlockStack>
            </Box>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  )
}

export default HomePage;
