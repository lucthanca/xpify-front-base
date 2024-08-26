import React from 'react';
import { Box, Divider, InlineStack, Icon, Text } from '@shopify/polaris';
import { CheckCircleIcon } from '@shopify/polaris-icons';
import './style.scss';
import PropTypes from 'prop-types';

const AllCaughtUp = ({ text }) => {
  return (
    <div className='AllCaughtUp__root'>
      <Divider borderColor='border-tertiary' />
      <div className='AllCaughtUp__text'>
        <InlineStack align='center' wrap='wrap' direction='row'>
          <Box background='bg' paddingInline='400'>
            <InlineStack gap='200'>
              <Box>
                <Icon source={CheckCircleIcon} tone='subdued' />
              </Box>
              <Text as='h2' variant='headingSm' tone='subdued' alignment='center'>{text || 'All caught up'}</Text>
            </InlineStack>
          </Box>
        </InlineStack>
      </div>
    </div>
  );
};
AllCaughtUp.propTypes = {
  text: PropTypes.oneOfType(
    [PropTypes.string, PropTypes.node]
  ),
}

export default React.memo(AllCaughtUp);
