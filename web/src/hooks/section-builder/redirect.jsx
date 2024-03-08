import { useCallback } from "react";

export const useRedirectPlansPage = useCallback(() => {
  navigate(`/plans`);
  useScrollToTop();
}, []);

export const useRedirectSectionsPage = useCallback(() => {
  navigate(`/sections`);
  useScrollToTop();
}, []);

export const useRedirectProductPage = useCallback((url) => {
  navigate(`/section/${url}`);
  useScrollToTop();
}, []);

export const useScrollToTop = useCallback(() => {
  window.scrollTo(0,0);
}, []);
