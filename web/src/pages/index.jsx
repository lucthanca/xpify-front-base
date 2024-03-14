import {
  BlockStack,
  Box,
  Button,
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
import NavCard from '~/components/block/card/nav';
import { useRedirectSectionsPage } from '~/hooks/section-builder/redirect';

function HomePage() {
  const handleRedirectSectionsPage = useRedirectSectionsPage();

  return (
    <Page
      title="Dashboard"
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
            <Card>
              <Text as="p" variant="bodyLg">
                Welcome to your new collection of sections and templates to extend and customize your Shopify theme.
              </Text>
              <Text as="p" variant="bodyLg">
                Once you have installed your sections and templates, they will appear in the theme editor. Look for "Simi" in the search box!
              </Text>
            </Card>
            </Box>

            <Box>
              <GuideCard />
            </Box>

            <Box>
              <BlockStack gap={400}>
                <TitleBlock title='Overview' subTitle='Sections and Blocks that you have installed.' />

                <InlineGrid gap="400" columns={2}>
                  <NavCard
                    title='Sections'
                    content='Select your missing parts to complete your store!'
                    actions={<Button onClick={() => {}}>Browse Sections</Button>}
                  />
                  <NavCard
                    title='Groups'
                    content="Don't know where to start? Select a whole solution for your store!"
                    actions={<Button onClick={() => {}}>Browse Groups</Button>}
                  />
                  <NavCard
                    title='My Library'
                    content='All your purchased sections in one place, ready to tailor your store'
                    actions={<Button onClick={() => {}}>My Library</Button>}
                  />
                  <NavCard
                    title='Help Center'
                    content='Need a helping hand? Check our FAQs for quick and friendly support.'
                    actions={<Button onClick={() => {}}>Browse Sections</Button>}
                  />
                </InlineGrid>
              </BlockStack>
            </Box>

            <Box>
              <BlockStack gap={400}>
                <TitleBlock title='Best Seller' subTitle='See a few examples of magically adding a theme section to your store in a few clicks.' />

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
