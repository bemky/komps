!function(){"use strict";function i(e,t,i,r,o={}){e.addEventListener(i,e=>{e.target.matches(t)?(e.delegateTarget=e.target,r(e)):e.target.closest(t)&&(e.delegateTarget=e.target.closest(t),r(e))},o)}const O=["accept","accept-charset","accesskey","action","align","allow","alt","async","autocapitalize","autocomplete","autofocus","autoplay","background","bgcolor","border","buffered","capture","challenge","charset","checked","cite","class","code","codebase","color","cols","colspan","content","contenteditable","contextmenu","controls","coords","crossorigin","csp","data","data-*","datetime","decoding","default","defer","dir","dirname","disabled","download","draggable","dropzone","enctype","enterkeyhint","for","form","formaction","formenctype","formmethod","formnovalidate","formtarget","headers","height","hidden","high","href","hreflang","http-equiv","icon","id","importance","integrity","intrinsicsize","inputmode","ismap","itemprop","keytype","kind","label","lang","language","loading","list","loop","low","manifest","max","maxlength","minlength","media","method","min","multiple","muted","name","novalidate","open","optimum","pattern","ping","placeholder","poster","preload","radiogroup","readonly","referrerpolicy","rel","required","reversed","rows","rowspan","sandbox","scope","scoped","selected","shape","size","sizes","slot","span","spellcheck","src","srcdoc","srclang","srcset","start","step","style","summary","tabindex","target","title","translate","type","usemap","value","width","wrap","aria","aria-*"],j=["disabled","readOnly","multiple","checked","autobuffer","autoplay","controls","loop","selected","hidden","scoped","async","defer","reversed","isMap","seemless","muted","required","autofocus","noValidate","formNoValidate","open","pubdate","itemscope"];function F(r,o={}){Object.keys(o).forEach(t=>{if(0!=O.filter(e=>t.match(new RegExp(e))).length||"children"==t){const i=o[t];var e=j.find(e=>e.toUpperCase()==t.toUpperCase());if(e)return!1!==i?r[e]=!0:void 0;switch(t){case"tag":return;case"value":return r.value=i;case"data":if("object"==typeof i)return Object.keys(i).forEach(e=>{r.dataset[e]="object"==typeof i[e]?JSON.stringify(i[e]):i[e]});break;case"style":if("object"==typeof i)return Object.keys(i).forEach(e=>{r.style[e]=i[e]});break;case"content":case"children":return void l(r,i)}r.setAttribute(t,i)}})}function d(e="div",t={}){"object"==typeof e&&(e=(t=e).tag||"div");e=document.createElement(e);return F(e,t),e}function h(e,t){if(Array.isArray(t)||t instanceof NodeList||t instanceof HTMLCollection){for(var i=Array.from(t);0<i.length;)e=h(e,i.pop());return e}if(Array.isArray(e)||e instanceof NodeList||e instanceof HTMLCollection)return h(e[0],t);if(e.parentNode)return t instanceof Node||(t=new Text(t)),e.parentNode.insertBefore(t,e),t;throw"argument of insertBefore unsupported"}function a(e){return e instanceof NodeList||e instanceof Array||e instanceof HTMLCollection?(e=Array.from(e)).forEach(a):e.parentNode.removeChild(e),e}function l(t,e,i,r,o){if(o=o||"append",Array.isArray(e)||e instanceof NodeList||e instanceof HTMLCollection)Array.from(e).forEach(e=>l(t,e,i,r));else if(i instanceof Element)Array.from(arguments).slice(1).filter(e=>e instanceof Element).forEach(e=>l(t,e));else if("boolean"!=typeof i&&(r=i,i=void 0),null!=e){var n;if(e instanceof Promise||e.then){const s=document.createElement("span");return t[o](s),(new Date).getMilliseconds(),e.then(e=>{l(s,e,i,r),h(s,s.childNodes),a(s)})}return e instanceof Element||e instanceof Node?t[o](e):"function"==typeof e?l(t,e.bind(r)(t),i,r):"object"==typeof e?t[o](d(e)):i?t[o](e):((n=document.createElement("div")).innerHTML=e,t[o](...n.childNodes))}}function n(e,t){return getComputedStyle(e)[t]}function u(e,t){if(Array.isArray(t)||t instanceof NodeList||t instanceof HTMLCollection){for(var i=Array.from(t);0<i.length;)e=u(e,i.shift());return e}if(Array.isArray(e)||e instanceof NodeList||e instanceof HTMLCollection)return u(e[e.length-1],t);if(e.parentNode)return t instanceof Node||(t=new Text(t)),e.parentNode.insertBefore(t,e.nextSibling),t;throw"argument of insertAfter unsupported"}function r(...e){let t=e.pop(),i=e.pop();"string"==typeof i||Array.isArray(i)||(e=e.concat(i),i="click"),"string"!=typeof e[0]&&e.unshift("button");const r=d(...e);return(i=Array.isArray(i)?i:[i]).forEach(e=>r.addEventListener(e,t)),r}function s(e,t){e.innerHTML="",l(e,t)}function o(e){return e&&e.constructor&&e.call&&e.apply}function c(e,t,...i){t=e[t];return o(t)?t.call(e,...i):t}function g(e,t){let i=[];return function e(t,i){i(t);t=Object.getPrototypeOf(t);t&&e(t,i)}(e,e=>{i.push(e[t])}),i}function p(e,t){return e.matches?e.matches(t)?e:e.closest(t):null}function q(t,...i){const r={};return Object.keys(t).forEach(function(e){i.includes(e)||(r[e]=t[e])}),r}class e extends HTMLElement{static assignableAttributes=[];static assignableMethods=[];static bindMethods=[];static style="";static watch=[];static get observedAttributes(){return this.watch}_assignableAttributes={};_assignableMethods=[];_attributes={};_cleanupCallbacks=[];is_instantiated=!1;constructor(t={}){super();const r=Object.assign({},t);g(this.constructor,"assignableAttributes").filter(e=>e).reverse().forEach(e=>{Array.isArray(e)?e.forEach(e=>{this._assignableAttributes[e]=this._assignableAttributes[e]||null}):Object.assign(this._assignableAttributes,e)}),Object.keys(this._assignableAttributes).forEach(i=>{Object.defineProperty(this,i,{configurable:!0,enumerable:!0,get:()=>this._attributes[i],set:e=>{var t=this._attributes[i];e!==t&&(this._attributes[i]=e,this.attributeChangedCallback(i,t,e))}}),t.hasOwnProperty(i)?(this._attributes[i]=t[i],delete r[i]):this._attributes[i]=this._assignableAttributes[i]}),g(this.constructor,"assignableMethods").filter(e=>e).reverse().forEach(e=>{e.forEach(e=>{t.hasOwnProperty(e)&&(this[e]=t[e],delete r[e])})}),g(this.constructor,"bindMethods").filter(e=>e).reverse().forEach(e=>{e.forEach(e=>{this[e]=this[e].bind(this)})}),F(this,r)}instantiate(){return Object.keys(this._assignableAttributes).forEach(e=>{var t=this.getAttribute(e)||this.dataset[e]||this[e];"content"==e&&t?(this.removeAttribute("content"),s(this,t)):null!==t&&(this[e]=t)}),this.is_instantiated=!0}connected(){}connectedCallback(){this.trigger("beforeConnect"),this.appendStyle(),!this.is_instantiated&&!1===this.instantiate()||(this.connected(),this.trigger("afterConnect"))}disconnected(){}disconnectedCallback(){this.trigger("beforeDisconnect"),this._cleanupCallbacks.forEach(e=>e()),this._cleanupCallbacks=[],this.disconnected(),this.trigger("afterDisconnect")}changed(e,t,i){}attributeChangedCallback(e,...t){return this[e+"Changed"]&&this[e+"Changed"](...t),this.changed(e,...t)}appendStyle(){if(this.constructor.style){var e=this.getRootNode();const r=this.tagName.toLowerCase();if(e&&e.adoptedStyleSheets&&!e.adoptedStyleSheets.find(e=>e.id==r)){var i=new CSSStyleSheet;let t="";g(this.constructor,"style").forEach(e=>{t+=o(e)?e.bind(this.constructor)():e}),i.replaceSync(t),i.id=r,e.adoptedStyleSheets.push(i)}}}async remove(e){return this.trigger("beforeRemove"),e&&await e(),super.remove(),this.trigger("afterRemove"),this}manageEventListenerFor(...e){this._cleanupCallbacks.push(()=>{e[0].removeEventListener(...e.slice(1))}),e[0].addEventListener(...e.slice(1))}trigger(...e){var t,i;[e,t]=[this,...e],(i=document.createEvent("HTMLEvents")).initEvent(t,!0,!1),e.dispatchEvent(i)}}class P extends e{static observer=new ResizeObserver(e=>{e.forEach(e=>e.target.resize())});static assignableAttributes={columnWidth:"max-content",method:"pop"};static assignableMethods=["initialTemplate"];connected(){this.enable()}disconnected(){this.disable()}cells(e){return Array.from(e.children).map(e=>["grid","inline-grid"].includes(getComputedStyle(e).display)?this.cells(e):e.dataset.autoGridIgnore?null:e).flat().filter(e=>null!==e)}disable(){this.constructor.observer.unobserve(this)}enable(){this.constructor.observer.observe(this)}initialTemplate(e){return e.map(e=>this.columnWidth).join(" ")}resize(){const t=getComputedStyle(this);for(var e,i=this.cells(this),r=this.initialTemplate(i).split(/(?<!\,)\s+/);this.style.setProperty("grid-template-columns",r.join(" ")),e=i.some(e=>e.offsetLeft<this.offsetLeft-parseFloat(t.paddingLeft))||i.some(e=>e.offsetLeft+e.offsetWidth>this.offsetLeft+this.offsetWidth-parseFloat(t.paddingRight)),r[this.method](),1<=r.length&&e;);}static style=`
        auto-grid {
            display: grid;
            grid-template-columns: auto;
        }
    `}window.customElements.define("auto-grid",P);class B extends e{static tagName="komp-modal";connected(){if(this.parentElement.tagName!=this.tagName.toUpperCase()+"-CONTAINER"){const t=d(this.tagName+"-container");this.backdrop=d(this.tagName+"-backdrop",{content:t}),this.backdrop.addEventListener("click",e=>{e.target!=this.backdrop&&e.target!=t||this.remove()}),this.replaceWith(this.backdrop),t.append(this),t.append(d(this.tagName+"-close",{content:r({content:'<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'},e=>{this.remove()})}))}this.getRootNode().body.style.overflow="hidden"}remove(){return this.getRootNode().body.style.overflow="",a(this.backdrop),super.remove()}static style=function(){return`
        ${this.tagName} {
            max-width: 100%;
        }
        ${this.tagName}-backdrop {
            position: fixed;
            inset: 0;
            overflow: scroll;
            display: flex;
            justify-content: center;
            align-items: start;
            background: rgba(0,0,0, 0.6);
            backdrop-filter: blur(4px); /* Not supported for dialog::backdrop as of 2023-09-13 */
        }
        ${this.tagName}-container {
            max-width: 100%;
            display: flex;
            justify-content: center;
            align-items: stretch;
            padding: 2em;
        }
        ${this.tagName}-close {
            width: 0;
            position: relative;
            background: red;
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
    `}}window.customElements.define(B.tagName,B);const W=["start","end"],K=["top","right","bottom","left"].reduce((e,t)=>e.concat(t,t+"-"+W[0],t+"-"+W[1]),[]),w=Math.min,b=Math.max,f=Math.round,m=Math.floor,v=e=>({x:e,y:e}),V={left:"right",right:"left",bottom:"top",top:"bottom"},U={start:"end",end:"start"};function Y(e,t,i){return b(e,w(t,i))}function L(e,t){return"function"==typeof e?e(t):e}function E(e){return e.split("-")[0]}function x(e){return e.split("-")[1]}function G(e){return"x"===e?"y":"x"}function X(e){return"y"===e?"height":"width"}function z(e){return["top","bottom"].includes(E(e))?"y":"x"}function J(e){return G(z(e))}function Q(e,t,i){void 0===i&&(i=!1);var r=x(e),e=J(e),o=X(e);let n="x"===e?r===(i?"end":"start")?"right":"left":"start"===r?"bottom":"top";return[n=t.reference[o]>t.floating[o]?ee(n):n,ee(n)]}function N(e){return e.replace(/start|end/g,e=>U[e])}function Z(e,t,i,r){const o=x(e);let n=function(e,t,i){var r=["left","right"],o=["right","left"];switch(e){case"top":case"bottom":return i?t?o:r:t?r:o;case"left":case"right":return t?["top","bottom"]:["bottom","top"];default:return[]}}(E(e),"start"===i,r);return n=o&&(n=n.map(e=>e+"-"+o),t)?n.concat(n.map(N)):n}function ee(e){return e.replace(/left|right|bottom|top/g,e=>V[e])}function te(e){return"number"!=typeof e?{top:0,right:0,bottom:0,left:0,...e}:{top:e,right:e,bottom:e,left:e}}function y(e){return{...e,top:e.y,left:e.x,right:e.x+e.width,bottom:e.y+e.height}}function ie(e,t,i){var{reference:r,floating:o}=e,e=z(t),n=J(t),s=X(n),a=E(t),l="y"===e,c=r.x+r.width/2-o.width/2,d=r.y+r.height/2-o.height/2,h=r[s]/2-o[s]/2;let u;switch(a){case"top":u={x:c,y:r.y-o.height};break;case"bottom":u={x:c,y:r.y+r.height};break;case"right":u={x:r.x+r.width,y:d};break;case"left":u={x:r.x-o.width,y:d};break;default:u={x:r.x,y:r.y}}switch(x(t)){case"start":u[n]-=h*(i&&l?-1:1);break;case"end":u[n]+=h*(i&&l?-1:1)}return u}async function re(e,t){var{x:i,y:r,platform:o,rects:n,elements:s,strategy:a}=e,{boundary:t="clippingAncestors",rootBoundary:e="viewport",elementContext:l="floating",altBoundary:c=!1,padding:d=0}=L(t=void 0===t?{}:t,e),d=te(d),c=s[c?"floating"===l?"reference":"floating":l],h=y(await o.getClippingRect({element:null==(h=await(null==o.isElement?void 0:o.isElement(c)))||h?c:c.contextElement||await(null==o.getDocumentElement?void 0:o.getDocumentElement(s.floating)),boundary:t,rootBoundary:e,strategy:a})),c="floating"===l?{...n.floating,x:i,y:r}:n.reference,t=await(null==o.getOffsetParent?void 0:o.getOffsetParent(s.floating)),e=await(null==o.isElement?void 0:o.isElement(t))&&await(null==o.getScale?void 0:o.getScale(t))||{x:1,y:1},l=y(o.convertOffsetParentRelativeRectToViewportRelativeRect?await o.convertOffsetParentRelativeRectToViewportRelativeRect({rect:c,offsetParent:t,strategy:a}):c);return{top:(h.top-l.top+d.top)/e.y,bottom:(l.bottom-h.bottom+d.bottom)/e.y,left:(h.left-l.left+d.left)/e.x,right:(l.right-h.right+d.right)/e.x}}const oe=m=>({name:"arrow",options:m,async fn(e){var{x:t,y:i,placement:r,rects:o,platform:n,elements:s}=e,{element:e,padding:a=0}=L(m,e)||{};if(null==e)return{};var a=te(a),t={x:t,y:i},i=J(r),l=X(i),c=await n.getDimensions(e),d="y"===i,h=d?"top":"left",u=d?"bottom":"right",d=d?"clientHeight":"clientWidth",g=o.reference[l]+o.reference[i]-t[i]-o.floating[l],p=t[i]-o.reference[i],e=await(null==n.getOffsetParent?void 0:n.getOffsetParent(e));let f=e?e[d]:0;g=g/2-p/2,p=(f=f&&await(null==n.isElement?void 0:n.isElement(e))?f:s.floating[d]||o.floating[l])/2-c[l]/2-1,n=w(a[h],p),e=w(a[u],p),s=n,d=f-c[l]-e,h=f/2-c[l]/2+g,a=Y(s,h,d),u=null!=x(r)&&h!=a&&o.reference[l]/2-(h<s?n:e)-c[l]/2<0?h<s?s-h:d-h:0;return{[i]:t[i]-u,data:{[i]:a,centerOffset:h-a+u}}}});function ne(e){var t=w(...e.map(e=>e.left)),i=w(...e.map(e=>e.top));return{x:t,y:i,width:b(...e.map(e=>e.right))-t,height:b(...e.map(e=>e.bottom))-i}}function R(e){return se(e)?(e.nodeName||"").toLowerCase():"#document"}function T(e){return(null==e||null==(e=e.ownerDocument)?void 0:e.defaultView)||window}function k(e){return null==(e=(se(e)?e.ownerDocument:e.document)||window.document)?void 0:e.documentElement}function se(e){return e instanceof Node||e instanceof T(e).Node}function A(e){return e instanceof Element||e instanceof T(e).Element}function C(e){return e instanceof HTMLElement||e instanceof T(e).HTMLElement}function ae(e){return"undefined"!=typeof ShadowRoot&&(e instanceof ShadowRoot||e instanceof T(e).ShadowRoot)}function S(e){var{overflow:e,overflowX:t,overflowY:i,display:r}=H(e);return/auto|scroll|overlay|hidden|clip/.test(e+i+t)&&!["inline","contents"].includes(r)}function le(e){var t=ce();const i=H(e);return"none"!==i.transform||"none"!==i.perspective||!!i.containerType&&"normal"!==i.containerType||!t&&!!i.backdropFilter&&"none"!==i.backdropFilter||!t&&!!i.filter&&"none"!==i.filter||["transform","perspective","filter"].some(e=>(i.willChange||"").includes(e))||["paint","layout","strict","content"].some(e=>(i.contain||"").includes(e))}function ce(){return!("undefined"==typeof CSS||!CSS.supports)&&CSS.supports("-webkit-backdrop-filter","none")}function de(e){return["html","body","#document"].includes(R(e))}function H(e){return T(e).getComputedStyle(e)}function he(e){return A(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.pageXOffset,scrollTop:e.pageYOffset}}function I(e){return"html"!==R(e)&&(e=e.assignedSlot||e.parentNode||ae(e)&&e.host||k(e),ae(e))?e.host:e}function $(e,t){void 0===t&&(t=[]);var i=function e(t){var i=I(t);return de(i)?(t.ownerDocument||t).body:C(i)&&S(i)?i:e(i)}(e),e=i===(null==(e=e.ownerDocument)?void 0:e.body),r=T(i);return e?t.concat(r,r.visualViewport||[],S(i)?i:[],r.frameElement?$(r.frameElement):[]):t.concat(i,$(i))}function ue(e){var t=H(e);let i=parseFloat(t.width)||0,r=parseFloat(t.height)||0;var t=C(e),o=t?e.offsetWidth:i,t=t?e.offsetHeight:r,e=f(i)!==o||f(r)!==t;return e&&(i=o,r=t),{width:i,height:r,$:e}}function ge(e){return A(e)?e:e.contextElement}function _(e){e=ge(e);if(!C(e))return v(1);var t=e.getBoundingClientRect(),{width:e,height:i,$:r}=ue(e);let o=(r?f(t.width):t.width)/e,n=(r?f(t.height):t.height)/i;return o&&Number.isFinite(o)||(o=1),n&&Number.isFinite(n)||(n=1),{x:o,y:n}}const pe=v(0);function fe(e){e=T(e);return ce()&&e.visualViewport?{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}:pe}function D(e,t,i,r){void 0===t&&(t=!1),void 0===i&&(i=!1);var o=e.getBoundingClientRect(),n=ge(e);let s=v(1);t&&(r?A(r)&&(s=_(r)):s=_(e));t=n,void 0===(e=i)&&(e=!1);i=!(i=r)||e&&i!==T(t)||!e?v(0):fe(n);let a=(o.left+i.x)/s.x,l=(o.top+i.y)/s.y,c=o.width/s.x,d=o.height/s.y;if(n){var h=T(n),u=r&&A(r)?T(r):r;let e=h.frameElement;for(;e&&r&&u!==h;){var g=_(e),p=e.getBoundingClientRect(),f=H(e),m=p.left+(e.clientLeft+parseFloat(f.paddingLeft))*g.x,p=p.top+(e.clientTop+parseFloat(f.paddingTop))*g.y;a*=g.x,l*=g.y,c*=g.x,d*=g.y,a+=m,l+=p,e=T(e).frameElement}}return y({width:c,height:d,x:a,y:l})}function me(e){return D(k(e)).left+he(e).scrollLeft}function ve(e,t,i){let r;var o,n,s;return y(r="viewport"===t?function(e,t){var i=T(e),e=k(e),i=i.visualViewport;let r=e.clientWidth,o=e.clientHeight,n=0,s=0;return i&&(r=i.width,o=i.height,ce()&&"fixed"!==t||(n=i.offsetLeft,s=i.offsetTop)),{width:r,height:o,x:n,y:s}}(e,i):"document"===t?function(e){var t=k(e),i=he(e),r=e.ownerDocument.body,o=b(t.scrollWidth,t.clientWidth,r.scrollWidth,r.clientWidth),n=b(t.scrollHeight,t.clientHeight,r.scrollHeight,r.clientHeight);let s=-i.scrollLeft+me(e);return e=-i.scrollTop,"rtl"===H(r).direction&&(s+=b(t.clientWidth,r.clientWidth)-o),{width:o,height:n,x:s,y:e}}(k(e)):A(t)?(n=(i=D(o=t,!0,"fixed"===(i=i))).top+o.clientTop,i=i.left+o.clientLeft,s=C(o)?_(o):v(1),{width:o.clientWidth*s.x,height:o.clientHeight*s.y,x:i*s.x,y:n*s.y}):(o=fe(e),{...t,x:t.x-o.x,y:t.y-o.y}))}function ye(e,t){var i=t.get(e);if(i)return i;let r=$(e).filter(e=>A(e)&&"body"!==R(e)),o=null;var n="fixed"===H(e).position;let s=n?I(e):e;for(;A(s)&&!de(s);){var a=H(s),l=le(s),l=(l||"fixed"!==a.position||(o=null),n?!l&&!o:!l&&"static"===a.position&&!!o&&["absolute","fixed"].includes(o.position)||S(s)&&!l&&function e(t,i){t=I(t);return!(t===i||!A(t)||de(t))&&("fixed"===H(t).position||e(t,i))}(e,s));l?r=r.filter(e=>e!==s):o=a,s=I(s)}return t.set(e,r),r}function we(e,t){return C(e)&&"fixed"!==H(e).position?t?t(e):e.offsetParent:null}function be(e,t){var i,r=T(e);if(!C(e))return r;let o=we(e,t);for(;o&&(i=o,["table","td","th"].includes(R(i)))&&"static"===H(o).position;)o=we(o,t);return(!o||"html"!==R(o)&&("body"!==R(o)||"static"!==H(o).position||le(o)))&&(o||function(e){let t=I(e);for(;C(t)&&!de(t);){if(le(t))return t;t=I(t)}return null}(e))||r}const xe={convertOffsetParentRelativeRectToViewportRelativeRect:function(e){var{rect:e,offsetParent:t,strategy:i}=e,r=C(t),o=k(t);if(t===o)return e;let n={scrollLeft:0,scrollTop:0},s=v(1);var a=v(0);return(r||!r&&"fixed"!==i)&&("body"===R(t)&&!S(o)||(n=he(t)),C(t))&&(r=D(t),s=_(t),a.x=r.x+t.clientLeft,a.y=r.y+t.clientTop),{width:e.width*s.x,height:e.height*s.y,x:e.x*s.x-n.scrollLeft*s.x+a.x,y:e.y*s.y-n.scrollTop*s.y+a.y}},getDocumentElement:k,getClippingRect:function(e){let{element:i,boundary:t,rootBoundary:r,strategy:o}=e;var n=(e=[..."clippingAncestors"===t?ye(i,this._c):[].concat(t),r])[0];return{width:(e=e.reduce((e,t)=>{t=ve(i,t,o);return e.top=b(t.top,e.top),e.right=w(t.right,e.right),e.bottom=w(t.bottom,e.bottom),e.left=b(t.left,e.left),e},ve(i,n,o))).right-e.left,height:e.bottom-e.top,x:e.left,y:e.top}},getOffsetParent:be,getElementRects:async function(e){var{reference:e,floating:t,strategy:i}=e,r=this.getOffsetParent||be,o=this.getDimensions;return{reference:function(e,t,i){var r=C(t),o=k(t),e=D(e,!0,i="fixed"===i,t);let n={scrollLeft:0,scrollTop:0};var s=v(0);return!r&&i||("body"===R(t)&&!S(o)||(n=he(t)),r?(r=D(t,!0,i,t),s.x=r.x+t.clientLeft,s.y=r.y+t.clientTop):o&&(s.x=me(o))),{x:e.left+n.scrollLeft-s.x,y:e.top+n.scrollTop-s.y,width:e.width,height:e.height}}(e,await r(t),i),floating:{x:0,y:0,...await o(t)}}},getClientRects:function(e){return Array.from(e.getClientRects())},getDimensions:ue,getScale:_,isElement:A,isRTL:function(e){return"rtl"===H(e).direction}};function Le(c,t){let d=null,h;const u=k(c);function g(){clearTimeout(h),d&&d.disconnect(),d=null}return function i(r,o){void 0===r&&(r=!1),void 0===o&&(o=1),g();var{left:e,top:n,width:s,height:a}=c.getBoundingClientRect();if(r||t(),s&&a){r={rootMargin:-m(n)+"px "+-m(u.clientWidth-(e+s))+"px "+-m(u.clientHeight-(n+a))+"px "+-m(e)+"px",threshold:b(0,w(1,o))||1};let t=!0;try{d=new IntersectionObserver(l,{...r,root:u.ownerDocument})}catch(e){d=new IntersectionObserver(l,r)}function l(e){if((e=e[0].intersectionRatio)!==o){if(!t)return i();e?i(!1,e):h=setTimeout(()=>{i(!1,1e-7)},100)}t=!1}d.observe(c)}}(!0),g}function Ee(i,t,r,e){void 0===e&&(e={});const{ancestorScroll:o=!0,ancestorResize:n=!0,elementResize:s="function"==typeof ResizeObserver,layoutShift:a="function"==typeof IntersectionObserver,animationFrame:l=!1}=e,c=ge(i),d=o||n?[...c?$(c):[],...$(t)]:[],h=(d.forEach(e=>{o&&e.addEventListener("scroll",r,{passive:!0}),n&&e.addEventListener("resize",r)}),c&&a?Le(c,r):null);let u=-1,g=null;s&&(g=new ResizeObserver(e=>{var[e]=e;e&&e.target===c&&g&&(g.unobserve(t),cancelAnimationFrame(u),u=requestAnimationFrame(()=>{g&&g.observe(t)})),r()}),c&&!l&&g.observe(c),g.observe(t));let p,f=l?D(i):null;return l&&function e(){const t=D(i);!f||t.x===f.x&&t.y===f.y&&t.width===f.width&&t.height===f.height||r();f=t;p=requestAnimationFrame(e)}(),r(),()=>{d.forEach(e=>{o&&e.removeEventListener("scroll",r),n&&e.removeEventListener("resize",r)}),h&&h(),g&&g.disconnect(),g=null,l&&cancelAnimationFrame(p)}}const ze=(e,t,i)=>{var r=new Map,i={platform:xe,...i},r={...i.platform,_c:r};return(async(t,i,e)=>{var{placement:r="bottom",strategy:o="absolute",middleware:e=[],platform:n}=e,s=e.filter(Boolean),a=await(null==n.isRTL?void 0:n.isRTL(i));let l=await n.getElementRects({reference:t,floating:i,strategy:o}),{x:c,y:d}=ie(l,r,a),h=r,u={},g=0;for(let e=0;e<s.length;e++){var{name:p,fn:f}=s[e],{x:f,y:m,data:v,reset:y}=await f({x:c,y:d,initialPlacement:r,placement:h,strategy:o,middlewareData:u,rects:l,platform:n,elements:{reference:t,floating:i}});c=null!=f?f:c,d=null!=m?m:d,u={...u,[p]:{...u[p],...v}},y&&g<=50&&(g++,"object"==typeof y&&(y.placement&&(h=y.placement),y.rects&&(l=!0===y.rects?await n.getElementRects({reference:t,floating:i,strategy:o}):y.rects),{x:c,y:d}=ie(l,h,a)),e=-1)}return{x:c,y:d,placement:h,strategy:o,middlewareData:u}})(e,t,{...i,platform:r})};class Ne extends e{static tagName="komp-floater";static assignableAttributes={content:null,anchor:null,placement:void 0,strategy:"absolute",flip:null,offset:null,shift:!0,arrow:null,autoPlacement:!0,inline:null,autoUpdate:{},removeOnBlur:!1,container:null,timeout:0};static bindMethods=["show","hide","checkFocus","checkEscape"];instantiate(){super.instantiate(),"string"==typeof this.anchor&&(this.anchor=this.getRootNode().querySelector(this.anchor))}connected(){if(this.style.position=this.strategy,!this.anchor)throw"Floater needs anchor to position to.";const t=[];Object.keys(Re).forEach(e=>{if(this[e])if("arrow"==e){let e=this.querySelector("komp-floater-arrow-locator");e||(e=d("komp-floater-arrow-locator"),this.prepend(e)),t.push(oe({element:e})),this.classList.add("komp-floater-arrow"),"number"==typeof this.arrow&&this.style.setProperty("--arrow-size",this.arrow+"px"),this.offset||(this.offset=!0===this.arrow?10:this.arrow)}else t.push(Re[e](!0===this[e]?{}:this[e]))}),this._cleanupCallbacks.push(Ee(this.anchor,this,()=>{ze(this.anchor,this,{strategy:this.strategy,placement:this.placement,middleware:t}).then(({x:e,y:t,placement:i,middlewareData:r})=>{if(this.style.left=e+"px",this.style.top=t+"px",this.classList.remove("-top","-left","-bottom","-right"),this.classList.add("-"+i),r.arrow){const{x:e,y:t}=r.arrow;null!=e&&this.style.setProperty("--arrow-left",e+"px"),null!=t&&this.style.setProperty("--arrow-top",t+"px")}})},this.autoUpdate)),this.classList.add("-in"),this.addEventListener("animationend",()=>{this.classList.remove("-in")},{once:!0}),this.removeOnBlur&&(this.manageEventListenerFor(this.getRootNode().body,"focusin",this.checkFocus),this.manageEventListenerFor(this.getRootNode().body,"click",this.checkFocus),this.manageEventListenerFor(this.getRootNode().body,"keyup",this.checkEscape))}checkFocus(e){e.defaultPrevented||e.target==this||e.target==this.anchor||this.contains(e.target)||this.anchor.contains(e.target)||this.hide()}checkEscape(e){27==e.which&&this.hide()}remove(){return new Promise(e=>{this.classList.add("-out");var t=()=>{this.classList.remove("-out"),super.remove().then(e)};"none"!=n(this,"animation-name")?this.addEventListener("animationend",t,{once:!0}):t()})}show(){if(this._hideTimeout&&(clearTimeout(this._hideTimeout),delete this._hideTimeout),this._removing)return this._removing.then(this.show);"string"==typeof this.container&&(this.container=this.closest(this.container)||this.anchor.closest(this.container)),null==this.container&&(this.container=this.parentElement||this.anchor.parentElement),this.parentElement||(this._showing=!0,this.container.append(this),this._showing=!1,this.trigger("shown"))}hide(){this._hideTimeout||this._hiding||(this._hideTimeout=setTimeout(async()=>{this.parentElement&&(this._removing=this.remove().then(()=>{this.trigger("hidden"),delete this._hideTimeout,delete this._removing}))},this.timeout))}toggle(e){this[(e="boolean"!=typeof e?null!==this.offsetParent:e)?"hide":"show"]()}static style=`
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
    `}window.customElements.define("komp-floater",Ne);const Re={size:function(y){return{name:"size",options:y=void 0===y?{}:y,async fn(e){var{placement:t,rects:i,platform:r,elements:o}=e;const{apply:n=()=>{},...s}=L(y,e);var a=await re(e,s),l=E(t),c=x(t),t="y"===z(t),{width:i,height:d}=i.floating;let h,u;"top"===l||"bottom"===l?(h=l,u=c===(await(null==r.isRTL?void 0:r.isRTL(o.floating))?"start":"end")?"left":"right"):(u=l,h="end"===c?"top":"bottom");var g,l=d-a[h],p=i-a[u],f=!e.middlewareData.shift;let m=l,v=p;t?(g=i-a.left-a.right,v=c||f?w(p,g):g):(p=d-a.top-a.bottom,m=c||f?w(l,p):p),f&&!c&&(g=b(a.left,0),l=b(a.right,0),p=b(a.top,0),f=b(a.bottom,0),t?v=i-2*(0!==g||0!==l?g+l:b(a.left,a.right)):m=d-2*(0!==p||0!==f?p+f:b(a.top,a.bottom))),await n({...e,availableWidth:v,availableHeight:m});c=await r.getDimensions(o.floating);return i!==c.width||d!==c.height?{reset:{rects:!0}}:{}}}},shift:function(p){return{name:"shift",options:p=void 0===p?{}:p,async fn(e){var{x:t,y:i,placement:r}=e;const{mainAxis:o=!0,crossAxis:n=!1,limiter:s={fn:e=>{var{x:e,y:t}=e;return{x:e,y:t}}},...a}=L(p,e);var l,c={x:t,y:i},d=await re(e,a),r=z(E(r)),h=G(r);let u=c[h],g=c[r];o&&(c=u+d["y"===h?"top":"left"],l=u-d["y"===h?"bottom":"right"],u=Y(c,u,l)),n&&(c=g+d["y"===r?"top":"left"],l=g-d["y"===r?"bottom":"right"],g=Y(c,g,l));d=s.fn({...e,[h]:u,[r]:g});return{...d,data:{x:d.x-t,y:d.y-i}}}}},autoPlacement:function(m){return{name:"autoPlacement",options:m=void 0===m?{}:m,async fn(e){var{rects:t,middlewareData:i,placement:r,platform:o,elements:n}=e;const{crossAxis:s=!1,alignment:a,allowedPlacements:l=K,autoAlignment:c=!0,...d}=L(m,e);var h,u,g=void 0!==a||l===K?(u=c,g=l,((h=a||null)?[...g.filter(e=>x(e)===h),...g.filter(e=>x(e)!==h)]:g.filter(e=>E(e)===e)).filter(e=>!h||x(e)===h||!!u&&N(e)!==e)):l,e=await re(e,d),p=(null==(p=i.autoPlacement)?void 0:p.index)||0,f=g[p];return null==f?{}:(t=Q(f,t,await(null==o.isRTL?void 0:o.isRTL(n.floating))),r!==f?{reset:{placement:g[0]}}:(o=[e[E(f)],e[t[0]],e[t[1]]],e=[...(null==(n=i.autoPlacement)?void 0:n.overflows)||[],{placement:f,overflows:o}],(t=g[p+1])?{data:{index:p+1,overflows:e},reset:{placement:t}}:(f=(null==(n=(i=e.map(e=>{var t=x(e.placement);return[e.placement,t&&s?e.overflows.slice(0,2).reduce((e,t)=>e+t,0):e.overflows[0],e.overflows]}).sort((e,t)=>e[1]-t[1])).filter(e=>e[2].slice(0,x(e[0])?2:3).every(e=>e<=0))[0])?void 0:n[0])||i[0][0])!==r?{data:{index:p+1,overflows:e},reset:{placement:f}}:{}))}}},flip:function(x){return{name:"flip",options:x=void 0===x?{}:x,async fn(e){const{placement:t,middlewareData:i,rects:r,initialPlacement:o,platform:n,elements:s}=e,{mainAxis:a=!0,crossAxis:l=!0,fallbackPlacements:c,fallbackStrategy:d="bestFit",fallbackAxisSideDirection:h="none",flipAlignment:u=!0,...g}=L(x,e);var p=E(t),f=E(o)===o,m=await(null==n.isRTL?void 0:n.isRTL(s.floating)),f=c||(f||!u?[ee(o)]:(v=ee(f=o),[N(f),v,N(v)])),v=(c||"none"===h||f.push(...Z(o,u,h,m)),[o,...f]),f=await re(e,g),e=[],y=(null==(w=i.flip)?void 0:w.overflows)||[];if(a&&e.push(f[p]),l&&(w=Q(t,r,m),e.push(f[w[0]],f[w[1]])),y=[...y,{placement:t,overflows:e}],!e.every(e=>e<=0)){var w,b,m=((null==(p=i.flip)?void 0:p.index)||0)+1,f=v[m];if(f)return{data:{index:m,overflows:y},reset:{placement:f}};let e=null==(w=y.filter(e=>e.overflows[0]<=0).sort((e,t)=>e.overflows[1]-t.overflows[1])[0])?void 0:w.placement;if(!e)switch(d){case"bestFit":{const t=null==(b=y.map(e=>[e.placement,e.overflows.filter(e=>0<e).reduce((e,t)=>e+t,0)]).sort((e,t)=>e[1]-t[1])[0])?void 0:b[0];t&&(e=t);break}case"initialPlacement":e=o}if(t!==e)return{reset:{placement:e}}}return{}}}},inline:function(s){return{name:"inline",options:s=void 0===s?{}:s,async fn(e){const{placement:c,elements:t,rects:i,platform:r,strategy:o}=e,{padding:n=2,x:d,y:h}=L(s,e);e=Array.from(await(null==r.getClientRects?void 0:r.getClientRects(t.reference))||[]);const u=function(e){var t=e.slice().sort((e,t)=>e.y-t.y),i=[];let r=null;for(let e=0;e<t.length;e++){var o=t[e];!r||o.y-r.y>r.height/2?i.push([o]):i[i.length-1].push(o),r=o}return i.map(e=>y(ne(e)))}(e),g=y(ne(e)),p=te(n);e=await r.getElementRects({reference:{getBoundingClientRect:function(){if(2===u.length&&u[0].left>u[1].right&&null!=d&&null!=h)return u.find(e=>d>e.left-p.left&&d<e.right+p.right&&h>e.top-p.top&&h<e.bottom+p.bottom)||g;if(2<=u.length){var e,t;if("y"===z(c))return i=u[0],r=u[u.length-1],o="top"===E(c),{top:e=i.top,bottom:n=r.bottom,left:t=(o?i:r).left,right:o=(o?i:r).right,width:o-t,height:n-e,x:t,y:e};const s="left"===E(c),a=b(...u.map(e=>e.right)),l=w(...u.map(e=>e.left));var i=u.filter(e=>s?e.left===l:e.right===a),r=i[0].top,o=i[i.length-1].bottom,n=l;return{top:r,bottom:o,left:n,right:a,width:a-n,height:o-r,x:n,y:r}}return g}},floating:t.floating,strategy:o});return i.reference.x!==e.reference.x||i.reference.y!==e.reference.y||i.reference.width!==e.reference.width||i.reference.height!==e.reference.height?{reset:{rects:e}}:{}}}},arrow:oe,offset:function(r){return{name:"offset",options:r=void 0===r?0:r,async fn(e){var{x:t,y:i}=e,e=await async function(e,t){var{placement:i,platform:r,elements:o}=e,r=await(null==r.isRTL?void 0:r.isRTL(o.floating)),o=E(i),n=x(i),i="y"===z(i),o=["left","top"].includes(o)?-1:1,r=r&&i?-1:1;let{mainAxis:s,crossAxis:a,alignmentAxis:l}="number"==typeof(t=L(t,e))?{mainAxis:t,crossAxis:0,alignmentAxis:null}:{mainAxis:0,crossAxis:0,alignmentAxis:null,...t};return n&&"number"==typeof l&&(a="end"===n?-1*l:l),i?{x:a*r,y:s*o}:{x:s*o,y:a*r}}(e,r);return{x:t+e.x,y:i+e.y,data:e}}}}};class Te extends e{static assignableAttributes={data:[],columns:void 0,defaultColSize:"max-content"};static tagName="komp-data-table";_columns=[];constructor(e,...t){super(e,...t),this.columns?this.initColumns(this.columns):this.constructor.columns&&this.initColumns(this.constructor.columns)}instantiate(...e){e=super.instantiate(...e);return this.render(),e}render(){Array.from(this.querySelectorAll(this.tagName+"-row")).forEach(e=>{removeRow(e)});const i=[],r=d(this.tagName+"-header");this.append(r);let o=0;return this._columns.forEach(t=>{(Array.isArray(t.columns)?t.columns.map(e=>Object.assign({},t,e)):[t]).forEach(e=>{var t=this.renderHeader.bind(this)(e);t.colIndex=o+1,t.rowIndex="header",t.classList.add("col-"+t.colIndex,"row-header"),l(r,t),i.push(e.width||""+this.defaultColSize),o++})}),this.style.gridTemplateColumns=i.join(" "),this.data.forEach((r,o)=>{const n=this.renderRow(r);this.append(n),this._columns.forEach((e,t)=>{const i=this.renderCell(r,e);e.columns&&(i.classList.add("column-span"),i.style.setProperty("--columns",e.columns.length)),i.render=()=>{s(i,c(e,"render",r,i,e,this))},i.colIndex=t+1,i.rowIndex=o+1,i.classList.add("col-"+i.colIndex,"row-"+i.rowIndex),n.append(i),i.render()})}),this}removeRow(e){Array.from(this.querySelectorAll(this.tagName+"-cell")).forEach(e=>{removeCell(cell)})}removeCell(e){e.remove()}renderRow(){return d(this.tagName+"-row")}renderHeader(e){return d(this.tagName+"-cell",{content:c(e,"header")})}renderCell(e,t,i){return d(this.tagName+"-cell",Object.assign({},t,i))}initColumns(t){return Array.isArray(t)?this._columns=t.map(e=>this.initColumn(e.id,e)):this._columns=Object.keys(t).map(e=>this.initColumn(e,t[e]))}initColumn(e,t){let i={id:e,render:this.defaultRender(e,t),header:this.defaultHeader(e,t)};return o(t)?i.render=t:Array.isArray(t)?i=Object.assign(i,{render:t[0]},q(t,"header","render")):"object"==typeof t?i=Object.assign(i,t):i.render=this.defaultRender(e,t),i}defaultHeader(e){return e}defaultRender(t){return e=>e[t]}static style=function(){return`
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
    `}}window.customElements.define(Te.tagName,Te);class t extends e{static tagName="komp-input";static assignableAttributes={record:null,attribute:null,dump:(e,t)=>e,load:(e,t)=>e};constructor(e){Object.assign({},e);var t={button:He.prototype,checkbox:ke.prototype,radio:ke.prototype,select:Ie.prototype,date:Ae.prototype,textarea:Se.prototype,"datetime-local":Ce.prototype}[e.type];super(q(e,...O)),"function"!=typeof this.dump&&(this.dump=e=>e),"function"!=typeof this.load&&(this.load=e=>e),t&&(this.__proto__=t),this.input=this.createInput(e),this._load(),this.append(this.input),this.setupInputListener(this.inputChange.bind(this)),this.setupRecordListener(this.recordChange.bind(this))}createInput(e){return d("input",Object.assign({type:"text"},e))}setupInputListener(e){this.input.addEventListener("change",e)}setupRecordListener(e){this.record.addEventListener&&this.record.addEventListener("change",e)}inputChange(){var e=this.load(this.record[this.attribute]),t=this._dump();this.trigger("change",t,e)}recordChange(){this._load()}_load(e,t){this.input.value=this.load(t||this.record[this.attribute])}_dump(e,t){t=this.dump(t||this.input.value,this.record);return this.record[this.attribute]=t}static style=`
        komp-input {
            display: contents;
        }
    `}window.customElements.define(t.tagName,t);class ke extends t{_load(){var e=this.load(this.record[this.attribute]);this.input.hasAttribute("value")&&"on"!=this.input.value?this.input.checked=e==this.input.value:this.input.checked=!0===e}_dump(){let e;return e=this.input.hasAttribute("value")&&"on"!=this.input.value?this.dump(this.input.checked?this.input.value:null):this.dump(this.input.checked),this.record[this.attribute]=e}}class Ae extends t{setupInputListener(){this.input.addEventListener("blur",this._dump.bind(this))}_load(e){let t=this.record[this.attribute];t instanceof Date&&(t=[t.getUTCFullYear(),(t.getMonth()+1).toString().padStart(2,"0"),t.getDate().toString().padStart(2,"0")].join("-")),super._load(e,t)}_dump(e){let t=this.input.value;""==t&&(t=null),super._dump(e,t)}}class Ce extends t{_load(e){let t=this.record[this.attribute];t instanceof Date&&(t=[[t.getUTCFullYear(),(t.getMonth()+1).toString().padStart(2,"0"),t.getDate().toString().padStart(2,"0")].join("-"),"T",[t.getHours().toString().padStart(2,"0"),t.getMinutes().toString().padStart(2,"0")].join(":")].join("")),super._load(e,t)}}class Se extends t{createInput(e){return d("textarea",e)}}class He extends t{createInput(e){return d("button",e)}setupInputListener(){this.input.addEventListener("click",this._dump.bind(this))}_load(){}}class Ie extends t{createInput(e){const t=d("select",e);return e.includeBlank&&t.append(d("option",Object.assign({content:"Unset",value:null},e.includeBlank))),e.options.forEach(e=>{t.append(d("option",{content:Array.isArray(e)?e[1]:e,value:Array.isArray(e)?e[0]:e}))}),t}_load(e){if(this.input.multiple){const t=this.load(this.record[this.attribute]);this.input.querySelectorAll("option").forEach(e=>{t.includes(e.value)?e.setAttribute("selected",!0):e.removeAttribute("selected")})}else super._load()}_dump(e){var t;if(this.input.multiple)return t=Array.from(this.input.options).filter(e=>e.selected).map(e=>e.value),this.record[this.attribute]=this.dump(t),t;{let e=this.input.value;return"null"==e&&(e=null),e=this.dump(e),this.record[this.attribute]=e}}}class $e extends Ne{static watch=["anchor"];static assignableAttributes={autoPlacement:!1,flip:!0,shift:!0,strategy:"absolute",placement:"top",arrow:!0,timeout:300};_showing=!1;constructor(e,...t){super(e,...t),this.anchor&&this.anchorChanged(this.anchor,this.anchor),void 0===e&&(this.needsFirstRemoval=!0)}connected(){if(super.connected(),this.getRootNode()==this.anchor.getRootNode()&&0==this._showing)return a(this),!1}anchorChanged(e,t){e&&e instanceof HTMLElement&&(e.removeEventListener("mouseenter",this.show.bind(this)),e.removeEventListener("mouseleave",this.hide.bind(this))),t&&t instanceof HTMLElement&&(t.addEventListener("mouseenter",this.show.bind(this)),t.addEventListener("mouseleave",this.hide.bind(this)))}}window.customElements.define("komp-tooltip",$e);class _e extends $e{static assignableAttributes={mouseevent:"click",placement:"bottom",arrow:!1,removeOnBlur:!0,timeout:0};connected(...e){return this.addEventListener("mouseenter",this.clearHide.bind(this)),"mouseenter"==this.mouseevent&&this.addEventListener("mouseleave",this.hide.bind(this)),super.connected(...e)}show(){super.show(),this.anchor.classList.add("-active")}hide(){super.hide(),this.anchor.classList.remove("-active")}anchorChanged(e,t){"mouseenter"==this.mouseevent?super.anchorChanged(e,t):(e&&e instanceof HTMLElement&&e.removeEventListener(this.mouseevent,this.toggle.bind(this)),t&&t instanceof HTMLElement&&t.addEventListener(this.mouseevent,this.toggle.bind(this)))}clearHide(){this._hideTimeout&&(clearTimeout(this._hideTimeout),delete this._hideTimeout)}}window.customElements.define("komp-dropdown",_e);class De extends e{static tagName="komp-dropzone";static assignableAttributes={enabled:!0,onFileDrop:null,overlay:{content:"Drag Here"}};static bindMethods=["windowDragEnter","windowDragLeave","windowDrop","drop","dragOver","dragEnter","dragLeave"];constructor(...e){super(...e),"object"!=typeof this.overlay||this.overlay instanceof HTMLElement||(this.overlay=d("komp-dropzone-overlay",Object.assign({},this.constructor.assignableAttributes.overlay,this.overlay)))}addEventListeners(){this.getRootNode()&&(this.getRootNode().addEventListener("dragenter",this.windowDragEnter),this.getRootNode().addEventListener("dragleave",this.windowDragLeave),this.getRootNode().addEventListener("drop",this.windowDrop)),this.addEventListener("drop",this.drop),this.addEventListener("dragover",this.dragOver),this.addEventListener("dragenter",this.dragEnter),this.addEventListener("dragleave",this.dragLeave)}removeEventListeners(){this.getRootNode()&&(this.getRootNode().removeEventListener("dragenter",this.windowDragEnter),this.getRootNode().removeEventListener("dragleave",this.windowDragLeave),this.getRootNode().removeEventListener("drop",this.windowDrop)),this.removeEventListener("drop",this.drop),this.removeEventListener("dragover",this.dragOver),this.removeEventListener("dragenter",this.dragEnter),this.removeEventListener("dragleave",this.dragLeave)}connected(){"static"==n(this,"position")&&(this.style.position="relative"),this.enabled&&this.addEventListeners()}disconnected(){this.enabled&&this.removeEventListeners()}enable(){this.enabled||(this.enabled=!0,this.addEventListeners())}disable(){0!=this.enabled&&(this.enabled=!1,this.removeEventListeners())}drop(e){e.target!=this&&!this.contains(e.target)||(e.preventDefault(),[...e.dataTransfer.files].forEach(e=>{this.onFileDrop&&this.onFileDrop(e),this.trigger("filedrop",e)}))}dragEnter(e){e.preventDefault(),this.overlay.classList.add("active")}dragLeave(e){e.preventDefault(),this.contains(e.relatedTarget)||this.overlay.classList.remove("active")}dragOver(e){e.preventDefault()}windowDragEnter(e){e.preventDefault(),e.relatedTarget&&e.relatedTarget.getRootNode()==this.getRootNode()||(this.overlay.classList.remove("active"),this.append(this.overlay))}windowDragLeave(e){e.preventDefault(),e.relatedTarget&&e.relatedTarget.getRootNode()==this.getRootNode()||this.overlay.remove()}windowDrop(e){e.preventDefault(),this.overlay.remove()}static style=`
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
    `}window.customElements.define(De.tagName,De);class M extends e{static tagName="komp-content-area";static assignableAttributes=["onchange"];static assignableMethods=["load"];constructor(e={}){var t=(e=Object.assign({tabIndex:0,contenteditable:!0},e)).content;delete e.content,super(e),s(this,this.load(t||e.value));let i=this.dump(this.innerText);this.addEventListener("focusout",e=>{var t=this.dump(this.innerText);i!=t&&(this.onchange&&this.onchange(t,i),this.trigger("change",t,i))})}dump(e){return e.trimEnd().replaceAll("<br>","\n")}load(e){return e="string"==typeof e?e.replaceAll("\n","<br>"):e}static style=`
        komp-content-area {
            appearance: textfield;
            background-color: white;
            border-width: 1px;
            padding: 0.22em;
            display: inline-block;
            min-width: 4ch;
        }
    `}function Me(e={}){return e.horizontal?`
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
    `}window.customElements.define(M.tagName,M);class Oe extends Te{static tagName="komp-spreadsheet";static assignableAttributes={reorder:["col","row"],resize:["col","row"]};constructor(...e){super(...e),!0===this.reorder?this.reorder=["col","row"]:!1===this.reorder?this.reorder=new Array:"string"==typeof this.reorder&&(this.reorder=[this.reorder]),!0===this.resize?this.resize=["col","row"]:!1===this.resize?this.resize=[]:"string"==typeof this.resize&&(this.resize=[this.resize]),this.cellTag=this.constructor.tagName+"-cell",this.rowTag=this.constructor.tagName+"-row",this.menuTag=this.constructor.tagName+"-menu",this.inputTag=this.constructor.tagName+"-input",this.reorderHandleTag=this.constructor.tagName+"-reorder-handle",this.resizeHandleTag=this.constructor.tagName+"-resize-handle",this.dragBoxTag=this.constructor.tagName+"-drag-box",this.addEventListenerFor(this.cellTag,"mousedown",e=>{2==e.button?e.delegateTarget.classList.contains("selected")?e.preventDefault():this.deselectCells():(e.metaKey||e.shiftKey||this.deselectCells(),this.initializeCellSelection(e.delegateTarget,e))}),this.addEventListenerFor(this.cellTag,"mouseover",e=>{this.showReorderHandleFor(e.delegateTarget),this.showResizeHandleFor(e.delegateTarget)}),this.addEventListenerFor(this.cellTag,"keydown",e=>{e.delegateTarget.classList.contains("input")?("Escape"==e.key&&(e.delegateTarget.remove(),e.delegateTarget.originalCell.focus()),this.deselectCells({copySelection:!0})):["ArrowRight","ArrowLeft","ArrowDown","ArrowUp"].includes(e.key)?(e.preventDefault(),this.changeFocusByDirection(e.key,e.delegateTarget,e)):e.altKey||e.ctrlKey||e.metaKey||!e.key.match(/^[a-z0-0\-\_\$]$/i)?"Enter"==e.key&&e.delegateTarget==this.getRootNode().activeElement&&(e.preventDefault(),this.activateCellInput(e.delegateTarget,e)):this.activateCellInput(e.delegateTarget,e)}),this.addEventListenerFor(this.cellTag,"dblclick",e=>{this.activateCellInput(e.delegateTarget,e)}),this.addEventListener("mouseleave",e=>{this.querySelectorAll(this.tagName+"-handle").forEach(e=>e.remove())}),this.addEventListener("contextmenu",e=>{e.preventDefault();e=p(e.target,this.cellTag);e&&this.renderContextMenu(e)}),this.observer=new ResizeObserver(e=>{for(const t of e)t.target.classList.contains("frozen-col")&&(this.style.scrollPaddingLeft=t.target.offsetWidth+"px")}),this.querySelectorAll(this.cellTag).forEach(e=>{this.observer.observe(e)})}connected(){this.getRootNode()&&(this.manageEventListenerFor(this.getRootNode(),"paste",e=>{this.contains(document.activeElement)&&(e.preventDefault(),this.pasteCells(e.clipboardData.getData("text/plain")))}),this.manageEventListenerFor(this.getRootNode(),"copy",e=>{this.contains(document.activeElement)&&(e.preventDefault(),this.copyCells(document.activeElement))}))}remove(...e){this.observer.disconnect(),delete this.observer,super.remove(...e)}initColumn(i,e,...t){t=super.initColumn(i,e,...t);return t.input=e.input||this.defaultInput(i,e),t.copy=e=>e[i],t.paste=(e,t)=>e[i]=t,t}defaultRender(i){return e=>{let t=e[i];return t="string"==typeof t?t.replaceAll("\n","<br>"):t}}defaultHeader(i,e){let t=e.header;return"object"!=typeof t&&(t={content:t||i}),Object.assign({content:i,class:this.tagName.toLowerCase()+"-input",input:(t,e)=>new M({value:t.header.content,style:{padding:n(e,"padding")},onchange:e=>{t.header.content=e,this.trigger("headerChange",i,e)}})},t)}renderHeader(e){const t=d(this.tagName+"-cell",e.header);return t.classList.add("header","frozen-row",!0===e.frozen?"frozen-col":null),t.tabIndex=0,t.columnModel=e,t.render=()=>{s(t,c(e.header,"content",e))},t}defaultInput(o){return(t,e,i)=>{let r=t[o];return"keydown"==i.type&&"Enter"!=i.key&&(r=""),new M({value:r,class:this.tagName.toLowerCase()+"-input",style:{padding:n(e,"padding")},onchange:e=>t[o]=e})}}renderCell(e,t,...i){i=super.renderCell(e,t,...i);return i.record=e,i.tabIndex=0,i.columnModel=t,i.classList.toggle("frozen-col",!0===t.frozen),this.observer&&this.observer.observe(i),i}removeCell(...e){return this.observe.unobserve(el),super.removeCell(...e)}changeFocusByDirection(r,o,n){if(o=o||this.querySelector(`${this.cellTag}:focus, ${this.cellTag}:focus-within`)){let i,e=o.rowIndex;switch("header"==e&&(e=0),r){case"ArrowDown":i=this.querySelector(`.row-${e+1}.col-`+o.colIndex);break;case"ArrowUp":i=this.querySelector(`.row-${e-1}.col-`+o.colIndex);break;case"ArrowLeft":i=this.querySelector(`.row-${e}.col-`+(o.colIndex-1));break;case"ArrowRight":i=this.querySelector(`.row-${e}.col-`+(o.colIndex+1))}if(i){i.focus();var s=this.getBoundingClientRect(),r=this.querySelector(this.cellTag+".frozen-row"),a=this.querySelector(this.cellTag+".frozen-col");r&&(s.y=s.top+r.offsetHeight,s.height=s.height-r.offsetHeight),a&&(s.x=s.left+a.offsetWidth,s.width=s.width-a.offsetWidth);let t=i.getBoundingClientRect();if(this.classList.add("unfreeze"),t.top<s.top&&this.scrollBy({left:0,top:t.top-s.top,behavior:"instant"}),t.bottom>s.bottom){let e=t.bottom-s.bottom;for(;t.bottom>s.bottom&&e<this.offsetHeight;)this.scrollBy({left:0,top:e,behavior:"instant"}),e+=5,t=i.getBoundingClientRect()}if(t.left<s.left&&this.scrollBy({left:t.left-s.left,top:0,behavior:"instant"}),t.right>s.right){let e=t.right-s.right;for(;t.right>s.right&&e<this.offsetWidth;)this.scrollBy({left:e,top:0,behavior:"instant"}),e+=5,t=i.getBoundingClientRect()}if(this.classList.remove("unfreeze"),n&&n.shiftKey){let e=this.querySelector(".selection-start");e||(o.classList.add("selection-start"),e=o),this.deselectCells({selectionStart:!1}),this.selectCells(e,i)}else this.deselectCells({selectionStart:!0})}}}activateCellInput(t,e){this.deselectCells({copySelection:!0});let i;if(i=t.classList.contains("header")?c(t.columnModel.header,"input",t.columnModel,t,e):c(t.columnModel,"input",t.record,t,e)){e=t.classList.contains("header")?"":" body";const o=d(this.cellTag,{class:"input",content:{tag:this.tagName+"-inputfield",content:i},style:{gridArea:[t.rowIndex+e,t.colIndex+" body",t.rowIndex+e,t.colIndex+" body"].join(" / ")}});o.classList.toggle("frozen-row",t.classList.contains("frozen-row")),o.classList.toggle("frozen-col",t.classList.contains("frozen-col")),u(t,o),o.originalCell=t;e=o.querySelector("input, textarea, button, [contenteditable]");e&&((e=e).focus(),(r=document.createRange()).selectNodeContents(e),r.collapse(!1),(e=window.getSelection()).removeAllRanges(),e.addRange(r)),t.tabIndex=-1,o.beforeRemove=()=>{t.tabIndex=0,t.render()},o.addEventListener("focusout",e=>{o.beforeRemove(),o.remove()}),o.addEventListener("keydown",e=>{"Enter"==e.key&&[e.metaKey,e.ctrlKey,e.altKey,e.shiftKey].every(e=>0==e)&&this.changeFocusByDirection("ArrowDown",t,e)})}var r}renderContextMenu(t){if(this.contextMenu&&this.contextMenu.anchor==t)return this.contextMenu.show();this.contextMenu&&this.contextMenu.hide();var e=null!=window.navigator.clipboard.readText||this.copyData;return this.contextMenu=new Ne({anchor:t,placement:"right-end",shift:!0,flip:!0,autoPlacement:!1,removeOnBlur:!0,class:this.constructor.tagName+"-menu",content:[r("button",{content:"Copy"},e=>{this.copyCells(t),this.contextMenu.hide()}),r("button",{content:"Paste",disabled:!e},async e=>{null==window.navigator.clipboard.readText?this.pasteCells(this.copyData):this.pasteCells(await window.navigator.clipboard.readText()),this.contextMenu.hide()})]}),this.append(this.contextMenu),this.contextMenu}initializeAxisResize(e){const o=e.target.parentElement.classList.contains("row")?"row":"col";var t="row"==o?this.rowResizeHandle:this.colResizeHandle;const i="row"==o?"rowIndex":"colIndex";var r=t[i]-(e.target.classList.contains("start")?1:0);const n=e["row"==o?"y":"x"]-this.querySelector(`${this.cellTag}.${o}-`+r)["row"==o?"offsetHeight":"offsetWidth"],s=function(e,t){if(!Array.isArray(e))return e;const i=[];return t=t||((e,t)=>!t.includes(e)),e.forEach(e=>{t(e,i)&&i.push(e)}),i}(Array.from(this.querySelectorAll(this.cellTag+".header.selected")).map(e=>e[i])).concat(r),a=(t.offsetWidth,this["col"==o?"scrollLeft":"scrollTop"]-this["col"==o?"offsetLeft":"offsetTop"]);this.classList.add("resizing"),this.dragIndicator=d(this.constructor.tagName+"-drag-indicator",{class:o,style:{["col"==o?"gridRow":"gridColumn"]:"handles / -1"}}),this.append(this.dragIndicator);let l=e=>{this.dragIndicator.style.insetInlineStart=e["col"==o?"x":"y"]+a+"px"},c=(l=l.bind(this),e=>{let t=e["row"==o?"y":"x"]-n,i=(t<0&&(t=0),this.style["gridTemplate"+("row"==o?"Rows":"Columns")].split(" [body] "));s.forEach(e=>{i[e]=t+"px"}),this.style["gridTemplate"+("row"==o?"Rows":"Columns")]=i.join(" [body] ");const r="row"==o?this.data:this._columns;this.trigger(s.map(e=>r[e].id),o+"Resize",t),this.dragIndicator.remove(),delete this.dragIndicator,this.classList.remove("resizing"),this.removeEventListener("mousemove",l),this.removeEventListener("mouseup",c)});c=c.bind(this),this.addEventListener("mousemove",l),this.addEventListener("mouseup",c)}showResizeHandleFor(e){!this.colResizeHandle&&this.resize.includes("col")&&(this.colResizeHandle=d(this.resizeHandleTag,{class:"col",content:[{class:"start"},{class:"end"}]}),this.manageEventListenerFor(this.colResizeHandle,"mousedown",this.initializeAxisResize.bind(this)),this.append(this.colResizeHandle)),!this.rowResizeHandle&&this.resize.includes("row")&&(this.rowResizeHandle=d(this.resizeHandleTag,{class:"row",content:[{class:"start"},{class:"end"}]}),this.manageEventListenerFor(this.rowResizeHandle,"mousedown",this.initializeAxisResize.bind(this)),this.append(this.rowResizeHandle)),this.classList.contains("resizing")||(this.colResizeHandle&&(this.colResizeHandle.rowIndex=1,this.colResizeHandle.colIndex=e.colIndex,this.colResizeHandle.style.gridArea=["header","body "+e.colIndex,"header","body "+e.colIndex].join(" / "),this.colResizeHandle.classList.toggle("hide-start",e.classList.contains("col-1")),this.colResizeHandle.classList.toggle("hide-end",e.classList.contains("col-"+e.parentElement.children.length)),this.colResizeHandle.classList.toggle("frozen-row",e.classList.contains("frozen-row")),e.classList.contains("row-header")?this.append(this.colResizeHandle):this.colResizeHandle.remove()),this.rowResizeHandle&&(this.rowResizeHandle.rowIndex=e.rowIndex,this.rowResizeHandle.colIndex=1,this.rowResizeHandle.style.gridArea=["body "+e.rowIndex,"body","body "+e.rowIndex,"body"].join(" / "),this.rowResizeHandle.classList.toggle("frozen-col",e.classList.contains("frozen-col")),e.classList.contains("col-1")?this.append(this.rowResizeHandle):this.rowResizeHandle.remove()))}initializeAxisReorder(e){const l=e.currentTarget.classList.contains("row")?"row":"col",r="row"==l?this.rowReorderHandle:this.colReorderHandle;let c,i=(e.dataTransfer.setDragImage(d(),0,0),this.deselectCells({copySelection:!0}),"col"==l?(this.dragStartIndex=r.colIndex,r.style.width=r.offsetWidth+"px",r.style.left=e.x-r.offsetWidth/2+this.scrollLeft-this.offsetLeft+"px",this.querySelectorAll(this.cellTag+".col-"+r.colIndex).forEach(e=>e.classList.add("selecting"))):(this.dragStartIndex=r.rowIndex,r.style.height=r.offsetHeight+"px",r.style.top=e.y-r.offsetHeight/2+this.scrollTop-this.offsetTop+"px",this.querySelectorAll(this.cellTag+".row-"+r.rowIndex).forEach(e=>e.classList.add("selecting"))),r.style.gridArea=null,this.classList.add("reordering"),this.dragIndicator=d(this.constructor.tagName+"-drag-indicator",{class:l,style:{["col"==l?"gridRow":"gridColumn"]:"handles / -1"}}),this.append(this.dragIndicator),e=>{e.preventDefault();var t,i=p(e.target,this.cellTag+", "+this.reorderHandleTag);c=i,"col"==l?(t=(t=(t=e.x-r.offsetWidth/2+this.scrollLeft-this.offsetLeft)<0?0:t)>this.scrollWidth-r.offsetWidth?this.scrollWidth-r.offsetWidth:t,r.style.left=t+"px",i&&(this.dragIndicator.style.gridColumn=`body ${i.colIndex} / body `+i.colIndex,this.dragIndicator.classList.toggle("end",i.colIndex>this.dragStartIndex))):(t=(t=(t=e.y-r.offsetHeight/2+this.scrollLeft-this.offsetTop)<0?0:t)>this.scrollHeight-r.offsetHeight?this.scrollHeight-r.offsetHeight:t,r.style.top=t+"px",i&&(this.dragIndicator.style.gridRow=`body ${i.rowIndex} / body `+i.rowIndex,this.dragIndicator.classList.toggle("end",i.rowIndex>this.dragStartIndex)))}),o=(i=i.bind(this),e=>{e=p(e.target,this.cellTag+", "+this.reorderHandleTag)||c;if(c=e){const r="col"==l?"colIndex":"rowIndex",o="col"==l?"gridColumn":"gridRow",n=e[r],s=this.dragStartIndex,a=n>s?-1:1;this.querySelectorAll(this.cellTag).forEach(e=>{var t,i;e.classList.remove(l+"-"+e[r]),e[r]==s?(t=(e[r]=n)+Math.max(a,0),i=-1==a?u:h,"col"==l?i(e.parentElement.querySelector(this.cellTag+".col-"+t),e):i(this.querySelector(this.cellTag+`.row-${t}.col-`+e.colIndex).parentElement,e.parentElement)):(e[r]==n||Math.min(s,n)<e[r]&&e[r]<Math.max(s,n))&&(e[r]+=a),e.classList.contains("header")&&"row"==l||(e.style[o+"Start"]="body "+e[r],e.style[o+"End"]="body "+e[r]),e.classList.add(l+"-"+e[r])});var e=this.style["gridTemplate"+("row"==l?"Rows":"Columns")].split(" [body] "),t=e[s];e.splice(s,1),e.splice(n,0,t),this.style["gridTemplate"+("row"==l?"Rows":"Columns")]=e.join(" [body] "),this.trigger(l+"Reorder",n,s)}this.querySelectorAll(this.cellTag+".selecting").forEach(e=>{e.classList.remove("selecting"),e.classList.add("selected")})}),n=(o=o.bind(this),e=>{var t=c||this.querySelector(`${this.cellTag}.selecting, ${this.cellTag}.selected`);this.dragIndicator.remove(),delete this.dragIndicator,this.classList.remove("reordering"),r.style.left="",r.style.width="",r.style.top="",r.style.height="",this.showReorderHandleFor(t),this.querySelectorAll(this.cellTag+".selecting").forEach(e=>{e.classList.remove("selecting")}),this.removeEventListener("dragover",i),this.removeEventListener("drop",o),this.removeEventListener("dragend",n)});n=n.bind(this),this.addEventListener("dragover",i),this.addEventListener("drop",o),this.addEventListener("dragend",n)}showReorderHandleFor(e){!this.colReorderHandle&&this.reorder.includes("col")&&(this.colReorderHandle=d(this.reorderHandleTag,{class:"col",draggable:!0,content:{content:Me()}}),this.manageEventListenerFor(this.colReorderHandle,"dragstart",this.initializeAxisReorder.bind(this))),!this.rowReorderHandle&&this.reorder.includes("row")&&(this.rowReorderHandle=d(this.reorderHandleTag,{class:"row",draggable:!0,content:{content:Me({horizontal:!0})}}),this.manageEventListenerFor(this.rowReorderHandle,"dragstart",this.initializeAxisReorder.bind(this))),this.classList.contains("reordering")||(this.colReorderHandle&&(this.colReorderHandle.rowIndex=1,this.colReorderHandle.colIndex=e.colIndex,this.colReorderHandle.style.gridArea=["handles","body "+e.colIndex,"handles","body "+e.colIndex].join(" / "),e.classList.contains("frozen-col")?this.colReorderHandle.remove():this.append(this.colReorderHandle)),this.rowReorderHandle&&(this.rowReorderHandle.rowIndex=e.rowIndex,this.rowReorderHandle.colIndex=1,this.rowReorderHandle.style.gridArea=["body "+e.rowIndex,"handles","body "+e.rowIndex,"handles"].join(" / "),e.classList.contains("frozen-row")?this.rowReorderHandle.remove():this.append(this.rowReorderHandle)))}initializeCellSelection(n,e){if(this.getRootNode()){e.shiftKey&&(this.deselectCells(),n=this.querySelector(this.cellTag+":focus"),e.preventDefault());const r=e=>{e=p(e.target,this.cellTag);if(e){this.querySelectorAll(this.cellTag+".selecting").forEach(e=>e.classList.remove("selecting"));var i=[n.colIndex,e.colIndex];if(n.classList.contains("header"))for(let e=Math.min(...i);e<=Math.max(...i);e++)this.querySelectorAll(".col-"+e).forEach(e=>e.classList.add("selecting"));else{var r=[n.rowIndex,e.rowIndex];for(let t=Math.min(...r);t<=Math.max(...r);t++)for(let e=Math.min(...i);e<=Math.max(...i);e++){var o=this.querySelector(`.row-${t}.col-`+e);o&&o.classList.add("selecting")}}}};e.shiftKey&&r(e),n.classList.contains("header")&&r(e);this.getRootNode().addEventListener("mouseup",e=>{var t,i=p(e.target,this.cellTag);n.classList.contains("header")||i&&i!=n?((t=this.querySelectorAll(this.cellTag+".selecting")).forEach(e=>e.classList.remove("selecting")),this.selectCells(...Array.from(t))):e?.metaKey?i.classList.add("selected"):this.deselectCells(),this.removeEventListener("mouseover",r),n.focus()},{once:!0}),this.addEventListener("mouseover",r)}}selectCells(...e){let i=e[e.length-1]instanceof HTMLElement?{}:e.pop();i=Object.assign({outline:!0,class:"selected"},i);var t=e=>Math.min(...e.filter(e=>"number"==typeof e)),r=e=>Math.max(...e.filter(e=>"number"==typeof e)),o=(i,e)=>[...Array(e-i+1).fill().map((e,t)=>t+i)];const n=[];let s=e.map(e=>e.rowIndex),a=(s=s.filter(e=>"header"==e).concat(o(t(s),r(s))),e.map(e=>e.colIndex));return a=a.filter(e=>"header"==e).concat(o(t(a),r(a))),i.class&&s.forEach(t=>{a.forEach(e=>{e=this.querySelector(`.row-${t}.col-`+e);e&&(e.classList.add(i.class),n.push(e))})}),i.outline&&((o=d("string"==typeof i.outline?i.outline:this.tagName+"-selection",{style:{gridArea:[s[0],a[0],s[s.length-1]+1,a[a.length-1]+1].map(e=>"header"==e?e:"body "+e).join(" / ")}})).classList.toggle("includes-frozen-row",e.some(e=>e.classList.contains("frozen-row"))),o.classList.toggle("includes-frozen-col",e.some(e=>e.classList.contains("frozen-col"))),this.append(o)),n}deselectCells(e={}){(e=Object.assign({selected:!0,selection:!0,inputfield:!0,selectionStart:!0,copySelection:!1},e)).selected&&this.querySelectorAll(this.cellTag+".selected").forEach(e=>e.classList.remove("selected")),e.selection&&this.querySelectorAll(this.tagName+"-selection").forEach(e=>e.remove()),e.inputfield&&this.querySelectorAll(this.cellTag+"-inputfield").forEach(e=>{e.beforeRemove(),e.remove()}),e.selectionStart&&this.querySelectorAll(this.cellTag+".selection-start").forEach(e=>e.classList.remove("selection-start")),e.copySelection&&this.querySelectorAll(this.tagName+"-copy-selection").forEach(e=>e.remove())}selectedCells(){let e=this.querySelectorAll(`${this.cellTag}.selected, ${this.cellTag}:focus, ${this.cellTag}:focus-within`);if(0==e.length){if(!this.contextMenu)return[];e=[this.contextMenu.anchor]}const t=function(e,i){const r={};return e.forEach(e=>{let t;t=o(i)?r[i(e)]:c(e,i),r[t]=r[t]||[],r[t].push(e)}),r}(e,"rowIndex");return Object.keys(t).map(e=>t[e])}copyCells(e){var t=this.selectedCells(),i=this.selectedCells().map(e=>e.map(e=>e.columnModel.copy(e.record)).join("\t")).join("\n");window.navigator.clipboard.writeText(i),this.copyData=i,this.deselectCells({copySelection:!0}),this.selectCells(...t.flat(),{outline:this.tagName+"-copy-selection"})}pasteCells(e){if(null!=e){var t=this.selectedCells();const o=e.split("\n").map(e=>e.split("\t"));if(1==t.length&&1==t[0].length){const n=t[0][0];let r=n.rowIndex;const s=[];o.forEach(e=>{let i=n.colIndex;e.forEach(e=>{var t=this.querySelector(this.cellTag+(`.col-${i}.row-`+r));t&&(this.pasteCell(t,e),s.push(t)),i++}),r++}),this.selectCells(...s),n.focus()}else{let i=0;t.forEach(e=>{i=i==o.length?0:i;let t=0;e.forEach(e=>{t=t==o[i].length?0:t,this.pasteCell(e,o[i][t]),t++}),i++})}this.querySelectorAll(this.tagName+"-copy-selection").forEach(e=>e.remove())}}pasteCell(e,t){e.columnModel.paste(e.record,t),e.render()}static style=function(){return`
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
        
    `};addEventListenerFor(...e){return i(this,...e)}}window.customElements.define(Oe.tagName,Oe);var je=Object.freeze({__proto__:null,AutoGrid:P,ContentArea:M,DataTable:Te,Dropdown:_e,Dropzone:De,Element:e,Floater:Ne,Input:t,Modal:B,Spreadsheet:Oe,Tooltip:$e});Object.keys(je).forEach(e=>{window[e]=je[e]}),document.addEventListener("DOMContentLoaded",function(){i(document,".js-toggle-source","click",e=>{document.querySelector(e.delegateTarget.getAttribute("rel")).classList.toggle("hide")})})}();