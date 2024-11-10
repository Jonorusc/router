"use strict";(()=>{var j=Object.defineProperty;var a=(t,e)=>j(t,"name",{value:e,configurable:!0});var l=a(t=>t=="/"?t:t.replace(/\/index\.html$/,"").replace(/\/$/,""),"cleanPathnameOptionalEnding");var L=a(t=>{if(!t.trim().length)return!1;let e=new URL(t.trim(),location.origin),r=l(location.pathname)===l(e.pathname);return e.search?r&&e.search===location.search:r},"isOnPage");function $(t){if(t&&typeof t=="string")try{t=t==="undefined"?void 0:JSON.parse(t.replace(/['`]/g,'"'))}catch{}return t}a($,"jsonParse");var d=a(()=>{let t=new URLSearchParams(location.search),e={};for(let r of t.keys()){let n=t.get(r);e[r]=n?$(n):null}return e},"getSearchParams");var F=a(t=>t===null||/undefined|number|string|bigint|boolean|symbol/.test(typeof t),"isPrimitive");function S(t){if(!F(t))try{return JSON.stringify(t)}catch{}return String(t)}a(S,"jsonStringify");var y=a((t,{pattern:e,params:r})=>{t=l(t);let n=t.match(e);if(n){let[,...o]=n;return r.reduce((s,u,R)=>({...s,[u]:o[R]??null}),{})}return null},"getPathMatchParams");var w=a((t,e=!0)=>{t=l(t);let r=[],n=t.replace(/:([^/]+)/g,(o,s)=>(r.push(s),"([^/]+)")).replace(/\?/g,"\\?");return{pattern:new RegExp(`^${n}${e?"$":"(\\/.*)?$"}`),params:r}},"pathStringToPattern");var A=new Set,T=a(()=>{A.forEach(t=>{t(l(location.pathname),d(),P())})},"broadcast");window.addEventListener("popstate",()=>{T()});var g=a(t=>(A.add(t),t(l(location.pathname),d(),P()),()=>{A.delete(t)}),"onPageChange"),f=a((t,e={},r=document.title)=>{window.history.pushState(e,r,t),r!==document.title&&(document.title=r),T()},"goToPage"),U=a((t,e={},r=document.title)=>{window.history.replaceState(e,r,t),r!==document.title&&(document.title=r),T()},"replacePage"),D=a(()=>{window.history.back()},"previousPage"),O=a(()=>{window.history.forward()},"nextPage"),P=a(()=>window.history.state,"getPageData"),W=a(t=>{if(t===null)window.history.replaceState(history.state,document.title,location.pathname);else{let e=new URLSearchParams(window.location.search);for(let r in t)t[r]&&e.set(r,S(t[r]));window.history.replaceState(history.state,document.title,location.pathname+`?${e.toString()}`)}T()},"updateSearchQuery"),M=new Map,b=a((t,e=!1)=>{M.set(t,{pathname:t,exact:e})},"registerRoute"),E=a(t=>Array.from(M.values()).some(e=>!!y(t,w(e.pathname))),"isRegisteredRoute"),v=a(()=>{for(let t of M.values()){let e=y(location.pathname,w(t.pathname,t.exact));if(e)return e}return{}},"getPageParams"),_=a(t=>{let e=location.pathname.split("/");return t.split("/").map((r,n)=>/:.+/.test(r)?e[n]:r).join("/")},"parsePathname");var x=a(t=>{let e=t.parentNode;for(;e&&(e instanceof ShadowRoot&&(e=e.host),!/PAGE-ROUTE/.test(e.nodeName));)e=e.parentNode;return e??null},"getAncestorPageRoute");var B=a(({html:t,WebComponent:e})=>{class r extends e{static{a(this,"PageLink")}static observedAttributes=["path","search","keep-current-search","title","payload"];path="";search="";keepCurrentSearch=!1;title="";payload={};#t=null;fullPath=()=>{let o=new URLSearchParams(this.props.search()),s=this.props.path();this.hasAttribute("path")?s.startsWith("$")?s=l(s.replace(/^\$/,_(this.#t?.fullPath??"/"))):s.startsWith("~")&&(s=l(s.replace(/^~/,location.pathname))):s=l(location.pathname);let u=new URL(s,location.origin);return this.props.keepCurrentSearch()&&new URLSearchParams(location.search).forEach((k,C)=>{u.searchParams.set(C,k)}),o.forEach((R,k)=>{u.searchParams.set(k,R)}),u.pathname+u.search};handleClick=o=>{o.preventDefault(),o.stopPropagation(),f(this.fullPath(),this.props.payload(),this.props.title())};toggleActive=o=>{o?this.setAttribute("active",""):this.removeAttribute("active")};onMount(){return this.#t=x(this),g(()=>{let o=L(this.fullPath());o!==this.hasAttribute("active")&&(this.toggleActive(o),this.dispatch("active",{value:o}))})}render(){return t`
                <a
                    part="anchor"
                    href="${this.fullPath}"
                    onclick="${this.handleClick}"
                >
                    <slot></slot>
                </a>
            `}}customElements.define("page-link",r)},"default");var Q=a(({html:t,WebComponent:e,HtmlTemplate:r,when:n,is:o})=>{let s={};b("/");class u extends e{static{a(this,"PageRoute")}static observedAttributes=["path","src","title","exact"];initialState={status:0};path="";src="";title="";exact=!0;#t=null;#e="";get fullPath(){return(this.#t?.fullPath??"")+this.props.path()}_clearContent=()=>{if(this.hasAttribute("src")){let p=s[this.props.src()];p&&typeof p.unmount=="function"?p.unmount():this.innerHTML=""}};_loadContent=async(p,h)=>{let i=this.props.src();this.setState({status:1});let c=s[i];if(!c)try{if(/\.([jt])s$/.test(i))({default:c}=await(i.startsWith("file:")?import(i.replace(/^file:/,"")):import(new URL(i,location.origin).href)));else{let m=await fetch(i);if(m.status===200)c=await m.text();else throw new Error(`Loading "${this.props.src()}" content failed with status code ${m.status}`)}s[i]=c}catch(m){return this.setState({status:3}),console.error(m)}if(this.mounted)try{typeof c=="function"&&(c=await c(P(),p,h)),this._clearContent(),typeof c.render=="function"?c.render(this):c instanceof Node?this.appendChild(c):this.innerHTML=String(c),this.setState({status:2})}catch(m){return this.setState({status:3}),console.error(m)}};_handlePageChange=(p,h)=>{let i=y(p+(this.#e?location.search:""),w(this.fullPath,this.props.exact()));if(i!==null){this.hasAttribute("src")&&this.state.status()!==1&&this.state.status()!==2?this._loadContent(i,h):this.state.status()!==2&&this.setState({status:2}),document.title=this.props.title(),this.hidden=!1;return}this.state.status()!==0&&(this.setState({status:0}),this._clearContent()),this.hidden=!0};onMount(){this.#t=x(this);let p=new URL(this.fullPath,location.origin);return this.#e=p.search,b(p.pathname,this.props.exact()),g(this._handlePageChange)}render(){let p=t`<slot></slot>`,h=t`<slot name="hidden"></slot>`,i=t`<slot name="loading"><p>Loading...</p></slot>`,c=t` <slot name="fallback"
                ><p>Failed to load content</p></slot
            >`;return t`
                ${n(o(this.state.status,2),p)}
                ${n(o(this.state.status,1),i)}
                ${n(o(this.state.status,3),c)}
                ${n(o(this.state.status,0),h)}
            `}}class R extends u{static{a(this,"PageRouteQuery")}static observedAttributes=["key","value","src"];key="";value="";#t=null;get fullPath(){return this.#t?.fullPath??"/"}_handlePageChange=(p,h)=>{let i=y(p,w(this.fullPath,this.#t?.props.exact()??!1)),c=this.props.key(),m=this.props.value();if(i!==null){if(h[c]===m){this.props.src()&&this.state.status()!==1&&this.state.status()!==2?this._loadContent(i,h):this.setState({status:2}),this.hidden=!1;return}this.state.status()!==0&&(this.setState({status:0}),this.hasAttribute("src")&&this._clearContent()),this.hidden=!0}};onMount(){return this.#t=x(this),g(this._handlePageChange)}}class k extends e{static{a(this,"PageRedirect")}static observedAttributes=["to","type"];to="";type="unknown";onMount(){let p=x(this);return g(h=>{let i=l(p?.fullPath??"/");h.startsWith(i)&&(this.props.type()==="always"?h+location.search===i&&f(this.props.to()):E(h)||f(this.props.to()))})}}customElements.define("page-route",u),customElements.define("page-route-query",R),customElements.define("page-redirect",k)},"default");var H=a(({WebComponent:t})=>{class e extends t{static{a(this,"PageData")}static observedAttributes=["param","search-param","key"];key="";param="";searchParam="";_updateValue=()=>{if(this.hasAttribute("param")){let o=v();this.textContent=o[this.props.param()];return}if(this.hasAttribute("search-param")){let o=d();this.textContent=o[this.props.searchParam()];return}let n=P();if(this.hasAttribute("key")&&n){let o=this.props.key().split(".");for(let s of o)if(s in n)n=n[s];else break}this.textContent=S(n)};onMount(){return g(this._updateValue)}onUpdate(){this._updateValue()}render(){return"<slot></slot>"}}customElements.define("page-data",e)},"default");if(!window.BFS?.MARKUP||!window.BFS.WebComponent)throw new Error('BFS.MARKUP and BFS.WebComponent are required in order for BFS.ROUTER to work. Please add the following script to the HTML head tag "<script src="https://unpkg.com/@beforesemicolon/web-component/dist/client.js"><\/script>"');if(window.BFS){let t={...window.BFS??{},...window.BFS?.MARKUP};Q(t),B(t),H(t),window.BFS={...window.BFS||{},ROUTER:{goToPage:f,replacePage:U,previousPage:D,nextPage:O,onPageChange:g,isOnPage:L,getSearchParams:d,getPageData:P,getPageParams:v,registerRoute:b,isRegisteredRoute:E,updateSearchQuery:W}}}})();
//# sourceMappingURL=client.js.map
