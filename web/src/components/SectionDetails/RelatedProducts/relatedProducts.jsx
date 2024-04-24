import React, { memo, useMemo } from 'react';
import { BlockStack, Card, Text, Box } from '@shopify/polaris';
import ProductCarousel from '~/components/ProductCarousel';
import SkeletonProduct from '~/components/block/product/skeleton';
import { SECTIONS_QUERY, QUERY_SECTION_COLLECTION_KEY, RELATED_SECTIONS_QUERY } from '~/queries/section-builder/product.gql';
import { useRelatedProducts } from '~/talons/relatedProducts/useRelatedProducts';

const RelatedProducts = props => {
  const type = !props.section?.child_ids ? 'Sections' : 'Groups';
  const variables = {
    key: props.section.url_key
  };
  const { slideOptions, slidePerPage } = useRelatedProducts();
  const skeleton = useMemo(() => {
    return (
      <Box paddingBlockStart='200'>
        <SkeletonProduct total={slidePerPage} columns={{ sm: 1, md: 2 }} />
      </Box>
    );
  }, [slidePerPage]);
  // should render error when error is not null
  return (
    <ProductCarousel
      query={RELATED_SECTIONS_QUERY}
      queryKey={'getRelatedSections'}
      queryVariables={variables}
      slideOptions={slideOptions}
      skeleton={skeleton}
      title={"Recommended " + type}
      //subTitle="Refer to a few other related products"
    />
  );
};

export default memo(RelatedProducts);
