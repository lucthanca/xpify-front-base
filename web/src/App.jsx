import NavigationMenu from "~/components/Navigation";
import Routes from "~/Routes";
import UserProvider from "~/context/user.tsx";
// import AuthProvider from "~/context/auth";
import {
  // EnsureInstalledProvider,
  FreshChat,
} from "~/components/providers";
import { useEffect } from 'react';
import { logAllInteractions } from '~/utils/onInteraction';
import { logAllCLSReports } from '~/hooks/use-cls';

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");

  useEffect(() => {
    logAllInteractions();
    logAllCLSReports();
  }, [])
  return (
    // <AuthProvider>
    //   <EnsureInstalledProvider>
    <UserProvider>
      <FreshChat>
        <NavigationMenu />
        <Routes pages={pages} />
      </FreshChat>
    </UserProvider>
    //   </EnsureInstalledProvider>
    // </AuthProvider>
  );
}
