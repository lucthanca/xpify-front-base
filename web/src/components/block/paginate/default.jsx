import { memo, useCallback } from 'react';
import { Icon } from '@shopify/polaris';
import {
  ChevronRightIcon,
  ChevronLeftIcon
} from '@shopify/polaris-icons';
import PropTypes from 'prop-types';

const PaginateItem = memo(({ selected, onPageSelect, pageNumber }) => {
  const handlePageSelect = useCallback(() => onPageSelect && onPageSelect(pageNumber), [pageNumber]);
  console.log({ pageNumber });
  return (
    <li className={selected ? 'selected' : ''}>
      <a role='button' aria-label='' onClick={!selected ? handlePageSelect : undefined}>{pageNumber}</a>
    </li>
  );
});

PaginateItem.displayName = 'PaginateItem';
PaginateItem.propTypes = {
  selected: PropTypes.bool,
  onPageSelect: PropTypes.func,
  pageNumber: PropTypes.number,
}

function Default({ pageInfo, currentPage, setCurrentPage }) {
  if (!pageInfo.current_page || pageInfo.total_pages <= 1) {
    return null;
  }
  const handlePrevPage = useCallback(() => setCurrentPage(prevState => prevState - 1), []);
  const handleNextPage = useCallback(() => setCurrentPage(prevState => prevState + 1), []);
  const handlePageSelected = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  return (
    <div className='section-builder-paginate'>
      <ul role='navigation' aria-label='Pagination'>
        <li className={currentPage == 1 ? 'disabled' : ''}>
          <a role='button' aria-disabled={currentPage == 1} aria-label='Previous' onClick={handlePrevPage}>
            <Icon source={ChevronLeftIcon} tone='base' />
          </a>
        </li>
        {[...Array(pageInfo.total_pages)].map((_, i) => {
          const page = i + 1;
          return <PaginateItem key={i} selected={parseInt(currentPage) === page} onPageSelect={handlePageSelected} pageNumber={page} />
        })}
        <li className={currentPage == pageInfo.total_pages ? 'disabled' : ''}>
          <a role='button' aria-disabled={currentPage == pageInfo.total_pages} aria-label='Next' onClick={handleNextPage}>
            <Icon source={ChevronRightIcon} tone='base' />
          </a>
        </li>
      </ul>
    </div>
  );
}

export default memo(Default);
