import { memo } from 'react';
import { useCategoryCollection } from '~/talons/category/useCategoryCollection';
import CategoryItem from './categoryItem';
import { Loading } from '@shopify/app-bridge-react';
import Pagination from '~/components/Pagination';
import Skeleton from './categoryItemShimmer';
import BannerError from '~/components/block/banner/alert';

const CategoryCollection = props => {
  const talonProps = useCategoryCollection();
  const {
    categories,
    error,
    pageInfo,
    handlePageChange,
    loading,
    loadingWithoutData,
  } = talonProps;
  if (loadingWithoutData) return <Skeleton itemNumber={4} />
  if (!loading && error) {
    const errs = error?.graphQLErrors ?? [{ message: error.message }];
    const bannerProps = {
      title: error.message,
      tone: 'critical',
      content: errs,
    };
    return <BannerError bannerAlert={bannerProps} />
  }

  return (
    <>
      {loading && <Loading />}
      {
        categories.length > 0 && categories.map(category => {
          if (!category?.id) return null;
          return <CategoryItem category={category} key={category.id} />
        })
      }
      {pageInfo && <Pagination onPageChange={handlePageChange} totalPages={pageInfo?.total_pages} currentPage={pageInfo?.current_page} />}
    </>
  );
};

export default memo(CategoryCollection);
