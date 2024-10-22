import { ActionList, BlockStack, Button, Card, Icon, InlineGrid, Popover, Text, Link } from '@shopify/polaris';
import { MenuHorizontalIcon } from '@shopify/polaris-icons';
import { useState } from 'react';

const AppRecommendItem = (props) => {
  return (
    <InlineGrid columns={'1fr auto'} gap='300'>
      <span className='w-16 aspect-square rounded-[1.25rem] relative block overflow-hidden'>
        <img src="https://cdn3.iconfinder.com/data/icons/social-media-2068/64/_shopping-512.png" alt="App name" className='w-full h-full absolute object-cover' />
      </span>
      <BlockStack gap='200'>
        <Text as='h3' variant='headingXs'>Omnisend Email marketing & SMS</Text>
        <Text as='p' variant='bodySm'>Help eCommerce businesses around the world grow and retain their customer audience with easy-to-use email and SMS...</Text>
      </BlockStack>
    </InlineGrid>
  );
};

const InAppRecommendations = () => {
  const [actionActive, toggleAction] = useState(false);
  const [items] = useState([]);

  const handleToggleAction = () => {
    toggleAction(prev => !prev);
  };
  const disclosureButtonActivator = (
    <Button variant="plain" onClick={handleToggleAction} icon={<Icon source={MenuHorizontalIcon} />} />
  );
  const disclosureButton = (
    <Popover
      active={actionActive}
      activator={disclosureButtonActivator}
      onClose={handleToggleAction}
    >
      <ActionList items={items} />
    </Popover>
  );

  return (
    <Card roundedAbove='sm'>
      <BlockStack gap='400'>
        <InlineGrid columns="1fr auto">
          <Text as='h2' variant='headingSm'>More apps your store might need</Text>
          {disclosureButton}
        </InlineGrid>

        <InlineGrid gap='400' columns={{ xs: '1fr', md: '1fr 1fr' }}>
          {[1, 2, 3, 4, 5].map((_, index) => <AppRecommendItem key={index} />)}
        </InlineGrid>
      </BlockStack>
    </Card>
  );
};

export default InAppRecommendations;
