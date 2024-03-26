import { memo } from 'react';
import { useCategoryCollection } from '~/talons/category/useCategoryCollection.js';

const CategoryCollection = props => {
  const talonProps = useCategoryCollection();

  return null;
};

export default memo(CategoryCollection);
