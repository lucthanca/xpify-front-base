import { memo, useCallback, useMemo, useState } from "react";
import {
  BlockStack,
  Box,
  Button,
  Card,
  Collapsible,
  Icon,
  Image,
  InlineGrid,
  InlineStack,
  List,
  Text
} from "@shopify/polaris";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  CheckIcon
} from '@shopify/polaris-icons';
import CollapsibleGuide from "~/components/block/collapsible/guide";
import { useQuery } from "@apollo/client";
import { MY_SHOP } from '~/queries/section-builder/other.gql';
import { THEMES_QUERY } from "~/queries/section-builder/theme.gql";
import { useRedirectGroupsPage, useRedirectSectionsPage } from "~/hooks/section-builder/redirect";

const totalStep = 3;

function GuideCard() {
  const [open, setOpen] = useState(true);
  const [openChild, setOpenChild] = useState([]);
  const [progress, setProgress] = useState(0);

  const handleToggle = useCallback(() => setOpen((open) => !open), []);
  const handleRedirectSectionsPage = useRedirectSectionsPage();
  const handleRedirectGroupsPage = useRedirectGroupsPage();

  const { data: myShop } = useQuery(MY_SHOP, {
    fetchPolicy: "cache-and-network",
  });
  const { data:themesData } = useQuery(THEMES_QUERY, {
    fetchPolicy: "cache-and-network"
  });

  const { urlEmbedApp, urlEditTheme } = useMemo(() => {
    if (myShop?.myShop?.domain && themesData?.getThemes && themesData.getThemes[0]?.id) {
      const urlEmbedApp = 'https://' + myShop?.myShop?.domain + '/admin/themes/' + themesData.getThemes[0].id + '/editor?context=apps';
      const urlEditTheme = 'https://' + myShop?.myShop?.domain + '/admin/themes/' + themesData.getThemes[0].id + '/editor';
      return {urlEmbedApp, urlEditTheme};
    }
    return {};
  }, [myShop, themesData]);

  return (
    <Card padding={0}>
      <Box padding={400}>
        <BlockStack gap={200}>
          <InlineGrid columns="1fr auto">
            <Text variant="headingMd" as="h2">Setup guide</Text>
            <Button
              variant="plain"
              onClick={() => handleToggle()}
              icon={<Icon source={open ? ChevronUpIcon : ChevronDownIcon} tone="base" />}
            />
          </InlineGrid>
          <Text variant="bodyMd">Use this guide to start customizing your Shopify theme with fresh sections and quickly enhance your store's UI/UX.</Text>

          <InlineStack>
            <div className={progress >= totalStep ? `step-complete` : `step-complete step-complete-padding-left`}>
              {
                progress >= totalStep
                ? <InlineStack>
                  <Icon source={CheckIcon} />
                  <Text variant="bodyMd">Done</Text>
                </InlineStack>
                : <Text variant="bodyMd">{progress} / {totalStep} completed</Text>
              }
            </div>
          </InlineStack>
        </BlockStack>
      </Box>
      <Box paddingInline={200} paddingBlockEnd={200} borderRadius={200}>
        <BlockStack gap={200}>
          <Collapsible
            open={open}
            id="guide"
            transition={{duration: '300ms', timingFunction: 'ease-in-out'}}
            expandOnPrint
          >
            <CollapsibleGuide
              options={{
                'id': 'step_1',
                'title': 'Enable the app embed in theme editor',
                'content': <Button variant='primary' url={urlEmbedApp} target="_blank">Go to themes</Button>,
                'demo': <Image source="https://sections.puco.io/images/general/enable-app.gif" />
              }}
              setProgress={setProgress}
              openChild={openChild}
              setOpenChild={setOpenChild}
            />
            <CollapsibleGuide
              options={{
                'id': 'step_2',
                'title': 'Install sections to theme',
                'content': <BlockStack gap={200}><List gap="100">
                    <List.Item>Find sections</List.Item>
                    <List.Item>Add sections to themes</List.Item>
                  </List>
                  <InlineStack gap={200}>
                    <Button onClick={handleRedirectSectionsPage}>Browse Sections</Button>
                    <Button onClick={handleRedirectGroupsPage}>Browse Groups</Button>
                  </InlineStack>
                </BlockStack>,
                'demo': <iframe width="100%" className='aspect-video' src="https://www.youtube.com/embed/vn9LHDsK3V8?si=Shj5GFPlR-0BWJUz" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
              }}
              setProgress={setProgress}
              openChild={openChild}
              setOpenChild={setOpenChild}
            />
            <CollapsibleGuide
              options={{
                'id': 'step_3',
                'title': 'Customize themes with the added sections',
                'content': <Button variant='primary' url={urlEditTheme} target="_blank">Go to theme editor</Button>,
                'demo': <Image source="https://sections.puco.io/images/general/enable-app.gif" />
              }}
              setProgress={setProgress}
              openChild={openChild}
              setOpenChild={setOpenChild}
            />
          </Collapsible>
        </BlockStack>
      </Box>
    </Card>
  );
}

export default memo(GuideCard);