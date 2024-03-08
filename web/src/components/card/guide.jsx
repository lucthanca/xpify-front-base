import { BlockStack, Box, Button, Card, Collapsible, Icon, Image, InlineGrid, InlineStack, ProgressBar, Text } from "@shopify/polaris";
import { memo, useCallback, useState } from "react";
import {
  ChevronUpIcon,
  ChevronDownIcon
} from '@shopify/polaris-icons';

import CollapsibleGuide from "~/components/collapsible/guide";

const totalStep = 3;

function GuideCard() {
  const [open, setOpen] = useState(true);
  const [openChild, setOpenChild] = useState([]);
  const [progress, setProgress] = useState(0);

  const handleToggle = useCallback(() => setOpen((open) => !open), []);

  return (
    <Card padding={0}>
      <Box padding={400}>
        <BlockStack gap={200}>
          <InlineGrid columns="1fr auto">
            <Text variant="headingMd">Setup guide</Text>
            <Button
              variant="plain"
              onClick={() => handleToggle()}
              icon={<Icon source={open ? ChevronUpIcon : ChevronDownIcon} tone="base" />}
            />
          </InlineGrid>
          <Text variant="bodySm">Only {totalStep} simple steps to add any sections & blocks to your theme</Text>

          <InlineStack>
            <div className="step-complete">
              <Text variant="bodyMd">
                {
                  progress === totalStep
                  ? `Done`
                  : `${progress} / ${totalStep} completed`
                }
                </Text>
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
                'title': 'Step 1',
                'content': 'By giving values to a key, this technique is used to store objects in localStorage. This value can be of any datatype, including text, integer, object, array, and so on.'
              }}
              setProgress={setProgress}
              openChild={openChild}
              setOpenChild={setOpenChild}
            />
            <CollapsibleGuide
              options={{
                'id': 'step_2',
                'title': 'Step 2',
                'content': 'By giving values to a key',
                'image': <Image source="https://sections.puco.io/images/general/enable-app.gif" />
              }}
              setProgress={setProgress}
              openChild={openChild}
              setOpenChild={setOpenChild}
            />
            <CollapsibleGuide
              options={{
                'id': 'step_3',
                'title': 'Step 3',
                'content': 'This value can be of any datatype'
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