import { memo, useEffect } from 'react';
import { useAuthContext } from '~/context/auth.jsx';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShopifyLoadingFull } from '~/components/adapter/index.jsx';
import { Banner, Layout, Page } from '@shopify/polaris';
import storage from '~/utils/storage';
import { useApolloClient } from '@apollo/client';

const EnsureInstalled = ({ children }) => {
  const [{ redirectQuery, hasInstalled, loading, error, dataVersion }] = useAuthContext();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const client = useApolloClient();

  useEffect(() => {
    if (loading) return;
    if (!dataVersion) return;
    // load data version from storage
    const currentVersion = storage.getItem('x-sb-data-version');
    if (!currentVersion || currentVersion !== dataVersion) {
      client.resetStore();
      storage.setItem('x-sb-data-version', dataVersion);
    }
  }, [loading, dataVersion]);

  if (location.pathname === '/exitIframe') return children;
  if (loading) return <ShopifyLoadingFull />;
  if (error) {
    return (
      <Page narrowWidth>
        <Layout>
          <Layout.Section>
            <div style={{ marginTop: '100px' }}>
              <Banner title={t('Error.UnknownError.heading')} children={t('Error.UnknownError.description')} status='critical' />
            </div>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
  if (!hasInstalled) {
    navigate(`/exitIframe?${redirectQuery}`);
    return null;
  }
  return children;
};

export default memo(EnsureInstalled);
