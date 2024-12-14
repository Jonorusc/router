import { getPageRouteByPath } from "./get-page-route-by-path";
import { isChildOf } from "./parent-check";

export const isTransitionable = (path: string): boolean => {
  const pageRoute = getPageRouteByPath(path);

  return !!pageRoute && isChildOf('page-transition', pageRoute);
}