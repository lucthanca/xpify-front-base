import { useLocation, useNavigate } from 'react-router-dom';

export const useRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
};
