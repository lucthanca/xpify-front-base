import NavigationMenu from "~/components/Navigation";
import Routes from "~/Routes";
import AuthProvider from "~/context/auth";
import { EnsureInstalledProvider, FreshChat } from "~/components/providers";
import { useEffect } from 'react';
import { logAllInteractions } from '~/utils/onInteraction';

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");

  useEffect(() => {
    logAllInteractions();
  }, [])
  return (
    <AuthProvider>
      <EnsureInstalledProvider>
        <FreshChat>
          <NavigationMenu />
          <Routes pages={pages} />
        </FreshChat>
      </EnsureInstalledProvider>
    </AuthProvider>
  );
}
