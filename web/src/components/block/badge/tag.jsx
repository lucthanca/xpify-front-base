import { memo, useCallback } from 'react';
import { Badge, InlineStack } from "@shopify/polaris";
import { useSearchParams } from 'react-router-dom';
import React from 'react';

const BadgeTag = React.memo(({tag}) => {
  const [, setSearchParams] = useSearchParams();
  const handleTagClick = useCallback(() => {
    setSearchParams({ tags: tag.name });
  }, [tag]);
  return (
    <Badge><div className='pointer' onClick={handleTagClick}>#{tag.name}</div></Badge>
  );
})

function BadgeTags({tags}) {
  return (
    <InlineStack gap={200} blockAlign='start'>
      {tags.map(tag => (
        <BadgeTag key={tag.id} tag={tag} />
      ))}
    </InlineStack>
  );
}

export default memo(BadgeTags);
