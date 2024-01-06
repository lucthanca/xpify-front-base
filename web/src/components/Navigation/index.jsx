import { memo, useCallback } from 'react';
import { NavigationMenu } from '@shopify/app-bridge-react';
import { useNavigationLinks } from '~/components/Navigation/links';

const Nav = () => {
  const links = useNavigationLinks();
  const matcher = useCallback((link, location) => link.destination === location.pathname, []);
  return <NavigationMenu navigationLinks={links} matcher={matcher} />;
};

export default memo(Nav);
