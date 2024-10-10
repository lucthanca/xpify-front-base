import { BlockStack, Button, Card, DataTable, Text, Icon, SkeletonBodyText } from '@shopify/polaris';
import { EditIcon } from '@shopify/polaris-icons';
import { useQuery } from '@apollo/client';
import { GET_SHOP_RECENT_INSTALLED_QUERY } from '~/queries/section-builder/shop.gql';
import { GraphQlQueryResponse, Shop } from '~/@types';
import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const RecentInstalled = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data, loading, error } = useQuery<GraphQlQueryResponse<Shop>>(GET_SHOP_RECENT_INSTALLED_QUERY, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });
  const [typeIdMap] = useState<{[key: string]: string}>({
    '1': 'Section',
    '2': 'Group',
  });

  const loadingWithoutData = loading && !data;

  const sectionRows = useMemo(() => {
    if (loadingWithoutData) {
      return Array.from({ length: 10 }).map((_, index) => [
        <div style={{ minHeight: '28px', display: 'flex', alignItems: 'center', maxWidth: `${Math.floor(Math.random() * (10 - 4 + 1)) + 4}rem` }}><SkeletonBodyText key={index} lines={1} /></div>,
        <div style={{ minHeight: '28px', display: 'flex', alignItems: 'center', maxWidth: `${Math.floor(Math.random() * (5 - 3 + 1)) + 3}rem` }}><SkeletonBodyText key={index} lines={1} /></div>,
        <div style={{ minHeight: '28px', display: 'flex', alignItems: 'center', maxWidth: `${Math.floor(Math.random() * (20 - 4 + 1)) + 4}rem` }}><SkeletonBodyText key={index} lines={1} /></div>,
        <div style={{ minHeight: '28px', display: 'flex', alignItems: 'center', maxWidth: '28px' }}><SkeletonBodyText key={index} lines={1} /></div>,
      ]);
    }
    const sections = data?.shop?.installed_sections?.items ?? [];
    return sections.map((item) => [
      item.section.name,
      typeIdMap[item.section.type_id],
      item?.theme?.name ?? 'Unknown',
      <Button onClick={() => {
        const targetpath = item.section.type_id === '2' ? 'groups' : 'sections';
        navigate(`/${targetpath}/${item.section.url_key}`, { state: { from: location } });
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }} icon={<Icon source={EditIcon} />}></Button>,
    ]);
  }, [data]);
  return (
    <Card>
      <BlockStack>
        <Text as="h2" variant="headingSm">Recent installed</Text>
        <DataTable columnContentTypes={['text', 'text', 'text', 'numeric']} headings={['Name', 'Type', 'Installed theme', '']} rows={sectionRows} verticalAlign='middle'></DataTable>
      </BlockStack>
    </Card>
  );
};

export default RecentInstalled;
