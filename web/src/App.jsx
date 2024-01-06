import NavigationMenu from "~/components/Navigation";
import Routes from "~/Routes";

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");

  return (
    <>
      <NavigationMenu />
      <Routes pages={pages} />
    </>
  );
}
