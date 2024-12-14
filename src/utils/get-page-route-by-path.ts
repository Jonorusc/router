export const getPageRouteByPath = (path: string): Element | null => {
    const pageRoute = document.querySelector(`page-route[path="${path}"]`)
    if (pageRoute) return pageRoute
    return null
}
