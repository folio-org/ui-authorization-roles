import { useLocation, matchPath } from 'react-router';

export default function useMatchPath() {
  const { pathname } = useLocation();

  const getParams = (path) => {
    const matchRoleId = matchPath(pathname, { path });
    return matchRoleId?.params || {};
  };

  return { getParams };
}
