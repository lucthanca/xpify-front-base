import { memo } from 'react';
import { Layout, Page } from '@shopify/polaris';
import GroupCollection from '~/components/SectionCollection';
import { SECTION_TYPE_GROUP } from '~/constants';

function GroupsPage() {
  return (
    <Page title="Section groups" fullWidth
          subtitle="Don't know where to start? Select a whole pack of solution for your store!">
      <div id="xpify_sections_footer">
        <Layout>
          <GroupCollection type={SECTION_TYPE_GROUP} />
        </Layout>
      </div>
    </Page>
);
}

export default memo(GroupsPage);
