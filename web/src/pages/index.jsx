import { memo, useCallback, useState } from 'react';
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
import { useRedirectGroupsPage, useRedirectHelpCenterPage, useRedirectMyLibraryPage, useRedirectSectionsPage } from '~/hooks/section-builder/redirect';
import { useQuery } from "@apollo/client";
import { MY_SHOP } from '~/queries/section-builder/other.gql';
import { BestSeller, LatestRelease } from '~/components/hompage';

function HomePage() {
  const { data: myShop } = useQuery(MY_SHOP, {
    fetchPolicy: "cache-and-network",
  });
  const handleRedirectSectionsPage = useRedirectSectionsPage();
  const handleRedirectGroupsPage = useRedirectGroupsPage();
  const handleRedirectMyLibraryPage = useRedirectMyLibraryPage();
  const handleRedirectHelpCenterPage = useRedirectHelpCenterPage();
  return (
    <Page title="Dashboard">
      <Layout>
        <Layout.Section>
          <BlockStack gap={600}>
            <Box>
              <Card>
                <BlockStack gap={200}>
                <Text as="p" variant="bodyLg">
                  Hi {myShop?.myShop?.shop_owner}, welcome to your fresh batch of sections and templates to jazz up your Shopify theme!
                </Text>
                <Text as="p" variant="bodyLg">
                  Once you've got these installed, just hop into the theme editor, and keep an eye out for 'Simi' in the search box.
                </Text>
                <Text as="p" variant="bodyLg">
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
                <TitleBlock title='Overview' subTitle='Sections and Blocks that you have installed.' />

                <InlineGrid gap="400" columns={2}>
                  <NavCard
                    title='Sections'
                    content='Select your missing parts to complete your store!'
                    actions={<Button onClick={handleRedirectSectionsPage}>Browse Sections</Button>}
                  />
                  <NavCard
                    title='Groups'
                    content="Don't know where to start? Select a whole solution for your store!"
                    actions={<Button onClick={handleRedirectGroupsPage}>Browse Groups</Button>}
                  />
                  <NavCard
                    title='My Library'
                    content='All your purchased sections in one place, ready to tailor your store'
                    actions={<Button onClick={handleRedirectMyLibraryPage}>My Library</Button>}
                  />
                  <NavCard
                    title='Help Center'
                    content='Need a helping hand? Check our FAQs for quick and friendly support.'
                    actions={<Button onClick={handleRedirectHelpCenterPage}>Help Center</Button>}
                  />
                </InlineGrid>
              </BlockStack>
            </Box>

            <BestSeller />
            <LatestRelease />
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  )
}

export default memo(HomePage);
