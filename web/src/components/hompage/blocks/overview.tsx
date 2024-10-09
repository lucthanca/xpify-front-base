import {
  BlockStack,
  Card,
  InlineGrid,
  Text,
} from '@shopify/polaris';
import { useQuery } from '@apollo/client';
import { GET_SHOP_OVERVIEW_QUERY } from '~/queries/section-builder/shop.gql';
import { SkeletonBodyText } from '@shopify/polaris';
import type { GraphQlQueryResponse, Shop } from '~/@types';

const Overview = props => {
  const { data, loading, error } = useQuery<GraphQlQueryResponse<Shop>>(GET_SHOP_OVERVIEW_QUERY, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });
  const sectionCount = loading ? (
    <div style={{ width: '2rem' }}>
      <SkeletonBodyText lines={1} />
    </div>
  ) : (
    <Text as='p' variant='bodySm'>{data?.shop?.installed_sections?.length || 0}</Text>
  );
  const availableSectionsCount = loading ? (
    <div style={{ width: '2.5rem' }}>
      <SkeletonBodyText lines={1} />
    </div>
  ) : (
    <Text as='p' variant='bodySm'>{data?.shop.available_sections_count || 0}</Text>
  );
  return (
    <Card>
      <BlockStack gap='400'>
        <BlockStack>
          <Text as='h2' variant='headingSm'>Overview</Text>
          <Text as='p' variant='bodySm'>Statistics of sections you have installed.</Text>
        </BlockStack>
        <InlineGrid columns={{ xs: '1fr', md: '1fr 1fr' }} gap='200'>
          <Card>
            <BlockStack gap='200'>
              <Text as='h3' variant='headingXs'>Sections</Text>
              {sectionCount}
            </BlockStack>
          </Card>
          <Card>
            <BlockStack gap='200'>
              <Text as='h3' variant='headingXs'>Available Sections</Text>
              {availableSectionsCount}
            </BlockStack>
          </Card>
        </InlineGrid>
      </BlockStack>
    </Card>
  );
};

export default Overview;
