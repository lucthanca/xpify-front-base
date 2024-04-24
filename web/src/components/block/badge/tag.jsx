import { memo, useCallback, useMemo } from 'react';
import { Badge, InlineStack } from "@shopify/polaris";
import { createSearchParams, useNavigate } from 'react-router-dom';
import React from 'react';

const BadgeTag = React.memo(({tag, isSimpleSection, afterClick}) => {
  const navigate = useNavigate();
  const handleTagClick = useCallback(() => {
    const nav = {
      pathname: isSimpleSection ? '/sections' : '/groups',
      search: `?${createSearchParams({tags: tag.name})}`,
    };
    navigate(nav, { replace: true });
    afterClick();
  }, [tag]);
  return (
    <Badge><div className='cursor-pointer' onClick={handleTagClick}>#{tag.name}</div></Badge>
  );
})

function BadgeTags({section, afterClick = () => {}}) {
  return section?.tags &&
  <InlineStack gap={200} blockAlign='start'>
    {section.tags.map(tag => (
      <BadgeTag key={tag.id} tag={tag} isSimpleSection={!section.child_ids} afterClick={afterClick} />
    ))}
  </InlineStack>
  ;
}

export default memo(BadgeTags);
