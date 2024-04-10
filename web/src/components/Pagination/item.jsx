import { memo, useCallback } from 'react';
import { Box, Text } from '@shopify/polaris';
const PaginationItem = ({ page, className, onPageChange }) => {
  const handlePageClick = useCallback(() => {
    if (onPageChange) onPageChange(page);
  }, [onPageChange]);
  return (
    <div className={Object.keys(className).join(' ')} onClick={handlePageClick}>
      <Box paddingInline='200' paddingBlockStart='100' paddingBlockEnd='100'>
        <Text as='span'>{page}</Text>
      </Box>
    </div>
  );
};

export default memo(PaginationItem);
