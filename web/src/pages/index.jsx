import {useState, useCallback, useMemo} from 'react';
import { BlockStack, Box, Card, Icon, InlineGrid, InlineStack, Layout, List, Page, Text, Tabs, ResourceList, ResourceItem, Avatar, Thumbnail, Tooltip, Badge, EmptyState } from "@shopify/polaris";
import {
  ProductIcon,
  HeartIcon,
  NotificationIcon,
  QuestionCircleIcon
} from '@shopify/polaris-icons';
import { useNavigate } from '@shopify/app-bridge-react';
import {gql, useQuery} from "@apollo/client";

import GuideCard from "~/components/card/guide";
import Tutorial from '~/components/media/tutorial';
import { SECTIONS_BOUGHT_QUERY, SECTIONS_INSTALLED_QUERY } from "~/queries/section-builder/product.gql";

const tabs = [
  {
    id: 'installed',
    content: 'Sections Installed',
    query: SECTIONS_INSTALLED_QUERY
  },
  {
    id: 'bought',
    content: 'Sections Paid',
    query: SECTIONS_BOUGHT_QUERY
  }
];

function HomePage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const [tabQuery, setTabQuery] = useState(SECTIONS_INSTALLED_QUERY);

  const handleTabChange = useCallback((selectedTabIndex) => {
    setSelected(selectedTabIndex);
    setTabQuery(tabs[selectedTabIndex].query);
  }, []);

  const handleRedirectProductPage = useCallback((url) => {
    navigate(`/section/${url}`);
    window.scrollTo(0,0);
  }, []);
  const handleRedirectSectionsPage = useCallback(() => {
    navigate(`/sections`);
    window.scrollTo(0,0);
  }, []);

  const { data:sections, loading:sectionsL, error:sectionsE } = useQuery(tabQuery, {
    fetchPolicy: "cache-and-network",
  });

  const emptyStateMarkup = useMemo(() => {
    return (
      <EmptyState
        heading="No sections"
        action={{
          content: 'Explore Library',
          onAction: () => handleRedirectSectionsPage()
        }}
        image="https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png"
      >
        <Text variant="bodyMd" as='p'>Discover all sections on library</Text>
      </EmptyState>
    );
  }, [sections]);

  return (
    <Page
      title="Home page"
      primaryAction={{
        content: 'Start App',
        onAction: () => {handleRedirectSectionsPage()}
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
                <BlockStack>
                  <Text variant="headingMd" as="h2">Overview</Text>
                  <Text variant="bodyXs" as="p" tone="subdued">Sections and Blocks that you have installed</Text>
                </BlockStack>
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
                  <Card padding={0}>
                    <Tabs
                      tabs={tabs}
                      selected={selected}
                      onSelect={handleTabChange}
                      fitted
                    >
                      <Box paddingInline={400} paddingBlockEnd={400}>
                        <ResourceList
                          resourceName={{singular: 'section', plural: 'sections'}}
                          items={
                            sections?.getSectionsInstall
                            ? sections?.getSectionsInstall ?? []
                            : sections?.getSectionsBuy ?? []
                          }
                          emptyState={emptyStateMarkup}
                          renderItem={(item) => {
                            return (
                              <ResourceItem
                                key={item.entity_id}
                                id={item.entity_id}
                                media={
                                  <Thumbnail size='medium' source={item.images[0]?.src} alt='' />
                                }
                                onClick={() => {handleRedirectProductPage(item.url_key)}}
                              >
                                <InlineStack align='space-between'>
                                  <BlockStack gap={200}>
                                    <BlockStack>
                                      <Text variant="headingSm" as="h3">
                                        {item.name}
                                      </Text>
                                      <Text variant="bodySm" tone='subdued' as="p">
                                        {item.price ? '$' + item.price : 'Free'}
                                      </Text>
                                    </BlockStack>
                                    {
                                      item.installed &&
                                      <Tooltip content={item.installed.filter(install => install.product_version !== item.version).length + ' themes are using old version!'}>
                                        <Text variant="bodySm" tone='subdued' as="p">
                                           in {item.installed.length} themes
                                        </Text>
                                      </Tooltip>
                                    }
                                  </BlockStack>
                                  <Badge tone="success">v{item.version}</Badge>
                                </InlineStack>
                              </ResourceItem>
                            );
                          }}
                        />
                      </Box>
                    </Tabs>
                  </Card>
                </InlineGrid>
              </BlockStack>
            </Box>

            <Box>
              <BlockStack gap={400}>
                <BlockStack>
                  <Text variant="headingMd" as="h2">How It Works</Text>
                  <Text variant="bodyXs" as="p" tone="subdued">See a few examples of magically adding a theme section to your store in a few clicks.</Text>
                </BlockStack>

                <InlineGrid gap="400" columns={3}>
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
