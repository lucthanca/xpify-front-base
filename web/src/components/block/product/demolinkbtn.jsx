import { Button, Icon, Tooltip } from '@shopify/polaris';
import { ExternalIcon } from '@shopify/polaris-icons';
import { useMutation } from '@apollo/client';
import { TRY_SECTION_MUTATION, TRY_SECTION_MUTATION_KEY } from '~/queries/section-builder/product.gql';
import PropTypes from 'prop-types';
import React from 'react';
import { useToast } from '@shopify/app-bridge-react';

const DemoButton = props => {
  const { id } = props;
  const [trySection, { loading, error }] = useMutation(TRY_SECTION_MUTATION, {
    variables: { id },
  });
  const toast = useToast();
  const handleClick = async () => {
    try {
      const response = await trySection();
      if (response.data[TRY_SECTION_MUTATION_KEY]) {
        window.open(response.data[TRY_SECTION_MUTATION_KEY], '_blank');
      }
    } catch (e) {
      toast.show(e.message, { isError: true })
    }
  };

  return (
    <Tooltip content='View demo store'>
      <Button
        icon={<Icon tone='base' source={ExternalIcon} />}
        size="large"
        onClick={handleClick}
        loading={loading}
      />
    </Tooltip>
  );
};
DemoButton.displayName = 'DemoButton';
DemoButton.propTypes = {
  id: PropTypes.string.isRequired,
};

export default React.memo(DemoButton);
