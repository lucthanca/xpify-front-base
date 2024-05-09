import ProductList from '~/components/block/product/list';
import { memo } from 'react';
import Skeleton from '~/components/block/product/skeleton';

const SectionCollection = props => {
  const { items, onPageChange, currentPage, totalPages, loading } = props;
  if (loading) {
    return <Skeleton total={12} columns={{sm: 1, md: 2, lg: 4}}/>
  }
  return (
    <>
      <ProductList items={items ?? []} columns={{sm: 1, md: 2, lg: 4}} />
    </>
  );
};

export default memo(SectionCollection);
