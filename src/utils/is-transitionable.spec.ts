import { isTransitionable } from './is-transitionable'
import { getPageRouteByPath } from './get-page-route-by-path'
import { isChildOf } from './parent-check'

jest.mock('./get-page-route-by-path')
jest.mock('./parent-check')

describe('isTransitionable', () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    it('should return true if the page route exists and is a child of page-transition', () => {
        const path = '/test-path'
        const pageRoute = document.createElement('page-route')

        ;(getPageRouteByPath as jest.Mock).mockReturnValue(pageRoute)
        ;(isChildOf as jest.Mock).mockReturnValue(true)

        const result = isTransitionable(path)
        expect(result).toBe(true)
        expect(getPageRouteByPath).toHaveBeenCalledWith(path)
        expect(isChildOf).toHaveBeenCalledWith('page-transition', pageRoute)
    })

    it('should return false if the page route does not exist', () => {
        const path = '/non-existent-path'

        ;(getPageRouteByPath as jest.Mock).mockReturnValue(null)

        const result = isTransitionable(path)
        expect(result).toBe(false)
        expect(getPageRouteByPath).toHaveBeenCalledWith(path)
        expect(isChildOf).not.toHaveBeenCalled()
    })

    it('should return false if the page route is not a child of page-transition', () => {
        const path = '/test-path'
        const pageRoute = document.createElement('page-route')

        ;(getPageRouteByPath as jest.Mock).mockReturnValue(pageRoute)
        ;(isChildOf as jest.Mock).mockReturnValue(false)

        const result = isTransitionable(path)
        expect(result).toBe(false)
        expect(getPageRouteByPath).toHaveBeenCalledWith(path)
        expect(isChildOf).toHaveBeenCalledWith('page-transition', pageRoute)
    })
})