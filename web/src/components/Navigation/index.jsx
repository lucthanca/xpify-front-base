import { memo, useCallback, useEffect, useState } from 'react';
import { NavigationMenu, useAppBridge } from '@shopify/app-bridge-react';
import { useNavigationLinks } from '~/components/Navigation/links';
import { Redirect } from '@shopify/app-bridge/actions';

const Nav = () => {
  const links = useNavigationLinks();
  const [stateLinks, setStateLinks] = useState(links);
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
      //scrollToTop();
      window.scrollTo(0, 0);
    });
  }, []);

  useEffect(() => {
    const removeNavs = () => {
      setStateLinks([]);
    };
    document.addEventListener('xpify:request-reauthorization', removeNavs);
    return () => {
      document.removeEventListener('xpify:request-reauthorization', removeNavs)
    };
  }, []);
  return <NavigationMenu navigationLinks={stateLinks} matcher={matcher} />;
};

export default memo(Nav);
