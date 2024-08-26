import '~/assets/style.css';
import { memo } from "react";
import {
  Page,
  Layout
} from "@shopify/polaris";
import SectionCollection from '~/components/SectionCollection';
import { SECTION_TYPE_SIMPLE } from '~/constants';

const SectionsPage = props => {
  return (
    <Page title='Sections' fullWidth subtitle='Select your missing parts to complete your store!'>
      <div id='xpify_sections_footer'>
        <Layout>
          <SectionCollection type={SECTION_TYPE_SIMPLE} {...props} />
        </Layout>
      </div>
    </Page>
  );
};

export default memo(SectionsPage);
