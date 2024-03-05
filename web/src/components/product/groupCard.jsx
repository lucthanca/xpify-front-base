import { BlockStack, Box, Card, InlineGrid, InlineStack, Layout, Page, Text } from "@shopify/polaris";
import { memo, useState } from 'react';
import {useNavigate} from '@shopify/app-bridge-react';

function GroupCard({item, columns}) {
  console.log('re-render-groupCard');
  const navigate = useNavigate();

  return (
    <Box>
      <InlineGrid columns={columns} gap={400}>
        <div className='pointer' onClick={() => {navigate(`/group/${item.url_key}`)}}>
          <Card padding={0}>
            <img
              src={item.images[0]?.src}
              alt={item.name}
            />

            <Box background="bg-surface-secondary" padding="400">
              <InlineStack align='space-between'>
                <Text variant="headingMd" as="h2">{item.name}</Text>
                <Text variant="bodyLg" as="p">${item.price}</Text>
              </InlineStack>
            </Box>
          </Card>
        </div>
      </InlineGrid>
    </Box>
  );
}

export default memo(GroupCard);