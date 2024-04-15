import { memo } from 'react';
import { Layout, Page } from '@shopify/polaris';
import GroupCollection from '~/components/GroupCollection';

function GroupsPage() {
  return (
    <Page fullWidth>
      <Layout>
        <GroupCollection />
      </Layout>
    </Page>
  );
}

export default memo(GroupsPage);
