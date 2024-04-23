import { memo, useCallback, useMemo } from 'react';
import { Divider, InlineStack, Text, Pagination as PolarisPagination } from '@shopify/polaris';
import PaginationItem from './item';
import PropTypes from 'prop-types';
import { useScrollToTop } from '~/hooks/section-builder/redirect';

const Pagination = props => {
  const { currentPage, onPageChange, totalPages } = props;

  const paginationItems = useMemo(() => {
    const items = Array.from({ length: totalPages }, (_, i) => {
      const baseClass = {};
      if (currentPage !== i + 1) {
        baseClass.underline = true;
        baseClass.cursorPointer = true;
      }
      return <PaginationItem key={i} page={i + 1} className={baseClass} onPageChange={onPageChange} />;
    });
    return <InlineStack gap='100'>{items}</InlineStack>
  }, [totalPages, currentPage]);
  const handleNextPage = useCallback(() => {
    onPageChange && onPageChange(currentPage + 1);
    useScrollToTop();
  }, [currentPage]);
  const handlePrevPage = useCallback(() => {
    onPageChange && onPageChange(currentPage - 1);
    useScrollToTop();
  }, [currentPage]);
  const hasNext = useMemo(() => currentPage < totalPages, [totalPages, currentPage]);
  const hasPrev = useMemo(() => currentPage > 1, [currentPage]);
  const shouldRenderPagination = useMemo(() => totalPages > 1, [totalPages]);
  if (!shouldRenderPagination) return null;
  return (
    <>
      <Divider />
      <InlineStack align='space-between' blockAlign={'center'}>
        <Text as='div' children={`Page ${currentPage} of ${totalPages}`} />
        <PolarisPagination
          onPrevious={handlePrevPage}
          onNext={handleNextPage}
          type="page"
          hasNext={hasNext}
          // label={paginationItems}
          hasPrevious={hasPrev}
        />
      </InlineStack>
    </>
  );
};

Pagination.propTypes = {
  onPageChange: PropTypes.func,
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
};

export default memo(Pagination);
