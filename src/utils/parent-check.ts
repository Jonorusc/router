import type { WebComponent } from '@beforesemicolon/web-component'

export const isChildOf = (
    tagName: string,
    element: WebComponent | Element | null
) => {
    if (!element) return false
    let currentElement = element.parentNode as Element | WebComponent
    const regex = new RegExp(tagName, 'i')
    const visitedElements = new Set<Element | WebComponent>()

    while (currentElement) {
        if (regex.test(currentElement.nodeName)) {
            return true
        }
        if (visitedElements.has(currentElement)) {
            break
        }
        visitedElements.add(currentElement)
        currentElement = currentElement.parentElement as
            | HTMLElement
            | WebComponent
    }

    return false
}
