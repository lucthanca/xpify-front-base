import { BlockStack, Button, Card, DataTable, Text } from '@shopify/polaris';

const RecentInstalled = props => {
  const fakeRows = [
    ['Section 1', 'Section', 'Theme 1, Theme 2', <Button>Edit</Button>],
    ['Section 2', 'Section', 'Theme 1, Theme 2', ''],
    ['Section 3', 'Section', 'Theme 1, Theme 2', ''],
    ['Section 4', 'Section', 'Theme 1, Theme 2', ''],
    ['Section 5', 'Section', 'Theme 1, Theme 2', ''],
  ]
  return (
    <Card>
      <BlockStack>
        <Text as="h2" variant="headingSm">Recent installed</Text>

        <DataTable columnContentTypes={[
          'text',
          'text',
          'text',
          'numeric',
        ]} headings={[
          'Name', 'Type', 'Installed theme', ''
        ]} rows={fakeRows}></DataTable>
      </BlockStack>
    </Card>
  );
};

export default RecentInstalled;
