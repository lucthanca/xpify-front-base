import { Box, Icon, InlineStack } from '@shopify/polaris';
import { XIcon } from '@shopify/polaris-icons';

export const CloseBtn = ({ dismiss }: { dismiss: () => void }) => {
  return (
    <Box position='absolute' insetBlockStart='300' insetInlineEnd='300' zIndex='1'>
      <div className="xpify-close-btn">
        <InlineStack wrap={false} gap='200'>
          <button type='button' className='xpify_dismiss' aria-label="Dismiss" onClick={dismiss}>
            <Icon source={XIcon} />
          </button>
        </InlineStack>
      </div>
    </Box>
  );
};
