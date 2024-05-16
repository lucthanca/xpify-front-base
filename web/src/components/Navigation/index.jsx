import { memo, useCallback, useEffect } from 'react';
import { NavigationMenu, useAppBridge } from '@shopify/app-bridge-react';
import { useNavigationLinks } from '~/components/Navigation/links';
import { Redirect } from '@shopify/app-bridge/actions';

const Nav = () => {
  const links = useNavigationLinks();
  const matcher = useCallback((link, location) => link.destination === location.pathname, []);
  const app = useAppBridge();
  const scrollToTop = () => {
    const c = document.documentElement.scrollTop || document.body.scrollTop;
    if (c > 0) {
      window.requestAnimationFrame(scrollToTop);
      window.scrollTo(0, c - c / 8);
    }
  };
  useEffect(() => {
    app.subscribe(Redirect.Action.APP, function(redirectData) {
      scrollToTop();
    });
  }, []);
  return <NavigationMenu navigationLinks={links} matcher={matcher} />;
};

export default memo(Nav);
