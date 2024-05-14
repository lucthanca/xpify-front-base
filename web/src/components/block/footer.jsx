import { memo } from "react";
import {
  Box
} from "@shopify/polaris";
import AllCaughtUp from '~/components/AllCaughtUp';

function Footer({ hasCaughtUp }) {
  return (
    <Box paddingBlockEnd='600' paddingBlockStart={hasCaughtUp ? '600' : '0'}>
      {hasCaughtUp && <AllCaughtUp />}
    </Box>
  );
}

export default memo(Footer);
