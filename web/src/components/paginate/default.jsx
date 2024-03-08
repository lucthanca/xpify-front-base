import { memo, useCallback } from 'react';
import {
  ChevronRightIcon,
  ChevronLeftIcon
} from '@shopify/polaris-icons';
import { Icon } from '@shopify/polaris';

function Default({pageInfo, currentPage, setCurrentPage}) {
  if (!pageInfo.current_page || pageInfo.total_pages <= 1) {
    return <></>;
  }

  const listItems = [];
  for (let i = 1; i <= pageInfo.total_pages; i++) {
    listItems.push(
      <li key={i} className={pageInfo.current_page == i ? 'selected' : ''}>
        <a role="button" aria-label="" onClick={() => handleChangePage(i)}>{i}</a>
      </li>
    );
  }

  const handleChangePage = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo(0,0);
  }, []);
  const handlePrevPage = useCallback(() => setCurrentPage(
    (prevState) => prevState - 1
  ),[]);
  const handleNextPage = useCallback(() => setCurrentPage(
    (prevState) => prevState + 1
  ),[]);

  return (
    <div className="section-builder-paginate">
      <ul role="navigation" aria-label="Pagination">
        <li className={currentPage == 1 ? "disabled" : ""}>
          <a role="button" aria-disabled={currentPage == 1} aria-label="Previous" onClick={() => handlePrevPage()}>
            <Icon
              source={ChevronLeftIcon}
              tone="base"
            />
          </a>
        </li>
        {listItems}
        <li className={currentPage == pageInfo.total_pages ? "disabled" : ""}>
          <a role="button" aria-disabled={currentPage == pageInfo.total_pages} aria-label="Next" onClick={() => handleNextPage()}>
            <Icon
              source={ChevronRightIcon}
              tone="base"
            />
          </a>
        </li>
      </ul>
    </div>
  );
}

export default memo(Default);