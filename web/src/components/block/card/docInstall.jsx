import { memo } from "react";
import { BlockStack, Box, Button, Card, InlineGrid, Text, List } from "@shopify/polaris";

function DocInstall() {
  return (
    <Card title='Doc'>
        <Box>
          <Text variant="headingMd">How to add section your theme</Text>
          <Box padding="200">
            <Text fontWeight='bold'>1. Find sections:</Text>
            <List gap='100'>
              <List.Item>
                <Text>Our sections are organized in feature categories and have tags so that you can easily spot related ones. Make use of the Search & Filter below to quickly find out the best-fit sections for your theme.</Text>
              </List.Item>
            </List>

            <Text fontWeight='bold'>2. Purchase sections/ Add sections to themes: </Text>
            <List gap='100'>
              <List.Item>
                <Text>If you purchase a section, you will own it and can always access its updated version in the future regardless of the plan it is put in. Please use the "Purchase" button.</Text>
              </List.Item>
              <List.Item>
                <Text>You can add to themes as many of sections as you want, provided that they are included in your pricing plan. Please use the "Add to theme" button.</Text>
              </List.Item>
              <List.Item>
                <Text>If you are on a free plan, you can still access a lot of free sections in our collections. </Text>
              </List.Item>
            </List>

            <Text fontWeight='bold'>3. Customize themes with the added sections:</Text>
            <List gap='100'>
              <List.Item>
                <Text>Go to theme editor</Text>
              </List.Item>
              <List.Item>
                <Text>Navigate to the places you want to add sections</Text>
              </List.Item>
              <List.Item>
                <Text>Click "Add section" and look for "OT" in the search box</Text>
              </List.Item>
            </List>
          </Box>
        </Box>
      </Card>
  );
}

export default memo(DocInstall);