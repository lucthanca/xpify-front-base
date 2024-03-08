import { useToast } from '@shopify/app-bridge-react';
import { useMutation, ServerError, ServerParseError } from '@apollo/client';
import { PURCHASE_SECTION_MUTATION } from '~/queries/section-builder/other.gql';
import { useCallback, useEffect, useMemo } from 'react';

type SectionObject = {
  entity_id: string;
};

export const useSectionPurchase = () => {
  const toast = useToast();
  const [purchaseSectionMutation, { loading, error }] = useMutation(PURCHASE_SECTION_MUTATION);
  const purchaseSection = useCallback(async (section: SectionObject) => {
    if (!section.entity_id) return;
    try {
      return purchaseSectionMutation({
        variables: { id: section.entity_id },
      });
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast.show(error.message, { isError: true });
      } else {
        toast.show('An error occurred', { isError: true });
      }
    }
    return null;
  }, []);

  const shouldLoading = useMemo(() => {
    const networkError = error?.networkError as ServerError | ServerParseError | undefined;
    return loading || (networkError?.response?.headers?.get('X-Shopify-Api-Request-Failure-Reauthorize') === '1');
  }, [loading, error]);
  useEffect(() => {
    if (!error) return;
    const networkError = error?.networkError as ServerError | ServerParseError | undefined;
    const shouldLogInfo = (networkError?.response?.headers?.get('X-Shopify-Api-Request-Failure-Reauthorize') === '1');
    if (shouldLogInfo) {
      toast.show('Redirecting to payment...', { isError: false });
    }
  }, [error]);
  return {
    purchaseSection,
    error,
    loading: shouldLoading,
  };
};
