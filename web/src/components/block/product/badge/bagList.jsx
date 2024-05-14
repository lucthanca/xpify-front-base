import { useCallback } from 'react';
import { Badge, InlineStack, Text } from '@shopify/polaris';
import React from 'react';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';

const BadgeItem = props => {
  const { renderBadgeItem, item, onClick, isSimpleSection, searchKey } = props;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    searchParams.set(searchKey, item.name);
    const nav = {
      pathname: isSimpleSection ? '/sections' : '/groups',
      search: `?${createSearchParams({ ...Object.fromEntries(searchParams.entries()) })}`,
    };
    onClick && onClick(item);
    navigate(nav, { replace: false });
  }, [onClick, searchKey, searchParams, item]);
  const badgeRender = useCallback(() => {
    if (!renderBadgeItem) return item.name;
    return renderBadgeItem && renderBadgeItem(item);
  }, [renderBadgeItem]);

  return (
    <Badge><div className='cursor-pointer' onClick={handleClick}>{badgeRender()}</div></Badge>
  );
};

const BadgeList = (props) => {
  const { items, isSimpleSection, itemContentRenderer, onClick, searchKey, title } = props;
  return (
    <InlineStack blockAlign='center' gap='200'>
      <Text as="span" variant="bodySm">{title}:</Text>
      <InlineStack gap='100' blockAlign='start'>
        {items.map(item => (
          <BadgeItem key={item.id} item={item} renderBadgeItem={itemContentRenderer} onClick={onClick} searchKey={searchKey} isSimpleSection={isSimpleSection} />
        ))}
      </InlineStack>
    </InlineStack>
  );
}

BadgeList.propTypes = {
  items: PropTypes.array.isRequired,
  itemContentRenderer: PropTypes.func,
  onClick: PropTypes.func,
  searchKey: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default React.memo(BadgeList);
