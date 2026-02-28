import { matchPath, useLocation } from 'react-router-dom';

// ----------------------------------------------------------------------

type ReturnType = boolean;

const ROOT_PATH = '/dashboard';

export function useActiveLink(path: string, deep = true, replaceRootPath?: boolean): ReturnType {
  const { pathname } = useLocation();

  const pathnameReplaced = pathname.replace(replaceRootPath ? ROOT_PATH : '', '');

  const normalActive = path ? !!matchPath({ path, end: true }, pathnameReplaced) : false;

  const deepActive = path ? !!matchPath({ path, end: false }, pathnameReplaced) : false;

  return deep ? deepActive : normalActive;
}
