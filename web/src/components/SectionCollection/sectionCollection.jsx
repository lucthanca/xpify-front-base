import ProductList from '~/components/block/product/list';
import Pagination from '~/components/Pagination/pagination';
import { memo } from 'react';
import Skeleton from '~/components/block/product/skeleton';

const SectionCollection = props => {
  const { items, refetch, loading } = props;
  if (loading) {
    return <Skeleton total={12} columns={{sm: 1, md: 2, lg: 4}}/>
  }
  return (
    <>
      <ProductList items={items ?? []} refetch={refetch} columns={{sm: 1, md: 2, lg: 4}} />
      {/* <Pagination onPageChange={onPageChange} currentPage={currentPage} totalPages={totalPages} /> */}
    </>
  );
};

export default memo(SectionCollection);
