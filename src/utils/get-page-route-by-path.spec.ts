import { getPageRouteByPath } from './get-page-route-by-path'

describe('getPageRouteByPath', () => {
    beforeEach(() => {
        document.body.innerHTML = ''
    })

    it('should return the page route element if it exists', () => {
        const path = '/test-path'
        const pageRoute = document.createElement('page-route')
        pageRoute.setAttribute('path', path)
        document.body.appendChild(pageRoute)

        const result = getPageRouteByPath(path)
        expect(result).toBe(pageRoute)
    })

    it('should return null if the page route element does not exist', () => {
        const path = '/non-existent-path'
        const result = getPageRouteByPath(path)
        expect(result).toBeNull()
    })
})