!function(){"use strict";function n(e,t,i,n,r={}){e.addEventListener(i,e=>{e.target.matches(t)?(e.delegateTarget=e.target,n(e)):e.target.closest(t)&&(e.delegateTarget=e.target.closest(t),n(e))},r)}const O=["accept","accept-charset","accesskey","action","align","allow","alt","async","autocapitalize","autocomplete","autofocus","autoplay","background","bgcolor","border","buffered","capture","challenge","charset","checked","cite","class","code","codebase","color","cols","colspan","content","contenteditable","contextmenu","controls","coords","crossorigin","csp","data","data-*","datetime","decoding","default","defer","dir","dirname","disabled","download","draggable","dropzone","enctype","enterkeyhint","for","form","formaction","formenctype","formmethod","formnovalidate","formtarget","headers","height","hidden","high","href","hreflang","http-equiv","icon","id","importance","integrity","intrinsicsize","inputmode","ismap","itemprop","keytype","kind","label","lang","language","loading","list","loop","low","manifest","max","maxlength","minlength","media","method","min","multiple","muted","name","novalidate","open","optimum","pattern","ping","placeholder","poster","preload","radiogroup","readonly","referrerpolicy","rel","required","reversed","rows","rowspan","sandbox","scope","scoped","selected","shape","size","sizes","slot","span","spellcheck","src","srcdoc","srclang","srcset","start","step","style","summary","tabindex","target","title","translate","type","usemap","value","width","wrap","aria","aria-*"],M=["disabled","readOnly","multiple","checked","autobuffer","autoplay","controls","loop","selected","hidden","scoped","async","defer","reversed","isMap","seemless","muted","required","autofocus","noValidate","formNoValidate","open","pubdate","itemscope"];function j(n,r={}){Object.keys(r).forEach(t=>{if(0!=O.filter(e=>t.match(new RegExp(e))).length||"children"==t){const i=r[t];var e=M.find(e=>e.toUpperCase()==t.toUpperCase());if(e)return!1!==i?n[e]=!0:void 0;switch(t){case"tag":return;case"value":return n.value=i;case"data":if("object"==typeof i)return Object.keys(i).forEach(e=>{n.dataset[e]="object"==typeof i[e]?JSON.stringify(i[e]):i[e]});break;case"style":if("object"==typeof i)return Object.keys(i).forEach(e=>{n.style[e]=i[e]});break;case"content":case"children":return void a(n,i)}n.setAttribute(t,i)}})}function d(e="div",t={}){"object"==typeof e&&(e=(t=e).tag||"div");e=document.createElement(e);return j(e,t),e}function h(e,t){if(Array.isArray(t)||t instanceof NodeList||t instanceof HTMLCollection){for(var i=Array.from(t);0<i.length;)e=h(e,i.pop());return e}if(Array.isArray(e)||e instanceof NodeList||e instanceof HTMLCollection)return h(e[0],t);if(e.parentNode)return t instanceof Node||(t=new Text(t)),e.parentNode.insertBefore(t,e),t;throw"argument of insertBefore unsupported"}function F(e){return e instanceof NodeList||e instanceof Array||e instanceof HTMLCollection?(e=Array.from(e)).forEach(F):e.parentNode.removeChild(e),e}function a(t,e,i,n,r){if(r=r||"append",Array.isArray(e)||e instanceof NodeList||e instanceof HTMLCollection)Array.from(e).forEach(e=>a(t,e,i,n));else if(i instanceof Element)Array.from(arguments).slice(1).filter(e=>e instanceof Element).forEach(e=>a(t,e));else if("boolean"!=typeof i&&(n=i,i=void 0),null!=e){var o;if(e instanceof Promise||e.then){const s=document.createElement("span");return t[r](s),(new Date).getMilliseconds(),e.then(e=>{a(s,e,i,n),h(s,s.childNodes),F(s)})}return e instanceof Element||e instanceof Node?t[r](e):"function"==typeof e?a(t,e.bind(n)(t),i,n):"object"==typeof e?t[r](d(e)):i?t[r](e):((o=document.createElement("div")).innerHTML=e,t[r](...o.childNodes))}}function o(e,t){return getComputedStyle(e)[t]}function u(e,t){if(Array.isArray(t)||t instanceof NodeList||t instanceof HTMLCollection){for(var i=Array.from(t);0<i.length;)e=u(e,i.shift());return e}if(Array.isArray(e)||e instanceof NodeList||e instanceof HTMLCollection)return u(e[e.length-1],t);if(e.parentNode)return t instanceof Node||(t=new Text(t)),e.parentNode.insertBefore(t,e.nextSibling),t;throw"argument of insertAfter unsupported"}function i(...e){let t=e.pop(),i=e.pop();"string"==typeof i||Array.isArray(i)||(e=e.concat(i),i="click"),"string"!=typeof e[0]&&e.unshift("button");const n=d(...e);return(i=Array.isArray(i)?i:[i]).forEach(e=>n.addEventListener(e,t)),n}function s(e,t){e.innerHTML="",a(e,t)}function r(e){return e&&e.constructor&&e.call&&e.apply}function l(e,t,...i){t=e[t];return r(t)?t.call(e,...i):t}function c(e,t){let i=[];return function e(t,i){i(t);t=Object.getPrototypeOf(t);t&&e(t,i)}(e,e=>{i.push(e[t])}),i}function p(e,t){return e.matches?e.matches(t)?e:e.closest(t):null}function q(t,...i){const n={};return Object.keys(t).forEach(function(e){i.includes(e)||(n[e]=t[e])}),n}class e extends HTMLElement{static assignableAttributes=[];static assignableMethods=[];static bindMethods=[];static style="";static watch=[];static get observedAttributes(){return this.watch}_assignableAttributes={};_assignableMethods=[];_attributes={};_cleanupCallbacks=[];is_instantiated=!1;constructor(t={}){super();const n=Object.assign({},t);c(this.constructor,"assignableAttributes").filter(e=>e).reverse().forEach(e=>{Array.isArray(e)?e.forEach(e=>{this._assignableAttributes[e]=this._assignableAttributes[e]||null}):Object.assign(this._assignableAttributes,e)}),Object.keys(this._assignableAttributes).forEach(i=>{Object.defineProperty(this,i,{configurable:!0,enumerable:!0,get:()=>this._attributes[i],set:e=>{var t=this._attributes[i];e!==t&&(this._attributes[i]=e,this.attributeChangedCallback(i,t,e))}}),t.hasOwnProperty(i)?(this._attributes[i]=t[i],delete n[i]):this._attributes[i]=this._assignableAttributes[i]}),c(this.constructor,"assignableMethods").filter(e=>e).reverse().forEach(e=>{e.forEach(e=>{t.hasOwnProperty(e)&&(this[e]=t[e],delete n[e])})}),c(this.constructor,"bindMethods").filter(e=>e).reverse().forEach(e=>{e.forEach(e=>{this[e]=this[e].bind(this)})}),j(this,n)}instantiate(){return Object.keys(this._assignableAttributes).forEach(e=>{var t=this.getAttribute(e)||this.dataset[e]||this[e];"content"==e&&t?(this.removeAttribute("content"),s(this,t)):null!==t&&(this[e]=t)}),this.is_instantiated=!0}connected(){}connectedCallback(){this.trigger("beforeConnect"),this.appendStyle(),!this.is_instantiated&&!1===this.instantiate()||(this.connected(),this.trigger("afterConnect"))}disconnected(){}disconnectedCallback(){this.trigger("beforeDisconnect"),this._cleanupCallbacks.forEach(e=>e()),this._cleanupCallbacks=[],this.disconnected(),this.trigger("afterDisconnect")}changed(e,t,i){}attributeChangedCallback(e,...t){return this[e+"Changed"]&&this[e+"Changed"](...t),this.changed(e,...t)}appendStyle(){if(this.constructor.style){var e=this.getRootNode();const n=this.tagName.toLowerCase();if(e&&e.adoptedStyleSheets&&!e.adoptedStyleSheets.find(e=>e.id==n)){var i=new CSSStyleSheet;let t="";c(this.constructor,"style").forEach(e=>{t+=r(e)?e.bind(this.constructor)():e}),i.replaceSync(t),i.id=n,e.adoptedStyleSheets.push(i)}}}async remove(e){return this.trigger("beforeRemove"),e&&await e(),super.remove(),this.trigger("afterRemove"),this}manageEventListenerFor(...e){this._cleanupCallbacks.push(()=>{e[0].removeEventListener(...e.slice(1))}),e[0].addEventListener(...e.slice(1))}trigger(...e){var t,i;[e,t]=[this,...e],(i=document.createEvent("HTMLEvents")).initEvent(t,!0,!1),e.dispatchEvent(i)}}class P extends e{static observer=new ResizeObserver(e=>{e.forEach(e=>e.target.resize())});static assignableAttributes={columnWidth:"max-content",method:"pop"};static assignableMethods=["initialTemplate"];connected(){this.enable()}disconnected(){this.disable()}cells(e){return Array.from(e.children).map(e=>["grid","inline-grid"].includes(getComputedStyle(e).display)?this.cells(e):e.dataset.autoGridIgnore?null:e).flat().filter(e=>null!==e)}disable(){this.constructor.observer.unobserve(this)}enable(){this.constructor.observer.observe(this)}initialTemplate(e){return e.map(e=>this.columnWidth).join(" ")}resize(){const t=getComputedStyle(this);for(var e,i=this.cells(this),n=this.initialTemplate(i).split(/(?<!\,)\s+/);this.style.setProperty("grid-template-columns",n.join(" ")),e=i.some(e=>e.offsetLeft<this.offsetLeft-parseFloat(t.paddingLeft))||i.some(e=>e.offsetLeft+e.offsetWidth>this.offsetLeft+this.offsetWidth-parseFloat(t.paddingRight)),n[this.method](),1<=n.length&&e;);}static style=`
        auto-grid {
            display: grid;
            grid-template-columns: auto;
        }
    `}window.customElements.define("auto-grid",P);class B extends e{static tagName="komp-modal";connected(){if(this.parentElement.localName!=this.localName+"-popover"){var e=Array.from(this.parentElement.querySelectorAll("komp-modal-popover"));let t=Math.max(...e.map(e=>parseInt(e.dataset.modalOrder||"0")));t++,e.forEach(e=>{e.dataset.modalOrder=e.dataset.modalOrder||t++}),this.container=d(this.tagName+"-popover",{popover:"manual"}),this.replaceWith(this.container),this.container.addEventListener("click",e=>{e.target==this.container&&this.remove()}),this.container.append(this),this.container.append(d(this.tagName+"-close",{content:i({content:'<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'},this.remove.bind(this))})),this.container.showPopover()}}remove(){var e=this.container.parentElement;return this.container.remove(),e&&(e=Array.from(e.querySelectorAll(this.localName+"-popover")).sort((e,t)=>parseInt(t.dataset.modalOrder)-parseInt(e.dataset.modalOrder))[0])&&delete e.dataset.modalOrder,super.remove()}static style=function(){return`
        body:has(komp-modal-popover:popover-open) {
            overflow: hidden;
            pointer-events: none;
        }
        ${this.tagName} {
            display: block;
            pointer-events: auto;
        }
        ${this.tagName}-popover {
            margin: 0;
            inset: 0;
            width: 100%;
            height: 100%;
            
            padding: 2em;
            overflow: auto;
            background: none;
            pointer-events: auto;
            
            display: flex;
            justify-content: center;
            align-items: start;
        }
        ${this.tagName}-popover::backdrop {
            background: rgba(0,0,0, 0.6);
            backdrop-filter: blur(4px);
        }
        ${this.tagName}-popover[data-modal-order]::backdrop {
            display: none;
        }
        
        ${this.tagName}-close {
            width: 0;
            position: relative;
        }
        ${this.tagName}-close button {
            position: absolute;
            bottom: 100%;
            left: 0;
            padding: 0.25em;
            outline: none;
            appearance: none;
            border: none;
            background:none;
            padding: 0;
            margin: 0;
            list-style:none;
            text-decoration: none;
            color: white;
            cursor: pointer;
            opacity: 0.75;
        }
        ${this.tagName}-close button:hover {
            opacity: 1;
        }
    `}}window.customElements.define(B.tagName,B);const W=["start","end"],V=["top","right","bottom","left"].reduce((e,t)=>e.concat(t,t+"-"+W[0],t+"-"+W[1]),[]),b=Math.min,x=Math.max,g=Math.round,f=Math.floor,m=e=>({x:e,y:e}),K={left:"right",right:"left",bottom:"top",top:"bottom"},U={start:"end",end:"start"};function Y(e,t,i){return x(e,b(t,i))}function z(e,t){return"function"==typeof e?e(t):e}function k(e){return e.split("-")[0]}function L(e){return e.split("-")[1]}function G(e){return"x"===e?"y":"x"}function X(e){return"y"===e?"height":"width"}function N(e){return["top","bottom"].includes(k(e))?"y":"x"}function J(e){return G(N(e))}function Q(e,t,i){void 0===i&&(i=!1);var n=L(e),e=J(e),r=X(e);let o="x"===e?n===(i?"end":"start")?"right":"left":"start"===n?"bottom":"top";return[o=t.reference[r]>t.floating[r]?te(o):o,te(o)]}function Z(e){return e.replace(/start|end/g,e=>U[e])}function ee(e,t,i,n){const r=L(e);let o=function(e,t,i){var n=["left","right"],r=["right","left"];switch(e){case"top":case"bottom":return i?t?r:n:t?n:r;case"left":case"right":return t?["top","bottom"]:["bottom","top"];default:return[]}}(k(e),"start"===i,n);return o=r&&(o=o.map(e=>e+"-"+r),t)?o.concat(o.map(Z)):o}function te(e){return e.replace(/left|right|bottom|top/g,e=>K[e])}function ie(e){return"number"!=typeof e?{top:0,right:0,bottom:0,left:0,...e}:{top:e,right:e,bottom:e,left:e}}function v(e){var{x:e,y:t,width:i,height:n}=e;return{width:i,height:n,top:t,left:e,right:e+i,bottom:t+n,x:e,y:t}}function ne(e,t,i){var{reference:n,floating:r}=e,e=N(t),o=J(t),s=X(o),a=k(t),l="y"===e,c=n.x+n.width/2-r.width/2,d=n.y+n.height/2-r.height/2,h=n[s]/2-r[s]/2;let u;switch(a){case"top":u={x:c,y:n.y-r.height};break;case"bottom":u={x:c,y:n.y+n.height};break;case"right":u={x:n.x+n.width,y:d};break;case"left":u={x:n.x-r.width,y:d};break;default:u={x:n.x,y:n.y}}switch(L(t)){case"start":u[o]-=h*(i&&l?-1:1);break;case"end":u[o]+=h*(i&&l?-1:1)}return u}async function re(e,t){var{x:i,y:n,platform:r,rects:o,elements:s,strategy:a}=e,{boundary:t="clippingAncestors",rootBoundary:e="viewport",elementContext:l="floating",altBoundary:c=!1,padding:d=0}=z(t=void 0===t?{}:t,e),d=ie(d),c=s[c?"floating"===l?"reference":"floating":l],h=v(await r.getClippingRect({element:null==(h=await(null==r.isElement?void 0:r.isElement(c)))||h?c:c.contextElement||await(null==r.getDocumentElement?void 0:r.getDocumentElement(s.floating)),boundary:t,rootBoundary:e,strategy:a})),c="floating"===l?{x:i,y:n,width:o.floating.width,height:o.floating.height}:o.reference,t=await(null==r.getOffsetParent?void 0:r.getOffsetParent(s.floating)),e=await(null==r.isElement?void 0:r.isElement(t))&&await(null==r.getScale?void 0:r.getScale(t))||{x:1,y:1},l=v(r.convertOffsetParentRelativeRectToViewportRelativeRect?await r.convertOffsetParentRelativeRectToViewportRelativeRect({elements:s,rect:c,offsetParent:t,strategy:a}):c);return{top:(h.top-l.top+d.top)/e.y,bottom:(l.bottom-h.bottom+d.bottom)/e.y,left:(h.left-l.left+d.left)/e.x,right:(l.right-h.right+d.right)/e.x}}function oe(e){var t=b(...e.map(e=>e.left)),i=b(...e.map(e=>e.top));return{x:t,y:i,width:x(...e.map(e=>e.right))-t,height:x(...e.map(e=>e.bottom))-i}}function se(){return"undefined"!=typeof window}function y(e){return ae(e)?(e.nodeName||"").toLowerCase():"#document"}function w(e){return(null==e||null==(e=e.ownerDocument)?void 0:e.defaultView)||window}function E(e){return null==(e=(ae(e)?e.ownerDocument:e.document)||window.document)?void 0:e.documentElement}function ae(e){return se()&&(e instanceof Node||e instanceof w(e).Node)}function R(e){return!!se()&&(e instanceof Element||e instanceof w(e).Element)}function T(e){return!!se()&&(e instanceof HTMLElement||e instanceof w(e).HTMLElement)}function le(e){return!(!se()||"undefined"==typeof ShadowRoot)&&(e instanceof ShadowRoot||e instanceof w(e).ShadowRoot)}function A(e){var{overflow:e,overflowX:t,overflowY:i,display:n}=S(e);return/auto|scroll|overlay|hidden|clip/.test(e+i+t)&&!["inline","contents"].includes(n)}function ce(t){return[":popover-open",":modal"].some(e=>{try{return t.matches(e)}catch(e){return!1}})}function de(e){var t=he();const i=R(e)?S(e):e;return"none"!==i.transform||"none"!==i.perspective||!!i.containerType&&"normal"!==i.containerType||!t&&!!i.backdropFilter&&"none"!==i.backdropFilter||!t&&!!i.filter&&"none"!==i.filter||["transform","perspective","filter"].some(e=>(i.willChange||"").includes(e))||["paint","layout","strict","content"].some(e=>(i.contain||"").includes(e))}function he(){return!("undefined"==typeof CSS||!CSS.supports)&&CSS.supports("-webkit-backdrop-filter","none")}function C(e){return["html","body","#document"].includes(y(e))}function S(e){return w(e).getComputedStyle(e)}function ue(e){return R(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function H(e){return"html"!==y(e)&&(e=e.assignedSlot||e.parentNode||le(e)&&e.host||E(e),le(e))?e.host:e}function I(e,t,i){void 0===t&&(t=[]),void 0===i&&(i=!0);var n=function e(t){var i=H(t);return C(i)?(t.ownerDocument||t).body:T(i)&&A(i)?i:e(i)}(e),e=n===(null==(e=e.ownerDocument)?void 0:e.body),r=w(n);return e?(e=pe(r),t.concat(r,r.visualViewport||[],A(n)?n:[],e&&i?I(e):[])):t.concat(n,I(n,[],i))}function pe(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function ge(e){var t=S(e);let i=parseFloat(t.width)||0,n=parseFloat(t.height)||0;var t=T(e),r=t?e.offsetWidth:i,t=t?e.offsetHeight:n,e=g(i)!==r||g(n)!==t;return e&&(i=r,n=t),{width:i,height:n,$:e}}function fe(e){return R(e)?e:e.contextElement}function $(e){e=fe(e);if(!T(e))return m(1);var t=e.getBoundingClientRect(),{width:e,height:i,$:n}=ge(e);let r=(n?g(t.width):t.width)/e,o=(n?g(t.height):t.height)/i;return r&&Number.isFinite(r)||(r=1),o&&Number.isFinite(o)||(o=1),{x:r,y:o}}const me=m(0);function ve(e){e=w(e);return he()&&e.visualViewport?{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}:me}function _(e,i,t,n){void 0===i&&(i=!1),void 0===t&&(t=!1);var r=e.getBoundingClientRect(),o=fe(e);let s=m(1);i&&(n?R(n)&&(s=$(n)):s=$(e));i=o,void 0===(e=t)&&(e=!1);t=!(t=n)||e&&t!==w(i)||!e?m(0):ve(o);let a=(r.left+t.x)/s.x,l=(r.top+t.y)/s.y,c=r.width/s.x,d=r.height/s.y;if(o){var i=w(o),h=n&&R(n)?w(n):n;let e=i,t=pe(e);for(;t&&n&&h!==e;){var u=$(t),p=t.getBoundingClientRect(),g=S(t),f=p.left+(t.clientLeft+parseFloat(g.paddingLeft))*u.x,p=p.top+(t.clientTop+parseFloat(g.paddingTop))*u.y;a*=u.x,l*=u.y,c*=u.x,d*=u.y,a+=f,l+=p,e=w(t),t=pe(e)}}return v({width:c,height:d,x:a,y:l})}function ye(e,t){var i=ue(e).scrollLeft;return t?t.left+i:_(E(e)).left+i}function we(e,t,i){let n;var r,o,s;return v(n="viewport"===t?function(e,t){var i=w(e),e=E(e),i=i.visualViewport;let n=e.clientWidth,r=e.clientHeight,o=0,s=0;return i&&(n=i.width,r=i.height,he()&&"fixed"!==t||(o=i.offsetLeft,s=i.offsetTop)),{width:n,height:r,x:o,y:s}}(e,i):"document"===t?function(e){var t=E(e),i=ue(e),n=e.ownerDocument.body,r=x(t.scrollWidth,t.clientWidth,n.scrollWidth,n.clientWidth),o=x(t.scrollHeight,t.clientHeight,n.scrollHeight,n.clientHeight);let s=-i.scrollLeft+ye(e);return e=-i.scrollTop,"rtl"===S(n).direction&&(s+=x(t.clientWidth,n.clientWidth)-r),{width:r,height:o,x:s,y:e}}(E(e)):R(t)?(o=(i=_(r=t,!0,"fixed"===(i=i))).top+r.clientTop,i=i.left+r.clientLeft,s=T(r)?$(r):m(1),{width:r.clientWidth*s.x,height:r.clientHeight*s.y,x:i*s.x,y:o*s.y}):(r=ve(e),{...t,x:t.x-r.x,y:t.y-r.y}))}function be(e,t){var i=t.get(e);if(i)return i;let n=I(e,[],!1).filter(e=>R(e)&&"body"!==y(e)),r=null;var o="fixed"===S(e).position;let s=o?H(e):e;for(;R(s)&&!C(s);){var a=S(s),l=de(s),l=(l||"fixed"!==a.position||(r=null),o?!l&&!r:!l&&"static"===a.position&&!!r&&["absolute","fixed"].includes(r.position)||A(s)&&!l&&function e(t,i){t=H(t);return!(t===i||!R(t)||C(t))&&("fixed"===S(t).position||e(t,i))}(e,s));l?n=n.filter(e=>e!==s):r=a,s=H(s)}return t.set(e,n),n}function xe(e){return"static"===S(e).position}function Le(e,t){if(!T(e)||"fixed"===S(e).position)return null;if(t)return t(e);let i=e.offsetParent;return i=E(e)===i?i.ownerDocument.body:i}function Ee(t,e){var i,n=w(t);if(ce(t))return n;if(!T(t)){let e=H(t);for(;e&&!C(e);){if(R(e)&&!xe(e))return e;e=H(e)}return n}let r=Le(t,e);for(;r&&(i=r,["table","td","th"].includes(y(i)))&&xe(r);)r=Le(r,e);return(!(r&&C(r)&&xe(r))||de(r))&&(r||function(e){let t=H(e);for(;T(t)&&!C(t);){if(de(t))return t;if(ce(t))return null;t=H(t)}return null}(t))||n}const ze={convertOffsetParentRelativeRectToViewportRelativeRect:function(e){var{elements:e,rect:t,offsetParent:i,strategy:n}=e,n="fixed"===n,r=E(i),e=!!e&&ce(e.floating);if(i===r||e&&n)return t;let o={scrollLeft:0,scrollTop:0},s=m(1);var e=m(0),a=T(i);return(a||!a&&!n)&&("body"===y(i)&&!A(r)||(o=ue(i)),T(i))&&(a=_(i),s=$(i),e.x=a.x+i.clientLeft,e.y=a.y+i.clientTop),{width:t.width*s.x,height:t.height*s.y,x:t.x*s.x-o.scrollLeft*s.x+e.x,y:t.y*s.y-o.scrollTop*s.y+e.y}},getDocumentElement:E,getClippingRect:function(e){let{element:i,boundary:t,rootBoundary:n,strategy:r}=e;var o=(e=[..."clippingAncestors"===t?ce(i)?[]:be(i,this._c):[].concat(t),n])[0];return{width:(e=e.reduce((e,t)=>{t=we(i,t,r);return e.top=x(t.top,e.top),e.right=b(t.right,e.right),e.bottom=b(t.bottom,e.bottom),e.left=x(t.left,e.left),e},we(i,o,r))).right-e.left,height:e.bottom-e.top,x:e.left,y:e.top}},getOffsetParent:Ee,getElementRects:async function(e){var t=this.getOffsetParent||Ee,i=await(0,this.getDimensions)(e.floating);return{reference:function(e,t,i){var n=T(t),r=E(t),e=_(e,!0,i="fixed"===i,t);let o={scrollLeft:0,scrollTop:0};var s,a=m(0);!n&&i||("body"===y(t)&&!A(r)||(o=ue(t)),n?(s=_(t,!0,i,t),a.x=s.x+t.clientLeft,a.y=s.y+t.clientTop):r&&(a.x=ye(r)));let l=0,c=0;return!r||n||i||(s=r.getBoundingClientRect(),c=s.top+o.scrollTop,l=s.left+o.scrollLeft-ye(r,s)),{x:e.left+o.scrollLeft-a.x-l,y:e.top+o.scrollTop-a.y-c,width:e.width,height:e.height}}(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:i.width,height:i.height}}},getClientRects:function(e){return Array.from(e.getClientRects())},getDimensions:function(e){var{width:e,height:t}=ge(e);return{width:e,height:t}},getScale:$,isElement:R,isRTL:function(e){return"rtl"===S(e).direction}};function ke(c,t){let d=null,h;const u=E(c);function p(){var e;clearTimeout(h),null!=(e=d)&&e.disconnect(),d=null}return function i(n,r){void 0===n&&(n=!1),void 0===r&&(r=1),p();var{left:e,top:o,width:s,height:a}=c.getBoundingClientRect();if(n||t(),s&&a){n={rootMargin:-f(o)+"px "+-f(u.clientWidth-(e+s))+"px "+-f(u.clientHeight-(o+a))+"px "+-f(e)+"px",threshold:x(0,b(1,r))||1};let t=!0;try{d=new IntersectionObserver(l,{...n,root:u.ownerDocument})}catch(e){d=new IntersectionObserver(l,n)}function l(e){if((e=e[0].intersectionRatio)!==r){if(!t)return i();e?i(!1,e):h=setTimeout(()=>{i(!1,1e-7)},1e3)}t=!1}d.observe(c)}}(!0),p}function Ne(i,t,n,e){void 0===e&&(e={});const{ancestorScroll:r=!0,ancestorResize:o=!0,elementResize:s="function"==typeof ResizeObserver,layoutShift:a="function"==typeof IntersectionObserver,animationFrame:l=!1}=e,c=fe(i),d=r||o?[...c?I(c):[],...I(t)]:[],h=(d.forEach(e=>{r&&e.addEventListener("scroll",n,{passive:!0}),o&&e.addEventListener("resize",n)}),c&&a?ke(c,n):null);let u=-1,p=null;s&&(p=new ResizeObserver(e=>{var[e]=e;e&&e.target===c&&p&&(p.unobserve(t),cancelAnimationFrame(u),u=requestAnimationFrame(()=>{var e;null!=(e=p)&&e.observe(t)})),n()}),c&&!l&&p.observe(c),p.observe(t));let g,f=l?_(i):null;return l&&function e(){const t=_(i);!f||t.x===f.x&&t.y===f.y&&t.width===f.width&&t.height===f.height||n();f=t;g=requestAnimationFrame(e)}(),n(),()=>{var e;d.forEach(e=>{r&&e.removeEventListener("scroll",n),o&&e.removeEventListener("resize",n)}),null!=h&&h(),null!=(e=p)&&e.disconnect(),p=null,l&&cancelAnimationFrame(g)}}function Re(s){return{name:"offset",options:s=void 0===s?0:s,async fn(e){var t,{x:i,y:n,placement:r,middlewareData:o}=e,e=await async function(e,t){var{placement:i,platform:n,elements:r}=e,n=await(null==n.isRTL?void 0:n.isRTL(r.floating)),r=k(i),o=L(i),i="y"===N(i),r=["left","top"].includes(r)?-1:1,n=n&&i?-1:1;let{mainAxis:s,crossAxis:a,alignmentAxis:l}="number"==typeof(t=z(t,e))?{mainAxis:t,crossAxis:0,alignmentAxis:null}:{mainAxis:t.mainAxis||0,crossAxis:t.crossAxis||0,alignmentAxis:t.alignmentAxis};return o&&"number"==typeof l&&(a="end"===o?-1*l:l),i?{x:a*n,y:s*r}:{x:s*r,y:a*n}}(e,s);return r===(null==(t=o.offset)?void 0:t.placement)&&null!=(t=o.arrow)&&t.alignmentOffset?{}:{x:i+e.x,y:n+e.y,data:{...e,placement:r}}}}}function Te(m){return{name:"autoPlacement",options:m=void 0===m?{}:m,async fn(e){var{rects:t,middlewareData:i,placement:n,platform:r,elements:o}=e;const{crossAxis:s=!1,alignment:a,allowedPlacements:l=V,autoAlignment:c=!0,...d}=z(m,e);var h,u,p=void 0!==a||l===V?(u=c,p=l,((h=a||null)?[...p.filter(e=>L(e)===h),...p.filter(e=>L(e)!==h)]:p.filter(e=>k(e)===e)).filter(e=>!h||L(e)===h||!!u&&Z(e)!==e)):l,e=await re(e,d),g=(null==(g=i.autoPlacement)?void 0:g.index)||0,f=p[g];return null==f?{}:(t=Q(f,t,await(null==r.isRTL?void 0:r.isRTL(o.floating))),n!==f?{reset:{placement:p[0]}}:(r=[e[k(f)],e[t[0]],e[t[1]]],e=[...(null==(o=i.autoPlacement)?void 0:o.overflows)||[],{placement:f,overflows:r}],(t=p[g+1])?{data:{index:g+1,overflows:e},reset:{placement:t}}:(f=(null==(o=(i=e.map(e=>{var t=L(e.placement);return[e.placement,t&&s?e.overflows.slice(0,2).reduce((e,t)=>e+t,0):e.overflows[0],e.overflows]}).sort((e,t)=>e[1]-t[1])).filter(e=>e[2].slice(0,L(e[0])?2:3).every(e=>e<=0))[0])?void 0:o[0])||i[0][0])!==n?{data:{index:g+1,overflows:e},reset:{placement:f}}:{}))}}}function Ae(g){return{name:"shift",options:g=void 0===g?{}:g,async fn(e){var{x:t,y:i,placement:n}=e;const{mainAxis:r=!0,crossAxis:o=!1,limiter:s={fn:e=>{var{x:e,y:t}=e;return{x:e,y:t}}},...a}=z(g,e);var l,c={x:t,y:i},d=await re(e,a),n=N(k(n)),h=G(n);let u=c[h],p=c[n];r&&(c=u+d["y"===h?"top":"left"],l=u-d["y"===h?"bottom":"right"],u=Y(c,u,l)),o&&(c=p+d["y"===n?"top":"left"],l=p-d["y"===n?"bottom":"right"],p=Y(c,p,l));d=s.fn({...e,[h]:u,[n]:p});return{...d,data:{x:d.x-t,y:d.y-i,enabled:{[h]:r,[n]:o}}}}}}function Ce(E){return{name:"flip",options:E=void 0===E?{}:E,async fn(e){const{placement:t,middlewareData:i,rects:n,initialPlacement:r,platform:o,elements:s}=e,{mainAxis:a=!0,crossAxis:l=!0,fallbackPlacements:c,fallbackStrategy:d="bestFit",fallbackAxisSideDirection:h="none",flipAlignment:u=!0,...p}=z(E,e);if(null==(g=i.arrow)||!g.alignmentOffset){var g=k(t);const x=N(r);var f=k(r)===r,m=await(null==o.isRTL?void 0:o.isRTL(s.floating)),f=c||(f||!u?[te(r)]:(v=te(f=r),[Z(f),v,Z(v)]));const L="none"!==h;!c&&L&&f.push(...ee(r,u,h,m));var v=[r,...f],f=await re(e,p),e=[],y=(null==(w=i.flip)?void 0:w.overflows)||[];if(a&&e.push(f[g]),l&&(w=Q(t,n,m),e.push(f[w[0]],f[w[1]])),y=[...y,{placement:t,overflows:e}],!e.every(e=>e<=0)){var w,b,m=((null==(g=i.flip)?void 0:g.index)||0)+1,f=v[m];if(f)return{data:{index:m,overflows:y},reset:{placement:f}};let e=null==(w=y.filter(e=>e.overflows[0]<=0).sort((e,t)=>e.overflows[1]-t.overflows[1])[0])?void 0:w.placement;if(!e)switch(d){case"bestFit":{const t=null==(b=y.filter(e=>{return!L||(e=N(e.placement))===x||"y"===e}).map(e=>[e.placement,e.overflows.filter(e=>0<e).reduce((e,t)=>e+t,0)]).sort((e,t)=>e[1]-t[1])[0])?void 0:b[0];t&&(e=t);break}case"initialPlacement":e=r}if(t!==e)return{reset:{placement:e}}}}return{}}}}function Se(w){return{name:"size",options:w=void 0===w?{}:w,async fn(e){var{placement:t,rects:i,platform:n,elements:r}=e;const{apply:o=()=>{},...s}=z(w,e);var a=await re(e,s),l=k(t),c=L(t),t="y"===N(t),{width:i,height:d}=i.floating;let h,u;"top"===l||"bottom"===l?(h=l,u=c===(await(null==n.isRTL?void 0:n.isRTL(r.floating))?"start":"end")?"left":"right"):(u=l,h="end"===c?"top":"bottom");var l=d-a.top-a.bottom,p=i-a.left-a.right,g=b(d-a[h],l),f=b(i-a[u],p),m=!e.middlewareData.shift;let v=g,y=f;null!=(g=e.middlewareData.shift)&&g.enabled.x&&(y=p),null!=(f=e.middlewareData.shift)&&f.enabled.y&&(v=l),m&&!c&&(g=x(a.left,0),p=x(a.right,0),f=x(a.top,0),l=x(a.bottom,0),t?y=i-2*(0!==g||0!==p?g+p:x(a.left,a.right)):v=d-2*(0!==f||0!==l?f+l:x(a.top,a.bottom))),await o({...e,availableWidth:y,availableHeight:v});m=await n.getDimensions(r.floating);return i!==m.width||d!==m.height?{reset:{rects:!0}}:{}}}}const He=v=>({name:"arrow",options:v,async fn(e){var{x:t,y:i,placement:n,rects:r,platform:o,elements:s,middlewareData:a}=e,{element:e,padding:l=0}=z(v,e)||{};if(null==e)return{};var l=ie(l),t={x:t,y:i},i=J(n),c=X(i),d=await o.getDimensions(e),h="y"===i,u=h?"top":"left",p=h?"bottom":"right",h=h?"clientHeight":"clientWidth",g=r.reference[c]+r.reference[i]-t[i]-r.floating[c],f=t[i]-r.reference[i],e=await(null==o.getOffsetParent?void 0:o.getOffsetParent(e));let m=e?e[h]:0;g=g/2-f/2,f=(m=m&&await(null==o.isElement?void 0:o.isElement(e))?m:s.floating[h]||r.floating[c])/2-d[c]/2-1,o=b(l[u],f),e=b(l[p],f),s=o,h=m-d[c]-e,u=m/2-d[c]/2+g,l=Y(s,u,h),p=!a.arrow&&null!=L(n)&&u!==l&&r.reference[c]/2-(u<s?o:e)-d[c]/2<0,f=p?u<s?u-s:u-h:0;return{[i]:t[i]+f,data:{[i]:l,centerOffset:u-l-f,...p&&{alignmentOffset:f}},reset:p}}});function Ie(s){return{name:"inline",options:s=void 0===s?{}:s,async fn(e){const{placement:c,elements:t,rects:i,platform:n,strategy:r}=e,{padding:o=2,x:d,y:h}=z(s,e);e=Array.from(await(null==n.getClientRects?void 0:n.getClientRects(t.reference))||[]);const u=function(e){var t=e.slice().sort((e,t)=>e.y-t.y),i=[];let n=null;for(let e=0;e<t.length;e++){var r=t[e];!n||r.y-n.y>n.height/2?i.push([r]):i[i.length-1].push(r),n=r}return i.map(e=>v(oe(e)))}(e),p=v(oe(e)),g=ie(o);e=await n.getElementRects({reference:{getBoundingClientRect:function(){if(2===u.length&&u[0].left>u[1].right&&null!=d&&null!=h)return u.find(e=>d>e.left-g.left&&d<e.right+g.right&&h>e.top-g.top&&h<e.bottom+g.bottom)||p;if(2<=u.length){var e,t;if("y"===N(c))return i=u[0],n=u[u.length-1],r="top"===k(c),{top:e=i.top,bottom:o=n.bottom,left:t=(r?i:n).left,right:r=(r?i:n).right,width:r-t,height:o-e,x:t,y:e};const s="left"===k(c),a=x(...u.map(e=>e.right)),l=b(...u.map(e=>e.left));var i=u.filter(e=>s?e.left===l:e.right===a),n=i[0].top,r=i[i.length-1].bottom,o=l;return{top:n,bottom:r,left:o,right:a,width:a-o,height:r-n,x:o,y:n}}return p}},floating:t.floating,strategy:r});return i.reference.x!==e.reference.x||i.reference.y!==e.reference.y||i.reference.width!==e.reference.width||i.reference.height!==e.reference.height?{reset:{rects:e}}:{}}}}const $e=(e,t,i)=>{var n=new Map,i={platform:ze,...i},n={...i.platform,_c:n};return(async(t,i,e)=>{var{placement:n="bottom",strategy:r="absolute",middleware:e=[],platform:o}=e,s=e.filter(Boolean),a=await(null==o.isRTL?void 0:o.isRTL(i));let l=await o.getElementRects({reference:t,floating:i,strategy:r}),{x:c,y:d}=ne(l,n,a),h=n,u={},p=0;for(let e=0;e<s.length;e++){var{name:g,fn:f}=s[e],{x:f,y:m,data:v,reset:y}=await f({x:c,y:d,initialPlacement:n,placement:h,strategy:r,middlewareData:u,rects:l,platform:o,elements:{reference:t,floating:i}});c=null!=f?f:c,d=null!=m?m:d,u={...u,[g]:{...u[g],...v}},y&&p<=50&&(p++,"object"==typeof y&&(y.placement&&(h=y.placement),y.rects&&(l=!0===y.rects?await o.getElementRects({reference:t,floating:i,strategy:r}):y.rects),{x:c,y:d}=ne(l,h,a)),e=-1)}return{x:c,y:d,placement:h,strategy:r,middlewareData:u}})(e,t,{...i,platform:n})};class _e extends e{static tagName="komp-floater";static assignableAttributes={content:null,anchor:null,placement:void 0,strategy:"absolute",flip:null,offset:null,shift:!0,arrow:null,autoPlacement:!0,inline:null,autoUpdate:{},removeOnBlur:!1,container:null,timeout:0};static bindMethods=["show","hide","checkFocus","checkEscape"];instantiate(){super.instantiate(),"string"==typeof this.anchor&&(this.anchor=this.getRootNode().querySelector(this.anchor))}connected(){if(this.style.position=this.strategy,!this.anchor)throw"Floater needs anchor to position to.";const t=[];Object.keys(De).forEach(e=>{if(this[e])if("arrow"==e){let e=this.querySelector("komp-floater-arrow-locator");e||(e=d("komp-floater-arrow-locator"),this.prepend(e)),t.push(He({element:e})),this.classList.add("komp-floater-arrow"),"number"==typeof this.arrow&&this.style.setProperty("--arrow-size",this.arrow+"px"),this.offset||(this.offset=!0===this.arrow?10:this.arrow)}else t.push(De[e](!0===this[e]?{}:this[e]))}),this._cleanupCallbacks.push(Ne(this.anchor,this,()=>{$e(this.anchor,this,{strategy:this.strategy,placement:this.placement,middleware:t}).then(({x:e,y:t,placement:i,middlewareData:n})=>{if(this.style.left=e+"px",this.style.top=t+"px",this.classList.remove("-top","-left","-bottom","-right"),this.classList.add("-"+i),n.arrow){const{x:e,y:t}=n.arrow;null!=e&&this.style.setProperty("--arrow-left",e+"px"),null!=t&&this.style.setProperty("--arrow-top",t+"px")}})},this.autoUpdate)),this.classList.add("-in"),this.addEventListener("animationend",()=>{this.classList.remove("-in")},{once:!0}),this.removeOnBlur&&(this.manageEventListenerFor(this.getRootNode().body,"focusin",this.checkFocus),this.manageEventListenerFor(this.getRootNode().body,"click",this.checkFocus),this.manageEventListenerFor(this.getRootNode().body,"keyup",this.checkEscape))}checkFocus(e){e.defaultPrevented||e.target==this||e.target==this.anchor||this.contains(e.target)||this.anchor.contains(e.target)||this.hide()}checkEscape(e){27==e.which&&this.hide()}remove(){return new Promise(e=>{this.classList.add("-out");var t=()=>{this.classList.remove("-out"),super.remove().then(e)};"none"!=o(this,"animation-name")?this.addEventListener("animationend",t,{once:!0}):t()})}show(){return this._hideTimeout&&(clearTimeout(this._hideTimeout),delete this._hideTimeout),this._removing?this._removing.then(this.show):("string"==typeof this.container&&(this.container=this.closest(this.container)||this.anchor.closest(this.container)),null==this.container&&(this.container=this.parentElement||this.anchor.parentElement),this.parentElement||(this._showing=!0,this.container.append(this),this._showing=!1,this.trigger("shown")),this)}hide(){if(!this._hideTimeout&&!this._hiding)return this._hideTimeout=setTimeout(async()=>{this.parentElement&&(this._removing=this.remove().then(()=>{this.trigger("hidden"),delete this._hideTimeout,delete this._removing}))},this.timeout),this}toggle(e){return this[(e="boolean"!=typeof e?null!==this.offsetParent:e)?"hide":"show"](),this}static style=`
        .komp-floater-arrow {
            --arrow-size: 0.5em;
            --arrow-left: 0;
            --arrow-top: 0;
        }
        .komp-floater-arrow:after{
            content: '';
            clip-path: polygon(0 0, 50% 100%, 100% 0);
            z-index: 1;
            position:absolute;
            top: calc(var(--arrow-top) - var(--arrow-size));
            left: calc(var(--arrow-left) - var(--arrow-size));
            width: calc(var(--arrow-size) * 2);
            height: var(--arrow-size);
            overflow: hidden;
            border-style: solid;
            border-width: inherit;
            box-shadow: inherit;
            background: inherit;
            border: inherit;
        }
        .komp-floater-arrow.-top:after{
            top: 100%;
        }
        .komp-floater-arrow.-bottom:after{
            top: auto;
            bottom: 100%;
            transform: rotate(180deg);
        }
        .komp-floater-arrow.-left:after,
        .komp-floater-arrow.-right:after {
            clip-path: polygon(0 0, 100% 50%, 0 100%);
            width: var(--arrow-size);
            height: calc(var(--arrow-size) * 2);
        }
        .komp-floater-arrow.-left:after{
            left: 100%;
        }
        .komp-floater-arrow.-right:after{
            left: auto;
            right: 100%;
            transform: rotate(180deg);
        }
        komp-floater-arrow-locator {
            position: absolute;
            left: 0;
            top: 0;
            width: 0;
            height 0;
        }
    `}window.customElements.define("komp-floater",_e);const De={size:Se,shift:Ae,autoPlacement:Te,flip:Ce,inline:Ie,arrow:He,offset:Re};class Oe extends e{static assignableAttributes={data:[],columns:void 0,defaultColSize:"max-content"};static tagName="komp-data-table";_columns=[];constructor(e,...t){super(e,...t),this.columns?this.initColumns(this.columns):this.constructor.columns&&this.initColumns(this.constructor.columns)}instantiate(...e){e=super.instantiate(...e);return this.render(),e}render(){this.innerHTML="";const n=[],r=d(this.tagName+"-header");this.append(r);let o=0;return this._columns.forEach(i=>{(Array.isArray(i.columns)?i.columns.map(t=>(Object.keys(i).forEach(e=>{null==t[e]&&(t[e]=i[e])}),t)):[i]).forEach(e=>{var t=this.renderHeader.bind(this)(e);t.colIndex=o+1,t.rowIndex="header",t.classList.add("col-"+t.colIndex,"row-header"),a(r,t),n.push(e.width||""+this.defaultColSize),o++})}),this.style.gridTemplateColumns=n.join(" "),this.renderRows(),this}renderRows(){Array.from(this.querySelectorAll(this.tagName+"-row")).forEach(e=>{e.remove()}),this.data.forEach((n,r)=>{const o=this.renderRow(n);this.append(o),this._columns.forEach((e,t)=>{const i=this.renderCell(n,e);e.columns&&(i.classList.add("column-span"),i.style.setProperty("--columns",e.columns.length)),i.render=()=>{s(i,l(e,"render",n,i,e,this))},i.colIndex=t+1,i.rowIndex=r+1,i.classList.add("col-"+i.colIndex,"row-"+i.rowIndex),o.append(i),i.render()})})}removeCell(e){e.remove()}renderRow(){return d(this.tagName+"-row")}renderHeader(e){return d(this.tagName+"-cell",{content:l(e,"header")})}renderCell(e,t,i){return d(this.tagName+"-cell",Object.assign({},t,i))}initColumns(t){return Array.isArray(t)?this._columns=t.map(e=>this.initColumn(e.id,e)):this._columns=Object.keys(t).map(e=>this.initColumn(e,t[e]))}initColumn(e,t){let i={id:e,render:this.defaultRender(e,t),header:this.defaultHeader(e,t)};return r(t)?i.render=t:Array.isArray(t)?i=Object.assign(i,{render:t[0]},q(t,"header","render")):"object"==typeof t?i=Object.assign(i,t):i.render=this.defaultRender(e,t),i}defaultHeader(e){return e}defaultRender(t){return e=>e[t]}static style=function(){return`
        ${this.tagName} {
            display: grid;
        }
        ${this.tagName}-cell{
            padding: var(--cell-padding);
        }
        ${this.tagName}-cell.column-span {
            display: grid;
            grid-template-columns: subgrid;
            grid-column: span var(--columns, 1);
        }
        ${this.tagName}-header,
        ${this.tagName}-row,
        ${this.tagName}-handles {
            display: grid;
            grid-template-columns: subgrid;
            grid-column: 1 / -1;
        }
        @supports (not (grid-template-columns: subgrid)) {
            ${this.tagName}-header,
            ${this.tagName}-row,
            ${this.tagName}-handles {
                display: contents;
            }
            ${this.tagName}-cell.column-span {
                grid-template-columns: repeat(var(--columns, 1), auto);
            }
        }
    `}}window.customElements.define(Oe.tagName,Oe);class t extends e{static tagName="komp-input";static assignableAttributes={record:null,attribute:null,dump:(e,t)=>e,load:(e,t)=>e};constructor(e={}){Object.assign({},e);var t={button:Pe.prototype,checkbox:Me.prototype,radio:Me.prototype,select:Be.prototype,date:je.prototype,textarea:qe.prototype,"datetime-local":Fe.prototype}[e.type];super(q(e,...O)),"function"!=typeof this.dump&&(this.dump=e=>e),"function"!=typeof this.load&&(this.load=e=>e),t&&(this.__proto__=t),this.input=this.createInput(e),this._load(),this.append(this.input),this.setupInputListener(this.inputChange.bind(this)),this.setupRecordListener(this.recordChange.bind(this))}get value(){this.input.value}set value(e){this.input.value=e}createInput(e){return d("input",Object.assign({type:"text"},e))}setupInputListener(e){this.input.addEventListener("change",e)}setupRecordListener(e){this.record.addEventListener&&this.record.addEventListener("change",e),this.record.addListener&&this.record.addListener(e)}inputChange(){var e=this.load(this._loadValue()),t=this._dump();this.trigger("change",t,e)}recordChange(){this._load()}_load(e,t){t=this.load(t||this._loadValue());null!=t&&(this.input.value=t)}_loadValue(){return function e(t,i,n){var r=(i=Array.isArray(i)?i:[i])[0];return i=i.slice(1),t.hasOwnProperty(r)?0<i.length?e(t[r],i,n):t[r]:n}(this.record,this.attribute)}_dump(e,t){t=this.dump(t||this.input.value,this.record);return this._dumpValue(t)}_dumpValue(e){let t=Array.isArray(this.attribute)?this.attribute:[this.attribute];return t=t.concat([e]),function e(t,...i){var n;2==i.length?t[i[0]]=i[1]:(t[n=i.shift()]instanceof Object||(t[n]={}),e(t[n],...i))}(this.record,...t),e}static style=`
        komp-input {
            display: contents;
        }
    `}window.customElements.define(t.tagName,t);class Me extends t{_load(){var e=this.load(this._loadValue()),t="on"==this.input.value||this.input.value;this.input.multiple?this.input.checked=!!Array.isArray(e)&&e.includes(t):this.input.checked=e==t}_dump(){let e,t="on"==this.input.value||this.input.value;var i;return e=this.input.multiple?(i=this._loadValue()||[],this.input.checked?i.includes(t)?this.dump(i):this.dump(i.concat(t)):this.dump(i.filter(e=>e!=t))):"boolean"==typeof t?this.dump(this.input.checked?t:!t):this.dump(this.input.checked?this.input.value:null),this._dumpValue(e)}}class je extends t{setupInputListener(){this.input.addEventListener("blur",this._dump.bind(this))}_load(e){let t=this._loadValue();t instanceof Date&&(t=[t.getUTCFullYear(),(t.getMonth()+1).toString().padStart(2,"0"),t.getDate().toString().padStart(2,"0")].join("-")),super._load(e,t)}_dump(e){let t=this.input.value;""==t&&(t=null),super._dump(e,t)}}class Fe extends t{_load(e){let t=this._loadValue();t instanceof Date&&(t=[[t.getUTCFullYear(),(t.getMonth()+1).toString().padStart(2,"0"),t.getDate().toString().padStart(2,"0")].join("-"),"T",[t.getHours().toString().padStart(2,"0"),t.getMinutes().toString().padStart(2,"0")].join(":")].join("")),super._load(e,t)}}class qe extends t{createInput(e){return d("textarea",e)}}class Pe extends t{createInput(e){return d("button",e)}setupInputListener(){this.input.addEventListener("click",this._dump.bind(this))}_load(){}}class Be extends t{createInput(e){const t=d("select",e);return e.includeBlank&&t.append(d("option",Object.assign({content:"Unset",value:null},e.includeBlank))),e.options.forEach(e=>{t.append(d("option",{content:Array.isArray(e)?e[1]:e,value:Array.isArray(e)?e[0]:e}))}),t}_load(e){if(this.input.multiple){const t=this.load(this._loadValue());this.input.querySelectorAll("option").forEach(e=>{t.includes(e.value)?e.setAttribute("selected",!0):e.removeAttribute("selected")})}else super._load()}_dump(e){var t;if(this.input.multiple)return t=Array.from(this.input.options).filter(e=>e.selected).map(e=>e.value),this._dumpValue(this.dump(t)),t;{let e=this.input.value;return"null"==e&&(e=null),e=this.dump(e),this._dumpValue(e),e}}}class We extends _e{static watch=["anchor"];static assignableAttributes={autoPlacement:!1,flip:!0,shift:!0,strategy:"absolute",placement:"top",arrow:!0,timeout:300};_showing=!1;constructor(e,...t){super(e,...t),this.anchor&&this.anchorChanged(this.anchor,this.anchor),void 0===e&&(this.needsFirstRemoval=!0)}connected(){if(super.connected(),this.getRootNode()==this.anchor.getRootNode()&&0==this._showing)return F(this),!1}anchorChanged(e,t){e&&e instanceof Element&&(e.removeEventListener("mouseenter",this.show.bind(this)),e.removeEventListener("mouseleave",this.hide.bind(this))),t&&t instanceof Element&&(t.addEventListener("mouseenter",this.show.bind(this)),t.addEventListener("mouseleave",this.hide.bind(this)))}}window.customElements.define("komp-tooltip",We);class Ve extends We{static assignableAttributes={mouseevent:"click",placement:"bottom",arrow:!1,removeOnBlur:!0,timeout:0};connected(...e){return this.addEventListener("mouseenter",this.clearHide.bind(this)),"mouseenter"==this.mouseevent&&this.addEventListener("mouseleave",this.hide.bind(this)),super.connected(...e)}show(){super.show(),this.anchor.classList.add("-active")}hide(){super.hide(),this.anchor.classList.remove("-active")}anchorChanged(e,t){"mouseenter"==this.mouseevent?super.anchorChanged(e,t):(e&&e instanceof HTMLElement&&e.removeEventListener(this.mouseevent,this.toggle.bind(this)),t&&t instanceof HTMLElement&&t.addEventListener(this.mouseevent,this.toggle.bind(this)))}clearHide(){this._hideTimeout&&(clearTimeout(this._hideTimeout),delete this._hideTimeout)}}window.customElements.define("komp-dropdown",Ve);class Ke extends e{static assignableAttributes={timeout:2e3,animation:!0};constructor(...e){super(...e),this.setAttribute("popover","manual")}connected(){this.showPopover()}add(e,t){this.hidePopover(),this.showPopover();e=new Ue(e,Object.assign({timeout:this.timeout,dismissable:this.dismissable},t));return a(this,e),e}static style=`
        komp-notification-center {
            overflow: visible;
            background: none;
            position: fixed;
            margin: 4px;
            inset: unset;
            bottom: 0;
            right: 0;
            display: flex;
            flex-direction: column;
            align-items: end;
            gap: 1px;
            transition: all 150ms;
        }
        komp-notification {
            backdrop-filter: blur(2px);
            display: flex;
            gap: 1em;
            align-items: start;
        }
        komp-notification .dismiss-button {
            outline: none;
            appearance: none;
            border: none;
            background:none;
            padding: 0;
            margin: 0;
            cursor: pointer;
            opacity: 0.75;
            color: currentColor;
        }
        komp-notification .dismiss-button:hover {
            opacity: 1;
        }
    `}window.customElements.define("komp-notification-center",Ke);class Ue extends e{static assignableAttributes=Ke.assignableAttributes;constructor(e,t){super(t),s(this,d({class:"komp-notification-body",content:e})),a(this,i({type:"button",class:"dismiss-button",content:`
                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
                <circle cx="12.5" cy="12.5" r="11" stroke-dasharray="0% 300%" />
                <line x1="16" y1="8" x2="8" y2="16"></line><line x1="8" y1="8" x2="16" y2="16"></line>
                </svg>`},e=>{this.remove()}))}connected(){this.addEventListener("mouseenter",this.clearTimeout),this.addEventListener("mouseleave",this.restartTimeout),this.timer=this.querySelector(".dismiss-button circle").animate([{strokeDasharray:"300% 300%"},{strokeDasharray:"0% 300%"}],{duration:this.timeout,iterations:1}),this.timer.finished.then(()=>this.remove()),this.animation&&this.animate([{opacity:0,easing:"ease-out",marginBottom:-1*this.offsetHeight+"px"},{opaicty:1,marginBottom:"0px"}],Object.assign({duration:150,iterations:1},this.animation))}remove(...e){if(this.animation)return this.animate([{opaicty:1,marginBottom:"0px",easing:"ease-in"},{opacity:0,marginBottom:-1*this.offsetHeight+"px"}],Object.assign({duration:150,iterations:1},this.animation)).finished.then(()=>{super.remove.call(this,...e)});super.remove.call(this,...e)}clearTimeout(){this.timer.pause(),this.timer.currentTime=0}restartTimeout(){this.timer.play()}}window.customElements.define("komp-notification",Ue);class Ye extends e{static tagName="komp-dropzone";static assignableAttributes={enabled:!0,onFileDrop:null,overlay:{content:"Drag Here"}};static bindMethods=["windowDragEnter","windowDragLeave","windowDrop","drop","dragOver","dragEnter","dragLeave"];constructor(...e){super(...e),"object"!=typeof this.overlay||this.overlay instanceof HTMLElement||(this.overlay=d("komp-dropzone-overlay",Object.assign({},this.constructor.assignableAttributes.overlay,this.overlay)))}addEventListeners(){this.getRootNode()&&(this.getRootNode().addEventListener("dragenter",this.windowDragEnter),this.getRootNode().addEventListener("dragleave",this.windowDragLeave),this.getRootNode().addEventListener("drop",this.windowDrop)),this.addEventListener("drop",this.drop),this.addEventListener("dragover",this.dragOver),this.addEventListener("dragenter",this.dragEnter),this.addEventListener("dragleave",this.dragLeave)}removeEventListeners(){this.getRootNode()&&(this.getRootNode().removeEventListener("dragenter",this.windowDragEnter),this.getRootNode().removeEventListener("dragleave",this.windowDragLeave),this.getRootNode().removeEventListener("drop",this.windowDrop)),this.removeEventListener("drop",this.drop),this.removeEventListener("dragover",this.dragOver),this.removeEventListener("dragenter",this.dragEnter),this.removeEventListener("dragleave",this.dragLeave)}connected(){"static"==o(this,"position")&&(this.style.position="relative"),this.enabled&&this.addEventListeners()}disconnected(){this.enabled&&this.removeEventListeners()}enable(){this.enabled||(this.enabled=!0,this.addEventListeners())}disable(){0!=this.enabled&&(this.enabled=!1,this.removeEventListeners())}drop(e){e.target!=this&&!this.contains(e.target)||(e.preventDefault(),[...e.dataTransfer.files].forEach(e=>{this.onFileDrop&&this.onFileDrop(e),this.trigger("filedrop",e)}))}dragEnter(e){e.preventDefault(),this.overlay.classList.add("active")}dragLeave(e){e.preventDefault(),this.contains(e.relatedTarget)||this.overlay.classList.remove("active")}dragOver(e){e.preventDefault()}windowDragEnter(e){e.preventDefault(),e.relatedTarget&&e.relatedTarget.getRootNode()==this.getRootNode()||(this.overlay.classList.remove("active"),this.append(this.overlay))}windowDragLeave(e){e.preventDefault(),e.relatedTarget&&e.relatedTarget.getRootNode()==this.getRootNode()||this.overlay.remove()}windowDrop(e){e.preventDefault(),this.overlay.remove()}static style=`
        komp-dropzone {
            display: inline-block;
            position: relative;
        }
        komp-dropzone-overlay {
            display: flex;
            position:absolute;
            inset: 0;
            border: 2px dashed blue;
            background: rgba(255,255,255, 0.5);
            backdrop-filter: blur(2px);
            z-index:2;
            color: blue;
            font-weight: bold;
            align-items: center;
            justify-content: center;
            pointer-events: none;
        }
        komp-dropzone-overlay.active {
            background: rgba(0,0,0, 0.3);
            color: black;
        }
    `}window.customElements.define(Ye.tagName,Ye);class D extends e{static tagName="komp-content-area";static assignableAttributes=["onchange"];static assignableMethods=["load"];constructor(e={}){var t=(e=Object.assign({tabIndex:0,contenteditable:!0},e)).content;delete e.content,super(e),s(this,this.load(t||e.value));let i=this.dump(this.innerText);this.addEventListener("focusout",e=>{var t=this.dump(this.innerText);i!=t&&(this.onchange&&this.onchange(t,i),this.trigger("change",t,i))})}dump(e){return e.trimEnd().replaceAll("<br>","\n")}load(e){return e="string"==typeof e?e.replaceAll("\n","<br>"):e}static style=`
        komp-content-area {
            appearance: textfield;
            background-color: white;
            border-width: 1px;
            padding: 0.22em;
            display: inline-block;
            min-width: 4ch;
        }
    `}function Ge(e={}){return e.horizontal?`
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        	 viewBox="0 0 2 18" style="enable-background:new 0 0 2 18;" xml:space="preserve" width="2" height="18" fill="currentColor">
        <circle cy="6" cx="1" r="1"/>
        <circle cy="10" cx="1" r="1"/>
        <circle cy="14" cx="1" r="1"/>
        </svg>
        `:`
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    	 viewBox="0 0 24 2" style="enable-background:new 0 0 24 2;" xml:space="preserve" width="24" height="2" fill="currentColor">
    <circle cy="1" cx="6" r="1"/>
    <circle cy="1" cx="12" r="1"/>
    <circle cy="1" cx="18" r="1"/>
    </svg>
    `}window.customElements.define(D.tagName,D);class Xe extends Oe{static tagName="komp-spreadsheet";static assignableAttributes={reorder:["col","row"],resize:["col","row"]};constructor(...e){super(...e),!0===this.reorder?this.reorder=["col","row"]:!1===this.reorder?this.reorder=new Array:"string"==typeof this.reorder&&(this.reorder=[this.reorder]),!0===this.resize?this.resize=["col","row"]:!1===this.resize?this.resize=[]:"string"==typeof this.resize&&(this.resize=[this.resize]),this.cellTag=this.constructor.tagName+"-cell",this.rowTag=this.constructor.tagName+"-row",this.menuTag=this.constructor.tagName+"-menu",this.inputTag=this.constructor.tagName+"-input",this.reorderHandleTag=this.constructor.tagName+"-reorder-handle",this.resizeHandleTag=this.constructor.tagName+"-resize-handle",this.dragBoxTag=this.constructor.tagName+"-drag-box",this.addEventListenerFor(this.cellTag,"mousedown",e=>{2==e.button?e.delegateTarget.classList.contains("selected")?e.preventDefault():this.deselectCells():(e.metaKey||e.shiftKey||this.deselectCells(),this.initializeCellSelection(e.delegateTarget,e))}),this.addEventListenerFor(this.cellTag,"mouseover",e=>{this.showReorderHandleFor(e.delegateTarget),this.showResizeHandleFor(e.delegateTarget)}),this.addEventListenerFor(this.cellTag,"keydown",e=>{e.delegateTarget.classList.contains("input")?("Escape"==e.key&&(e.delegateTarget.remove(),e.delegateTarget.originalCell.focus()),this.deselectCells({copySelection:!0})):["ArrowRight","ArrowLeft","ArrowDown","ArrowUp"].includes(e.key)?(e.preventDefault(),this.changeFocusByDirection(e.key,e.delegateTarget,e)):e.altKey||e.ctrlKey||e.metaKey||!e.key.match(/^[a-z0-0\-\_\$]$/i)?"Enter"==e.key&&e.delegateTarget==this.getRootNode().activeElement&&(e.preventDefault(),this.activateCellInput(e.delegateTarget,e)):this.activateCellInput(e.delegateTarget,e)}),this.addEventListenerFor(this.cellTag,"dblclick",e=>{this.activateCellInput(e.delegateTarget,e)}),this.addEventListener("mouseleave",e=>{this.querySelectorAll(this.tagName+"-handle").forEach(e=>e.remove())}),this.addEventListener("contextmenu",e=>{e.preventDefault();e=p(e.target,this.cellTag);e&&this.renderContextMenu(e)}),this.observer=new ResizeObserver(e=>{for(const t of e)t.target.classList.contains("frozen-col")&&(this.style.scrollPaddingLeft=t.target.offsetWidth+"px")}),this.querySelectorAll(this.cellTag).forEach(e=>{this.observer.observe(e)})}connected(){this.getRootNode()&&(this.manageEventListenerFor(this.getRootNode(),"paste",e=>{this.contains(document.activeElement)&&(e.preventDefault(),this.pasteCells(e.clipboardData.getData("text/plain")))}),this.manageEventListenerFor(this.getRootNode(),"copy",e=>{this.contains(document.activeElement)&&(e.preventDefault(),this.copyCells(document.activeElement))}))}remove(...e){this.observer.disconnect(),delete this.observer,super.remove(...e)}initColumn(i,e,...t){t=super.initColumn(i,e,...t);return t.input=e.input||this.defaultInput(i,e),t.copy=e=>e[i],t.paste=(e,t)=>e[i]=t,t}defaultRender(i){return e=>{let t=e[i];return t="string"==typeof t?t.replaceAll("\n","<br>"):t}}defaultHeader(i,e){let t=e.header;return"object"!=typeof t&&(t={content:t||i}),Object.assign({content:i,class:this.tagName.toLowerCase()+"-input",input:(t,e)=>new D({value:t.header.content,style:{padding:o(e,"padding")},onchange:e=>{t.header.content=e,this.trigger("headerChange",i,e)}})},t)}renderHeader(e){const t=d(this.tagName+"-cell",e.header);return t.classList.add("header","frozen-row",!0===e.frozen?"frozen-col":null),t.tabIndex=0,t.columnModel=e,t.render=()=>{s(t,l(e.header,"content",e))},t}defaultInput(r){return(t,e,i)=>{let n=t[r];return"keydown"==i.type&&"Enter"!=i.key&&(n=""),new D({value:n,class:this.tagName.toLowerCase()+"-input",style:{padding:o(e,"padding")},onchange:e=>t[r]=e})}}renderCell(e,t,...i){i=super.renderCell(e,t,...i);return i.record=e,i.tabIndex=0,i.columnModel=t,i.classList.toggle("frozen-col",!0===t.frozen),this.observer&&this.observer.observe(i),i}removeCell(...e){return this.observe.unobserve(el),super.removeCell(...e)}changeFocusByDirection(n,r,o){if(r=r||this.querySelector(`${this.cellTag}:focus, ${this.cellTag}:focus-within`)){let i,e=r.rowIndex;switch("header"==e&&(e=0),n){case"ArrowDown":i=this.querySelector(`.row-${e+1}.col-`+r.colIndex);break;case"ArrowUp":i=this.querySelector(`.row-${e-1}.col-`+r.colIndex);break;case"ArrowLeft":i=this.querySelector(`.row-${e}.col-`+(r.colIndex-1));break;case"ArrowRight":i=this.querySelector(`.row-${e}.col-`+(r.colIndex+1))}if(i){i.focus();var s=this.getBoundingClientRect(),n=this.querySelector(this.cellTag+".frozen-row"),a=this.querySelector(this.cellTag+".frozen-col");n&&(s.y=s.top+n.offsetHeight,s.height=s.height-n.offsetHeight),a&&(s.x=s.left+a.offsetWidth,s.width=s.width-a.offsetWidth);let t=i.getBoundingClientRect();if(this.classList.add("unfreeze"),t.top<s.top&&this.scrollBy({left:0,top:t.top-s.top,behavior:"instant"}),t.bottom>s.bottom){let e=t.bottom-s.bottom;for(;t.bottom>s.bottom&&e<this.offsetHeight;)this.scrollBy({left:0,top:e,behavior:"instant"}),e+=5,t=i.getBoundingClientRect()}if(t.left<s.left&&this.scrollBy({left:t.left-s.left,top:0,behavior:"instant"}),t.right>s.right){let e=t.right-s.right;for(;t.right>s.right&&e<this.offsetWidth;)this.scrollBy({left:e,top:0,behavior:"instant"}),e+=5,t=i.getBoundingClientRect()}if(this.classList.remove("unfreeze"),o&&o.shiftKey){let e=this.querySelector(".selection-start");e||(r.classList.add("selection-start"),e=r),this.deselectCells({selectionStart:!1}),this.selectCells(e,i)}else this.deselectCells({selectionStart:!0})}}}activateCellInput(t,e){this.deselectCells({copySelection:!0});let i;if(i=t.classList.contains("header")?l(t.columnModel.header,"input",t.columnModel,t,e):l(t.columnModel,"input",t.record,t,e)){e=t.classList.contains("header")?"":" body";const r=d(this.cellTag,{class:"input",content:{tag:this.tagName+"-inputfield",content:i},style:{gridArea:[t.rowIndex+e,t.colIndex+" body",t.rowIndex+e,t.colIndex+" body"].join(" / ")}});r.classList.toggle("frozen-row",t.classList.contains("frozen-row")),r.classList.toggle("frozen-col",t.classList.contains("frozen-col")),u(t,r),r.originalCell=t;e=r.querySelector("input, textarea, button, [contenteditable]");e&&((e=e).focus(),(n=document.createRange()).selectNodeContents(e),n.collapse(!1),(e=window.getSelection()).removeAllRanges(),e.addRange(n)),t.tabIndex=-1,r.beforeRemove=()=>{t.tabIndex=0,t.render()},r.addEventListener("focusout",e=>{r.beforeRemove(),r.remove()}),r.addEventListener("keydown",e=>{"Enter"==e.key&&[e.metaKey,e.ctrlKey,e.altKey,e.shiftKey].every(e=>0==e)&&this.changeFocusByDirection("ArrowDown",t,e)})}var n}renderContextMenu(t){if(this.contextMenu&&this.contextMenu.anchor==t)return this.contextMenu.show();this.contextMenu&&this.contextMenu.hide();var e=null!=window.navigator.clipboard.readText||this.copyData;return this.contextMenu=new _e({anchor:t,placement:"right-end",shift:!0,flip:!0,autoPlacement:!1,removeOnBlur:!0,class:this.constructor.tagName+"-menu",content:[i("button",{content:"Copy"},e=>{this.copyCells(t),this.contextMenu.hide()}),i("button",{content:"Paste",disabled:!e},async e=>{null==window.navigator.clipboard.readText?this.pasteCells(this.copyData):this.pasteCells(await window.navigator.clipboard.readText()),this.contextMenu.hide()})]}),this.append(this.contextMenu),this.contextMenu}initializeAxisResize(e){const r=e.target.parentElement.classList.contains("row")?"row":"col";var t="row"==r?this.rowResizeHandle:this.colResizeHandle;const i="row"==r?"rowIndex":"colIndex";var n=t[i]-(e.target.classList.contains("start")?1:0);const o=e["row"==r?"y":"x"]-this.querySelector(`${this.cellTag}.${r}-`+n)["row"==r?"offsetHeight":"offsetWidth"],s=function(e,t){if(!Array.isArray(e))return e;const i=[];return t=t||((e,t)=>!t.includes(e)),e.forEach(e=>{t(e,i)&&i.push(e)}),i}(Array.from(this.querySelectorAll(this.cellTag+".header.selected")).map(e=>e[i])).concat(n),a=(t.offsetWidth,this["col"==r?"scrollLeft":"scrollTop"]-this["col"==r?"offsetLeft":"offsetTop"]);this.classList.add("resizing"),this.dragIndicator=d(this.constructor.tagName+"-drag-indicator",{class:r,style:{["col"==r?"gridRow":"gridColumn"]:"handles / -1"}}),this.append(this.dragIndicator);let l=e=>{this.dragIndicator.style.insetInlineStart=e["col"==r?"x":"y"]+a+"px"},c=(l=l.bind(this),e=>{let t=e["row"==r?"y":"x"]-o,i=(t<0&&(t=0),this.style["gridTemplate"+("row"==r?"Rows":"Columns")].split(" [body] "));s.forEach(e=>{i[e]=t+"px"}),this.style["gridTemplate"+("row"==r?"Rows":"Columns")]=i.join(" [body] ");const n="row"==r?this.data:this._columns;this.trigger(s.map(e=>n[e].id),r+"Resize",t),this.dragIndicator.remove(),delete this.dragIndicator,this.classList.remove("resizing"),this.removeEventListener("mousemove",l),this.removeEventListener("mouseup",c)});c=c.bind(this),this.addEventListener("mousemove",l),this.addEventListener("mouseup",c)}showResizeHandleFor(e){!this.colResizeHandle&&this.resize.includes("col")&&(this.colResizeHandle=d(this.resizeHandleTag,{class:"col",content:[{class:"start"},{class:"end"}]}),this.manageEventListenerFor(this.colResizeHandle,"mousedown",this.initializeAxisResize.bind(this)),this.append(this.colResizeHandle)),!this.rowResizeHandle&&this.resize.includes("row")&&(this.rowResizeHandle=d(this.resizeHandleTag,{class:"row",content:[{class:"start"},{class:"end"}]}),this.manageEventListenerFor(this.rowResizeHandle,"mousedown",this.initializeAxisResize.bind(this)),this.append(this.rowResizeHandle)),this.classList.contains("resizing")||(this.colResizeHandle&&(this.colResizeHandle.rowIndex=1,this.colResizeHandle.colIndex=e.colIndex,this.colResizeHandle.style.gridArea=["header","body "+e.colIndex,"header","body "+e.colIndex].join(" / "),this.colResizeHandle.classList.toggle("hide-start",e.classList.contains("col-1")),this.colResizeHandle.classList.toggle("hide-end",e.classList.contains("col-"+e.parentElement.children.length)),this.colResizeHandle.classList.toggle("frozen-row",e.classList.contains("frozen-row")),e.classList.contains("row-header")?this.append(this.colResizeHandle):this.colResizeHandle.remove()),this.rowResizeHandle&&(this.rowResizeHandle.rowIndex=e.rowIndex,this.rowResizeHandle.colIndex=1,this.rowResizeHandle.style.gridArea=["body "+e.rowIndex,"body","body "+e.rowIndex,"body"].join(" / "),this.rowResizeHandle.classList.toggle("frozen-col",e.classList.contains("frozen-col")),e.classList.contains("col-1")?this.append(this.rowResizeHandle):this.rowResizeHandle.remove()))}initializeAxisReorder(e){const l=e.currentTarget.classList.contains("row")?"row":"col",n="row"==l?this.rowReorderHandle:this.colReorderHandle;let c,i=(e.dataTransfer.setDragImage(d(),0,0),this.deselectCells({copySelection:!0}),"col"==l?(this.dragStartIndex=n.colIndex,n.style.width=n.offsetWidth+"px",n.style.left=e.x-n.offsetWidth/2+this.scrollLeft-this.offsetLeft+"px",this.querySelectorAll(this.cellTag+".col-"+n.colIndex).forEach(e=>e.classList.add("selecting"))):(this.dragStartIndex=n.rowIndex,n.style.height=n.offsetHeight+"px",n.style.top=e.y-n.offsetHeight/2+this.scrollTop-this.offsetTop+"px",this.querySelectorAll(this.cellTag+".row-"+n.rowIndex).forEach(e=>e.classList.add("selecting"))),n.style.gridArea=null,this.classList.add("reordering"),this.dragIndicator=d(this.constructor.tagName+"-drag-indicator",{class:l,style:{["col"==l?"gridRow":"gridColumn"]:"handles / -1"}}),this.append(this.dragIndicator),e=>{e.preventDefault();var t,i=p(e.target,this.cellTag+", "+this.reorderHandleTag);c=i,"col"==l?(t=(t=(t=e.x-n.offsetWidth/2+this.scrollLeft-this.offsetLeft)<0?0:t)>this.scrollWidth-n.offsetWidth?this.scrollWidth-n.offsetWidth:t,n.style.left=t+"px",i&&(this.dragIndicator.style.gridColumn=`body ${i.colIndex} / body `+i.colIndex,this.dragIndicator.classList.toggle("end",i.colIndex>this.dragStartIndex))):(t=(t=(t=e.y-n.offsetHeight/2+this.scrollLeft-this.offsetTop)<0?0:t)>this.scrollHeight-n.offsetHeight?this.scrollHeight-n.offsetHeight:t,n.style.top=t+"px",i&&(this.dragIndicator.style.gridRow=`body ${i.rowIndex} / body `+i.rowIndex,this.dragIndicator.classList.toggle("end",i.rowIndex>this.dragStartIndex)))}),r=(i=i.bind(this),e=>{e=p(e.target,this.cellTag+", "+this.reorderHandleTag)||c;if(c=e){const n="col"==l?"colIndex":"rowIndex",r="col"==l?"gridColumn":"gridRow",o=e[n],s=this.dragStartIndex,a=o>s?-1:1;this.querySelectorAll(this.cellTag).forEach(e=>{var t,i;e.classList.remove(l+"-"+e[n]),e[n]==s?(t=(e[n]=o)+Math.max(a,0),i=-1==a?u:h,"col"==l?i(e.parentElement.querySelector(this.cellTag+".col-"+t),e):i(this.querySelector(this.cellTag+`.row-${t}.col-`+e.colIndex).parentElement,e.parentElement)):(e[n]==o||Math.min(s,o)<e[n]&&e[n]<Math.max(s,o))&&(e[n]+=a),e.classList.contains("header")&&"row"==l||(e.style[r+"Start"]="body "+e[n],e.style[r+"End"]="body "+e[n]),e.classList.add(l+"-"+e[n])});var e=this.style["gridTemplate"+("row"==l?"Rows":"Columns")].split(" [body] "),t=e[s];e.splice(s,1),e.splice(o,0,t),this.style["gridTemplate"+("row"==l?"Rows":"Columns")]=e.join(" [body] "),this.trigger(l+"Reorder",o,s)}this.querySelectorAll(this.cellTag+".selecting").forEach(e=>{e.classList.remove("selecting"),e.classList.add("selected")})}),o=(r=r.bind(this),e=>{var t=c||this.querySelector(`${this.cellTag}.selecting, ${this.cellTag}.selected`);this.dragIndicator.remove(),delete this.dragIndicator,this.classList.remove("reordering"),n.style.left="",n.style.width="",n.style.top="",n.style.height="",this.showReorderHandleFor(t),this.querySelectorAll(this.cellTag+".selecting").forEach(e=>{e.classList.remove("selecting")}),this.removeEventListener("dragover",i),this.removeEventListener("drop",r),this.removeEventListener("dragend",o)});o=o.bind(this),this.addEventListener("dragover",i),this.addEventListener("drop",r),this.addEventListener("dragend",o)}showReorderHandleFor(e){!this.colReorderHandle&&this.reorder.includes("col")&&(this.colReorderHandle=d(this.reorderHandleTag,{class:"col",draggable:!0,content:{content:Ge()}}),this.manageEventListenerFor(this.colReorderHandle,"dragstart",this.initializeAxisReorder.bind(this))),!this.rowReorderHandle&&this.reorder.includes("row")&&(this.rowReorderHandle=d(this.reorderHandleTag,{class:"row",draggable:!0,content:{content:Ge({horizontal:!0})}}),this.manageEventListenerFor(this.rowReorderHandle,"dragstart",this.initializeAxisReorder.bind(this))),this.classList.contains("reordering")||(this.colReorderHandle&&(this.colReorderHandle.rowIndex=1,this.colReorderHandle.colIndex=e.colIndex,this.colReorderHandle.style.gridArea=["handles","body "+e.colIndex,"handles","body "+e.colIndex].join(" / "),e.classList.contains("frozen-col")?this.colReorderHandle.remove():this.append(this.colReorderHandle)),this.rowReorderHandle&&(this.rowReorderHandle.rowIndex=e.rowIndex,this.rowReorderHandle.colIndex=1,this.rowReorderHandle.style.gridArea=["body "+e.rowIndex,"handles","body "+e.rowIndex,"handles"].join(" / "),e.classList.contains("frozen-row")?this.rowReorderHandle.remove():this.append(this.rowReorderHandle)))}initializeCellSelection(o,e){if(this.getRootNode()){e.shiftKey&&(this.deselectCells(),o=this.querySelector(this.cellTag+":focus"),e.preventDefault());const n=e=>{e=p(e.target,this.cellTag);if(e){this.querySelectorAll(this.cellTag+".selecting").forEach(e=>e.classList.remove("selecting"));var i=[o.colIndex,e.colIndex];if(o.classList.contains("header"))for(let e=Math.min(...i);e<=Math.max(...i);e++)this.querySelectorAll(".col-"+e).forEach(e=>e.classList.add("selecting"));else{var n=[o.rowIndex,e.rowIndex];for(let t=Math.min(...n);t<=Math.max(...n);t++)for(let e=Math.min(...i);e<=Math.max(...i);e++){var r=this.querySelector(`.row-${t}.col-`+e);r&&r.classList.add("selecting")}}}};e.shiftKey&&n(e),o.classList.contains("header")&&n(e);this.getRootNode().addEventListener("mouseup",e=>{var t,i=p(e.target,this.cellTag);o.classList.contains("header")||i&&i!=o?((t=this.querySelectorAll(this.cellTag+".selecting")).forEach(e=>e.classList.remove("selecting")),this.selectCells(...Array.from(t))):e?.metaKey?i.classList.add("selected"):this.deselectCells(),this.removeEventListener("mouseover",n),o.focus()},{once:!0}),this.addEventListener("mouseover",n)}}selectCells(...e){let i=e[e.length-1]instanceof HTMLElement?{}:e.pop();i=Object.assign({outline:!0,class:"selected"},i);var t=e=>Math.min(...e.filter(e=>"number"==typeof e)),n=e=>Math.max(...e.filter(e=>"number"==typeof e)),r=(i,e)=>[...Array(e-i+1).fill().map((e,t)=>t+i)];const o=[];let s=e.map(e=>e.rowIndex),a=(s=s.filter(e=>"header"==e).concat(r(t(s),n(s))),e.map(e=>e.colIndex));return a=a.filter(e=>"header"==e).concat(r(t(a),n(a))),i.class&&s.forEach(t=>{a.forEach(e=>{e=this.querySelector(`.row-${t}.col-`+e);e&&(e.classList.add(i.class),o.push(e))})}),i.outline&&((r=d("string"==typeof i.outline?i.outline:this.tagName+"-selection",{style:{gridArea:[s[0],a[0],s[s.length-1]+1,a[a.length-1]+1].map(e=>"header"==e?e:"body "+e).join(" / ")}})).classList.toggle("includes-frozen-row",e.some(e=>e.classList.contains("frozen-row"))),r.classList.toggle("includes-frozen-col",e.some(e=>e.classList.contains("frozen-col"))),this.append(r)),o}deselectCells(e={}){(e=Object.assign({selected:!0,selection:!0,inputfield:!0,selectionStart:!0,copySelection:!1},e)).selected&&this.querySelectorAll(this.cellTag+".selected").forEach(e=>e.classList.remove("selected")),e.selection&&this.querySelectorAll(this.tagName+"-selection").forEach(e=>e.remove()),e.inputfield&&this.querySelectorAll(this.cellTag+"-inputfield").forEach(e=>{e.beforeRemove(),e.remove()}),e.selectionStart&&this.querySelectorAll(this.cellTag+".selection-start").forEach(e=>e.classList.remove("selection-start")),e.copySelection&&this.querySelectorAll(this.tagName+"-copy-selection").forEach(e=>e.remove())}selectedCells(){let e=this.querySelectorAll(`${this.cellTag}.selected, ${this.cellTag}:focus, ${this.cellTag}:focus-within`);if(0==e.length){if(!this.contextMenu)return[];e=[this.contextMenu.anchor]}const t=function(e,i){const n={};return e.forEach(e=>{let t;t=r(i)?n[i(e)]:l(e,i),n[t]=n[t]||[],n[t].push(e)}),n}(e,"rowIndex");return Object.keys(t).map(e=>t[e])}copyCells(e){var t=this.selectedCells(),i=this.selectedCells().map(e=>e.map(e=>e.columnModel.copy(e.record)).join("\t")).join("\n");window.navigator.clipboard.writeText(i),this.copyData=i,this.deselectCells({copySelection:!0}),this.selectCells(...t.flat(),{outline:this.tagName+"-copy-selection"})}pasteCells(e){if(null!=e){var t=this.selectedCells();const r=e.split("\n").map(e=>e.split("\t"));if(1==t.length&&1==t[0].length){const o=t[0][0];let n=o.rowIndex;const s=[];r.forEach(e=>{let i=o.colIndex;e.forEach(e=>{var t=this.querySelector(this.cellTag+(`.col-${i}.row-`+n));t&&(this.pasteCell(t,e),s.push(t)),i++}),n++}),this.selectCells(...s),o.focus()}else{let i=0;t.forEach(e=>{i=i==r.length?0:i;let t=0;e.forEach(e=>{t=t==r[i].length?0:t,this.pasteCell(e,r[i][t]),t++}),i++})}this.querySelectorAll(this.tagName+"-copy-selection").forEach(e=>e.remove())}}pasteCell(e,t){e.columnModel.paste(e.record,t),e.render()}static style=function(){return`
        ${this.tagName} {
            --select-color: #1a73e8;
            --handle-size: 10px;
            position: relative;
            overflow: scroll;
            scroll-snap-type: both mandatory;
        }
        ${this.tagName}.unfreeze .frozen-col,
        ${this.tagName}.unfreeze .frozen-row {
            position: relative;
        }
        ${this.tagName}-cell {
            cursor: cell;
            user-select: none;
            position: relative;
            scroll-snap-stop: always;
            scroll-snap-align: start;
            overflow: hidden;
            white-space: nowrap;
        }
        ${this.tagName} .frozen-col,
        ${this.tagName} .frozen-row {
            position: sticky;
            left: 0;
            top: auto;
        }
        ${this.tagName} .frozen-row {
            top: 0;
        }
        ${this.tagName}-cell:focus {
            box-shadow: inset 0 0 0 1px var(--select-color), 0 0 0 1px var(--select-color);
            outline: none;
        }
        ${this.tagName}-cell.selecting,
        ${this.tagName}-cell.selected {
            box-shadow: inset 0 0 0 999px rgba(26, 115, 232, 0.1);
            &:focus {
                box-shadow: inset 0 0 0 999px rgba(26, 115, 232, 0.1), inset 0 0 0 1px var(--select-color), 0 0 0 1px var(--select-color);
            }
        }
        
        ${this.tagName}-selection {
            pointer-events: none;
            border: 1px solid var(--select-color);
        }
        ${this.tagName}-copy-selection {
            pointer-events: none;
            border: 2px dashed var(--select-color);
        }
        
        ${this.tagName}-cell.input {
            overflow: visible;
        }
        ${this.tagName}-inputfield {
            position: absolute;
            top: 0;
            left: 0;
            min-width: 100%;
            min-height: 100%;
            box-shadow: inset 0 0 0 1px var(--select-color), 0 0 0 1px var(--select-color), 0 0 0 3px rgba(26, 115, 232, 0.5);
            background: white;
            display: flex;
            flex-direction: column;
        }
        ${this.tagName}-input {
            min-width: 100%;
            outline: none;
            border: none;
            background: none;
            flex: 1 0 auto;
            white-space: nowrap;
        }
        
        .${this.tagName}-menu {
            border-radius: 0.35em;
            background: white;
            padding: 0.5em;
            font-size: 0.8em;
            box-shadow: 0 2px 12px 2px rgba(0,0,0, 0.2), 0 1px 2px 1px rgba(0,0,0, 0.3);
        }
        .${this.tagName}-menu > button {
            display: block;
            outline: none;
            appearance: none;
            border: none;
            background:none;
            padding: 0.2em 0.5em;
            border-radius: 0.25em;
        }
        .${this.tagName}-menu > button:disabled {
            opacity: 0.5;
        }
        .${this.tagName}-menu > button:disabled:hover {
            background: white;
            color: inherit;
        }
        .${this.tagName}-menu > button:hover {
            background: var(--select-color);
            color: white;
        }
        
        ${this.tagName}-resize-handle {
            position: sticky;
            block-size-start: 0;
            pointer-events: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: col-resize;
        }
        ${this.tagName}-resize-handle.row {
            writing-mode: vertical-lr;
            cursor: row-resize;
            block-size: 20px;
        }
        ${this.tagName}-resize-handle .start,
        ${this.tagName}-resize-handle .end {
            pointer-events: auto;
            block-size: 50%;
            inline-size: 11px;
            border: 3px none currentColor;
            border-inline-style: solid;
            opacity: 0.2;
            margin-inline: -6px;
        }
        ${this.tagName}-resize-handle .start:hover,
        ${this.tagName}-resize-handle .end:hover {
            opacity: 1;
            border-color: var(--select-color);
        }
        ${this.tagName}-resize-handle.hide-start .start {
            pointer-events: none;
            opacity: 0;
        }
        ${this.tagName}-resize-handle.hide-end .end {
            pointer-events: none;
            opacity: 0;
        }

        ${this.tagName}-reorder-handle {
            position: sticky;
            inset-block-start: 0;
        }
        ${this.tagName}-reorder-handle.row {
            writing-mode: vertical-lr;
        }
        ${this.tagName}.reordering ${this.tagName}-cell {
            cursor: grabbing;
        }
        ${this.tagName}.reordering ${this.tagName}-reorder-handle {
            position: absolute;
            background: rgba(0,0,0, 0.2);
            block-size: 100%;
            pointer-events: none;
        }
        ${this.tagName}-reorder-handle > * {
            top: 1px;
            inline-size: 100%;
            block-size: var(--handle-size);
            display: flex;
            cursor: grab;
            justify-content: center;
            padding-block-start: 2px;
        }
        ${this.tagName}-reorder-handle > *:hover {
            background: rgba(26, 115, 232, 0.1);
        }
        
        ${this.tagName}-drag-indicator {
            pointer-events: none;
            position: absolute;
            block-size: 100%;
            inline-size: 3px;
            inset-block-start: 0;
            background: var(--select-color);
        }
        ${this.tagName}-drag-indicator.row {
            writing-mode: vertical-lr;
        }
        ${this.tagName}-cell { z-index: 1; }
        ${this.tagName}-cell:focus {z-index: 2; }
        ${this.tagName}-cell.input { z-index: 3 }
        
        ${this.tagName}-resize-handle { z-index: 31; }
        ${this.tagName}-selection { z-index: 35; }
        ${this.tagName}-copy-selection { z-index: 36; }
        
        ${this.tagName} .frozen-row { z-index: 40; }
        ${this.tagName}-cell.input.frozen-row { z-index: 41; }
        ${this.tagName}-resize-handle.frozen-row { z-index: 42; }
        ${this.tagName}-selection.includes-frozen-row { z-index: 43; }
        ${this.tagName}-copy-selection.includes-frozen-row { z-index: 44; }
        ${this.tagName}-reorder-handle { z-index: 45; }
        
        ${this.tagName} .frozen-col { z-index: 50; }
        ${this.tagName}-cell.input.frozen-col { z-index: 51; }
        ${this.tagName}-resize-handle.frozen-col { z-index: 52; }
        ${this.tagName}-selection.includes-frozen-col { z-index: 53; }
        ${this.tagName}-copy-selection.includes-frozen-col { z-index: 54; }
        ${this.tagName}-reorder-handle.row { z-index: 55; }
        
        ${this.tagName} .frozen-col.frozen-row { z-index: 59; }
        
        ${this.tagName}-drag-indicator { z-index: 60; }
        
        .${this.tagName}-menu { z-index: 70; }
        
    `};addEventListenerFor(...e){return n(this,...e)}}window.customElements.define(Xe.tagName,Xe);var Je=Object.freeze({__proto__:null,AutoGrid:P,ContentArea:D,DataTable:Oe,Dropdown:Ve,Dropzone:Ye,Element:e,Floater:_e,Input:t,Modal:B,NotificationCenter:Ke,Spreadsheet:Xe,Tooltip:We});Object.keys(Je).forEach(e=>{window[e]=Je[e]}),document.addEventListener("DOMContentLoaded",function(){n(document,".js-toggle-source","click",e=>{document.querySelector(e.delegateTarget.getAttribute("rel")).classList.toggle("hide")})})}();