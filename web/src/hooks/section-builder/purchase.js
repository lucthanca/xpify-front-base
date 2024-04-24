import { useCallback } from "react";
import { useSectionPurchase } from "../useSectionPurchase";

export const usePurchase = (section) => {
  const { purchaseSection, loading: purchaseLoading } = useSectionPurchase();
  const handlePurchase = useCallback(async (section) => {
    if (!section.entity_id) return;
    await purchaseSection(section);
  }, [section]);

  return {
    handlePurchase,
    purchaseLoading
  };
}