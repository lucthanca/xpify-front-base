import '~/assets/style.css';
import { memo } from "react";
import {
  Page,
  Layout
} from "@shopify/polaris";
import SectionCollection from '~/components/SectionCollection';

const SectionsPage = props => {
  return (
    <Page fullWidth>
      <Layout>
        <SectionCollection {...props} />
      </Layout>
    </Page>
  );
}

export default memo(SectionsPage);
