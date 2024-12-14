import { isChildOf } from './parent-check'

describe('isChildOf', () => {
  it('should return false if the element is null', () => {
    expect(isChildOf('div', null)).toBe(false)
  })

  it('should return false if the element is not a child of the specified tag', () => {
    const parent = document.createElement('div')
    const child = document.createElement('span')
    parent.appendChild(child)
    expect(isChildOf('section', child)).toBe(false)
  })

  it('should return true if the element is a direct child of the specified tag', () => {
    const parent = document.createElement('div')
    const child = document.createElement('span')
    parent.appendChild(child)
    expect(isChildOf('div', child)).toBe(true)
  })

  it('should return true if the element is a nested child of the specified tag', () => {
    const grandParent = document.createElement('div')
    const parent = document.createElement('section')
    const child = document.createElement('span')
    grandParent.appendChild(parent)
    parent.appendChild(child)
    expect(isChildOf('div', child)).toBe(true)
  })

  describe('isChildOf', () => {
    it('should handle circular references in the DOM tree', () => {
        const parent = document.createElement('div')
        const child = document.createElement('span')
        parent.appendChild(child)
        // Simulate circular reference
        Object.defineProperty(parent, 'parentElement', {
            value: parent,
            configurable: true
        })
        expect(isChildOf('div', child)).toBe(true)
    })
})
})