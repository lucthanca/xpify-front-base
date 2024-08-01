import ProductList from '~/components/block/product/list';
import { memo } from 'react';
import Skeleton from '~/components/block/product/skeleton';

const SectionCollection = props => {
  const { items, refetch, loading, fetchNextPage } = props;

  if (loading) {
    return <Skeleton total={12} columns={{sm: 1, md: 2, lg: 4}}/>
  }
  return (
    <ProductList items={items ?? []} refetch={refetch} columns={{sm: 1, md: 2, lg: 4}} fetchNextPage={fetchNextPage} />
  );
};

export default memo(SectionCollection);
