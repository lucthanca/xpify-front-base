import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const useRedirectSectionsPage = () => {
  const navigate = useNavigate();
  const result = useCallback(() => {
    navigate(`/sections`);
    useScrollToTop();
  })
  return result;
}

export const useRedirectSectionPage = (key) => {
  const navigate = useNavigate();
  const result = useCallback((key) => {
    navigate(`/section/${key}`);
    useScrollToTop();
  }, [key])
  return result;
}

export const useRedirectGroupsPage = () => {
  const navigate = useNavigate();
  const result = useCallback(() => {
    navigate(`/groups`);
    useScrollToTop();
  })
  return result;
}

export const useRedirectGroupPage = (key) => {
  const navigate = useNavigate();
  const result = useCallback(() => {
    navigate(`/group/${key}`);
    useScrollToTop();
  })
  return result;
}

export const useRedirectPlansPage = () => {
  const navigate = useNavigate();
  const result = useCallback(() => {
    navigate(`/plans`);
    useScrollToTop();
  })
  return result;
}

export const useRedirectFaqsPage = () => {
  const navigate = useNavigate();
  const result = useCallback(() => {
    navigate(`/faqs`);
    useScrollToTop();
  })
  return result;
}

export const useBackPage = () => {
  const navigate = useNavigate();
  const result = useCallback(() => {
    navigate(-1);
  })
  return result;
}

export const useScrollToTop = () => {
  window.scrollTo(0,0);
}
