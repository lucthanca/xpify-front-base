import { memo } from 'react';
import { Layout, Page } from '@shopify/polaris';
import GroupCollection from '~/components/GroupCollection';
import Footer from '~/components/block/footer';

function GroupsPage() {
  return (
    <Page title="Section groups" fullWidth subtitle="Don't know where to start? Select a whole pack of solution for your store!">
      <Layout>
        <GroupCollection />
      </Layout>
      <Footer />
    </Page>
  );
}

export default memo(GroupsPage);
