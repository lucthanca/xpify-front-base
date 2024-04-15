import { memo, useCallback, useState } from "react";
import {
  Badge,
  BlockStack,
  Box,
  Card,
  InlineStack,
  ResourceItem,
  ResourceList,
  Tabs,
  Text,
  Thumbnail,
  Tooltip
} from "@shopify/polaris";
import { useQuery } from "@apollo/client";
import { useRedirectSectionPage, useRedirectSectionsPage } from '~/hooks/section-builder/redirect';
import EmptyState from '~/components/block/emptyState';
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

function SectionList() {
  const [selected, setSelected] = useState(0);
  const [tabQuery, setTabQuery] = useState(SECTIONS_INSTALLED_QUERY);

  const handleTabChange = useCallback((selectedTabIndex) => {
    setSelected(selectedTabIndex);
    setTabQuery(tabs[selectedTabIndex].query);
  }, []);

  const handleRedirectSectionsPage = useRedirectSectionsPage();
  const handleRedirectSectionPage = useRedirectSectionPage();

  const { data:sections } = useQuery(tabQuery, {
    fetchPolicy: "cache-and-network",
  });

	return (
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
            emptyState={
              <EmptyState
                heading='No sections'
                action={{
                  content: 'Explore Library',
                  onAction: handleRedirectSectionsPage
                }}
                content='Discover all sections on library'
              />
            }
            renderItem={(item) => {
              return (
                <ResourceItem
                  key={item.entity_id}
                  id={item.entity_id}
                  media={
                    <Thumbnail size='medium' source={item.images[0]?.src} alt='' />
                  }
                  onClick={() => handleRedirectSectionPage(item.url_key)}
                >
                  <InlineStack align='space-between'>
                    <BlockStack gap={200}>
                      <BlockStack>
                        <Text variant="bodySm" fontWeight="bold">
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
                              Installed in {item.installed.length} themes
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
	);
}

export default memo(SectionList);