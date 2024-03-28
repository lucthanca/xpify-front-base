import { memo } from 'react';
import { BlockStack, Button, Card, Icon, InlineStack, Text } from '@shopify/polaris';
import { CheckIcon } from '@shopify/polaris-icons';
import PropTypes from 'prop-types';
import { useRedirectPlansPage } from '~/hooks/section-builder/redirect.js';

const SectionPricingPlan = props => {
  const { plan, subscribable } = props;
  const handleRedirectPlansPage = useRedirectPlansPage();

  if (!plan) return null;
  return (
    <Card title='Plan'>
      <BlockStack gap='200'>
        <Text variant='headingMd' as='h2'>
          Plan {plan?.name}
        </Text>
        {plan.prices && (
          <Text variant='bodySm' as='h2' tone='subdued' fontWeight='regular'>
            As low as {'$' + Math.min(...plan.prices.map(item => item.amount))}
          </Text>
        )}
        {plan?.description &&
          plan.description.split('\n').map((item, key) => {
            return (
              <InlineStack key={key} gap='200' blockAlign='start'>
                <div>
                  <Icon source={CheckIcon} tone='info' />
                </div>
                <Text as='span'>{item}</Text>
              </InlineStack>
            );
          })}
        <Button size='large' fullWidth disabled={!subscribable} onClick={handleRedirectPlansPage}>
          {subscribable ? 'Upgrade Now' : 'Actived'}
        </Button>
      </BlockStack>
    </Card>
  );
};

SectionPricingPlan.propTypes = {
  plan: PropTypes.object,
  subscribable: PropTypes.bool,
}

export default memo(SectionPricingPlan);
