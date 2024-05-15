import '~/assets/style.css';
import { memo } from "react";
import {
  Page,
  Layout
} from "@shopify/polaris";
import SectionCollection from '~/components/SectionCollection';
import Footer from '~/components/block/footer';

const SectionsPage = props => {
  return (
    <Page title="Sections" fullWidth subtitle='Select your missing parts to complete your store!'>
      <Layout>
        <SectionCollection {...props} />
      </Layout>
      <Footer />
    </Page>
  );
}

export default memo(SectionsPage);
