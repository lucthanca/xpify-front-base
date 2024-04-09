import { memo, useMemo } from 'react';
import { useCategoryCollection } from '~/talons/category/useCategoryCollection';
import CategoryItem from './categoryItem';
import { Pagination, InlineStack, Box, Text } from '@shopify/polaris';

const CategoryCollection = props => {
  const talonProps = useCategoryCollection();
  const {
    categories,
    error,
    pageInfo,
  } = talonProps;

  console.log({ pageInfo });
  const paginationItems = useMemo(() => {
    if (!pageInfo) return null;
    const { current_page: currentPage, total_pages: totalPages } = pageInfo;
    const items = Array.from({ length: totalPages }, (_, i) => {
      const baseClass = {};
      if (currentPage !== i + 1) {
        baseClass.underline = true;
        baseClass.pointer = true;
      }
      return (<div className={Object.keys(baseClass).join(' ')}><Box paddingInline='200' paddingBlockStart='100' paddingBlockEnd='100'><Text as='span'>{i + 1}</Text></Box></div>)
    });
    return <InlineStack gap='100'>{items}</InlineStack>
  }, [pageInfo]);
  return (
    <>
      {
        categories.length > 0 && categories.map(category => {
          if (!category?.id) return null;
          return <CategoryItem category={category} key={category.id} />
        })
      }
      <InlineStack align='space-around'>
        <Pagination
          onPrevious={() => {
            console.log('Previous');
          }}
          onNext={() => {
            console.log('Next');
          }}
          type="page"
          hasNext
          label={paginationItems}
        />
      </InlineStack>
    </>
  );
};

export default memo(CategoryCollection);
