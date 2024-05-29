import { useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
  const location = useLocation();
  const result = useCallback((key) => {
    navigate(`/sections/${key}`, { state: { from: location } });
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
  const location = useLocation();
  const result = useCallback((key) => {
    navigate(`/groups/${key}`, { state: { from: location } });
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
  const location = useLocation();
  const result = useCallback(() => {
    navigate(`/plans`, { state: { from: location } });
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
  const location = useLocation();
  const previousPath = useRef(location.state?.from?.pathname);
  const result = useCallback(() => {
    if (previousPath.current === undefined) {
      navigate('/');
    } else {
      navigate(-1);
    }
  }, [])
  return result;
}

export const useScrollToTop = () => {
  window.scrollTo(0,0);
}
