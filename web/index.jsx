import { createRoot } from 'react-dom/client';
import Adapter from './src/components/adapter';
import { initI18n } from '~/utils/i18nUtils';
import './index.css';

const shopDomain = new URLSearchParams(window.location.search).get('shop');

// Ensure that locales are loaded before rendering the app
initI18n().then(() => {
  const container = document.getElementById('app');
  const root = createRoot(container);
  root.render(<Adapter domain={shopDomain} origin={process.env.XPIFY_BACKEND_URL} />);
});
