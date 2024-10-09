import { memo, useEffect, useState } from 'react';
import {
  BlockStack,
  Layout,
  Page,
} from '@shopify/polaris';
import Footer from '~/components/block/footer';
import { Loading } from '@shopify/app-bridge-react';
import './style.scss';
import { WelcomeMsg, Guide, Contact, Overview, RecentInstalled } from '~/components/hompage/blocks';

function HomePage() {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const handleReauthorization = () => {
      setLoading(true);
    };
    document.addEventListener('xpify:request-reauthorization', handleReauthorization);
    return () => {
      document.removeEventListener('xpify:request-reauthorization', handleReauthorization)
    };
  }, []);

  return (
    <>
      {loading && <Loading />}
      <Page title="Welcome to Omni Themes: Theme Sections!">
        <Layout>
          <Layout.Section>
            <BlockStack gap='600'>
              <WelcomeMsg />
              <Guide />
              <Contact />

              <Overview />
              <RecentInstalled />
              {/*<BestSeller />*/}
              {/*<LatestRelease />*/}
            </BlockStack>
          </Layout.Section>
        </Layout>
        <Footer hasCaughtUp={true} />
      </Page>
    </>
  )
}

export default memo(HomePage);
