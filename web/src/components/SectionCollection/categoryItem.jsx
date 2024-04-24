
import { BlockStack, Text } from '@shopify/polaris';
import LazyProductCarousel from '~/components/LazyProductCarousel/carousel';
import { QUERY_SECTION_COLLECTION_KEY, SECTIONS_QUERY } from '~/queries/section-builder/product.gql';
import { Skeleton } from '~/components/block/product';
import { memo, useCallback, useState } from 'react';
import ProductCard from '~/components/block/product/card';
import { useSectionType } from '~/hooks/useSectionType';

/**
 * @typedef {object} CategoryItemProps
 * @property {string} categoryId
 */

/**
 * @param {CategoryItemProps} props
 * @returns {Element}
 * @constructor
 */
const CategoryItem = props => {
  const { category = {} } = props;
  const { id: categoryId, name } = category;
  const renderProduct = useCallback((item) => {
    return (
      <ProductCard
        key={item.id}
        item={item}
      />
    );
  }, []);
  const { sectionType } = useSectionType();
  const [lazyProductCarouselVariablesProp] = useState(() => {
    return {
      filter: {
        category_id: [categoryId],
        type_id: sectionType.sectionType,
        owned: sectionType.isOwned,
      }
    };
  });

  const SkeletonLoader = (
    <div className='sliderItemCardRoot'>
      <Skeleton total={1} />
    </div>
  );

  return (
    <>
      <Text variant='headingMd' as='h2'>
        {name ?? 'N/A'}
      </Text>
      <LazyProductCarousel
        renderItem={renderProduct}
        fetchQuery={SECTIONS_QUERY}
        queryRootKey={QUERY_SECTION_COLLECTION_KEY}
        skeletonLoader={SkeletonLoader}
        variables={lazyProductCarouselVariablesProp}
        pageSize={5}
      />
    </>
  );
};

export default memo(CategoryItem);
