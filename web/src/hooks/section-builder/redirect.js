import { useQuery } from "@apollo/client";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MY_SHOP } from "~/queries/section-builder/other.gql";
import { THEMES_QUERY } from "~/queries/section-builder/theme.gql";

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
  }, [])
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
  const result = useCallback((key) => {
    navigate(`/group/${key}`);
    useScrollToTop();
  }, [])
  return result;
}

export const useRedirectMyLibraryPage = () => {
  const navigate = useNavigate();
  const result = useCallback(() => {
    navigate(`/my-library`);
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

export const useRedirectHelpCenterPage = () => {
  const navigate = useNavigate();
  const result = useCallback(() => {
    navigate(`/help-center`);
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
