import { memo, useCallback, useMemo, useState } from "react";
import {
  BlockStack,
  Box,
  Button,
  Card,
  Collapsible,
  Icon,
  InlineGrid,
  InlineStack,
  List,
  Text,
  Tooltip,
} from '@shopify/polaris';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  CheckIcon, XIcon,
} from '@shopify/polaris-icons';
import CollapsibleGuide from "~/components/block/collapsible/guide";
import { useQuery } from "@apollo/client";
import { THEMES_QUERY } from "~/queries/section-builder/theme.gql";
import { useRedirectGroupsPage, useRedirectSectionsPage } from "~/hooks/section-builder/redirect";
import LazyLoadImage from '~/components/block/image';
import { useDismiss } from '~/talons/useDismiss';
import DismissedCard from '~/components/hompage/blocks/dismissed';
import { DottedCircleIcon } from '~/assets/dottedCircle';

const totalStep = 3;

function GuideCard() {
  const [blockId] = useState('home_guide_step');
  const [open, setOpen] = useState(true);
  const [openChild, setOpenChild] = useState([]);
  const [progress, setProgress] = useState(0);
  const handleToggle = useCallback(() => setOpen((open) => !open), []);
  const handleRedirectSectionsPage = useRedirectSectionsPage();
  const handleRedirectGroupsPage = useRedirectGroupsPage();
  const { isDismissed, loading, shop, dismissTriggered, undo, dismiss, loadingWithoutCache } = useDismiss(blockId);

  const { data:themesData } = useQuery(THEMES_QUERY, {
    fetchPolicy: "cache-and-network"
  });

  const { urlEmbedApp, urlEditTheme } = useMemo(() => {
    if (shop?.domain && themesData?.getThemes && themesData.getThemes[0]?.id) {
      const urlEmbedApp = 'https://' + shop.domain + '/admin/themes/' + themesData.getThemes[0].id + '/editor?context=apps';
      const urlEditTheme = 'https://' + shop.domain + '/admin/themes/' + themesData.getThemes[0].id + '/editor';
      return {urlEmbedApp, urlEditTheme};
    }
    return {};
  }, [shop, themesData]);

  if (loadingWithoutCache) return (
    <Card padding='0'>
      <Box padding='400' paddingBlockEnd='200'>
        <BlockStack gap='200'>
          <InlineGrid columns='1fr auto'>
            <Text variant='headingMd' as='h2'>
              Setup guide
            </Text>
          </InlineGrid>
          <Text variant='bodyMd' as='p'>
            Use this guide to start customizing your Shopify theme with fresh sections and quickly enhance your store's UI/UX.
          </Text>

          <InlineStack>
            <span style={{ height: '22px', width: '7rem',background:'var(--p-color-bg-fill-tertiary)',borderRadius:'0.25rem' }}></span>
          </InlineStack>
        </BlockStack>
      </Box>
      <Box paddingInline='200' paddingBlockEnd='200' borderRadius='200'>
        <BlockStack gap="200">
          <div className="bss-setup-guide">
            <Box padding="200" borderRadius="200">
              <div className="grid-guide">
                <Tooltip content={'Mark as done'}>
                  <Button
                    size="large"
                    variant="plain"
                    icon={<DottedCircleIcon width="20" height="20" className="dotted-icon" />}
                  />
                </Tooltip>
                <InlineStack>
                  <div className="title-collapsible">
                    <InlineStack gap="200">
                      <Text as="p" variant="bodyMd">Enable the app embed in theme editor</Text>
                    </InlineStack>
                  </div>
                </InlineStack>
              </div>
            </Box>
          </div>
          <div className="bss-setup-guide">
            <Box padding="200" borderRadius="200">
              <div className="grid-guide">
                <Tooltip content={'Mark as done'}>
                  <Button
                    size="large"
                    variant="plain"
                    icon={<DottedCircleIcon width="20" height="20" className="dotted-icon" />}
                  />
                </Tooltip>
                <InlineStack>
                  <div className="title-collapsible">
                    <InlineStack gap="200">
                      <Text as="p" variant="bodyMd">Install sections to theme</Text>
                    </InlineStack>
                  </div>
                </InlineStack>
              </div>
            </Box>
          </div>
          <div className="bss-setup-guide">
            <Box padding="200" borderRadius="200">
              <div className="grid-guide">
                <Tooltip content={'Mark as done'}>
                  <Button
                    size="large"
                    variant="plain"
                    icon={<DottedCircleIcon width="20" height="20" className="dotted-icon" />}
                  />
                </Tooltip>
                <InlineStack>
                  <div className="title-collapsible">
                    <InlineStack gap="200">
                      <Text as="p" variant="bodyMd">Customize themes with the added sections</Text>
                    </InlineStack>
                  </div>
                </InlineStack>
              </div>
            </Box>
          </div>
        </BlockStack>
      </Box>
    </Card>
  );
  if (dismissTriggered) return <DismissedCard onUndo={undo} />;
  if (isDismissed) return null;
  return (
    <Card padding="0">
      <div className="xpify_dismissible_content">
        <Box padding="400" paddingBlockEnd="200">
          <BlockStack gap="200">
            <InlineGrid columns="1fr auto">
              <Text variant="headingMd" as="h2">
                Setup guide
              </Text>
              <Box position="absolute" insetBlockStart="300" insetInlineEnd="300" zIndex="1">
                <div className="xpify-close-btn">
                  <InlineStack wrap={false} gap="200">
                    <button type="button" className="xpify_dismiss" aria-label="Dismiss" onClick={dismiss}>
                      <Icon source={XIcon} />
                    </button>
                    <button type="button" className='xpify_dismiss' onClick={handleToggle} aria-label="Expand guide" aria-expanded={open} aria-controls="guide-setup_guide">
                    <Icon source={open ? ChevronUpIcon : ChevronDownIcon} />
                  </button>
                </InlineStack>
              </div>
            </Box>
          </InlineGrid>
          <Text variant='bodyMd' as='p'>
            Use this guide to start customizing your Shopify theme with fresh sections and quickly enhance your store's UI/UX.
          </Text>

          <InlineStack>
            <div className={progress >= totalStep ? `step-complete` : `step-complete step-complete-padding-left`}>
              {progress >= totalStep ? (
                <InlineStack>
                  <Icon source={CheckIcon} />
                  <Text variant='bodyMd' as='span'>Done</Text>
                </InlineStack>
              ) : (
                <Text variant='bodyMd' as='span'>
                  {progress} / {totalStep} completed
                </Text>
              )}
            </div>
          </InlineStack>
        </BlockStack>
      </Box>
      <Box paddingInline='200' paddingBlockEnd='200' borderRadius='200'>
        <BlockStack gap='200'>
          <Collapsible open={open} id='guide' transition={{ duration: '300ms', timingFunction: 'ease-in-out' }} expandOnPrint>
            <CollapsibleGuide
              options={{
                id: 'step_1',
                title: 'Enable the app embed in theme editor',
                content: <Button variant='primary' url={urlEmbedApp} target='_blank'>Go to themes</Button>,
                demo: <LazyLoadImage src={'https://api.omnithemes.com/media/section_builder/image/guide_enable_app_embed.gif'} />,
              }}
              setProgress={setProgress}
              openChild={openChild}
              setOpenChild={setOpenChild}
            />
            <CollapsibleGuide
              options={{
                id: 'step_2',
                title: 'Install sections to theme',
                content: (
                  <BlockStack gap='200'>
                    <List gap='100'>
                      <List.Item>Find sections</List.Item>
                      <List.Item>Add sections to themes</List.Item>
                    </List>
                    <InlineStack gap='200'>
                      <Button onClick={handleRedirectSectionsPage}>Browse Sections</Button>
                      <Button onClick={handleRedirectGroupsPage}>Browse Groups</Button>
                    </InlineStack>
                  </BlockStack>
                ),
              }}
              setProgress={setProgress}
              openChild={openChild}
              setOpenChild={setOpenChild}
            />
            <CollapsibleGuide
              options={{
                id: 'step_3',
                title: 'Customize themes with the added sections',
                content: <Button variant='primary' url={urlEditTheme} target='_blank'>Go to theme editor</Button>,
                demo: <LazyLoadImage src='https://api.omnithemes.com/media/section_builder/image/guide_add_section.gif' />,
              }}
              setProgress={setProgress}
              openChild={openChild}
              setOpenChild={setOpenChild}
            />
          </Collapsible>
        </BlockStack>
      </Box>
      </div>
    </Card>
  );
}

export default memo(GuideCard);
