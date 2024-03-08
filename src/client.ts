import './components/page-link'
import './components/with-route'
import {
    goToPage,
    nextPage,
    onPageChange,
    previousPage,
    replacePage,
} from './pages'
import { isOnPage } from './utils/is-on-page'
import { getSearchQuery } from './utils/get-search-query'

export * from './components/with-route'
import initPageLink from './components/page-link'
import initWithRoute from './components/with-route'
import type { WebComponent } from '@beforesemicolon/web-component'

declare global {
    interface Window {
        BFS: {
            MARKUP: typeof import('@beforesemicolon/web-component')
            ROUTER: Record<string, unknown>
            WebComponent: typeof WebComponent
        }
    }
}

if (!window.BFS?.MARKUP || !window.BFS.WebComponent) {
    throw new Error(
        `BFS.MARKUP and BFS.WebComponent are required in order for BFS.ROUTER to work. Please add the following script to the HTML head tag "<script src="https://unpkg.com/@beforesemicolon/web-component/dist/client.js"></script>"`
    )
}

if (window.BFS) {
    const BFS = { ...window.BFS, ...window.BFS?.MARKUP }

    initWithRoute(BFS)
    initPageLink(BFS)

    window.BFS = {
        ...(window.BFS || {}),
        ROUTER: {
            goToPage,
            replacePage,
            previousPage,
            nextPage,
            onPageChange,
            isOnPage,
            getSearchQuery,
        },
    }
}
