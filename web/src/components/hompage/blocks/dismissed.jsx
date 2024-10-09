import { Button, Card, Icon, InlineGrid, InlineStack, Text } from '@shopify/polaris';
import { XIcon } from '@shopify/polaris-icons';
import PropTypes from 'prop-types';
import { useState } from 'react';

const DismissedCard = (props) => {
  const { onUndo } = props;
  const [show, setShow] = useState(true);
  if (!show) return null;
  return (
    <Card background="bg-surface-secondary" roundedAbove="md">
      <InlineGrid columns={{ xs: "1fr auto" }} alignItems='center'>
        <InlineStack wrap={true} gap='200'>
          <Text as='h2' tone='subdued' variant='bodyMd'>You’ve dismissed this card.</Text>
          <Button id='btn-undo-1' variant='plain' onClick={onUndo}>Undo</Button>
        </InlineStack>
        <Button variant='plain' icon={<Icon source={XIcon} />} tone='base' onClick={() => setShow(false)} />
      </InlineGrid>
    </Card>
  );
};
DismissedCard.propTypes = {
  onUndo: PropTypes.func,
};

export default DismissedCard;
