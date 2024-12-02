!function(){"use strict";function r(t,i,e,r,n={}){(e=Array.isArray(e)?e:[e]).forEach(e=>{t.addEventListener(e,e=>{e.target.matches(i)?(e.delegateTarget=e.target,r(e)):e.target.closest(i)&&(e.delegateTarget=e.target.closest(i),r(e))},n)})}const O=["accept","accept-charset","accesskey","action","align","allow","alt","async","autocapitalize","autocomplete","autofocus","autoplay","background","bgcolor","border","buffered","capture","challenge","charset","checked","cite","class","code","codebase","color","cols","colspan","content","contenteditable","contextmenu","controls","coords","crossorigin","csp","data","data-*","datetime","decoding","default","defer","dir","dirname","disabled","download","draggable","dropzone","enctype","enterkeyhint","for","form","formaction","formenctype","formmethod","formnovalidate","formtarget","headers","height","hidden","high","href","hreflang","http-equiv","icon","id","importance","integrity","intrinsicsize","inputmode","ismap","itemprop","keytype","kind","label","lang","language","loading","list","loop","low","manifest","max","maxlength","minlength","media","method","min","multiple","muted","name","novalidate","open","optimum","pattern","ping","placeholder","popover","popovertarget","popovertargetaction","poster","preload","radiogroup","readonly","referrerpolicy","rel","required","reversed","rows","rowspan","sandbox","scope","scoped","selected","shape","size","sizes","slot","span","spellcheck","src","srcdoc","srclang","srcset","start","step","style","summary","tabindex","target","title","translate","type","usemap","value","width","wrap","aria","aria-*","xmlns"],M=["disabled","readOnly","multiple","checked","autobuffer","autoplay","controls","loop","selected","hidden","scoped","async","defer","reversed","isMap","seemless","muted","required","autofocus","noValidate","formNoValidate","open","pubdate","itemscope","indeterminate"],j=["accent-height","accumulate","additive","alignment-baseline","alphabetic","amplitude","arabic-form","ascent","attributeName","attributeType","azimuth","baseFrequency","baseline-shift","baseProfile","bbox","begin","bias","by","calcMode","cap-height","class","clip","clipPathUnits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","crossorigin","cursor","cx","cy","d","decelerate","descent","diffuseConstant","direction","display","divisor","dominant-baseline","dur","dx","dy","edgeMode","elevation","enable-background","end","exponent","fill","fill-opacity","fill-rule","filter","filterUnits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","format","from","fr","fx","fy","g1","g2","glyph-name","glyph-orientation-horizontal","glyph-orientation-vertical","glyphRef","gradientTransform","gradientUnits","hanging","height","href","hreflang","horiz-adv-x","horiz-origin-x","id","ideographic","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kernelMatrix","kernelUnitLength","kerning","keyPoints","keySplines","keyTimes","lang","lengthAdjust","letter-spacing","lighting-color","limitingConeAngle","local","marker-end","marker-mid","marker-start","markerHeight","markerUnits","markerWidth","mask","maskContentUnits","maskUnits","mathematical","max","media","method","min","mode","name","numOctaves","offset","opacity","operator","order","orient","orientation","origin","overflow","overline-position","overline-thickness","panose-1","paint-order","path","pathLength","patternContentUnits","patternTransform","patternUnits","ping","pointer-events","points","pointsAtX","pointsAtY","pointsAtZ","preserveAlpha","preserveAspectRatio","primitiveUnits","r","radius","referrerPolicy","refX","refY","rel","rendering-intent","repeatCount","repeatDur","requiredExtensions","requiredFeatures","restart","result","rotate","rx","ry","scale","seed","shape-rendering","slope","spacing","specularConstant","specularExponent","speed","spreadMethod","startOffset","stdDeviation","stemh","stemv","stitchTiles","stop-color","stop-opacity","strikethrough-position","strikethrough-thickness","string","stroke","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke-width","style","surfaceScale","systemLanguage","tabindex","tableValues","target","targetX","targetY","text-anchor","text-decoration","text-rendering","textLength","to","transform","transform-origin","type","u1","u2","underline-position","underline-thickness","unicode","unicode-bidi","unicode-range","units-per-em","v-alphabetic","v-hanging","v-ideographic","v-mathematical","values","vector-effect","version","vert-adv-y","vert-origin-x","vert-origin-y","viewBox","visibility","width","widths","word-spacing","writing-mode","x","x-height","x1","x2","xChannelSelector","xlink:actuate","xlink:arcrole","xlink:href Deprecated","xlink:role","xlink:show","xlink:title","xlink:type","xml:base","xml:lang","xml:space","y","y1","y2","yChannelSelector","z","zoomAndPan"];function s(e,t){e.innerHTML="",a(e,t)}function P(t,i={}){Object.keys(i).forEach(e=>function t(i,r,n){n instanceof Promise?n.then(e=>t(i,r,e)):!1?(n.addListener(e=>t(i,r,e)),"content"==r?s(i,n.value):t(i,r,n.value)):"value"==r?i.value=n:"data"==r&&"object"==typeof n?Object.keys(n).forEach(e=>{i.dataset[e]="object"==typeof n[e]?JSON.stringify(n[e]):n[e]}):"style"==r&&"object"==typeof n?Object.keys(n).forEach(t=>{let e=n[t];(e,!1)&&(e.addListener(e=>{null===e?i.style.removeProperty(t):i.style.setProperty(t,e)}),e=e.value),null===e?i.style.removeProperty(t):i.style.setProperty(t,e)}):"content"==r||"children"==r?s(i,n):r.match(/^on[a-z]/)?i[r]=n:M.find(e=>e.toUpperCase()==r.toUpperCase())?(r=M.find(e=>e.toUpperCase()==r.toUpperCase()),i[r]=!1!==n):(O.find(e=>r.match(new RegExp(e)))||j.includes(r))&&i.setAttribute(r,n)}(t,e,i[e]))}function d(e="div",t={},i){"object"==typeof e&&("string"==typeof t&&(i=t),e=(t=e).tag||"div");let r;return"svg"==e&&(t.xmlns=t.xmlns||"http://www.w3.org/2000/svg"),P(r=t.xmlns||i?document.createElementNS(t.xmlns||i,e):document.createElement(e),t),r}function h(e,t){if(Array.isArray(t)||t instanceof NodeList||t instanceof HTMLCollection){for(var i=Array.from(t);0<i.length;)e=h(e,i.pop());return e}if(Array.isArray(e)||e instanceof NodeList||e instanceof HTMLCollection)return h(e[0],t);if(e.parentNode)return t instanceof Node||(t=new Text(t)),e.parentNode.insertBefore(t,e),t;throw"argument of insertBefore unsupported"}function F(e){return e instanceof NodeList||e instanceof Array||e instanceof HTMLCollection?(e=Array.from(e)).forEach(F):e.parentNode.removeChild(e),e}function a(t,i,r,n,o){if(o=o||"append",Array.isArray(i)||i instanceof NodeList||i instanceof HTMLCollection){let e=Array.from(i);(e="prepend"==o?e.reverse():e).forEach(e=>a(t,e,r,n,o))}else if(r instanceof Element){let e=Array.from(arguments).slice(1).filter(e=>e instanceof Element);(e="prepend"==o?e.reverse():e).forEach(e=>a(t,e,void 0,n,o))}else if("boolean"!=typeof r&&(n=r,r=void 0),null!=i){var e;if(i instanceof Promise||i.then){const s=document.createElement("span");return t[o](s),i.then(e=>{a(s,e,r,n),h(s,s.childNodes),F(s)})}return i instanceof Element||i instanceof Node?t[o](i):"function"==typeof i?a(t,i.bind(n)(t),r,n):"object"==typeof i?t[o](d(i,t.namespaceURI)):r?t[o](i):((e=document.createElement("div")).innerHTML=i,t[o](...e.childNodes))}}function o(e,t){return getComputedStyle(e).getPropertyValue(t)}function u(e,t){if(Array.isArray(t)||t instanceof NodeList||t instanceof HTMLCollection){for(var i=Array.from(t);0<i.length;)e=u(e,i.shift());return e}if(Array.isArray(e)||e instanceof NodeList||e instanceof HTMLCollection)return u(e[e.length-1],t);if(e.parentNode)return t instanceof Node||(t=new Text(t)),e.parentNode.insertBefore(t,e.nextSibling),t;throw"argument of insertAfter unsupported"}function i(...e){let t=e.pop(),i=e.pop();"string"==typeof i||Array.isArray(i)||(e=e.concat(i),i="click"),"string"!=typeof e[0]&&e.unshift("button");const r=d(...e);return(i=Array.isArray(i)?i:[i]).forEach(e=>r.addEventListener(e,t)),r}function n(e){return e&&e.constructor&&e.call&&e.apply}function l(e,t,...i){t=e[t];return n(t)?t.call(e,...i):t}function c(e,t){let i=[];return function e(t,i){i(t);t=Object.getPrototypeOf(t);t&&e(t,i)}(e,e=>{i.push(e[t])}),i}function p(e,t){return e.matches?e.matches(t)?e:e.closest(t):null}function q(t,...i){const r={};return Object.keys(t).forEach(function(e){i.includes(e)||(r[e]=t[e])}),r}class e extends HTMLElement{static assignableAttributes=[];static assignableMethods=[];static bindMethods=[];static style="";static watch=[];static get observedAttributes(){return this.watch}_assignableAttributes={};_assignableMethods=[];_attributes={};_cleanupCallbacks=[];is_instantiated=!1;constructor(t={}){super();const r=Object.assign({},t);c(this.constructor,"assignableAttributes").filter(e=>e).reverse().forEach(e=>{Array.isArray(e)?e.forEach(e=>{this._assignableAttributes[e]=this._assignableAttributes[e]||null}):Object.assign(this._assignableAttributes,e)}),Object.keys(this._assignableAttributes).forEach(i=>{Object.defineProperty(this,i,{configurable:!0,enumerable:!0,get:()=>this._attributes[i],set:e=>{var t=this._attributes[i];e!==t&&(this._attributes[i]=e,this.attributeChangedCallback(i,t,e))}}),t.hasOwnProperty(i)?(this._attributes[i]=t[i],delete r[i]):this._attributes[i]=this._assignableAttributes[i]}),c(this.constructor,"assignableMethods").filter(e=>e).reverse().forEach(e=>{e.forEach(e=>{t.hasOwnProperty(e)&&(this[e]=t[e],delete r[e])})}),c(this.constructor,"bindMethods").filter(e=>e).reverse().forEach(e=>{e.forEach(e=>{this[e]=this[e].bind(this)})}),P(this,r)}instantiate(){return Object.keys(this._assignableAttributes).forEach(e=>{var t=this.getAttribute(e)||this.dataset[e]||this[e];"content"==e&&t?(this.removeAttribute("content"),s(this,t)):null!==t&&(this[e]=t)}),this.is_instantiated=!0}connected(){}connectedCallback(){this.trigger("beforeConnect"),this.appendStyle(),!this.is_instantiated&&!1===this.instantiate()||(this.connected(),this.trigger("afterConnect"))}disconnected(){}disconnectedCallback(){this.trigger("beforeDisconnect"),this._cleanupCallbacks.forEach(e=>e()),this._cleanupCallbacks=[],this.disconnected(),this.trigger("afterDisconnect")}changed(e,t,i){}attributeChangedCallback(e,...t){return this[e+"Changed"]&&this[e+"Changed"](...t),this.changed(e,...t)}appendStyle(){if(this.constructor.style){var e=this.getRootNode();const r=this.tagName.toLowerCase();if(e&&e.adoptedStyleSheets&&!e.adoptedStyleSheets.find(e=>e.id==r)){var i=new CSSStyleSheet;let t="";c(this.constructor,"style").forEach(e=>{t+=n(e)?e.bind(this.constructor)():e}),i.replaceSync(t),i.id=r,e.adoptedStyleSheets.push(i)}}}async remove(e){return this.trigger("beforeRemove"),e&&await e(),super.remove(),this.trigger("afterRemove"),this}manageEventListenerFor(...e){this._cleanupCallbacks.push(()=>{e[0].removeEventListener(...e.slice(1))}),e[0].addEventListener(...e.slice(1))}trigger(...e){var t,i;[e,t,i]=[this,...e],i=Object.assign({bubbles:!0,cancelable:!0},i),e.dispatchEvent(new CustomEvent(t,i))}}class B extends e{static observer=new ResizeObserver(e=>{e.forEach(e=>e.target.resize())});static assignableAttributes={columnWidth:"max-content",method:"pop"};static assignableMethods=["initialTemplate"];connected(){this.enable()}disconnected(){this.disable()}cells(e){return Array.from(e.children).map(e=>["grid","inline-grid"].includes(getComputedStyle(e).display)?this.cells(e):e.dataset.autoGridIgnore?null:e).flat().filter(e=>null!==e)}disable(){this.constructor.observer.unobserve(this)}enable(){this.constructor.observer.observe(this)}initialTemplate(e){return e.map(e=>this.columnWidth).join(" ")}resize(){const t=getComputedStyle(this);for(var e,i=this.cells(this),r=this.initialTemplate(i).split(/(?<!\,)\s+/);this.style.setProperty("grid-template-columns",r.join(" ")),e=i.some(e=>e.offsetLeft<this.offsetLeft-parseFloat(t.paddingLeft))||i.some(e=>e.offsetLeft+e.offsetWidth>this.offsetLeft+this.offsetWidth-parseFloat(t.paddingRight)),r[this.method](),1<=r.length&&e;);}static style=`
        auto-grid {
            display: grid;
            grid-template-columns: auto;
        }
    `}window.customElements.define("auto-grid",B);class W extends e{static tagName="komp-modal";constructor(...e){super(...e),this.container=d(this.tagName+"-popover",{popover:"manual"})}connected(){if(this.parentElement.localName!=this.localName+"-popover"){var e=Array.from(this.parentElement.querySelectorAll("komp-modal-popover"));let t=Math.max(...e.map(e=>parseInt(e.dataset.modalOrder||"0")));t++,e.forEach(e=>{e.dataset.modalOrder=e.dataset.modalOrder||t++}),this.replaceWith(this.container),this.container.addEventListener("click",e=>{e.target==this.container&&this.remove()}),this.container.append(this),this.container.append(d(this.tagName+"-close",{content:i({content:'<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'},this.remove.bind(this))})),this.container.showPopover()}}remove(){var e=this.container.parentElement;return this.container.remove(),e&&(e=Array.from(e.querySelectorAll(this.localName+"-popover")).sort((e,t)=>parseInt(t.dataset.modalOrder)-parseInt(e.dataset.modalOrder))[0])&&delete e.dataset.modalOrder,super.remove()}static style=function(){return`
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
    `}}window.customElements.define(W.tagName,W);const V=["start","end"],U=["top","right","bottom","left"].reduce((e,t)=>e.concat(t,t+"-"+V[0],t+"-"+V[1]),[]),w=Math.min,b=Math.max,g=Math.round,m=Math.floor,v=e=>({x:e,y:e}),K={left:"right",right:"left",bottom:"top",top:"bottom"},Y={start:"end",end:"start"};function X(e,t,i){return b(e,w(t,i))}function L(e,t){return"function"==typeof e?e(t):e}function E(e){return e.split("-")[0]}function x(e){return e.split("-")[1]}function G(e){return"x"===e?"y":"x"}function J(e){return"y"===e?"height":"width"}function k(e){return["top","bottom"].includes(E(e))?"y":"x"}function Z(e){return G(k(e))}function Q(e,t,i){void 0===i&&(i=!1);var r=x(e),e=Z(e),n=J(e);let o="x"===e?r===(i?"end":"start")?"right":"left":"start"===r?"bottom":"top";return[o=t.reference[n]>t.floating[n]?te(o):o,te(o)]}function z(e){return e.replace(/start|end/g,e=>Y[e])}function ee(e,t,i,r){const n=x(e);let o=function(e,t,i){var r=["left","right"],n=["right","left"];switch(e){case"top":case"bottom":return i?t?n:r:t?r:n;case"left":case"right":return t?["top","bottom"]:["bottom","top"];default:return[]}}(E(e),"start"===i,r);return o=n&&(o=o.map(e=>e+"-"+n),t)?o.concat(o.map(z)):o}function te(e){return e.replace(/left|right|bottom|top/g,e=>K[e])}function ie(e){return"number"!=typeof e?{top:0,right:0,bottom:0,left:0,...e}:{top:e,right:e,bottom:e,left:e}}function y(e){return{...e,top:e.y,left:e.x,right:e.x+e.width,bottom:e.y+e.height}}function re(e,t,i){var{reference:r,floating:n}=e,e=k(t),o=Z(t),s=J(o),a=E(t),l="y"===e,c=r.x+r.width/2-n.width/2,d=r.y+r.height/2-n.height/2,h=r[s]/2-n[s]/2;let u;switch(a){case"top":u={x:c,y:r.y-n.height};break;case"bottom":u={x:c,y:r.y+r.height};break;case"right":u={x:r.x+r.width,y:d};break;case"left":u={x:r.x-n.width,y:d};break;default:u={x:r.x,y:r.y}}switch(x(t)){case"start":u[o]-=h*(i&&l?-1:1);break;case"end":u[o]+=h*(i&&l?-1:1)}return u}async function ne(e,t){var{x:i,y:r,platform:n,rects:o,elements:s,strategy:a}=e,{boundary:t="clippingAncestors",rootBoundary:e="viewport",elementContext:l="floating",altBoundary:c=!1,padding:d=0}=L(t=void 0===t?{}:t,e),d=ie(d),c=s[c?"floating"===l?"reference":"floating":l],h=y(await n.getClippingRect({element:null==(h=await(null==n.isElement?void 0:n.isElement(c)))||h?c:c.contextElement||await(null==n.getDocumentElement?void 0:n.getDocumentElement(s.floating)),boundary:t,rootBoundary:e,strategy:a})),c="floating"===l?{...o.floating,x:i,y:r}:o.reference,t=await(null==n.getOffsetParent?void 0:n.getOffsetParent(s.floating)),e=await(null==n.isElement?void 0:n.isElement(t))&&await(null==n.getScale?void 0:n.getScale(t))||{x:1,y:1},l=y(n.convertOffsetParentRelativeRectToViewportRelativeRect?await n.convertOffsetParentRelativeRectToViewportRelativeRect({rect:c,offsetParent:t,strategy:a}):c);return{top:(h.top-l.top+d.top)/e.y,bottom:(l.bottom-h.bottom+d.bottom)/e.y,left:(h.left-l.left+d.left)/e.x,right:(l.right-h.right+d.right)/e.x}}const oe=f=>({name:"arrow",options:f,async fn(e){var{x:t,y:i,placement:r,rects:n,platform:o,elements:s}=e,{element:e,padding:a=0}=L(f,e)||{};if(null==e)return{};var a=ie(a),t={x:t,y:i},i=Z(r),l=J(i),c=await o.getDimensions(e),d="y"===i,h=d?"top":"left",u=d?"bottom":"right",d=d?"clientHeight":"clientWidth",p=n.reference[l]+n.reference[i]-t[i]-n.floating[l],g=t[i]-n.reference[i],e=await(null==o.getOffsetParent?void 0:o.getOffsetParent(e));let m=e?e[d]:0;p=p/2-g/2,g=(m=m&&await(null==o.isElement?void 0:o.isElement(e))?m:s.floating[d]||n.floating[l])/2-c[l]/2-1,o=w(a[h],g),e=w(a[u],g),s=o,d=m-c[l]-e,h=m/2-c[l]/2+p,a=X(s,h,d),u=null!=x(r)&&h!=a&&n.reference[l]/2-(h<s?o:e)-c[l]/2<0?h<s?s-h:d-h:0;return{[i]:t[i]-u,data:{[i]:a,centerOffset:h-a+u}}}});function se(e){var t=w(...e.map(e=>e.left)),i=w(...e.map(e=>e.top));return{x:t,y:i,width:b(...e.map(e=>e.right))-t,height:b(...e.map(e=>e.bottom))-i}}function f(e){return ae(e)?(e.nodeName||"").toLowerCase():"#document"}function N(e){return(null==e||null==(e=e.ownerDocument)?void 0:e.defaultView)||window}function R(e){return null==(e=(ae(e)?e.ownerDocument:e.document)||window.document)?void 0:e.documentElement}function ae(e){return e instanceof Node||e instanceof N(e).Node}function T(e){return e instanceof Element||e instanceof N(e).Element}function A(e){return e instanceof HTMLElement||e instanceof N(e).HTMLElement}function le(e){return"undefined"!=typeof ShadowRoot&&(e instanceof ShadowRoot||e instanceof N(e).ShadowRoot)}function C(e){var{overflow:e,overflowX:t,overflowY:i,display:r}=S(e);return/auto|scroll|overlay|hidden|clip/.test(e+i+t)&&!["inline","contents"].includes(r)}function ce(e){var t=de();const i=S(e);return"none"!==i.transform||"none"!==i.perspective||!!i.containerType&&"normal"!==i.containerType||!t&&!!i.backdropFilter&&"none"!==i.backdropFilter||!t&&!!i.filter&&"none"!==i.filter||["transform","perspective","filter"].some(e=>(i.willChange||"").includes(e))||["paint","layout","strict","content"].some(e=>(i.contain||"").includes(e))}function de(){return!("undefined"==typeof CSS||!CSS.supports)&&CSS.supports("-webkit-backdrop-filter","none")}function he(e){return["html","body","#document"].includes(f(e))}function S(e){return N(e).getComputedStyle(e)}function ue(e){return T(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.pageXOffset,scrollTop:e.pageYOffset}}function H(e){return"html"!==f(e)&&(e=e.assignedSlot||e.parentNode||le(e)&&e.host||R(e),le(e))?e.host:e}function I(e,t){void 0===t&&(t=[]);var i=function e(t){var i=H(t);return he(i)?(t.ownerDocument||t).body:A(i)&&C(i)?i:e(i)}(e),e=i===(null==(e=e.ownerDocument)?void 0:e.body),r=N(i);return e?t.concat(r,r.visualViewport||[],C(i)?i:[],r.frameElement?I(r.frameElement):[]):t.concat(i,I(i))}function pe(e){var t=S(e);let i=parseFloat(t.width)||0,r=parseFloat(t.height)||0;var t=A(e),n=t?e.offsetWidth:i,t=t?e.offsetHeight:r,e=g(i)!==n||g(r)!==t;return e&&(i=n,r=t),{width:i,height:r,$:e}}function ge(e){return T(e)?e:e.contextElement}function $(e){e=ge(e);if(!A(e))return v(1);var t=e.getBoundingClientRect(),{width:e,height:i,$:r}=pe(e);let n=(r?g(t.width):t.width)/e,o=(r?g(t.height):t.height)/i;return n&&Number.isFinite(n)||(n=1),o&&Number.isFinite(o)||(o=1),{x:n,y:o}}const me=v(0);function fe(e){e=N(e);return de()&&e.visualViewport?{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}:me}function _(e,t,i,r){void 0===t&&(t=!1),void 0===i&&(i=!1);var n=e.getBoundingClientRect(),o=ge(e);let s=v(1);t&&(r?T(r)&&(s=$(r)):s=$(e));t=o,void 0===(e=i)&&(e=!1);i=!(i=r)||e&&i!==N(t)||!e?v(0):fe(o);let a=(n.left+i.x)/s.x,l=(n.top+i.y)/s.y,c=n.width/s.x,d=n.height/s.y;if(o){var h=N(o),u=r&&T(r)?N(r):r;let e=h.frameElement;for(;e&&r&&u!==h;){var p=$(e),g=e.getBoundingClientRect(),m=S(e),f=g.left+(e.clientLeft+parseFloat(m.paddingLeft))*p.x,g=g.top+(e.clientTop+parseFloat(m.paddingTop))*p.y;a*=p.x,l*=p.y,c*=p.x,d*=p.y,a+=f,l+=g,e=N(e).frameElement}}return y({width:c,height:d,x:a,y:l})}function ve(e){return _(R(e)).left+ue(e).scrollLeft}function ye(e,t,i){let r;var n,o,s;return y(r="viewport"===t?function(e,t){var i=N(e),e=R(e),i=i.visualViewport;let r=e.clientWidth,n=e.clientHeight,o=0,s=0;return i&&(r=i.width,n=i.height,de()&&"fixed"!==t||(o=i.offsetLeft,s=i.offsetTop)),{width:r,height:n,x:o,y:s}}(e,i):"document"===t?function(e){var t=R(e),i=ue(e),r=e.ownerDocument.body,n=b(t.scrollWidth,t.clientWidth,r.scrollWidth,r.clientWidth),o=b(t.scrollHeight,t.clientHeight,r.scrollHeight,r.clientHeight);let s=-i.scrollLeft+ve(e);return e=-i.scrollTop,"rtl"===S(r).direction&&(s+=b(t.clientWidth,r.clientWidth)-n),{width:n,height:o,x:s,y:e}}(R(e)):T(t)?(o=(i=_(n=t,!0,"fixed"===(i=i))).top+n.clientTop,i=i.left+n.clientLeft,s=A(n)?$(n):v(1),{width:n.clientWidth*s.x,height:n.clientHeight*s.y,x:i*s.x,y:o*s.y}):(n=fe(e),{...t,x:t.x-n.x,y:t.y-n.y}))}function we(e,t){var i=t.get(e);if(i)return i;let r=I(e).filter(e=>T(e)&&"body"!==f(e)),n=null;var o="fixed"===S(e).position;let s=o?H(e):e;for(;T(s)&&!he(s);){var a=S(s),l=ce(s),l=(l||"fixed"!==a.position||(n=null),o?!l&&!n:!l&&"static"===a.position&&!!n&&["absolute","fixed"].includes(n.position)||C(s)&&!l&&function e(t,i){t=H(t);return!(t===i||!T(t)||he(t))&&("fixed"===S(t).position||e(t,i))}(e,s));l?r=r.filter(e=>e!==s):n=a,s=H(s)}return t.set(e,r),r}function be(e,t){return A(e)&&"fixed"!==S(e).position?t?t(e):e.offsetParent:null}function xe(e,t){var i,r=N(e);if(!A(e))return r;let n=be(e,t);for(;n&&(i=n,["table","td","th"].includes(f(i)))&&"static"===S(n).position;)n=be(n,t);return(!n||"html"!==f(n)&&("body"!==f(n)||"static"!==S(n).position||ce(n)))&&(n||function(e){let t=H(e);for(;A(t)&&!he(t);){if(ce(t))return t;t=H(t)}return null}(e))||r}const Le={convertOffsetParentRelativeRectToViewportRelativeRect:function(e){var{rect:e,offsetParent:t,strategy:i}=e,r=A(t),n=R(t);if(t===n)return e;let o={scrollLeft:0,scrollTop:0},s=v(1);var a=v(0);return(r||!r&&"fixed"!==i)&&("body"===f(t)&&!C(n)||(o=ue(t)),A(t))&&(r=_(t),s=$(t),a.x=r.x+t.clientLeft,a.y=r.y+t.clientTop),{width:e.width*s.x,height:e.height*s.y,x:e.x*s.x-o.scrollLeft*s.x+a.x,y:e.y*s.y-o.scrollTop*s.y+a.y}},getDocumentElement:R,getClippingRect:function(e){let{element:i,boundary:t,rootBoundary:r,strategy:n}=e;var o=(e=[..."clippingAncestors"===t?we(i,this._c):[].concat(t),r])[0];return{width:(e=e.reduce((e,t)=>{t=ye(i,t,n);return e.top=b(t.top,e.top),e.right=w(t.right,e.right),e.bottom=w(t.bottom,e.bottom),e.left=b(t.left,e.left),e},ye(i,o,n))).right-e.left,height:e.bottom-e.top,x:e.left,y:e.top}},getOffsetParent:xe,getElementRects:async function(e){var{reference:e,floating:t,strategy:i}=e,r=this.getOffsetParent||xe,n=this.getDimensions;return{reference:function(e,t,i){var r=A(t),n=R(t),e=_(e,!0,i="fixed"===i,t);let o={scrollLeft:0,scrollTop:0};var s=v(0);return!r&&i||("body"===f(t)&&!C(n)||(o=ue(t)),r?(r=_(t,!0,i,t),s.x=r.x+t.clientLeft,s.y=r.y+t.clientTop):n&&(s.x=ve(n))),{x:e.left+o.scrollLeft-s.x,y:e.top+o.scrollTop-s.y,width:e.width,height:e.height}}(e,await r(t),i),floating:{x:0,y:0,...await n(t)}}},getClientRects:function(e){return Array.from(e.getClientRects())},getDimensions:pe,getScale:$,isElement:T,isRTL:function(e){return"rtl"===S(e).direction}};function Ee(c,t){let d=null,h;const u=R(c);function p(){clearTimeout(h),d&&d.disconnect(),d=null}return function i(r,n){void 0===r&&(r=!1),void 0===n&&(n=1),p();var{left:e,top:o,width:s,height:a}=c.getBoundingClientRect();if(r||t(),s&&a){r={rootMargin:-m(o)+"px "+-m(u.clientWidth-(e+s))+"px "+-m(u.clientHeight-(o+a))+"px "+-m(e)+"px",threshold:b(0,w(1,n))||1};let t=!0;try{d=new IntersectionObserver(l,{...r,root:u.ownerDocument})}catch(e){d=new IntersectionObserver(l,r)}function l(e){if((e=e[0].intersectionRatio)!==n){if(!t)return i();e?i(!1,e):h=setTimeout(()=>{i(!1,1e-7)},100)}t=!1}d.observe(c)}}(!0),p}function ke(i,t,r,e){void 0===e&&(e={});const{ancestorScroll:n=!0,ancestorResize:o=!0,elementResize:s="function"==typeof ResizeObserver,layoutShift:a="function"==typeof IntersectionObserver,animationFrame:l=!1}=e,c=ge(i),d=n||o?[...c?I(c):[],...I(t)]:[],h=(d.forEach(e=>{n&&e.addEventListener("scroll",r,{passive:!0}),o&&e.addEventListener("resize",r)}),c&&a?Ee(c,r):null);let u=-1,p=null;s&&(p=new ResizeObserver(e=>{var[e]=e;e&&e.target===c&&p&&(p.unobserve(t),cancelAnimationFrame(u),u=requestAnimationFrame(()=>{p&&p.observe(t)})),r()}),c&&!l&&p.observe(c),p.observe(t));let g,m=l?_(i):null;return l&&function e(){const t=_(i);!m||t.x===m.x&&t.y===m.y&&t.width===m.width&&t.height===m.height||r();m=t;g=requestAnimationFrame(e)}(),r(),()=>{d.forEach(e=>{n&&e.removeEventListener("scroll",r),o&&e.removeEventListener("resize",r)}),h&&h(),p&&p.disconnect(),p=null,l&&cancelAnimationFrame(g)}}const ze=(e,t,i)=>{var r=new Map,i={platform:Le,...i},r={...i.platform,_c:r};return(async(t,i,e)=>{var{placement:r="bottom",strategy:n="absolute",middleware:e=[],platform:o}=e,s=e.filter(Boolean),a=await(null==o.isRTL?void 0:o.isRTL(i));let l=await o.getElementRects({reference:t,floating:i,strategy:n}),{x:c,y:d}=re(l,r,a),h=r,u={},p=0;for(let e=0;e<s.length;e++){var{name:g,fn:m}=s[e],{x:m,y:f,data:v,reset:y}=await m({x:c,y:d,initialPlacement:r,placement:h,strategy:n,middlewareData:u,rects:l,platform:o,elements:{reference:t,floating:i}});c=null!=m?m:c,d=null!=f?f:d,u={...u,[g]:{...u[g],...v}},y&&p<=50&&(p++,"object"==typeof y&&(y.placement&&(h=y.placement),y.rects&&(l=!0===y.rects?await o.getElementRects({reference:t,floating:i,strategy:n}):y.rects),{x:c,y:d}=re(l,h,a)),e=-1)}return{x:c,y:d,placement:h,strategy:n,middlewareData:u}})(e,t,{...i,platform:r})};class Ne extends e{static tagName="komp-floater";static assignableAttributes={content:null,anchor:null,placement:void 0,strategy:"absolute",flip:null,offset:null,shift:!0,arrow:null,autoPlacement:!0,inline:null,autoUpdate:{},removeOnBlur:!1,container:null,timeout:0};static bindMethods=["show","hide","checkFocus","checkEscape"];instantiate(){super.instantiate(),"string"==typeof this.anchor&&(this.anchor=this.getRootNode().querySelector(this.anchor))}connected(){if(this.style.position=this.strategy,!this.anchor)throw"Floater needs anchor to position to.";const t=[];Object.keys(Re).forEach(e=>{if(this[e])if("arrow"==e){let e=this.querySelector("komp-floater-arrow-locator");e||(e=d("komp-floater-arrow-locator"),this.prepend(e)),t.push(oe({element:e})),this.classList.add("komp-floater-arrow"),"number"==typeof this.arrow&&this.style.setProperty("--arrow-size",this.arrow+"px"),this.offset||(this.offset=!0===this.arrow?10:this.arrow)}else t.push(Re[e](!0===this[e]?{}:this[e]))}),this._cleanupCallbacks.push(ke(this.anchor,this,()=>{ze(this.anchor,this,{strategy:this.strategy,placement:this.placement,middleware:t}).then(({x:e,y:t,placement:i,middlewareData:r})=>{if(this.style.left=e+"px",this.style.top=t+"px",this.classList.remove("-top","-left","-bottom","-right"),this.classList.add("-"+i),r.arrow){const{x:e,y:t}=r.arrow;null!=e&&this.style.setProperty("--arrow-left",e+"px"),null!=t&&this.style.setProperty("--arrow-top",t+"px")}})},this.autoUpdate)),this.classList.add("-in"),this.addEventListener("animationend",()=>{this.classList.remove("-in")},{once:!0}),this.removeOnBlur&&(this.manageEventListenerFor(this.getRootNode().body,"focusin",this.checkFocus),this.manageEventListenerFor(this.getRootNode().body,"click",this.checkFocus),this.manageEventListenerFor(this.getRootNode().body,"keyup",this.checkEscape))}checkFocus(e){e.defaultPrevented||e.target==this||e.target==this.anchor||this.contains(e.target)||this.anchor.contains(e.target)||this.hide()}checkEscape(e){27==e.which&&this.hide()}remove(){return new Promise(e=>{this.classList.add("-out");var t=()=>{this.classList.remove("-out"),super.remove().then(e)};"none"!=o(this,"animation-name")?this.addEventListener("animationend",t,{once:!0}):t()})}show(){return this._hideTimeout&&(clearTimeout(this._hideTimeout),delete this._hideTimeout),this._removing?this._removing.then(this.show):("string"==typeof this.container&&(this.container=this.closest(this.container)||this.anchor.closest(this.container)),null==this.container&&(this.container=this.parentElement||this.anchor.parentElement),this.parentElement||(this._showing=!0,this.container.append(this),this._showing=!1,this.trigger("shown")),this)}hide(){if(!this._hideTimeout&&!this._hiding)return this._hideTimeout=setTimeout(async()=>{this.parentElement&&(this._removing=this.remove().then(()=>{this.trigger("hidden"),delete this._hideTimeout,delete this._removing}))},this.timeout),this}toggle(e){return this[(e="boolean"!=typeof e?null!==this.offsetParent:e)?"hide":"show"](),this}static style=`
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
    `}window.customElements.define("komp-floater",Ne);const Re={size:function(y){return{name:"size",options:y=void 0===y?{}:y,async fn(e){var{placement:t,rects:i,platform:r,elements:n}=e;const{apply:o=()=>{},...s}=L(y,e);var a=await ne(e,s),l=E(t),c=x(t),t="y"===k(t),{width:i,height:d}=i.floating;let h,u;"top"===l||"bottom"===l?(h=l,u=c===(await(null==r.isRTL?void 0:r.isRTL(n.floating))?"start":"end")?"left":"right"):(u=l,h="end"===c?"top":"bottom");var p,l=d-a[h],g=i-a[u],m=!e.middlewareData.shift;let f=l,v=g;t?(p=i-a.left-a.right,v=c||m?w(g,p):p):(g=d-a.top-a.bottom,f=c||m?w(l,g):g),m&&!c&&(p=b(a.left,0),l=b(a.right,0),g=b(a.top,0),m=b(a.bottom,0),t?v=i-2*(0!==p||0!==l?p+l:b(a.left,a.right)):f=d-2*(0!==g||0!==m?g+m:b(a.top,a.bottom))),await o({...e,availableWidth:v,availableHeight:f});c=await r.getDimensions(n.floating);return i!==c.width||d!==c.height?{reset:{rects:!0}}:{}}}},shift:function(g){return{name:"shift",options:g=void 0===g?{}:g,async fn(e){var{x:t,y:i,placement:r}=e;const{mainAxis:n=!0,crossAxis:o=!1,limiter:s={fn:e=>{var{x:e,y:t}=e;return{x:e,y:t}}},...a}=L(g,e);var l,c={x:t,y:i},d=await ne(e,a),r=k(E(r)),h=G(r);let u=c[h],p=c[r];n&&(c=u+d["y"===h?"top":"left"],l=u-d["y"===h?"bottom":"right"],u=X(c,u,l)),o&&(c=p+d["y"===r?"top":"left"],l=p-d["y"===r?"bottom":"right"],p=X(c,p,l));d=s.fn({...e,[h]:u,[r]:p});return{...d,data:{x:d.x-t,y:d.y-i}}}}},autoPlacement:function(f){return{name:"autoPlacement",options:f=void 0===f?{}:f,async fn(e){var{rects:t,middlewareData:i,placement:r,platform:n,elements:o}=e;const{crossAxis:s=!1,alignment:a,allowedPlacements:l=U,autoAlignment:c=!0,...d}=L(f,e);var h,u,p=void 0!==a||l===U?(u=c,p=l,((h=a||null)?[...p.filter(e=>x(e)===h),...p.filter(e=>x(e)!==h)]:p.filter(e=>E(e)===e)).filter(e=>!h||x(e)===h||!!u&&z(e)!==e)):l,e=await ne(e,d),g=(null==(g=i.autoPlacement)?void 0:g.index)||0,m=p[g];return null==m?{}:(t=Q(m,t,await(null==n.isRTL?void 0:n.isRTL(o.floating))),r!==m?{reset:{placement:p[0]}}:(n=[e[E(m)],e[t[0]],e[t[1]]],e=[...(null==(o=i.autoPlacement)?void 0:o.overflows)||[],{placement:m,overflows:n}],(t=p[g+1])?{data:{index:g+1,overflows:e},reset:{placement:t}}:(m=(null==(o=(i=e.map(e=>{var t=x(e.placement);return[e.placement,t&&s?e.overflows.slice(0,2).reduce((e,t)=>e+t,0):e.overflows[0],e.overflows]}).sort((e,t)=>e[1]-t[1])).filter(e=>e[2].slice(0,x(e[0])?2:3).every(e=>e<=0))[0])?void 0:o[0])||i[0][0])!==r?{data:{index:g+1,overflows:e},reset:{placement:m}}:{}))}}},flip:function(x){return{name:"flip",options:x=void 0===x?{}:x,async fn(e){const{placement:t,middlewareData:i,rects:r,initialPlacement:n,platform:o,elements:s}=e,{mainAxis:a=!0,crossAxis:l=!0,fallbackPlacements:c,fallbackStrategy:d="bestFit",fallbackAxisSideDirection:h="none",flipAlignment:u=!0,...p}=L(x,e);var g=E(t),m=E(n)===n,f=await(null==o.isRTL?void 0:o.isRTL(s.floating)),m=c||(m||!u?[te(n)]:(v=te(m=n),[z(m),v,z(v)])),v=(c||"none"===h||m.push(...ee(n,u,h,f)),[n,...m]),m=await ne(e,p),e=[],y=(null==(w=i.flip)?void 0:w.overflows)||[];if(a&&e.push(m[g]),l&&(w=Q(t,r,f),e.push(m[w[0]],m[w[1]])),y=[...y,{placement:t,overflows:e}],!e.every(e=>e<=0)){var w,b,f=((null==(g=i.flip)?void 0:g.index)||0)+1,m=v[f];if(m)return{data:{index:f,overflows:y},reset:{placement:m}};let e=null==(w=y.filter(e=>e.overflows[0]<=0).sort((e,t)=>e.overflows[1]-t.overflows[1])[0])?void 0:w.placement;if(!e)switch(d){case"bestFit":{const t=null==(b=y.map(e=>[e.placement,e.overflows.filter(e=>0<e).reduce((e,t)=>e+t,0)]).sort((e,t)=>e[1]-t[1])[0])?void 0:b[0];t&&(e=t);break}case"initialPlacement":e=n}if(t!==e)return{reset:{placement:e}}}return{}}}},inline:function(s){return{name:"inline",options:s=void 0===s?{}:s,async fn(e){const{placement:c,elements:t,rects:i,platform:r,strategy:n}=e,{padding:o=2,x:d,y:h}=L(s,e);e=Array.from(await(null==r.getClientRects?void 0:r.getClientRects(t.reference))||[]);const u=function(e){var t=e.slice().sort((e,t)=>e.y-t.y),i=[];let r=null;for(let e=0;e<t.length;e++){var n=t[e];!r||n.y-r.y>r.height/2?i.push([n]):i[i.length-1].push(n),r=n}return i.map(e=>y(se(e)))}(e),p=y(se(e)),g=ie(o);e=await r.getElementRects({reference:{getBoundingClientRect:function(){if(2===u.length&&u[0].left>u[1].right&&null!=d&&null!=h)return u.find(e=>d>e.left-g.left&&d<e.right+g.right&&h>e.top-g.top&&h<e.bottom+g.bottom)||p;if(2<=u.length){var e,t;if("y"===k(c))return i=u[0],r=u[u.length-1],n="top"===E(c),{top:e=i.top,bottom:o=r.bottom,left:t=(n?i:r).left,right:n=(n?i:r).right,width:n-t,height:o-e,x:t,y:e};const s="left"===E(c),a=b(...u.map(e=>e.right)),l=w(...u.map(e=>e.left));var i=u.filter(e=>s?e.left===l:e.right===a),r=i[0].top,n=i[i.length-1].bottom,o=l;return{top:r,bottom:n,left:o,right:a,width:a-o,height:n-r,x:o,y:r}}return p}},floating:t.floating,strategy:n});return i.reference.x!==e.reference.x||i.reference.y!==e.reference.y||i.reference.width!==e.reference.width||i.reference.height!==e.reference.height?{reset:{rects:e}}:{}}}},arrow:oe,offset:function(r){return{name:"offset",options:r=void 0===r?0:r,async fn(e){var{x:t,y:i}=e,e=await async function(e,t){var{placement:i,platform:r,elements:n}=e,r=await(null==r.isRTL?void 0:r.isRTL(n.floating)),n=E(i),o=x(i),i="y"===k(i),n=["left","top"].includes(n)?-1:1,r=r&&i?-1:1;let{mainAxis:s,crossAxis:a,alignmentAxis:l}="number"==typeof(t=L(t,e))?{mainAxis:t,crossAxis:0,alignmentAxis:null}:{mainAxis:0,crossAxis:0,alignmentAxis:null,...t};return o&&"number"==typeof l&&(a="end"===o?-1*l:l),i?{x:a*r,y:s*n}:{x:s*n,y:a*r}}(e,r);return{x:t+e.x,y:i+e.y,data:e}}}}};class Te extends e{static assignableAttributes={data:[],columns:void 0,defaultColSize:"max-content"};static tagName="komp-data-table";_columns=[];constructor(e,...t){super(e,...t),this.columns?this.initColumns(this.columns):this.constructor.columns&&this.initColumns(this.constructor.columns)}instantiate(...e){e=super.instantiate(...e);return this.render(),e}render(){this.innerHTML="";const r=[],n=d(this.tagName+"-header");this.append(n);let o=0;return this._columns.forEach(i=>{(Array.isArray(i.columns)?i.columns.map(t=>(Object.keys(i).forEach(e=>{null==t[e]&&(t[e]=i[e])}),t)):[i]).forEach(e=>{var t=this.renderHeader.bind(this)(e);t.colIndex=o+1,t.rowIndex="header",t.classList.add("col-"+t.colIndex,"row-header"),a(n,t),r.push(e.width||""+this.defaultColSize),o++})}),this.style.gridTemplateColumns=r.join(" "),this.renderRows(),this}renderRows(){Array.from(this.querySelectorAll(this.tagName+"-row")).forEach(e=>{e.remove()}),this.data.forEach((r,n)=>{const o=this.renderRow(r);this.append(o),this._columns.forEach((e,t)=>{const i=this.renderCell(r,e);e.columns&&(i.classList.add("column-span"),i.style.setProperty("--columns",e.columns.length)),i.render=()=>{s(i,l(e,"render",r,i,e,this))},i.colIndex=t+1,i.rowIndex=n+1,i.classList.add("col-"+i.colIndex,"row-"+i.rowIndex),o.append(i),i.render()})})}removeCell(e){e.remove()}renderRow(){return d(this.tagName+"-row")}renderHeader(e){return d(this.tagName+"-cell",{content:l(e,"header")})}renderCell(e,t,i){return d(this.tagName+"-cell",Object.assign({},t,i))}initColumns(t){return Array.isArray(t)?this._columns=t.map(e=>this.initColumn(e.id,e)):this._columns=Object.keys(t).map(e=>this.initColumn(e,t[e]))}initColumn(e,t){let i={id:e,render:this.defaultRender(e,t),header:this.defaultHeader(e,t)};return n(t)?i.render=t:Array.isArray(t)?i=Object.assign(i,{render:t[0]},q(t,"header","render")):"object"==typeof t?i=Object.assign(i,t):i.render=this.defaultRender(e,t),i}defaultHeader(e){return e}defaultRender(t){return e=>e[t]}static style=function(){return`
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
    `}}window.customElements.define(Te.tagName,Te);class t extends e{static tagName="komp-input";static assignableAttributes={record:null,attribute:null,dump:(e,t)=>e,load:(e,t)=>e};constructor(e={}){Object.assign({},e);var t={button:Ie.prototype,checkbox:Ae.prototype,radio:Ae.prototype,select:$e.prototype,date:Ce.prototype,textarea:He.prototype,"datetime-local":Se.prototype}[e.type];super(q(e,...O)),"function"!=typeof this.dump&&(this.dump=e=>e),"function"!=typeof this.load&&(this.load=e=>e),t&&(this.__proto__=t),this.input=this.createInput(e),this._load(),this.append(this.input),this.setupInputListener(this.inputChange.bind(this)),this.setupRecordListener(this.recordChange.bind(this))}get value(){this.input.value}set value(e){this.input.value=e}createInput(e){return d("input",Object.assign({type:"text"},e))}setupInputListener(e){this.input.addEventListener("change",e)}setupRecordListener(e){this.record.addEventListener&&this.record.addEventListener("change",e),this.record.addListener&&this.record.addListener(e)}inputChange(){var e=this.load(this._loadValue()),t=this._dump();this.trigger("change",t,e)}recordChange(){this._load()}_load(e,t){t=this.load(t||this._loadValue());null!=t&&(this.input.value=t)}_loadValue(){return function e(t,i,r){var n=(i=Array.isArray(i)?i:[i])[0];return i=i.slice(1),t.hasOwnProperty(n)?0<i.length?e(t[n],i,r):t[n]:r}(this.record,this.attribute)}_dump(e,t){t=this.dump(t||this.input.value,this.record);return this._dumpValue(t)}_dumpValue(e){let t=Array.isArray(this.attribute)?this.attribute:[this.attribute];return t=t.concat([e]),function e(t,...i){var r;return 2==i.length?t[i[0]]=i[1]:(t[r=i.shift()]instanceof Object||(t[r]={}),Array.isArray(t[r])?t[r]=e(Array.from(t[r]),...i):t[r]=e(Object.assign({},t[r]),...i)),t}(this.record,...t),e}static style=`
        komp-input {
            display: contents;
        }
    `}window.customElements.define(t.tagName,t);class Ae extends t{_load(){var e=this.load(this._loadValue()),t="on"==this.input.value||this.input.value;this.input.multiple?this.input.checked=!!Array.isArray(e)&&e.includes(t):this.input.checked=e==t}_dump(){let e,t="on"==this.input.value||this.input.value;var i;return e=this.input.multiple?(i=this._loadValue()||[],this.input.checked?i.includes(t)?this.dump(i):this.dump(i.concat(t)):this.dump(i.filter(e=>e!=t))):"boolean"==typeof t?this.dump(this.input.checked?t:!t):this.dump(this.input.checked?this.input.value:null),this._dumpValue(e)}}class Ce extends t{setupInputListener(){this.input.addEventListener("blur",this._dump.bind(this))}_load(e){let t=this._loadValue();t instanceof Date&&(t=[t.getUTCFullYear(),(t.getMonth()+1).toString().padStart(2,"0"),t.getDate().toString().padStart(2,"0")].join("-")),super._load(e,t)}_dump(e){let t=this.input.value;""==t&&(t=null),super._dump(e,t)}}class Se extends t{_load(e){let t=this._loadValue();t instanceof Date&&(t=[[t.getUTCFullYear(),(t.getMonth()+1).toString().padStart(2,"0"),t.getDate().toString().padStart(2,"0")].join("-"),"T",[t.getHours().toString().padStart(2,"0"),t.getMinutes().toString().padStart(2,"0")].join(":")].join("")),super._load(e,t)}}class He extends t{createInput(e){return d("textarea",e)}}class Ie extends t{createInput(e){return d("button",e)}setupInputListener(){this.input.addEventListener("click",this._dump.bind(this))}_load(){}}class $e extends t{createInput(e){const t=d("select",e);return e.includeBlank&&t.append(d("option",Object.assign({content:"Unset",value:null},e.includeBlank))),e.options.forEach(e=>{t.append(d("option",{content:Array.isArray(e)?e[1]:e,value:Array.isArray(e)?e[0]:e}))}),t}_load(e){if(this.input.multiple){const t=this.load(this._loadValue());this.input.querySelectorAll("option").forEach(e=>{t.includes(e.value)?e.setAttribute("selected",!0):e.removeAttribute("selected")})}else super._load()}_dump(e){var t;if(this.input.multiple)return t=Array.from(this.input.options).filter(e=>e.selected).map(e=>e.value),this._dumpValue(this.dump(t)),t;{let e=this.input.value;return"null"==e&&(e=null),e=this.dump(e),this._dumpValue(e),e}}}class _e extends Ne{static watch=["anchor"];static assignableAttributes={autoPlacement:!1,flip:!0,shift:!0,strategy:"absolute",placement:"top",arrow:!0,timeout:300};_showing=!1;constructor(e,...t){super(e,...t),this.anchor&&this.anchorChanged(this.anchor,this.anchor),void 0===e&&(this.needsFirstRemoval=!0)}connected(){if(super.connected(),this.getRootNode()==this.anchor.getRootNode()&&0==this._showing)return F(this),!1}anchorChanged(e,t){e&&e instanceof Element&&(e.removeEventListener("mouseenter",this.show.bind(this)),e.removeEventListener("mouseleave",this.hide.bind(this))),t&&t instanceof Element&&(t.addEventListener("mouseenter",this.show.bind(this)),t.addEventListener("mouseleave",this.hide.bind(this)))}}window.customElements.define("komp-tooltip",_e);class De extends _e{static assignableAttributes={mouseevent:"click",placement:"bottom",arrow:!1,removeOnBlur:!0,timeout:0};connected(...e){return this.addEventListener("mouseenter",this.clearHide.bind(this)),"mouseenter"==this.mouseevent&&this.addEventListener("mouseleave",this.hide.bind(this)),super.connected(...e)}show(){super.show(),this.anchor.classList.add("-active")}hide(){super.hide(),this.anchor.classList.remove("-active")}anchorChanged(e,t){"mouseenter"==this.mouseevent?super.anchorChanged(e,t):(e&&e instanceof HTMLElement&&e.removeEventListener(this.mouseevent,this.toggle.bind(this)),t&&t instanceof HTMLElement&&t.addEventListener(this.mouseevent,this.toggle.bind(this)))}clearHide(){this._hideTimeout&&(clearTimeout(this._hideTimeout),delete this._hideTimeout)}}window.customElements.define("komp-dropdown",De);class Oe extends e{static assignableAttributes={timeout:5e3,animation:!0};constructor(...e){super(...e),this.setAttribute("popover","manual")}connected(){this.showPopover()}add(e,t){this.hidePopover(),this.showPopover();e=new Me(e,Object.assign({timeout:this.timeout,dismissable:this.dismissable},t));return a(this,e),e}static style=`
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
    `}window.customElements.define("komp-notification-center",Oe);class Me extends e{static assignableAttributes=Oe.assignableAttributes;constructor(e,t){super(t),s(this,d({class:"komp-notification-body",content:e})),a(this,i({type:"button",class:"dismiss-button",content:`
                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
                <circle cx="12.5" cy="12.5" r="11" stroke-dasharray="0% 300%" />
                <line x1="16" y1="8" x2="8" y2="16"></line><line x1="8" y1="8" x2="16" y2="16"></line>
                </svg>`},e=>{this.remove()}))}connected(){this.addEventListener("mouseenter",this.clearTimeout),this.addEventListener("mouseleave",this.restartTimeout),this.timer=this.querySelector(".dismiss-button circle").animate([{strokeDasharray:"300% 300%"},{strokeDasharray:"0% 300%"}],{duration:this.timeout,iterations:1}),this.timer.finished.then(()=>this.remove()),this.animation&&this.animate([{opacity:0,easing:"ease-out",marginBottom:-1*this.offsetHeight+"px"},{opaicty:1,marginBottom:"0px"}],Object.assign({duration:150,iterations:1},this.animation))}remove(...e){if(this.animation)return this.animate([{opaicty:1,marginBottom:"0px",easing:"ease-in"},{opacity:0,marginBottom:-1*this.offsetHeight+"px"}],Object.assign({duration:150,iterations:1},this.animation)).finished.then(()=>{super.remove.call(this,...e)});super.remove.call(this,...e)}clearTimeout(){this.timer.pause(),this.timer.currentTime=0}restartTimeout(){this.timer.play()}}window.customElements.define("komp-notification",Me);class je extends e{static tagName="komp-dropzone";static assignableAttributes={enabled:!0,onFileDrop:null,overlay:{content:"Drag Here"}};static bindMethods=["windowDragEnter","windowDragLeave","windowDrop","drop","dragOver","dragEnter","dragLeave"];constructor(...e){super(...e),"object"!=typeof this.overlay||this.overlay instanceof HTMLElement||(this.overlay=d("komp-dropzone-overlay",Object.assign({},this.constructor.assignableAttributes.overlay,this.overlay)))}addEventListeners(){this.getRootNode()&&(this.getRootNode().addEventListener("dragenter",this.windowDragEnter),this.getRootNode().addEventListener("dragleave",this.windowDragLeave),this.getRootNode().addEventListener("drop",this.windowDrop)),this.addEventListener("drop",this.drop),this.addEventListener("dragover",this.dragOver),this.addEventListener("dragenter",this.dragEnter),this.addEventListener("dragleave",this.dragLeave)}removeEventListeners(){this.getRootNode()&&(this.getRootNode().removeEventListener("dragenter",this.windowDragEnter),this.getRootNode().removeEventListener("dragleave",this.windowDragLeave),this.getRootNode().removeEventListener("drop",this.windowDrop)),this.removeEventListener("drop",this.drop),this.removeEventListener("dragover",this.dragOver),this.removeEventListener("dragenter",this.dragEnter),this.removeEventListener("dragleave",this.dragLeave)}connected(){"static"==o(this,"position")&&(this.style.position="relative"),this.enabled&&this.addEventListeners()}disconnected(){this.enabled&&this.removeEventListeners()}enable(){this.enabled||(this.enabled=!0,this.addEventListeners())}disable(){0!=this.enabled&&(this.enabled=!1,this.removeEventListeners())}drop(e){e.target!=this&&!this.contains(e.target)||(e.preventDefault(),[...e.dataTransfer.files].forEach(e=>{this.onFileDrop&&this.onFileDrop(e),this.trigger("filedrop",e)}))}dragEnter(e){e.preventDefault(),this.overlay.classList.add("active")}dragLeave(e){e.preventDefault(),this.contains(e.relatedTarget)||this.overlay.classList.remove("active")}dragOver(e){e.preventDefault()}windowDragEnter(e){e.preventDefault(),e.relatedTarget&&e.relatedTarget.getRootNode()==this.getRootNode()||(this.overlay.classList.remove("active"),this.append(this.overlay))}windowDragLeave(e){e.preventDefault(),e.relatedTarget&&e.relatedTarget.getRootNode()==this.getRootNode()||this.overlay.remove()}windowDrop(e){e.preventDefault(),this.overlay.remove()}static style=`
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
    `}window.customElements.define(je.tagName,je);class D extends e{static tagName="komp-content-area";static assignableAttributes=["onchange"];static assignableMethods=["load"];constructor(e={}){var t=(e=Object.assign({tabIndex:0,contenteditable:!0},e)).content;delete e.content,super(e),s(this,this.load(t||e.value));let i=this.dump(this.innerText);this.addEventListener("focusout",e=>{var t=this.dump(this.innerText);i!=t&&(this.onchange&&this.onchange(t,i),this.trigger("change",t,i))})}dump(e){return e.trimEnd().replaceAll("<br>","\n")}load(e){return e="string"==typeof e?e.replaceAll("\n","<br>"):e}static style=`
        komp-content-area {
            appearance: textfield;
            background-color: white;
            border-width: 1px;
            padding: 0.22em;
            display: inline-block;
            min-width: 4ch;
        }
    `}function Pe(e={}){return e.horizontal?`
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
    `}window.customElements.define(D.tagName,D);class Fe extends Te{static tagName="komp-spreadsheet";static assignableAttributes={reorder:["col","row"],resize:["col","row"]};constructor(...e){super(...e),!0===this.reorder?this.reorder=["col","row"]:!1===this.reorder?this.reorder=new Array:"string"==typeof this.reorder&&(this.reorder=[this.reorder]),!0===this.resize?this.resize=["col","row"]:!1===this.resize?this.resize=[]:"string"==typeof this.resize&&(this.resize=[this.resize]),this.cellTag=this.constructor.tagName+"-cell",this.rowTag=this.constructor.tagName+"-row",this.menuTag=this.constructor.tagName+"-menu",this.inputTag=this.constructor.tagName+"-input",this.reorderHandleTag=this.constructor.tagName+"-reorder-handle",this.resizeHandleTag=this.constructor.tagName+"-resize-handle",this.dragBoxTag=this.constructor.tagName+"-drag-box",this.addEventListenerFor(this.cellTag,"mousedown",e=>{2==e.button?e.delegateTarget.classList.contains("selected")?e.preventDefault():this.deselectCells():(e.metaKey||e.shiftKey||this.deselectCells(),this.initializeCellSelection(e.delegateTarget,e))}),this.addEventListenerFor(this.cellTag,"mouseover",e=>{this.showReorderHandleFor(e.delegateTarget),this.showResizeHandleFor(e.delegateTarget)}),this.addEventListenerFor(this.cellTag,"keydown",e=>{e.delegateTarget.classList.contains("input")?("Escape"==e.key&&(e.delegateTarget.remove(),e.delegateTarget.originalCell.focus()),this.deselectCells({copySelection:!0})):["ArrowRight","ArrowLeft","ArrowDown","ArrowUp"].includes(e.key)?(e.preventDefault(),this.changeFocusByDirection(e.key,e.delegateTarget,e)):e.altKey||e.ctrlKey||e.metaKey||!e.key.match(/^[a-z0-0\-\_\$]$/i)?"Enter"==e.key&&e.delegateTarget==this.getRootNode().activeElement&&(e.preventDefault(),this.activateCellInput(e.delegateTarget,e)):this.activateCellInput(e.delegateTarget,e)}),this.addEventListenerFor(this.cellTag,"dblclick",e=>{this.activateCellInput(e.delegateTarget,e)}),this.addEventListener("mouseleave",e=>{this.querySelectorAll(this.tagName+"-handle").forEach(e=>e.remove())}),this.addEventListener("contextmenu",e=>{e.preventDefault();e=p(e.target,this.cellTag);e&&this.renderContextMenu(e)}),this.observer=new ResizeObserver(e=>{for(const t of e)t.target.classList.contains("frozen-col")&&(this.style.scrollPaddingLeft=t.target.offsetWidth+"px")}),this.querySelectorAll(this.cellTag).forEach(e=>{this.observer.observe(e)})}connected(){this.getRootNode()&&(this.manageEventListenerFor(this.getRootNode(),"paste",e=>{this.contains(document.activeElement)&&(e.preventDefault(),this.pasteCells(e.clipboardData.getData("text/plain")))}),this.manageEventListenerFor(this.getRootNode(),"copy",e=>{this.contains(document.activeElement)&&(e.preventDefault(),this.copyCells(document.activeElement))}))}remove(...e){this.observer.disconnect(),delete this.observer,super.remove(...e)}initColumn(i,e,...t){t=super.initColumn(i,e,...t);return t.input=e.input||this.defaultInput(i,e),t.copy=e=>e[i],t.paste=(e,t)=>e[i]=t,t}defaultRender(i){return e=>{let t=e[i];return t="string"==typeof t?t.replaceAll("\n","<br>"):t}}defaultHeader(i,e){let t=e.header;return"object"!=typeof t&&(t={content:t||i}),Object.assign({content:i,class:this.tagName.toLowerCase()+"-input",input:(t,e)=>new D({value:t.header.content,style:{padding:o(e,"padding")},onchange:e=>{t.header.content=e,this.trigger("headerChange",i,e)}})},t)}renderHeader(e){const t=d(this.tagName+"-cell",e.header);return t.classList.add("header","frozen-row",!0===e.frozen?"frozen-col":null),t.tabIndex=0,t.columnModel=e,t.render=()=>{s(t,l(e.header,"content",e))},t}defaultInput(n){return(t,e,i)=>{let r=t[n];return"keydown"==i.type&&"Enter"!=i.key&&(r=""),new D({value:r,class:this.tagName.toLowerCase()+"-input",style:{padding:o(e,"padding")},onchange:e=>t[n]=e})}}renderCell(e,t,...i){i=super.renderCell(e,t,...i);return i.record=e,i.tabIndex=0,i.columnModel=t,i.classList.toggle("frozen-col",!0===t.frozen),this.observer&&this.observer.observe(i),i}removeCell(...e){return this.observe.unobserve(el),super.removeCell(...e)}changeFocusByDirection(r,n,o){if(n=n||this.querySelector(`${this.cellTag}:focus, ${this.cellTag}:focus-within`)){let i,e=n.rowIndex;switch("header"==e&&(e=0),r){case"ArrowDown":i=this.querySelector(`.row-${e+1}.col-`+n.colIndex);break;case"ArrowUp":i=this.querySelector(`.row-${e-1}.col-`+n.colIndex);break;case"ArrowLeft":i=this.querySelector(`.row-${e}.col-`+(n.colIndex-1));break;case"ArrowRight":i=this.querySelector(`.row-${e}.col-`+(n.colIndex+1))}if(i){i.focus();var s=this.getBoundingClientRect(),r=this.querySelector(this.cellTag+".frozen-row"),a=this.querySelector(this.cellTag+".frozen-col");r&&(s.y=s.top+r.offsetHeight,s.height=s.height-r.offsetHeight),a&&(s.x=s.left+a.offsetWidth,s.width=s.width-a.offsetWidth);let t=i.getBoundingClientRect();if(this.classList.add("unfreeze"),t.top<s.top&&this.scrollBy({left:0,top:t.top-s.top,behavior:"instant"}),t.bottom>s.bottom){let e=t.bottom-s.bottom;for(;t.bottom>s.bottom&&e<this.offsetHeight;)this.scrollBy({left:0,top:e,behavior:"instant"}),e+=5,t=i.getBoundingClientRect()}if(t.left<s.left&&this.scrollBy({left:t.left-s.left,top:0,behavior:"instant"}),t.right>s.right){let e=t.right-s.right;for(;t.right>s.right&&e<this.offsetWidth;)this.scrollBy({left:e,top:0,behavior:"instant"}),e+=5,t=i.getBoundingClientRect()}if(this.classList.remove("unfreeze"),o&&o.shiftKey){let e=this.querySelector(".selection-start");e||(n.classList.add("selection-start"),e=n),this.deselectCells({selectionStart:!1}),this.selectCells(e,i)}else this.deselectCells({selectionStart:!0})}}}activateCellInput(t,e){this.deselectCells({copySelection:!0});let i;if(i=t.classList.contains("header")?l(t.columnModel.header,"input",t.columnModel,t,e):l(t.columnModel,"input",t.record,t,e)){e=t.classList.contains("header")?"":" body";const n=d(this.cellTag,{class:"input",content:{tag:this.tagName+"-inputfield",content:i},style:{gridArea:[t.rowIndex+e,t.colIndex+" body",t.rowIndex+e,t.colIndex+" body"].join(" / ")}});n.classList.toggle("frozen-row",t.classList.contains("frozen-row")),n.classList.toggle("frozen-col",t.classList.contains("frozen-col")),u(t,n),n.originalCell=t;e=n.querySelector("input, textarea, button, [contenteditable]");e&&((e=e).focus(),(r=document.createRange()).selectNodeContents(e),r.collapse(!1),(e=window.getSelection()).removeAllRanges(),e.addRange(r)),t.tabIndex=-1,n.beforeRemove=()=>{t.tabIndex=0,t.render()},n.addEventListener("focusout",e=>{n.beforeRemove(),n.remove()}),n.addEventListener("keydown",e=>{"Enter"==e.key&&[e.metaKey,e.ctrlKey,e.altKey,e.shiftKey].every(e=>0==e)&&this.changeFocusByDirection("ArrowDown",t,e)})}var r}renderContextMenu(t){if(this.contextMenu&&this.contextMenu.anchor==t)return this.contextMenu.show();this.contextMenu&&this.contextMenu.hide();var e=null!=window.navigator.clipboard.readText||this.copyData;return this.contextMenu=new Ne({anchor:t,placement:"right-end",shift:!0,flip:!0,autoPlacement:!1,removeOnBlur:!0,class:this.constructor.tagName+"-menu",content:[i("button",{content:"Copy"},e=>{this.copyCells(t),this.contextMenu.hide()}),i("button",{content:"Paste",disabled:!e},async e=>{null==window.navigator.clipboard.readText?this.pasteCells(this.copyData):this.pasteCells(await window.navigator.clipboard.readText()),this.contextMenu.hide()})]}),this.append(this.contextMenu),this.contextMenu}initializeAxisResize(e){const n=e.target.parentElement.classList.contains("row")?"row":"col";var t="row"==n?this.rowResizeHandle:this.colResizeHandle;const i="row"==n?"rowIndex":"colIndex";var r=t[i]-(e.target.classList.contains("start")?1:0);const o=e["row"==n?"y":"x"]-this.querySelector(`${this.cellTag}.${n}-`+r)["row"==n?"offsetHeight":"offsetWidth"],s=function(e,t){if(!Array.isArray(e))return e;const i=[];return t=t||((e,t)=>!t.includes(e)),e.forEach(e=>{t(e,i)&&i.push(e)}),i}(Array.from(this.querySelectorAll(this.cellTag+".header.selected")).map(e=>e[i])).concat(r),a=(t.offsetWidth,this["col"==n?"scrollLeft":"scrollTop"]-this["col"==n?"offsetLeft":"offsetTop"]);this.classList.add("resizing"),this.dragIndicator=d(this.constructor.tagName+"-drag-indicator",{class:n,style:{["col"==n?"gridRow":"gridColumn"]:"handles / -1"}}),this.append(this.dragIndicator);let l=e=>{this.dragIndicator.style.insetInlineStart=e["col"==n?"x":"y"]+a+"px"},c=(l=l.bind(this),e=>{let t=e["row"==n?"y":"x"]-o,i=(t<0&&(t=0),this.style["gridTemplate"+("row"==n?"Rows":"Columns")].split(" [body] "));s.forEach(e=>{i[e]=t+"px"}),this.style["gridTemplate"+("row"==n?"Rows":"Columns")]=i.join(" [body] ");const r="row"==n?this.data:this._columns;this.trigger(s.map(e=>r[e].id),n+"Resize",t),this.dragIndicator.remove(),delete this.dragIndicator,this.classList.remove("resizing"),this.removeEventListener("mousemove",l),this.removeEventListener("mouseup",c)});c=c.bind(this),this.addEventListener("mousemove",l),this.addEventListener("mouseup",c)}showResizeHandleFor(e){!this.colResizeHandle&&this.resize.includes("col")&&(this.colResizeHandle=d(this.resizeHandleTag,{class:"col",content:[{class:"start"},{class:"end"}]}),this.manageEventListenerFor(this.colResizeHandle,"mousedown",this.initializeAxisResize.bind(this)),this.append(this.colResizeHandle)),!this.rowResizeHandle&&this.resize.includes("row")&&(this.rowResizeHandle=d(this.resizeHandleTag,{class:"row",content:[{class:"start"},{class:"end"}]}),this.manageEventListenerFor(this.rowResizeHandle,"mousedown",this.initializeAxisResize.bind(this)),this.append(this.rowResizeHandle)),this.classList.contains("resizing")||(this.colResizeHandle&&(this.colResizeHandle.rowIndex=1,this.colResizeHandle.colIndex=e.colIndex,this.colResizeHandle.style.gridArea=["header","body "+e.colIndex,"header","body "+e.colIndex].join(" / "),this.colResizeHandle.classList.toggle("hide-start",e.classList.contains("col-1")),this.colResizeHandle.classList.toggle("hide-end",e.classList.contains("col-"+e.parentElement.children.length)),this.colResizeHandle.classList.toggle("frozen-row",e.classList.contains("frozen-row")),e.classList.contains("row-header")?this.append(this.colResizeHandle):this.colResizeHandle.remove()),this.rowResizeHandle&&(this.rowResizeHandle.rowIndex=e.rowIndex,this.rowResizeHandle.colIndex=1,this.rowResizeHandle.style.gridArea=["body "+e.rowIndex,"body","body "+e.rowIndex,"body"].join(" / "),this.rowResizeHandle.classList.toggle("frozen-col",e.classList.contains("frozen-col")),e.classList.contains("col-1")?this.append(this.rowResizeHandle):this.rowResizeHandle.remove()))}initializeAxisReorder(e){const l=e.currentTarget.classList.contains("row")?"row":"col",r="row"==l?this.rowReorderHandle:this.colReorderHandle;let c,i=(e.dataTransfer.setDragImage(d(),0,0),this.deselectCells({copySelection:!0}),"col"==l?(this.dragStartIndex=r.colIndex,r.style.width=r.offsetWidth+"px",r.style.left=e.x-r.offsetWidth/2+this.scrollLeft-this.offsetLeft+"px",this.querySelectorAll(this.cellTag+".col-"+r.colIndex).forEach(e=>e.classList.add("selecting"))):(this.dragStartIndex=r.rowIndex,r.style.height=r.offsetHeight+"px",r.style.top=e.y-r.offsetHeight/2+this.scrollTop-this.offsetTop+"px",this.querySelectorAll(this.cellTag+".row-"+r.rowIndex).forEach(e=>e.classList.add("selecting"))),r.style.gridArea=null,this.classList.add("reordering"),this.dragIndicator=d(this.constructor.tagName+"-drag-indicator",{class:l,style:{["col"==l?"gridRow":"gridColumn"]:"handles / -1"}}),this.append(this.dragIndicator),e=>{e.preventDefault();var t,i=p(e.target,this.cellTag+", "+this.reorderHandleTag);c=i,"col"==l?(t=(t=(t=e.x-r.offsetWidth/2+this.scrollLeft-this.offsetLeft)<0?0:t)>this.scrollWidth-r.offsetWidth?this.scrollWidth-r.offsetWidth:t,r.style.left=t+"px",i&&(this.dragIndicator.style.gridColumn=`body ${i.colIndex} / body `+i.colIndex,this.dragIndicator.classList.toggle("end",i.colIndex>this.dragStartIndex))):(t=(t=(t=e.y-r.offsetHeight/2+this.scrollLeft-this.offsetTop)<0?0:t)>this.scrollHeight-r.offsetHeight?this.scrollHeight-r.offsetHeight:t,r.style.top=t+"px",i&&(this.dragIndicator.style.gridRow=`body ${i.rowIndex} / body `+i.rowIndex,this.dragIndicator.classList.toggle("end",i.rowIndex>this.dragStartIndex)))}),n=(i=i.bind(this),e=>{e=p(e.target,this.cellTag+", "+this.reorderHandleTag)||c;if(c=e){const r="col"==l?"colIndex":"rowIndex",n="col"==l?"gridColumn":"gridRow",o=e[r],s=this.dragStartIndex,a=o>s?-1:1;this.querySelectorAll(this.cellTag).forEach(e=>{var t,i;e.classList.remove(l+"-"+e[r]),e[r]==s?(t=(e[r]=o)+Math.max(a,0),i=-1==a?u:h,"col"==l?i(e.parentElement.querySelector(this.cellTag+".col-"+t),e):i(this.querySelector(this.cellTag+`.row-${t}.col-`+e.colIndex).parentElement,e.parentElement)):(e[r]==o||Math.min(s,o)<e[r]&&e[r]<Math.max(s,o))&&(e[r]+=a),e.classList.contains("header")&&"row"==l||(e.style[n+"Start"]="body "+e[r],e.style[n+"End"]="body "+e[r]),e.classList.add(l+"-"+e[r])});var e=this.style["gridTemplate"+("row"==l?"Rows":"Columns")].split(" [body] "),t=e[s];e.splice(s,1),e.splice(o,0,t),this.style["gridTemplate"+("row"==l?"Rows":"Columns")]=e.join(" [body] "),this.trigger(l+"Reorder",o,s)}this.querySelectorAll(this.cellTag+".selecting").forEach(e=>{e.classList.remove("selecting"),e.classList.add("selected")})}),o=(n=n.bind(this),e=>{var t=c||this.querySelector(`${this.cellTag}.selecting, ${this.cellTag}.selected`);this.dragIndicator.remove(),delete this.dragIndicator,this.classList.remove("reordering"),r.style.left="",r.style.width="",r.style.top="",r.style.height="",this.showReorderHandleFor(t),this.querySelectorAll(this.cellTag+".selecting").forEach(e=>{e.classList.remove("selecting")}),this.removeEventListener("dragover",i),this.removeEventListener("drop",n),this.removeEventListener("dragend",o)});o=o.bind(this),this.addEventListener("dragover",i),this.addEventListener("drop",n),this.addEventListener("dragend",o)}showReorderHandleFor(e){!this.colReorderHandle&&this.reorder.includes("col")&&(this.colReorderHandle=d(this.reorderHandleTag,{class:"col",draggable:!0,content:{content:Pe()}}),this.manageEventListenerFor(this.colReorderHandle,"dragstart",this.initializeAxisReorder.bind(this))),!this.rowReorderHandle&&this.reorder.includes("row")&&(this.rowReorderHandle=d(this.reorderHandleTag,{class:"row",draggable:!0,content:{content:Pe({horizontal:!0})}}),this.manageEventListenerFor(this.rowReorderHandle,"dragstart",this.initializeAxisReorder.bind(this))),this.classList.contains("reordering")||(this.colReorderHandle&&(this.colReorderHandle.rowIndex=1,this.colReorderHandle.colIndex=e.colIndex,this.colReorderHandle.style.gridArea=["handles","body "+e.colIndex,"handles","body "+e.colIndex].join(" / "),e.classList.contains("frozen-col")?this.colReorderHandle.remove():this.append(this.colReorderHandle)),this.rowReorderHandle&&(this.rowReorderHandle.rowIndex=e.rowIndex,this.rowReorderHandle.colIndex=1,this.rowReorderHandle.style.gridArea=["body "+e.rowIndex,"handles","body "+e.rowIndex,"handles"].join(" / "),e.classList.contains("frozen-row")?this.rowReorderHandle.remove():this.append(this.rowReorderHandle)))}initializeCellSelection(o,e){if(this.getRootNode()){e.shiftKey&&(this.deselectCells(),o=this.querySelector(this.cellTag+":focus"),e.preventDefault());const r=e=>{e=p(e.target,this.cellTag);if(e){this.querySelectorAll(this.cellTag+".selecting").forEach(e=>e.classList.remove("selecting"));var i=[o.colIndex,e.colIndex];if(o.classList.contains("header"))for(let e=Math.min(...i);e<=Math.max(...i);e++)this.querySelectorAll(".col-"+e).forEach(e=>e.classList.add("selecting"));else{var r=[o.rowIndex,e.rowIndex];for(let t=Math.min(...r);t<=Math.max(...r);t++)for(let e=Math.min(...i);e<=Math.max(...i);e++){var n=this.querySelector(`.row-${t}.col-`+e);n&&n.classList.add("selecting")}}}};e.shiftKey&&r(e),o.classList.contains("header")&&r(e);this.getRootNode().addEventListener("mouseup",e=>{var t,i=p(e.target,this.cellTag);o.classList.contains("header")||i&&i!=o?((t=this.querySelectorAll(this.cellTag+".selecting")).forEach(e=>e.classList.remove("selecting")),this.selectCells(...Array.from(t))):e?.metaKey?i.classList.add("selected"):this.deselectCells(),this.removeEventListener("mouseover",r),o.focus()},{once:!0}),this.addEventListener("mouseover",r)}}selectCells(...e){let i=e[e.length-1]instanceof HTMLElement?{}:e.pop();i=Object.assign({outline:!0,class:"selected"},i);var t=e=>Math.min(...e.filter(e=>"number"==typeof e)),r=e=>Math.max(...e.filter(e=>"number"==typeof e)),n=(i,e)=>[...Array(e-i+1).fill().map((e,t)=>t+i)];const o=[];let s=e.map(e=>e.rowIndex),a=(s=s.filter(e=>"header"==e).concat(n(t(s),r(s))),e.map(e=>e.colIndex));return a=a.filter(e=>"header"==e).concat(n(t(a),r(a))),i.class&&s.forEach(t=>{a.forEach(e=>{e=this.querySelector(`.row-${t}.col-`+e);e&&(e.classList.add(i.class),o.push(e))})}),i.outline&&((n=d("string"==typeof i.outline?i.outline:this.tagName+"-selection",{style:{gridArea:[s[0],a[0],s[s.length-1]+1,a[a.length-1]+1].map(e=>"header"==e?e:"body "+e).join(" / ")}})).classList.toggle("includes-frozen-row",e.some(e=>e.classList.contains("frozen-row"))),n.classList.toggle("includes-frozen-col",e.some(e=>e.classList.contains("frozen-col"))),this.append(n)),o}deselectCells(e={}){(e=Object.assign({selected:!0,selection:!0,inputfield:!0,selectionStart:!0,copySelection:!1},e)).selected&&this.querySelectorAll(this.cellTag+".selected").forEach(e=>e.classList.remove("selected")),e.selection&&this.querySelectorAll(this.tagName+"-selection").forEach(e=>e.remove()),e.inputfield&&this.querySelectorAll(this.cellTag+"-inputfield").forEach(e=>{e.beforeRemove(),e.remove()}),e.selectionStart&&this.querySelectorAll(this.cellTag+".selection-start").forEach(e=>e.classList.remove("selection-start")),e.copySelection&&this.querySelectorAll(this.tagName+"-copy-selection").forEach(e=>e.remove())}selectedCells(){let e=this.querySelectorAll(`${this.cellTag}.selected, ${this.cellTag}:focus, ${this.cellTag}:focus-within`);if(0==e.length){if(!this.contextMenu)return[];e=[this.contextMenu.anchor]}const t=function(e,i){const r={};return e.forEach(e=>{let t;t=n(i)?r[i(e)]:l(e,i),r[t]=r[t]||[],r[t].push(e)}),r}(e,"rowIndex");return Object.keys(t).map(e=>t[e])}copyCells(e){var t=this.selectedCells(),i=this.selectedCells().map(e=>e.map(e=>e.columnModel.copy(e.record)).join("\t")).join("\n");window.navigator.clipboard.writeText(i),this.copyData=i,this.deselectCells({copySelection:!0}),this.selectCells(...t.flat(),{outline:this.tagName+"-copy-selection"})}pasteCells(e){if(null!=e){var t=this.selectedCells();const n=e.split("\n").map(e=>e.split("\t"));if(1==t.length&&1==t[0].length){const o=t[0][0];let r=o.rowIndex;const s=[];n.forEach(e=>{let i=o.colIndex;e.forEach(e=>{var t=this.querySelector(this.cellTag+(`.col-${i}.row-`+r));t&&(this.pasteCell(t,e),s.push(t)),i++}),r++}),this.selectCells(...s),o.focus()}else{let i=0;t.forEach(e=>{i=i==n.length?0:i;let t=0;e.forEach(e=>{t=t==n[i].length?0:t,this.pasteCell(e,n[i][t]),t++}),i++})}this.querySelectorAll(this.tagName+"-copy-selection").forEach(e=>e.remove())}}pasteCell(e,t){e.columnModel.paste(e.record,t),e.render()}static style=function(){return`
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
        
    `};addEventListenerFor(...e){return r(this,...e)}}window.customElements.define(Fe.tagName,Fe);var qe=Object.freeze({__proto__:null,AutoGrid:B,ContentArea:D,DataTable:Te,Dropdown:De,Dropzone:je,Element:e,Floater:Ne,Input:t,Modal:W,NotificationCenter:Oe,Spreadsheet:Fe,Tooltip:_e});Object.keys(qe).forEach(e=>{window[e]=qe[e]}),document.addEventListener("DOMContentLoaded",function(){r(document,".js-toggle-source","click",e=>{document.querySelector(e.delegateTarget.getAttribute("rel")).classList.toggle("hide")})})}();