import NavigationMenu from "~/components/Navigation";
import Routes from "~/Routes";
import AuthProvider, {useAuthContext} from "~/context/auth";
import { useTranslation } from "react-i18next";
import { ShopifyLoadingFull } from "~/components/adapter/index.jsx";
import { Banner, Layout, Page } from "@shopify/polaris";
import { useLocation, useNavigate } from "react-router-dom";

const EnsureInstalled = ({ children }) => {
  const [{ redirectQuery, hasInstalled, loading, error }] = useAuthContext();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/exitIframe") return children;
  if (loading) return <ShopifyLoadingFull />;
  if (error) {
    return (
      <Page narrowWidth>
        <Layout>
          <Layout.Section>
            <div style={{ marginTop: "100px" }}>
              <Banner title={t('Error.UnknownError.heading')} children={t('Error.UnknownError.description')} status="critical" />
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
}
export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");

  return (
    <AuthProvider>
      <EnsureInstalled>
        <NavigationMenu />
        <Routes pages={pages} />
      </EnsureInstalled>
    </AuthProvider>
  );
}
