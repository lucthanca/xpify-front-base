import { useCallback, useEffect, useMemo, useState } from 'react';
import { ServerError, ServerParseError, useMutation } from '@apollo/client';
import { SUBSCRIBE_PLAN_MUTATION } from '~/queries/section-builder/other.gql';
import { useToast } from '@shopify/app-bridge-react';
import { PricingPlan as IPricingPlan } from '~/talons/section/useSection';

type PricingPlanInformation = {
  name: string;
  currentPeriodEnd: string;
  trialDays: String;
};
type PricingPlan = IPricingPlan & {
  information: PricingPlanInformation
}

export const usePlan = ({ plan }: { plan: PricingPlan }) => {
  const [selected, setSelected] = useState(0);
  const handleTabChange = useCallback((selectedTabIndex: number) => setSelected(selectedTabIndex), []);
  const [subscribePlan, { loading, error }] = useMutation(SUBSCRIBE_PLAN_MUTATION);
  const toast = useToast();

  const selectedInterval = useMemo(() => plan?.prices?.[selected], [selected, plan]);

  const subscribe = useCallback(async () => {
    if (!selectedInterval) {
      toast.show('Please select a plan', { isError: true });
      return;
    }
    try {
      await subscribePlan({
        variables: {
          input: {
            plan_id: plan.id,
            interval: selectedInterval.interval,
          }
        }
      });
    } catch (e) {

    }
  }, [selectedInterval]);
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
    selected,
    subscribe,
    loading: shouldLoading,
    handleTabChange,
  };
}
