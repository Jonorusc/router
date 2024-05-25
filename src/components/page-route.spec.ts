import iniWithRoute from './page-route';
import {PageLinkProps} from './page-link';
import * as WB from "@beforesemicolon/web-component";
import { html, when, state, WebComponent } from '@beforesemicolon/web-component'
import {goToPage} from "../pages";
import {HTMLComponentElement} from "@beforesemicolon/web-component/dist/types/web-component";
import {waitFor} from "../test.utils";
import * as fs from "fs";
import * as path from "path";

iniWithRoute(WB)

describe('PageRoute', () => {
	beforeEach(() => {
		Array.from(document.body.children, (el) => {
			el.remove()
		})
		goToPage('/');
	})
	
	it('should render inner content with route static and fetched content', async () => {
		jest.spyOn(window, 'fetch').mockImplementation(() => {
			return Promise.resolve({
				status: 200,
				text: () => Promise.resolve('<p>Hello World</p>')
			} as Response)
		});
		
		html`
			<page-route path="/">Hello World</page-route>
			<page-route path="/test" src="/test"></page-route>`.render(document.body);
		
		expect(window.fetch).not.toHaveBeenCalled();
		
		const [r1, r2] = Array.from(document.body.children) as HTMLComponentElement<PageLinkProps>[];
		
		expect(r1.contentRoot.innerHTML.trim()).toBe('<slot></slot>')
		expect(r1.outerHTML).toBe('<page-route path="/">Hello World</page-route>')
		
		let slot = r2.contentRoot.querySelector('slot');
		expect(slot?.getAttribute('name')).toMatch(/\d+/)
		expect(r2.outerHTML).toBe('<page-route path="/test" src="/test"></page-route>')
		
		expect(r2.contentRoot.querySelector('slot[name="loading"]')).toBeNull();
		
		await waitFor(() => {
			goToPage('/test');
		})
		
		// r1 slot gets a name to hide content
		slot = r1.contentRoot.querySelector('slot');
		expect(slot?.getAttribute('name') ?? '').toMatch(/\d+/)
		expect(r1.outerHTML).toBe('<page-route path="/">Hello World</page-route>')
		
		// r2 slot loses the name to show content
		expect(r2.contentRoot.innerHTML.trim()).toBe('<slot></slot>')
		// the content is placed inside
		expect(r2.outerHTML).toBe('<page-route path="/test" src="/test"><p>Hello World</p></page-route>')
	});
	
	it('should render inner content with route query static and fetched content', async () => {
		jest.spyOn(window, 'fetch').mockImplementation(() => {
			return Promise.resolve({
				status: 200,
				text: () => Promise.resolve('<p>Hello World</p>')
			} as Response)
		});
		
		await waitFor(() => {
			goToPage('/?tab=one');
		})
		
		html`
			<page-route-query key="tab" value="one">Tab 1</page-route-query>
			<page-route-query key="tab" value="two" src="/test"></page-route-query>`.render(document.body);
		
		expect(window.fetch).not.toHaveBeenCalled();
		
		const [r1, r2] = Array.from(document.body.children) as HTMLComponentElement<PageLinkProps>[];
		
		expect(r1.contentRoot.innerHTML.trim()).toBe('<slot></slot>')
		expect(r1.outerHTML).toBe('<page-route-query key="tab" value="one">Tab 1</page-route-query>')
		
		let slot = r2.contentRoot.querySelector('slot');
		expect(slot?.getAttribute('name')).toMatch(/\d+/)
		expect(r2.outerHTML).toBe('<page-route-query key="tab" value="two" src="/test"></page-route-query>')
		
		expect(r2.contentRoot.querySelector('slot[name="loading"]')).toBeNull();
		
		await waitFor(() => {
			goToPage('/?tab=two');
		})
		
		// r1 slot gets a name to hide content
		slot = r1.contentRoot.querySelector('slot');
		expect(slot?.getAttribute('name') ?? '').toMatch(/\d+/)
		expect(r1.outerHTML).toBe('<page-route-query key="tab" value="one">Tab 1</page-route-query>')
		
		// r2 slot loses the name to show content
		expect(r2.contentRoot.innerHTML.trim()).toBe('<slot></slot>')
		// the content is placed inside
		expect(r2.outerHTML).toBe('<page-route-query key="tab" value="two" src="/test"><p>Hello World</p></page-route-query>')
	});
	
	it('should fail to load content and show fallback slot', async () => {
		jest.spyOn(window, 'fetch').mockImplementation(() => {
			return Promise.resolve({
				status: 404
			} as Response)
		});
		
		html`<page-route path="/test" src="/test"></page-route>`.render(document.body);
		
		const [r1] = Array.from(document.body.children) as HTMLComponentElement<PageLinkProps>[];
		
		let slot = r1.contentRoot.querySelector('slot');
		expect(slot?.getAttribute('name')).toMatch(/\d+/)
		expect(r1.outerHTML).toBe('<page-route path="/test" src="/test"></page-route>')
		
		expect(r1.contentRoot.querySelector('slot[name="loading"]')).toBeNull();
		expect(r1.contentRoot.querySelector('slot[name="fallback"]')).toBeNull();
		
		await waitFor(() => {
			goToPage('/test');
			// show loading slot
			expect(r1.contentRoot.querySelector('slot[name="loading"]')).not.toBeNull();
		})
		
		expect(console.error).toHaveBeenCalledWith(new Error('Loading "/test" content failed with status code 404'));
		// hide loading slot
		expect(r1.contentRoot.querySelector('slot[name="loading"]')).toBeNull();
		// show fallback slot
		expect(r1.contentRoot.querySelector('slot[name="fallback"]')).not.toBeNull();
	})

	it('should allow to nest routes', async () => {
		html`
			<page-route path="/todos" exact="false">
				Todos:
				<page-route path="/pending">pending todos</page-route>
				<page-route path="/in-progress">in progress todos</page-route>
				<page-route path="/completed">completed todos</page-route>
			</page-route>
		`.render(document.body);

		const [r1] = Array.from(document.body.children) as HTMLComponentElement<PageLinkProps>[];
		const [r11, r12, r13] = Array.from(r1.children) as HTMLComponentElement<PageLinkProps>[];

		let slot = r1.contentRoot.querySelector('slot');
		expect(slot?.getAttribute('name')).toMatch(/\d+/)
		expect(r11.contentRoot.querySelector('slot')?.getAttribute('name')).toMatch(/\d+/)
		expect(r12.contentRoot.querySelector('slot')?.getAttribute('name')).toMatch(/\d+/)
		expect(r13.contentRoot.querySelector('slot')?.getAttribute('name')).toMatch(/\d+/)

		await waitFor(() => {
			goToPage('/todos');
		})

		expect(slot?.getAttribute('name')).toBeNull()

		expect(r11.contentRoot.querySelector('slot')?.getAttribute('name')).toMatch(/\d+/)
		expect(r12.contentRoot.querySelector('slot')?.getAttribute('name')).toMatch(/\d+/)
		expect(r13.contentRoot.querySelector('slot')?.getAttribute('name')).toMatch(/\d+/)

		await waitFor(() => {
			goToPage('/todos/pending');
		})

		expect(r11.contentRoot.querySelector('slot')?.getAttribute('name')).toBeNull()
		expect(r12.contentRoot.querySelector('slot')?.getAttribute('name')).toMatch(/\d+/)
		expect(r13.contentRoot.querySelector('slot')?.getAttribute('name')).toMatch(/\d+/)

		await waitFor(() => {
			goToPage('/todos/in-progress');
		})

		expect(r11.contentRoot.querySelector('slot')?.getAttribute('name')).toMatch(/\d+/)
		expect(r12.contentRoot.querySelector('slot')?.getAttribute('name')).toBeNull()
		expect(r13.contentRoot.querySelector('slot')?.getAttribute('name')).toMatch(/\d+/)

		await waitFor(() => {
			goToPage('/todos/completed');
		})

		expect(r11.contentRoot.querySelector('slot')?.getAttribute('name')).toMatch(/\d+/)
		expect(r12.contentRoot.querySelector('slot')?.getAttribute('name')).toMatch(/\d+/)
		expect(r13.contentRoot.querySelector('slot')?.getAttribute('name')).toBeNull()
	})

	it('should allow to nest routes inside a component', async () => {
		class PageContent extends WebComponent {
			render() {
				return html`
					<page-route path="/pending">pending todos</page-route>
					<page-route path="/in-progress">in progress todos</page-route>
					<page-route path="/completed">completed todos</page-route>
				`
			}
		}

		customElements.define('page-content', PageContent)

		html`
			<page-route path="/todos" exact="false">
				Todos:
				<page-content></page-content>
			</page-route>
		`.render(document.body);

		const [r1] = Array.from(document.body.children) as HTMLComponentElement<PageLinkProps>[];

		let slot = r1.contentRoot.querySelector('slot');
		expect(slot?.getAttribute('name')).toMatch(/\d+/)

		await waitFor(() => {
			goToPage('/todos');
		})

		expect(slot?.getAttribute('name')).toBeNull()

		const cont = r1.children[0] as  HTMLComponentElement<PageLinkProps>;
		const [r11, r12, r13] = Array.from((cont.contentRoot as HTMLComponentElement<PageLinkProps>).children) as HTMLComponentElement<PageLinkProps>[];

		expect(r11.contentRoot.querySelector('slot')?.getAttribute('name')).toMatch(/\d+/)
		expect(r12.contentRoot.querySelector('slot')?.getAttribute('name')).toMatch(/\d+/)
		expect(r13.contentRoot.querySelector('slot')?.getAttribute('name')).toMatch(/\d+/)

		await waitFor(() => {
			goToPage('/todos/pending');
		})

		expect(r11.contentRoot.querySelector('slot')?.getAttribute('name')).toBeNull()
		expect(r12.contentRoot.querySelector('slot')?.getAttribute('name')).toMatch(/\d+/)
		expect(r13.contentRoot.querySelector('slot')?.getAttribute('name')).toMatch(/\d+/)

		await waitFor(() => {
			goToPage('/todos/in-progress');
		})

		expect(r11.contentRoot.querySelector('slot')?.getAttribute('name')).toMatch(/\d+/)
		expect(r12.contentRoot.querySelector('slot')?.getAttribute('name')).toBeNull()
		expect(r13.contentRoot.querySelector('slot')?.getAttribute('name')).toMatch(/\d+/)

		await waitFor(() => {
			goToPage('/todos/completed');
		})

		expect(r11.contentRoot.querySelector('slot')?.getAttribute('name')).toMatch(/\d+/)
		expect(r12.contentRoot.querySelector('slot')?.getAttribute('name')).toMatch(/\d+/)
		expect(r13.contentRoot.querySelector('slot')?.getAttribute('name')).toBeNull()
	})

	describe('should import content', () => {
		afterAll(() => {
			fs.rmSync(path.resolve(__dirname, './sample.js'))
		})

		it('with the js file as src attribute', async () => {
			fs.writeFileSync(path.resolve(__dirname, './sample.js'), `
				module.exports = () => ({render: el => {
					el.innerHTML = 'It works';
				}});
			`.trim())
			html`<page-route path="/sample" src="file:./sample.js"></page-route>`.render(document.body);

			const [r1] = Array.from(document.body.children) as HTMLComponentElement<PageLinkProps>[];

			// content is not shown initially
			const slot = r1.contentRoot.querySelector('slot');
			expect(slot?.getAttribute('name') ?? '').toMatch(/\d+/)
			expect(r1.outerHTML).toBe('<page-route path="/sample" src="file:./sample.js"></page-route>')

			await waitFor(() => {
				goToPage('/sample');
			})

			expect(console.error).not.toHaveBeenCalled();

			// r2 slot loses the name to show content
			expect(r1.contentRoot.innerHTML.trim()).toBe('<slot></slot>')
			// the content is placed inside
			expect(r1.outerHTML).toBe('<page-route path="/sample" src="file:./sample.js">It works</page-route>')
		})

		it('with nested route', async () => {
			fs.writeFileSync(path.resolve(__dirname, './sample.js'), `
				module.exports = () => ({render: el => {
					el.innerHTML = 'Todos:\\n' +
						'<page-route path="/pending">pending todos</page-route>\\n' +
						'<page-route path="/in-progress">in progress todos</page-route>\\n' +
						'<page-route path="/completed">completed todos</page-route>';
				}});
			`.trim())

			html`<page-route path="/todos" exact="false" src="file:./sample.js"></page-route>`.render(document.body);

			const [r1] = Array.from(document.body.children) as HTMLComponentElement<PageLinkProps>[];

			let slot = r1.contentRoot.querySelector('slot');

			expect(slot?.getAttribute('name')).toMatch(/\d+/)
			expect(r1.outerHTML).toBe('<page-route path="/todos" exact="false" src="file:./sample.js"></page-route>')

			await waitFor(() => {
				goToPage('/todos/pending');
			})

			expect(r1.outerHTML).toBe('<page-route path="/todos" exact="false" src="file:./sample.js">Todos:\n' +
				'<page-route path="/pending">pending todos</page-route>\n' +
				'<page-route path="/in-progress">in progress todos</page-route>\n' +
				'<page-route path="/completed">completed todos</page-route></page-route>')

			const [r11, r12, r13] = Array.from(r1.children) as HTMLComponentElement<PageLinkProps>[];

			expect(r11.contentRoot.querySelector('slot')?.getAttribute('name')).toBeNull()
			expect(r12.contentRoot.querySelector('slot')?.getAttribute('name')).toMatch(/\d+/)
			expect(r13.contentRoot.querySelector('slot')?.getAttribute('name')).toMatch(/\d+/)
		})
	})
})
