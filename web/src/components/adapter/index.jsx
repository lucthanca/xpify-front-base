import PropTypes from 'prop-types';
import App from '~/App';
import { memo } from 'react';
import { ApolloProvider } from '@apollo/client';
import { useAdapter } from '~/components/adapter/useAdapter';
import { PolarisProvider, AppBridgeProvider } from '~/components';
import { Loading } from '@shopify/app-bridge-react';
import { BrowserRouter } from 'react-router-dom';
import { Spinner } from '@shopify/polaris';

export const ShopifyLoadingFull = () => {
  return (
    <div className='grid grid-rows-1 justify-center h-fill-available items-center'>
      <Loading />
      <Spinner accessibilityLabel={'Loading'} />
    </div>
  );
};

const Adapter = props => {
  const talonProps = useAdapter(props);
  const { client, initialized } = talonProps;
  const loadingScreen = document.getElementById('otsb-app-loading');
  console.log('aasdasdasd');
  if (!initialized || !props.domain) {
    if (loadingScreen) return null;
    return <ShopifyLoadingFull />
    }

  if (loadingScreen) {
    loadingScreen.remove();
  }
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
};

Adapter.displayName = 'Adapter';
Adapter.propTypes = {
  origin: PropTypes.string.isRequired,
  domain: PropTypes.string,
};
const MemoizedAdapter = memo(Adapter);
const MainAdapter = props => {
  return (
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <MemoizedAdapter {...props} />
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
};
MainAdapter.propTypes = {
  origin: PropTypes.string.isRequired,
  domain: PropTypes.string,
};

export default memo(MainAdapter);
