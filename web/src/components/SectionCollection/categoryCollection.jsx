import { memo } from 'react';
import { useCategoryCollection } from '~/talons/category/useCategoryCollection';
import CategoryItem from './categoryItem';

const CategoryCollection = props => {
  const talonProps = useCategoryCollection();
  const {
    categories,
    error
  } = talonProps;

  return (
    <>
      {
        categories.length > 0 && categories.map(category => {
          if (!category?.id) return null;
          return <CategoryItem category={category} key={category.id} />
        })
      }
    </>
  );
};

export default memo(CategoryCollection);
