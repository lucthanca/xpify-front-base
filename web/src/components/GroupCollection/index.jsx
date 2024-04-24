import { memo } from 'react';
import { Card, Layout } from '@shopify/polaris';
import SectionListing from '~/components/SectionCollection/sectionListing';

const GroupCollection = props => {
  return (
    <>
      <Layout.Section>
        <Card padding='400'>
          <SectionListing />
        </Card>
      </Layout.Section>
    </>
  );
};

export default memo(GroupCollection);
