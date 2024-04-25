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
    <Page fullWidth>
      <Layout>
        <SectionCollection {...props} />
        <div className='mb-14 w-full' />
      </Layout>
      <Footer />
    </Page>
  );
}

export default memo(SectionsPage);
