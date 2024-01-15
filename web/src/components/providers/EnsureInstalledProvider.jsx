import { memo } from 'react';
import { useAuthContext } from '~/context/auth.jsx';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShopifyLoadingFull } from '~/components/adapter/index.jsx';
import { Banner, Layout, Page } from '@shopify/polaris';

const EnsureInstalled = ({ children }) => {
  const [{ redirectQuery, hasInstalled, loading, error }] = useAuthContext();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

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
