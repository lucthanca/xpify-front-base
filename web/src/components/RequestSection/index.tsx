import { memo } from "react";
import { Box } from "@shopify/polaris";
import AllCaughtUp from '~/components/AllCaughtUp';
import { useFreshChat } from '~/components/providers/freshchat';

function RequestSection() {
  const { open: openChat } = useFreshChat();
  const textContent = (
    <p>
      Request a section? please email at <a href='mailto:support@omnithemes.com' target="_blank" className='text-blue-400 hover:underline'>support@omnithemes.com</a> - or - <span className='cursor-pointer text-blue-400 hover:underline' onClick={openChat}>chat with us</span>
    </p>
  );
  return (
    <Box paddingBlockEnd='600' paddingBlockStart='600'>
      <AllCaughtUp text={textContent} />
    </Box>
  );
}

export default memo(RequestSection);
