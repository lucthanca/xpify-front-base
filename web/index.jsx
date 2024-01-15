import ReactDOM from 'react-dom';
import Adapter from './src/components/adapter';
import { initI18n } from '~/utils/i18nUtils';
import './index.css';

const shopDomain = new URLSearchParams(window.location.search).get('shop');

// Ensure that locales are loaded before rendering the app
initI18n().then(() => {
  ReactDOM.render(<Adapter domain={shopDomain} origin={process.env.XPIFY_BACKEND_URL} />, document.getElementById('app'));
});
