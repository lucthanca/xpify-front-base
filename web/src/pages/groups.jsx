import { memo } from 'react';
import { Layout, Page } from '@shopify/polaris';
import GroupCollection from '~/components/GroupCollection';
import Footer from '~/components/block/footer';

function GroupsPage() {
  return (
    <Page fullWidth>
      <Layout>
        <GroupCollection />
        <div className='mb-14 w-full' />
      </Layout>
      <Footer />
    </Page>
  );
}

export default memo(GroupsPage);
