
import { BlockStack, Text } from '@shopify/polaris';
import LazyProductCarousel from '~/components/LazyProductCarousel/carousel';
import { QUERY_SECTION_COLLECTION_KEY, SECTIONS_QUERY } from '~/queries/section-builder/product.gql';
import { Skeleton } from '~/components/product';
import { memo, useCallback, useState } from 'react';
import ProductCard from '~/components/product/card';

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
        lazyLoadImg={false}
      />
    );
  }, []);
  const [lazyProductCarouselVariablesProp] = useState(() => {
    return {
      filter: {
        category_id: [categoryId]
      }
    };
  });

  return (
    <BlockStack gap='200'>
      <Text variant="headingMd" as="h2">{name ?? 'N/A'}</Text>
      <LazyProductCarousel
        renderItem={renderProduct}
        fetchQuery={SECTIONS_QUERY}
        queryRootKey={QUERY_SECTION_COLLECTION_KEY}
        skeletonLoader={<Skeleton total={1} />}
        variables={lazyProductCarouselVariablesProp}
        pageSize={5} />
    </BlockStack>
  );
};

export default memo(CategoryItem);
