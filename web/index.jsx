import './index.css';
import { createRoot } from 'react-dom/client';
import Adapter from './src/components/adapter';
import { initI18n } from '~/utils/i18nUtils';

const shopDomain = new URLSearchParams(window.location.search).get('shop');

// Ensure that locales are loaded before rendering the app
initI18n().then(() => {
  const container = document.getElementById('app');
  const root = createRoot(container);
  root.render(<Adapter domain={shopDomain} origin={window.location.origin} />);
});
