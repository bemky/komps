!function(){"use strict";function _(t,i,e,r,n={}){(e=Array.isArray(e)?e:[e]).forEach(e=>{t.addEventListener(e,e=>{e.target.matches(i)?(e.delegateTarget=e.target,r(e)):e.target.closest(i)&&(e.delegateTarget=e.target.closest(i),r(e))},n)})}const M=["accept","accept-charset","accesskey","action","align","allow","alt","async","autocapitalize","autocomplete","autofocus","autoplay","background","bgcolor","border","buffered","capture","challenge","charset","checked","cite","class","code","codebase","color","cols","colspan","content","contenteditable","contextmenu","controls","coords","crossorigin","csp","data","data-*","datetime","decoding","default","defer","dir","dirname","disabled","download","draggable","dropzone","enctype","enterkeyhint","for","form","formaction","formenctype","formmethod","formnovalidate","formtarget","headers","height","hidden","high","href","hreflang","http-equiv","icon","id","importance","integrity","intrinsicsize","inputmode","ismap","itemprop","keytype","kind","label","lang","language","loading","list","loop","low","manifest","max","maxlength","minlength","media","method","min","multiple","muted","name","novalidate","open","optimum","pattern","ping","placeholder","popover","popovertarget","popovertargetaction","poster","preload","radiogroup","readonly","referrerpolicy","rel","required","reversed","rows","rowspan","sandbox","scope","scoped","selected","shape","size","sizes","slot","span","spellcheck","src","srcdoc","srclang","srcset","start","step","style","summary","tabindex","target","title","translate","type","usemap","value","width","wrap","aria","aria-*","xmlns"],H=["disabled","readOnly","multiple","checked","autobuffer","autoplay","controls","loop","selected","hidden","scoped","async","defer","reversed","isMap","seemless","muted","required","autofocus","noValidate","formNoValidate","open","pubdate","itemscope","indeterminate"],j=["accent-height","accumulate","additive","alignment-baseline","alphabetic","amplitude","arabic-form","ascent","attributeName","attributeType","azimuth","baseFrequency","baseline-shift","baseProfile","bbox","begin","bias","by","calcMode","cap-height","class","clip","clipPathUnits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","crossorigin","cursor","cx","cy","d","decelerate","descent","diffuseConstant","direction","display","divisor","dominant-baseline","dur","dx","dy","edgeMode","elevation","enable-background","end","exponent","fill","fill-opacity","fill-rule","filter","filterUnits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","format","from","fr","fx","fy","g1","g2","glyph-name","glyph-orientation-horizontal","glyph-orientation-vertical","glyphRef","gradientTransform","gradientUnits","hanging","height","href","hreflang","horiz-adv-x","horiz-origin-x","id","ideographic","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kernelMatrix","kernelUnitLength","kerning","keyPoints","keySplines","keyTimes","lang","lengthAdjust","letter-spacing","lighting-color","limitingConeAngle","local","marker-end","marker-mid","marker-start","markerHeight","markerUnits","markerWidth","mask","maskContentUnits","maskUnits","mathematical","max","media","method","min","mode","name","numOctaves","offset","opacity","operator","order","orient","orientation","origin","overflow","overline-position","overline-thickness","panose-1","paint-order","path","pathLength","patternContentUnits","patternTransform","patternUnits","ping","pointer-events","points","pointsAtX","pointsAtY","pointsAtZ","preserveAlpha","preserveAspectRatio","primitiveUnits","r","radius","referrerPolicy","refX","refY","rel","rendering-intent","repeatCount","repeatDur","requiredExtensions","requiredFeatures","restart","result","rotate","rx","ry","scale","seed","shape-rendering","slope","spacing","specularConstant","specularExponent","speed","spreadMethod","startOffset","stdDeviation","stemh","stemv","stitchTiles","stop-color","stop-opacity","strikethrough-position","strikethrough-thickness","string","stroke","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke-width","style","surfaceScale","systemLanguage","tabindex","tableValues","target","targetX","targetY","text-anchor","text-decoration","text-rendering","textLength","to","transform","transform-origin","type","u1","u2","underline-position","underline-thickness","unicode","unicode-bidi","unicode-range","units-per-em","v-alphabetic","v-hanging","v-ideographic","v-mathematical","values","vector-effect","version","vert-adv-y","vert-origin-x","vert-origin-y","viewBox","visibility","width","widths","word-spacing","writing-mode","x","x-height","x1","x2","xChannelSelector","xlink:actuate","xlink:arcrole","xlink:href Deprecated","xlink:role","xlink:show","xlink:title","xlink:type","xml:base","xml:lang","xml:space","y","y1","y2","yChannelSelector","z","zoomAndPan"];function s(e,t){e.innerHTML="",l(e,t)}function $(t,i={}){Object.keys(i).forEach(e=>function t(i,r,n){n instanceof Promise?n.then(e=>t(i,r,e)):!1?(n.addListener(e=>t(i,r,e)),"content"==r?s(i,n.value):t(i,r,n.value)):"value"==r?i.value=n:"data"==r&&"object"==typeof n?Object.keys(n).forEach(e=>{i.dataset[e]="object"==typeof n[e]?JSON.stringify(n[e]):n[e]}):"style"==r&&"object"==typeof n?Object.keys(n).forEach(t=>{let e=n[t];(e,!1)&&(e.addListener(e=>{null===e?i.style.removeProperty(t):i.style.setProperty(t,e)}),e=e.value),null===e?i.style.removeProperty(t):i.style.setProperty(t,e)}):"content"==r||"children"==r?s(i,n):r.match(/^on[a-z]/)?i[r]=n:H.find(e=>e.toUpperCase()==r.toUpperCase())?(r=H.find(e=>e.toUpperCase()==r.toUpperCase()),i[r]=!1!==n):(M.find(e=>r.match(new RegExp(e)))||j.includes(r))&&i.setAttribute(r,n)}(t,e,i[e]))}function w(e="div",t={},i){"object"==typeof e&&("string"==typeof t&&(i=t),e=(t=e).tag||"div");let r;return"svg"==e&&(t.xmlns=t.xmlns||"http://www.w3.org/2000/svg"),$(r=t.xmlns||i?document.createElementNS(t.xmlns||i,e):document.createElement(e),t),r}function a(e,t){if(Array.isArray(t)||t instanceof NodeList||t instanceof HTMLCollection){for(var i=Array.from(t);0<i.length;)e=a(e,i.pop());return e}if(Array.isArray(e)||e instanceof NodeList||e instanceof HTMLCollection)return a(e[0],t);if(e.parentNode)return t instanceof Node||(t=new Text(t)),e.parentNode.insertBefore(t,e),t;throw"argument of insertBefore unsupported"}function F(e){return e instanceof NodeList||e instanceof Array||e instanceof HTMLCollection?(e=Array.from(e)).forEach(F):e.parentNode.removeChild(e),e}function l(t,i,r,n,s){if(s=s||"append",Array.isArray(i)||i instanceof NodeList||i instanceof HTMLCollection){let e=Array.from(i);(e="prepend"==s?e.reverse():e).forEach(e=>l(t,e,r,n,s))}else if(r instanceof Element){let e=Array.from(arguments).slice(1).filter(e=>e instanceof Element);(e="prepend"==s?e.reverse():e).forEach(e=>l(t,e,void 0,n,s))}else if("boolean"!=typeof r&&(n=r,r=void 0),null!=i){var e;if(i instanceof Promise||i.then){const o=document.createElement("span");return t[s](o),i.then(e=>{l(o,e,r,n),a(o,o.childNodes),F(o)})}return i instanceof Element||i instanceof Node?t[s](i):"function"==typeof i?l(t,i.bind(n)(t),r,n):"object"==typeof i?t[s](w(i,t.namespaceURI)):r?t[s](i):((e=document.createElement("div")).innerHTML=i,t[s](...e.childNodes))}}function h(e,t){return getComputedStyle(e).getPropertyValue(t)}function o(e,t){if(Array.isArray(t)||t instanceof NodeList||t instanceof HTMLCollection){for(var i=Array.from(t);0<i.length;)e=o(e,i.shift());return e}if(Array.isArray(e)||e instanceof NodeList||e instanceof HTMLCollection)return o(e[e.length-1],t);if(e.parentNode)return t instanceof Node||(t=new Text(t)),e.parentNode.insertBefore(t,e.nextSibling),t;throw"argument of insertAfter unsupported"}function c(...e){let t=e.pop(),i=e.pop();"string"==typeof i||Array.isArray(i)||(e=e.concat(i),i="click"),"string"!=typeof e[0]&&e.unshift("button");const r=w(...e);return(i=Array.isArray(i)?i:[i]).forEach(e=>r.addEventListener(e,t)),r}function q(e,t,i){i=Object.assign({bubbles:!0,cancelable:!0},i),e.dispatchEvent(new CustomEvent(t,i))}function B(e){return e&&e.constructor&&e.call&&e.apply}function W(e,t,i,r=!0){var[t,i]=[t,i].sort((e,t)=>e-t);return r?t<=e&&e<=i:t<e&&e<i}function d(e,t,...i){t=e[t];return B(t)?t.call(e,...i):t}function V(e,t){t(e);e=Object.getPrototypeOf(e);e&&V(e,t)}function e(e,t){let i=[];return V(e,e=>{e.hasOwnProperty(t)&&i.push(e[t])}),i}function x(e,t){if(!Array.isArray(e))return e;const i=[];return t=t||((e,t)=>!t.includes(e)),e.forEach(e=>{t(e,i)&&i.push(e)}),i}function U(e,t){return e.matches?e.matches(t)?e:e.closest(t):null}function K(e,i){const r={};return e.forEach(e=>{let t;t=B(i)?r[i(e)]:d(e,i),r[t]=r[t]||[],r[t].push(e)}),r}function Y(e,t){var i=[];let r=0,n="",s=!1;for(;r<e.length;){var o=e.at(r);'"'==o&&s&&e.at(r+1)==t?s=!1:'"'!=o||s||0!=r&&e.at(r-1)!=t?s||o!=t?n+=o:(i.push(n),n=""):s=!0,r++}return i.push(n),i}class t extends HTMLElement{static assignableAttributes=[];static assignableMethods=[];static bindMethods=[];static style="";static watch=[];static events=["afterRemove","beforeRemove","beforeConnect","afterConnect","beforeDisconnect","afterDisconnect"];static get observedAttributes(){return this.watch}static include(e){this._plugins||(this._plugins=[]),this._plugins.includes(e.name)||(this._plugins.push(e.name),e.call(this,this.prototype))}_assignableAttributes={};_attributes={};_cleanupCallbacks=[];is_initialized=!1;constructor(r={}){super();const n=Object.assign({},r);e(this.constructor,"bindMethods").filter(e=>e).reverse().forEach(e=>{e.forEach(e=>{this[e]=this[e].bind(this)})}),e(this.constructor,"assignableAttributes").filter(e=>e).reverse().forEach(e=>{Array.isArray(e)?e.forEach(e=>{this._assignableAttributes[e]=this._assignableAttributes[e]||null}):Object.assign(this._assignableAttributes,e)}),Object.keys(this._assignableAttributes).forEach(i=>{Object.defineProperty(this,i,{configurable:!0,get:()=>this._attributes[i],set:e=>{var t=this._attributes[i];e!==t&&(this._attributes[i]=e,this.attributeChangedCallback(i,t,e))}}),r.hasOwnProperty(i)?(this[i]=r[i],delete n[i]):this[i]=this._assignableAttributes[i]}),e(this.constructor,"assignableMethods").filter(e=>e).reverse().forEach(e=>{e.forEach(t=>{if(r.hasOwnProperty(t)&&"function"==typeof r[t]){const i=this[t];this[t]=function(...e){return e.push(i),r[t].call(this,...e)},delete n[t]}})}),e(this.constructor,"events").filter(e=>e).reverse().forEach(e=>{e.forEach(e=>{var t="on"+e[0].toUpperCase()+e.slice(1);r.hasOwnProperty(t)&&(this.addEventListener(e,r[t]),delete n[t])})}),Object.keys(n).forEach(e=>{null==n[e]&&delete n[e]}),$(this,n)}initialize(){return Object.keys(this._assignableAttributes).forEach(e=>{var t=this.getAttribute(e)||this.dataset[e]||this[e];"content"==e&&t?(this.removeAttribute("content"),s(this,t)):null!==t&&(this[e]=t)}),this.is_initialized=!0}connected(){}connectedCallback(){this.trigger("beforeConnect"),this.appendStyle(),!this.is_initialized&&!1===this.initialize()||(this.connected(),this.trigger("afterConnect"))}disconnected(){}disconnectedCallback(){this.trigger("beforeDisconnect"),this._cleanupCallbacks.forEach(e=>e()),this._cleanupCallbacks=[],this.disconnected(),this.trigger("afterDisconnect")}changed(e,t,i){}attributeChangedCallback(e,...t){return this[e+"Changed"]&&this[e+"Changed"](...t),this.trigger(e+"Changed",{detail:t}),this.changed(e,...t)}appendStyle(){if(this.constructor.style){const i=this.getRootNode();i&&i.adoptedStyleSheets&&!i.adoptedStyleSheets.find(e=>e.id==this.constructor.name)&&V(this.constructor,t=>{var e;t.hasOwnProperty("style")&&t.renderStyle&&i&&i.adoptedStyleSheets&&!i.adoptedStyleSheets.find(e=>e.id==t.name)&&(e=t.renderStyle())&&i.adoptedStyleSheets.push(t.renderStyle(e))})}}static renderStyle(){if(!this.style)return null;var e=new CSSStyleSheet;e.id=this.name;let t="";const i=e=>Array.isArray(e)?e.map(i).join("\n"):B(e)?e.call(this):e||void 0;return V(this,e=>{t+=i(e.style)}),e.replaceSync(t),e}async remove(e){return this.trigger("beforeRemove"),e&&await e(),super.remove(),this.trigger("afterRemove"),this}addEventListenerFor(...e){_(this,...e)}cleanupEventListenerFor(...e){this._cleanupCallbacks.push(()=>{e[0].removeEventListener(...e.slice(1))}),e[0].addEventListener(...e.slice(1))}trigger(...e){q(this,...e)}}class G extends t{static observer=new ResizeObserver(e=>{e.forEach(e=>e.target.resize())});static assignableAttributes={columnWidth:"max-content",method:"pop"};static assignableMethods=["initialTemplate"];connected(){this.enable()}disconnected(){this.disable()}cells(e){return Array.from(e.children).map(e=>["grid","inline-grid"].includes(getComputedStyle(e).display)?this.cells(e):e.dataset.autoGridIgnore?null:e).flat().filter(e=>null!==e)}disable(){this.constructor.observer.unobserve(this)}enable(){this.constructor.observer.observe(this)}initialTemplate(e){return e.map(e=>this.columnWidth).join(" ")}resize(){const t=getComputedStyle(this);for(var e,i=this.cells(this),r=this.initialTemplate(i).split(/(?<!\,)\s+/);this.style.setProperty("grid-template-columns",r.join(" ")),e=i.some(e=>e.offsetLeft<this.offsetLeft-parseFloat(t.paddingLeft))||i.some(e=>e.offsetLeft+e.offsetWidth>this.offsetLeft+this.offsetWidth-parseFloat(t.paddingRight)),r[this.method](),1<=r.length&&e;);}static style=`
        auto-grid {
            display: grid;
            grid-template-columns: auto;
        }
    `}window.customElements.define("auto-grid",G);class X extends t{static tagName="komp-modal";constructor(...e){super(...e),this.container=w(this.tagName+"-popover",{popover:"manual"})}connected(){if(this.parentElement.localName!=this.localName+"-popover"){var e=Array.from(this.parentElement.querySelectorAll("komp-modal-popover"));let t=Math.max(...e.map(e=>parseInt(e.dataset.modalOrder||"0")));t++,e.forEach(e=>{e.dataset.modalOrder=e.dataset.modalOrder||t++}),this.replaceWith(this.container),this.container.addEventListener("click",e=>{e.target==this.container&&this.remove()}),this.container.append(this),this.container.append(w(this.tagName+"-close",{content:c({content:'<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'},this.remove.bind(this))})),this.container.showPopover()}}remove(){var e=this.container.parentElement;return this.container.remove(),e&&(e=Array.from(e.querySelectorAll(this.localName+"-popover")).sort((e,t)=>parseInt(t.dataset.modalOrder)-parseInt(e.dataset.modalOrder))[0])&&delete e.dataset.modalOrder,super.remove()}static style=function(){return`
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
    `}}window.customElements.define(X.tagName,X);const J=["start","end"],Z=["top","right","bottom","left"].reduce((e,t)=>e.concat(t,t+"-"+J[0],t+"-"+J[1]),[]),k=Math.min,C=Math.max,Q=Math.round,ee=Math.floor,f=e=>({x:e,y:e}),te={left:"right",right:"left",bottom:"top",top:"bottom"},ie={start:"end",end:"start"};function re(e,t,i){return C(e,k(t,i))}function z(e,t){return"function"==typeof e?e(t):e}function E(e){return e.split("-")[0]}function L(e){return e.split("-")[1]}function ne(e){return"x"===e?"y":"x"}function se(e){return"y"===e?"height":"width"}function A(e){return["top","bottom"].includes(E(e))?"y":"x"}function oe(e){return ne(A(e))}function ae(e,t,i){void 0===i&&(i=!1);var r=L(e),e=oe(e),n=se(e);let s="x"===e?r===(i?"end":"start")?"right":"left":"start"===r?"bottom":"top";return[s=t.reference[n]>t.floating[n]?he(s):s,he(s)]}function le(e){return e.replace(/start|end/g,e=>ie[e])}function ce(e,t,i,r){const n=L(e);let s=function(e,t,i){var r=["left","right"],n=["right","left"];switch(e){case"top":case"bottom":return i?t?n:r:t?r:n;case"left":case"right":return t?["top","bottom"]:["bottom","top"];default:return[]}}(E(e),"start"===i,r);return s=n&&(s=s.map(e=>e+"-"+n),t)?s.concat(s.map(le)):s}function he(e){return e.replace(/left|right|bottom|top/g,e=>te[e])}function de(e){return"number"!=typeof e?{top:0,right:0,bottom:0,left:0,...e}:{top:e,right:e,bottom:e,left:e}}function v(e){var{x:e,y:t,width:i,height:r}=e;return{width:i,height:r,top:t,left:e,right:e+i,bottom:t+r,x:e,y:t}}function ue(e,t,i){var{reference:r,floating:n}=e,e=A(t),s=oe(t),o=se(s),a=E(t),l="y"===e,c=r.x+r.width/2-n.width/2,h=r.y+r.height/2-n.height/2,d=r[o]/2-n[o]/2;let u;switch(a){case"top":u={x:c,y:r.y-n.height};break;case"bottom":u={x:c,y:r.y+r.height};break;case"right":u={x:r.x+r.width,y:h};break;case"left":u={x:r.x-n.width,y:h};break;default:u={x:r.x,y:r.y}}switch(L(t)){case"start":u[s]-=d*(i&&l?-1:1);break;case"end":u[s]+=d*(i&&l?-1:1)}return u}async function pe(e,t){var{x:i,y:r,platform:n,rects:s,elements:o,strategy:a}=e,{boundary:t="clippingAncestors",rootBoundary:e="viewport",elementContext:l="floating",altBoundary:c=!1,padding:h=0}=z(t=void 0===t?{}:t,e),h=de(h),c=o[c?"floating"===l?"reference":"floating":l],d=v(await n.getClippingRect({element:null==(d=await(null==n.isElement?void 0:n.isElement(c)))||d?c:c.contextElement||await(null==n.getDocumentElement?void 0:n.getDocumentElement(o.floating)),boundary:t,rootBoundary:e,strategy:a})),c="floating"===l?{x:i,y:r,width:s.floating.width,height:s.floating.height}:s.reference,t=await(null==n.getOffsetParent?void 0:n.getOffsetParent(o.floating)),e=await(null==n.isElement?void 0:n.isElement(t))&&await(null==n.getScale?void 0:n.getScale(t))||{x:1,y:1},l=v(n.convertOffsetParentRelativeRectToViewportRelativeRect?await n.convertOffsetParentRelativeRectToViewportRelativeRect({elements:o,rect:c,offsetParent:t,strategy:a}):c);return{top:(d.top-l.top+h.top)/e.y,bottom:(l.bottom-d.bottom+h.bottom)/e.y,left:(d.left-l.left+h.left)/e.x,right:(l.right-d.right+h.right)/e.x}}function me(e){var t=k(...e.map(e=>e.left)),i=k(...e.map(e=>e.top));return{x:t,y:i,width:C(...e.map(e=>e.right))-t,height:C(...e.map(e=>e.bottom))-i}}function ge(){return"undefined"!=typeof window}function u(e){return fe(e)?(e.nodeName||"").toLowerCase():"#document"}function y(e){return(null==e||null==(e=e.ownerDocument)?void 0:e.defaultView)||window}function m(e){return null==(e=(fe(e)?e.ownerDocument:e.document)||window.document)?void 0:e.documentElement}function fe(e){return ge()&&(e instanceof Node||e instanceof y(e).Node)}function b(e){return!!ge()&&(e instanceof Element||e instanceof y(e).Element)}function p(e){return!!ge()&&(e instanceof HTMLElement||e instanceof y(e).HTMLElement)}function ve(e){return!(!ge()||"undefined"==typeof ShadowRoot)&&(e instanceof ShadowRoot||e instanceof y(e).ShadowRoot)}function g(e){var{overflow:e,overflowX:t,overflowY:i,display:r}=N(e);return/auto|scroll|overlay|hidden|clip/.test(e+i+t)&&!["inline","contents"].includes(r)}function ye(t){return[":popover-open",":modal"].some(e=>{try{return t.matches(e)}catch(e){return!1}})}function be(e){var t=we();const i=b(e)?N(e):e;return"none"!==i.transform||"none"!==i.perspective||!!i.containerType&&"normal"!==i.containerType||!t&&!!i.backdropFilter&&"none"!==i.backdropFilter||!t&&!!i.filter&&"none"!==i.filter||["transform","perspective","filter"].some(e=>(i.willChange||"").includes(e))||["paint","layout","strict","content"].some(e=>(i.contain||"").includes(e))}function we(){return!("undefined"==typeof CSS||!CSS.supports)&&CSS.supports("-webkit-backdrop-filter","none")}function R(e){return["html","body","#document"].includes(u(e))}function N(e){return y(e).getComputedStyle(e)}function xe(e){return b(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function T(e){return"html"!==u(e)&&(e=e.assignedSlot||e.parentNode||ve(e)&&e.host||m(e),ve(e))?e.host:e}function I(e,t,i){void 0===t&&(t=[]),void 0===i&&(i=!0);var r=function e(t){var i=T(t);return R(i)?(t.ownerDocument||t).body:p(i)&&g(i)?i:e(i)}(e),e=r===(null==(e=e.ownerDocument)?void 0:e.body),n=y(r);return e?(e=ke(n),t.concat(n,n.visualViewport||[],g(r)?r:[],e&&i?I(e):[])):t.concat(r,I(r,[],i))}function ke(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function Ce(e){var t=N(e);let i=parseFloat(t.width)||0,r=parseFloat(t.height)||0;var t=p(e),n=t?e.offsetWidth:i,t=t?e.offsetHeight:r,e=Q(i)!==n||Q(r)!==t;return e&&(i=n,r=t),{width:i,height:r,$:e}}function ze(e){return b(e)?e:e.contextElement}function S(e){e=ze(e);if(!p(e))return f(1);var t=e.getBoundingClientRect(),{width:e,height:i,$:r}=Ce(e);let n=(r?Q(t.width):t.width)/e,s=(r?Q(t.height):t.height)/i;return n&&Number.isFinite(n)||(n=1),s&&Number.isFinite(s)||(s=1),{x:n,y:s}}const Ee=f(0);function Le(e){e=y(e);return we()&&e.visualViewport?{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}:Ee}function O(e,i,t,r){void 0===i&&(i=!1),void 0===t&&(t=!1);var n=e.getBoundingClientRect(),s=ze(e);let o=f(1);i&&(r?b(r)&&(o=S(r)):o=S(e));i=s,void 0===(e=t)&&(e=!1);t=!(t=r)||e&&t!==y(i)||!e?f(0):Le(s);let a=(n.left+t.x)/o.x,l=(n.top+t.y)/o.y,c=n.width/o.x,h=n.height/o.y;if(s){var i=y(s),d=r&&b(r)?y(r):r;let e=i,t=ke(e);for(;t&&r&&d!==e;){var u=S(t),p=t.getBoundingClientRect(),m=N(t),g=p.left+(t.clientLeft+parseFloat(m.paddingLeft))*u.x,p=p.top+(t.clientTop+parseFloat(m.paddingTop))*u.y;a*=u.x,l*=u.y,c*=u.x,h*=u.y,a+=g,l+=p,e=y(t),t=ke(e)}}return v({width:c,height:h,x:a,y:l})}function Ae(e,t){var i=xe(e).scrollLeft;return t?t.left+i:O(m(e)).left+i}function Re(e,t,i){void 0===i&&(i=!1);var r=e.getBoundingClientRect();return{x:r.left+t.scrollLeft-(i?0:Ae(e,r)),y:r.top+t.scrollTop}}function Ne(e,t,i){let r;var n,s,o;return v(r="viewport"===t?function(e,t){var i=y(e),e=m(e),i=i.visualViewport;let r=e.clientWidth,n=e.clientHeight,s=0,o=0;return i&&(r=i.width,n=i.height,we()&&"fixed"!==t||(s=i.offsetLeft,o=i.offsetTop)),{width:r,height:n,x:s,y:o}}(e,i):"document"===t?function(e){var t=m(e),i=xe(e),r=e.ownerDocument.body,n=C(t.scrollWidth,t.clientWidth,r.scrollWidth,r.clientWidth),s=C(t.scrollHeight,t.clientHeight,r.scrollHeight,r.clientHeight);let o=-i.scrollLeft+Ae(e);return e=-i.scrollTop,"rtl"===N(r).direction&&(o+=C(t.clientWidth,r.clientWidth)-n),{width:n,height:s,x:o,y:e}}(m(e)):b(t)?(s=(i=O(n=t,!0,"fixed"===(i=i))).top+n.clientTop,i=i.left+n.clientLeft,o=p(n)?S(n):f(1),{width:n.clientWidth*o.x,height:n.clientHeight*o.y,x:i*o.x,y:s*o.y}):(n=Le(e),{x:t.x-n.x,y:t.y-n.y,width:t.width,height:t.height}))}function Te(e,t){var i=t.get(e);if(i)return i;let r=I(e,[],!1).filter(e=>b(e)&&"body"!==u(e)),n=null;var s="fixed"===N(e).position;let o=s?T(e):e;for(;b(o)&&!R(o);){var a=N(o),l=be(o),l=(l||"fixed"!==a.position||(n=null),s?!l&&!n:!l&&"static"===a.position&&!!n&&["absolute","fixed"].includes(n.position)||g(o)&&!l&&function e(t,i){t=T(t);return!(t===i||!b(t)||R(t))&&("fixed"===N(t).position||e(t,i))}(e,o));l?r=r.filter(e=>e!==o):n=a,o=T(o)}return t.set(e,r),r}function Ie(e){return"static"===N(e).position}function Se(e,t){if(!p(e)||"fixed"===N(e).position)return null;if(t)return t(e);let i=e.offsetParent;return i=m(e)===i?i.ownerDocument.body:i}function Oe(t,e){var i,r=y(t);if(ye(t))return r;if(!p(t)){let e=T(t);for(;e&&!R(e);){if(b(e)&&!Ie(e))return e;e=T(e)}return r}let n=Se(t,e);for(;n&&(i=n,["table","td","th"].includes(u(i)))&&Ie(n);)n=Se(n,e);return(!(n&&R(n)&&Ie(n))||be(n))&&(n||function(e){let t=T(e);for(;p(t)&&!R(t);){if(be(t))return t;if(ye(t))return null;t=T(t)}return null}(t))||r}const De={convertOffsetParentRelativeRectToViewportRelativeRect:function(e){var{elements:e,rect:t,offsetParent:i,strategy:r}=e,r="fixed"===r,n=m(i),e=!!e&&ye(e.floating);if(i===n||e&&r)return t;let s={scrollLeft:0,scrollTop:0},o=f(1);var e=f(0),a=p(i),l=((a||!a&&!r)&&("body"===u(i)&&!g(n)||(s=xe(i)),p(i))&&(l=O(i),o=S(i),e.x=l.x+i.clientLeft,e.y=l.y+i.clientTop),!n||a||r?f(0):Re(n,s,!0));return{width:t.width*o.x,height:t.height*o.y,x:t.x*o.x-s.scrollLeft*o.x+e.x+l.x,y:t.y*o.y-s.scrollTop*o.y+e.y+l.y}},getDocumentElement:m,getClippingRect:function(e){let{element:i,boundary:t,rootBoundary:r,strategy:n}=e;var s=(e=[..."clippingAncestors"===t?ye(i)?[]:Te(i,this._c):[].concat(t),r])[0];return{width:(e=e.reduce((e,t)=>{t=Ne(i,t,n);return e.top=C(t.top,e.top),e.right=k(t.right,e.right),e.bottom=k(t.bottom,e.bottom),e.left=C(t.left,e.left),e},Ne(i,s,n))).right-e.left,height:e.bottom-e.top,x:e.left,y:e.top}},getOffsetParent:Oe,getElementRects:async function(e){var t=this.getOffsetParent||Oe,i=await(0,this.getDimensions)(e.floating);return{reference:function(e,t,i){var r=p(t),n=m(t),e=O(e,!0,i="fixed"===i,t);let s={scrollLeft:0,scrollTop:0};var o=f(0),a=(!r&&i||("body"===u(t)&&!g(n)||(s=xe(t)),r?(a=O(t,!0,i,t),o.x=a.x+t.clientLeft,o.y=a.y+t.clientTop):n&&(o.x=Ae(n))),!n||r||i?f(0):Re(n,s));return{x:e.left+s.scrollLeft-o.x-a.x,y:e.top+s.scrollTop-o.y-a.y,width:e.width,height:e.height}}(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:i.width,height:i.height}}},getClientRects:function(e){return Array.from(e.getClientRects())},getDimensions:function(e){var{width:e,height:t}=Ce(e);return{width:e,height:t}},getScale:S,isElement:b,isRTL:function(e){return"rtl"===N(e).direction}};function Pe(c,t){let h=null,d;const u=m(c);function p(){var e;clearTimeout(d),null!=(e=h)&&e.disconnect(),h=null}return function i(r,n){void 0===r&&(r=!1),void 0===n&&(n=1),p();var{left:e,top:s,width:o,height:a}=c.getBoundingClientRect();if(r||t(),o&&a){r={rootMargin:-ee(s)+"px "+-ee(u.clientWidth-(e+o))+"px "+-ee(u.clientHeight-(s+a))+"px "+-ee(e)+"px",threshold:C(0,k(1,n))||1};let t=!0;try{h=new IntersectionObserver(l,{...r,root:u.ownerDocument})}catch(e){h=new IntersectionObserver(l,r)}function l(e){if((e=e[0].intersectionRatio)!==n){if(!t)return i();e?i(!1,e):d=setTimeout(()=>{i(!1,1e-7)},1e3)}t=!1}h.observe(c)}}(!0),p}function _e(i,t,r,e){void 0===e&&(e={});const{ancestorScroll:n=!0,ancestorResize:s=!0,elementResize:o="function"==typeof ResizeObserver,layoutShift:a="function"==typeof IntersectionObserver,animationFrame:l=!1}=e,c=ze(i),h=n||s?[...c?I(c):[],...I(t)]:[],d=(h.forEach(e=>{n&&e.addEventListener("scroll",r,{passive:!0}),s&&e.addEventListener("resize",r)}),c&&a?Pe(c,r):null);let u=-1,p=null;o&&(p=new ResizeObserver(e=>{var[e]=e;e&&e.target===c&&p&&(p.unobserve(t),cancelAnimationFrame(u),u=requestAnimationFrame(()=>{var e;null!=(e=p)&&e.observe(t)})),r()}),c&&!l&&p.observe(c),p.observe(t));let m,g=l?O(i):null;return l&&function e(){const t=O(i);!g||t.x===g.x&&t.y===g.y&&t.width===g.width&&t.height===g.height||r();g=t;m=requestAnimationFrame(e)}(),r(),()=>{var e;h.forEach(e=>{n&&e.removeEventListener("scroll",r),s&&e.removeEventListener("resize",r)}),null!=d&&d(),null!=(e=p)&&e.disconnect(),p=null,l&&cancelAnimationFrame(m)}}function Me(o){return{name:"offset",options:o=void 0===o?0:o,async fn(e){var t,{x:i,y:r,placement:n,middlewareData:s}=e,e=await async function(e,t){var{placement:i,platform:r,elements:n}=e,r=await(null==r.isRTL?void 0:r.isRTL(n.floating)),n=E(i),s=L(i),i="y"===A(i),n=["left","top"].includes(n)?-1:1,r=r&&i?-1:1;let{mainAxis:o,crossAxis:a,alignmentAxis:l}="number"==typeof(t=z(t,e))?{mainAxis:t,crossAxis:0,alignmentAxis:null}:{mainAxis:t.mainAxis||0,crossAxis:t.crossAxis||0,alignmentAxis:t.alignmentAxis};return s&&"number"==typeof l&&(a="end"===s?-1*l:l),i?{x:a*r,y:o*n}:{x:o*n,y:a*r}}(e,o);return n===(null==(t=s.offset)?void 0:t.placement)&&null!=(t=s.arrow)&&t.alignmentOffset?{}:{x:i+e.x,y:r+e.y,data:{...e,placement:n}}}}}function He(f){return{name:"autoPlacement",options:f=void 0===f?{}:f,async fn(e){var{rects:t,middlewareData:i,placement:r,platform:n,elements:s}=e;const{crossAxis:o=!1,alignment:a,allowedPlacements:l=Z,autoAlignment:c=!0,...h}=z(f,e);var d,u,p=void 0!==a||l===Z?(u=c,p=l,((d=a||null)?[...p.filter(e=>L(e)===d),...p.filter(e=>L(e)!==d)]:p.filter(e=>E(e)===e)).filter(e=>!d||L(e)===d||!!u&&le(e)!==e)):l,e=await pe(e,h),m=(null==(m=i.autoPlacement)?void 0:m.index)||0,g=p[m];return null==g?{}:(t=ae(g,t,await(null==n.isRTL?void 0:n.isRTL(s.floating))),r!==g?{reset:{placement:p[0]}}:(n=[e[E(g)],e[t[0]],e[t[1]]],e=[...(null==(s=i.autoPlacement)?void 0:s.overflows)||[],{placement:g,overflows:n}],(t=p[m+1])?{data:{index:m+1,overflows:e},reset:{placement:t}}:(g=(null==(s=(i=e.map(e=>{var t=L(e.placement);return[e.placement,t&&o?e.overflows.slice(0,2).reduce((e,t)=>e+t,0):e.overflows[0],e.overflows]}).sort((e,t)=>e[1]-t[1])).filter(e=>e[2].slice(0,L(e[0])?2:3).every(e=>e<=0))[0])?void 0:s[0])||i[0][0])!==r?{data:{index:m+1,overflows:e},reset:{placement:g}}:{}))}}}function je(m){return{name:"shift",options:m=void 0===m?{}:m,async fn(e){var{x:t,y:i,placement:r}=e;const{mainAxis:n=!0,crossAxis:s=!1,limiter:o={fn:e=>{var{x:e,y:t}=e;return{x:e,y:t}}},...a}=z(m,e);var l,c={x:t,y:i},h=await pe(e,a),r=A(E(r)),d=ne(r);let u=c[d],p=c[r];n&&(c=u+h["y"===d?"top":"left"],l=u-h["y"===d?"bottom":"right"],u=re(c,u,l)),s&&(c=p+h["y"===r?"top":"left"],l=p-h["y"===r?"bottom":"right"],p=re(c,p,l));h=o.fn({...e,[d]:u,[r]:p});return{...h,data:{x:h.x-t,y:h.y-i,enabled:{[d]:n,[r]:s}}}}}}function $e(C){return{name:"flip",options:C=void 0===C?{}:C,async fn(e){const{placement:t,middlewareData:i,rects:r,initialPlacement:n,platform:s,elements:o}=e,{mainAxis:a=!0,crossAxis:l=!0,fallbackPlacements:c,fallbackStrategy:h="bestFit",fallbackAxisSideDirection:d="none",flipAlignment:u=!0,...p}=z(C,e);if(null==(m=i.arrow)||!m.alignmentOffset){var m=E(t);const x=A(n);var g=E(n)===n,f=await(null==s.isRTL?void 0:s.isRTL(o.floating)),g=c||(g||!u?[he(n)]:(v=he(g=n),[le(g),v,le(v)]));const k="none"!==d;!c&&k&&g.push(...ce(n,u,d,f));var v=[n,...g],g=await pe(e,p),e=[],y=(null==(b=i.flip)?void 0:b.overflows)||[];if(a&&e.push(g[m]),l&&(b=ae(t,r,f),e.push(g[b[0]],g[b[1]])),y=[...y,{placement:t,overflows:e}],!e.every(e=>e<=0)){var b,w,f=((null==(m=i.flip)?void 0:m.index)||0)+1,g=v[f];if(g)return{data:{index:f,overflows:y},reset:{placement:g}};let e=null==(b=y.filter(e=>e.overflows[0]<=0).sort((e,t)=>e.overflows[1]-t.overflows[1])[0])?void 0:b.placement;if(!e)switch(h){case"bestFit":{const t=null==(w=y.filter(e=>{return!k||(e=A(e.placement))===x||"y"===e}).map(e=>[e.placement,e.overflows.filter(e=>0<e).reduce((e,t)=>e+t,0)]).sort((e,t)=>e[1]-t[1])[0])?void 0:w[0];t&&(e=t);break}case"initialPlacement":e=n}if(t!==e)return{reset:{placement:e}}}}return{}}}}function Fe(b){return{name:"size",options:b=void 0===b?{}:b,async fn(e){var{placement:t,rects:i,platform:r,elements:n}=e;const{apply:s=()=>{},...o}=z(b,e);var a=await pe(e,o),l=E(t),c=L(t),t="y"===A(t),{width:i,height:h}=i.floating;let d,u;"top"===l||"bottom"===l?(d=l,u=c===(await(null==r.isRTL?void 0:r.isRTL(n.floating))?"start":"end")?"left":"right"):(u=l,d="end"===c?"top":"bottom");var l=h-a.top-a.bottom,p=i-a.left-a.right,m=k(h-a[d],l),g=k(i-a[u],p),f=!e.middlewareData.shift;let v=m,y=g;null!=(m=e.middlewareData.shift)&&m.enabled.x&&(y=p),null!=(g=e.middlewareData.shift)&&g.enabled.y&&(v=l),f&&!c&&(m=C(a.left,0),p=C(a.right,0),g=C(a.top,0),l=C(a.bottom,0),t?y=i-2*(0!==m||0!==p?m+p:C(a.left,a.right)):v=h-2*(0!==g||0!==l?g+l:C(a.top,a.bottom))),await s({...e,availableWidth:y,availableHeight:v});f=await r.getDimensions(n.floating);return i!==f.width||h!==f.height?{reset:{rects:!0}}:{}}}}const qe=v=>({name:"arrow",options:v,async fn(e){var{x:t,y:i,placement:r,rects:n,platform:s,elements:o,middlewareData:a}=e,{element:e,padding:l=0}=z(v,e)||{};if(null==e)return{};var l=de(l),t={x:t,y:i},i=oe(r),c=se(i),h=await s.getDimensions(e),d="y"===i,u=d?"top":"left",p=d?"bottom":"right",d=d?"clientHeight":"clientWidth",m=n.reference[c]+n.reference[i]-t[i]-n.floating[c],g=t[i]-n.reference[i],e=await(null==s.getOffsetParent?void 0:s.getOffsetParent(e));let f=e?e[d]:0;m=m/2-g/2,g=(f=f&&await(null==s.isElement?void 0:s.isElement(e))?f:o.floating[d]||n.floating[c])/2-h[c]/2-1,s=k(l[u],g),e=k(l[p],g),o=s,d=f-h[c]-e,u=f/2-h[c]/2+m,l=re(o,u,d),p=!a.arrow&&null!=L(r)&&u!==l&&n.reference[c]/2-(u<o?s:e)-h[c]/2<0,g=p?u<o?u-o:u-d:0;return{[i]:t[i]+g,data:{[i]:l,centerOffset:u-l-g,...p&&{alignmentOffset:g}},reset:p}}});function Be(o){return{name:"inline",options:o=void 0===o?{}:o,async fn(e){const{placement:c,elements:t,rects:i,platform:r,strategy:n}=e,{padding:s=2,x:h,y:d}=z(o,e);e=Array.from(await(null==r.getClientRects?void 0:r.getClientRects(t.reference))||[]);const u=function(e){var t=e.slice().sort((e,t)=>e.y-t.y),i=[];let r=null;for(let e=0;e<t.length;e++){var n=t[e];!r||n.y-r.y>r.height/2?i.push([n]):i[i.length-1].push(n),r=n}return i.map(e=>v(me(e)))}(e),p=v(me(e)),m=de(s);e=await r.getElementRects({reference:{getBoundingClientRect:function(){if(2===u.length&&u[0].left>u[1].right&&null!=h&&null!=d)return u.find(e=>h>e.left-m.left&&h<e.right+m.right&&d>e.top-m.top&&d<e.bottom+m.bottom)||p;if(2<=u.length){var e,t;if("y"===A(c))return i=u[0],r=u[u.length-1],n="top"===E(c),{top:e=i.top,bottom:s=r.bottom,left:t=(n?i:r).left,right:n=(n?i:r).right,width:n-t,height:s-e,x:t,y:e};const o="left"===E(c),a=C(...u.map(e=>e.right)),l=k(...u.map(e=>e.left));var i=u.filter(e=>o?e.left===l:e.right===a),r=i[0].top,n=i[i.length-1].bottom,s=l;return{top:r,bottom:n,left:s,right:a,width:a-s,height:n-r,x:s,y:r}}return p}},floating:t.floating,strategy:n});return i.reference.x!==e.reference.x||i.reference.y!==e.reference.y||i.reference.width!==e.reference.width||i.reference.height!==e.reference.height?{reset:{rects:e}}:{}}}}const We=(e,t,i)=>{var r=new Map,i={platform:De,...i},r={...i.platform,_c:r};return(async(t,i,e)=>{var{placement:r="bottom",strategy:n="absolute",middleware:e=[],platform:s}=e,o=e.filter(Boolean),a=await(null==s.isRTL?void 0:s.isRTL(i));let l=await s.getElementRects({reference:t,floating:i,strategy:n}),{x:c,y:h}=ue(l,r,a),d=r,u={},p=0;for(let e=0;e<o.length;e++){var{name:m,fn:g}=o[e],{x:g,y:f,data:v,reset:y}=await g({x:c,y:h,initialPlacement:r,placement:d,strategy:n,middlewareData:u,rects:l,platform:s,elements:{reference:t,floating:i}});c=null!=g?g:c,h=null!=f?f:h,u={...u,[m]:{...u[m],...v}},y&&p<=50&&(p++,"object"==typeof y&&(y.placement&&(d=y.placement),y.rects&&(l=!0===y.rects?await s.getElementRects({reference:t,floating:i,strategy:n}):y.rects),{x:c,y:h}=ue(l,d,a)),e=-1)}return{x:c,y:h,placement:d,strategy:n,middlewareData:u}})(e,t,{...i,platform:r})};class Ve extends t{static tagName="komp-floater";static assignableAttributes={content:null,anchor:null,placement:void 0,strategy:"absolute",flip:null,offset:null,shift:!0,arrow:null,autoPlacement:!0,inline:null,autoUpdate:{},removeOnBlur:!1,container:null,timeout:0,onHide:null};static bindMethods=["show","hide","checkFocus","checkEscape"];initialize(){if(super.initialize(),"string"==typeof this.anchor)this.anchor=this.getRootNode().querySelector(this.anchor);else if(!(this.anchor instanceof Element)){const e=this.anchor;this.anchor={getBoundingClientRect(){return{width:0,height:0,x:e.x,y:e.y,left:e.x,right:e.x,top:e.y,bottom:e.y}}}}}connected(){if(this.style.position=this.strategy,!this.anchor)throw"Floater needs anchor to position to.";const t=[];Object.keys(Ue).forEach(e=>{if(this[e])if("arrow"==e){let e=this.querySelector("komp-floater-arrow-locator");e||(e=w("komp-floater-arrow-locator"),this.prepend(e)),t.push(qe({element:e})),this.classList.add("komp-floater-arrow"),"number"==typeof this.arrow&&this.style.setProperty("--arrow-size",this.arrow+"px"),this.offset||(this.offset=!0===this.arrow?10:this.arrow),"none"!=h(this,"box-shadow")&&(this.style.filter=h(this,"box-shadow").split(/(?<!\([^\)]*),/).map(e=>`drop-shadow(${e.trim().split(/(?<!\([^\)]*)\s/).slice(0,4).join(" ")})`).join(" "),this.style.boxShadow="none")}else t.push(Ue[e](!0===this[e]?{}:this[e]))}),this._cleanupCallbacks.push(_e(this.anchor,this,()=>{We(this.anchor,this,{strategy:this.strategy,placement:this.placement,middleware:t}).then(({x:e,y:t,placement:i,middlewareData:r})=>{if(this.style.left=e+"px",this.style.top=t+"px",this.classList.remove("-top","-left","-bottom","-right"),this.classList.add("-"+i),r.arrow){const{x:e,y:t}=r.arrow;null!=e&&(this.style.setProperty("--arrow-left",e+"px"),this.querySelector("komp-floater-arrow-locator").style.setProperty("left",e+"px")),null!=t&&(this.style.setProperty("--arrow-top",t+"px"),this.querySelector("komp-floater-arrow-locator").style.setProperty("top",e+"px"))}})},this.autoUpdate)),this.classList.add("-in"),this.addEventListener("animationend",()=>{this.classList.remove("-in")},{once:!0}),this.removeOnBlur&&(this.cleanupEventListenerFor(this.getRootNode().body,"focusin",this.checkFocus),this.cleanupEventListenerFor(this.getRootNode().body,"click",this.checkFocus),this.cleanupEventListenerFor(this.getRootNode().body,"keyup",this.checkEscape))}checkFocus(e){e.defaultPrevented||e.target==this||e.target==this.anchor||this.contains(e.target)||this.anchor.contains&&this.anchor.contains(e.target)||this.hide()}checkEscape(e){27==e.which&&this.hide()}remove(){return new Promise(e=>{this.classList.add("-out");var t=()=>{this.classList.remove("-out"),super.remove().then(e)};"none"!=h(this,"animation-name")?this.addEventListener("animationend",t,{once:!0}):t()})}show(){return this._hideTimeout&&(clearTimeout(this._hideTimeout),delete this._hideTimeout),this._removing?this._removing.then(this.show):("string"==typeof this.container&&(this.container=this.closest(this.container)||this.anchor.closest&&this.anchor.closest(this.container)),null==this.container&&(this.container=this.parentElement||this.anchor.parentElement),this.parentElement||(this._showing=!0,this.container.append(this),this._showing=!1,this.trigger("shown")),this)}hide(){this._hideTimeout||this._hiding||(this._hideTimeout=setTimeout(this.hideAfterTimeout.bind(this),this.timeout))}hideAfterTimeout(){return this.parentElement?this._removing=this.remove().then(()=>{this.trigger("hidden"),this.onHide&&this.onHide(),delete this._hideTimeout,delete this._removing}):this}toggle(e){return this[(e="boolean"!=typeof e?null!==this.offsetParent:e)?"hide":"show"](),this}static style=`
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
            width: var(--arrow-size, 1px);
            height: var(--arrow-size, 1px);
        }
    `}window.customElements.define("komp-floater",Ve);const Ue={size:Fe,shift:je,autoPlacement:He,flip:$e,inline:Be,arrow:qe,offset:Me};class Ke extends t{static tagName="komp-content-area";static assignableAttributes=["onchange"];static assignableMethods=["load"];get value(){return this.dump(this.innerHTML.replaceAll("<br>","\n").replaceAll(/<[^\>]+>/g,""))}set value(e){s(this,this.load(e))}constructor(e={}){var t=(e=Object.assign({tabIndex:0,contenteditable:!0},e)).content;delete e.content,super(e),this.value=t||e.value,this.valueWas=this.value,this.addEventListener("focusout",this.onFocusOut),this.addEventListener("focusin",this.onFocusIn)}onFocusIn(){var e,t;this.valueWas=this.value,e=this,(t=document.createRange()).selectNodeContents(e),t.collapse(!1),(e=window.getSelection()).removeAllRanges(),e.addRange(t)}onFocusOut(){var e=this.value;this.valueWas!=e&&(this.onchange&&this.onchange(e,this.valueWas),this.trigger("change",e,this.valueWas),this.valueWas=e)}dump(e){return e.trimEnd()}load(e){return e="string"==typeof e?e.replaceAll("\n","<br>"):e}select(){var e=document.createRange(),t=(e.selectNodeContents(this),window.getSelection());t.removeAllRanges(),t.addRange(e)}static style=`
        komp-content-area {
            appearance: textfield;
            background-color: white;
            border-width: 1px;
            padding: 0.22em;
            display: inline-block;
            min-width: 4ch;
        }
    `}window.customElements.define(Ke.tagName,Ke);class r{static assignableAttributes={record:null,attribute:null,dump:(e,t)=>e,load:(e,t)=>e};static create(e,t={}){return this.new(e,t).input}static new(e,t={}){var i={button:Qe,checkbox:Ge,radio:Ge,select:et,date:Xe,textarea:Ze,"datetime-local":Je,contentarea:Ye}[e];return new(i||this)(Object.assign({type:e},t))}constructor(t={}){Object.keys(this.constructor.assignableAttributes).forEach(e=>{null!=t[e]&&(this[e]=t[e])}),"function"!=typeof this.dump&&(this.dump=e=>e),"function"!=typeof this.load&&(this.load=e=>e),this.input=this.createInput(function(t,i){const r={};return Object.keys(t).forEach(function(e){i.includes(e)||(r[e]=t[e])}),r}(t,["load","dump"])),this.input._loading=this._load(null,t.value),this.setupInputListener(this.inputChange.bind(this)),this.setupRecordListener(this.recordChange.bind(this))}get value(){this.input.value}set value(e){this.input.value=e}createInput(e={}){return w("input",Object.assign({type:e.type},e))}setupInputListener(e){this.input.addEventListener("change",e.bind(this)),this.input.addEventListener("blur",e.bind(this))}setupRecordListener(e){this.record&&this.record.addEventListener&&this.record.addEventListener("change",e),this.record&&this.record.addListener&&this.record.addListener(e)}inputChange(e){if(!this._dumping){if(this.input.closest("[preventChange]"))return!1;this._dump(),this._dumping=new Promise(e=>{setTimeout(()=>{delete this._dumping,e()},50)})}}recordChange(){this.input._loading=this._load()}_load(e,t){t=this.load(t||this._loadValue(),this.record,{explicitValue:t});null!=t&&(this.input.value=t)}_loadValue(){if(this.record)return function e(t,i,r){var n=(i=Array.isArray(i)?i:[i])[0];return i=i.slice(1),null!=t[n]?0<i.length?e(t[n],i,r):d(t,n):r}(this.record,this.attribute)}_dump(e,t){t=this.dump(t||this.input.value,this.record);return this._dumpValue(t)}_dumpValue(e){let t=Array.isArray(this.attribute)?this.attribute:[this.attribute];return t=t.concat([e]),function e(t,...i){var r;return 2==i.length?t[i[0]]=i[1]:(t[r=i.shift()]instanceof Object||(t[r]={}),Array.isArray(t[r])?t[r]=e(Array.from(t[r]),...i):t[r]=e(Object.assign({},t[r]),...i)),t}(this.record,...t),e}}class Ye extends r{createInput(e){return new Ke(e)}}class Ge extends r{async _load(){var e=this.load(await this._loadValue()),t="on"==this.input.value||this.input.value;this.input.multiple?this.input.checked=!!Array.isArray(e)&&e.includes(t):this.input.checked=e==t}_dump(){let e,t="on"==this.input.value||this.input.value;var i;return e=this.input.multiple?(i=this._loadValue()||[],this.input.checked?i.includes(t)?this.dump(i):this.dump(i.concat(t)):this.dump(i.filter(e=>e!=t))):"boolean"==typeof t?this.dump(this.input.checked?t:!t):this.dump(this.input.checked?this.input.value:null),this._dumpValue(e)}setupInputListener(e){this.input.addEventListener("change",e.bind(this))}}class Xe extends r{setupInputListener(){this.input.addEventListener("blur",this.inputChange.bind(this))}async _load(e){let t=await this._loadValue();return t instanceof Date&&(t=[t.getUTCFullYear(),(t.getMonth()+1).toString().padStart(2,"0"),t.getDate().toString().padStart(2,"0")].join("-")),super._load(e,t)}_dump(e){let t=this.input.value;""==t&&(t=null),super._dump(e,t)}}class Je extends r{async _load(e){let t=await this._loadValue();t instanceof Date&&(t=[[t.getUTCFullYear(),(t.getMonth()+1).toString().padStart(2,"0"),t.getDate().toString().padStart(2,"0")].join("-"),"T",[t.getHours().toString().padStart(2,"0"),t.getMinutes().toString().padStart(2,"0")].join(":")].join("")),super._load(e,t)}}class Ze extends r{createInput(e){return w("textarea",e)}}class Qe extends r{createInput(e){return w("button",e)}setupInputListener(){this.input.addEventListener("click",this._dump.bind(this))}_load(){}}class et extends r{createInput(e={}){const t=w("select",e);return e.includeBlank&&t.append(w("option",Object.assign({content:"Unset",value:null},e.includeBlank))),e.options&&e.options.forEach(e=>{t.append(w("option",{content:Array.isArray(e)?e[1]:e,value:Array.isArray(e)?e[0]:e}))}),t}async _load(e){if(this.input.multiple){const t=this.load(await this._loadValue());this.input.querySelectorAll("option").forEach(e=>{t.includes(e.value)?e.setAttribute("selected",!0):e.removeAttribute("selected")})}else super._load()}_dump(e){var t;if(this.input.multiple)return t=Array.from(this.input.options).filter(e=>e.selected).map(e=>e.value),this._dumpValue(this.dump(t)),t;{let e=this.input.value;return"null"==e&&(e=null),e=this.dump(e),this._dumpValue(e),e}}}class i extends t{static tagName="komp-table-cell";static assignableAttributes=["record","column","table","cellIndex","groupIndex"];get row(){let e=this.parentElement;for(;e instanceof this.constructor;)e=e.parentElement;return e}get rowIndex(){return this.row.rowIndex}get cellIndex(){return this.column.index}get cells(){return Array.from(this.querySelectorAll(this.table.cellSelector))}cellIndexChanged(e,t){this.style.gridColumn=t}groupIndexChanged(e,t){this.style.gridRow=t}render(){return s(this,d(this.column,"render",this.record,this)),this}connected(){this.column.cells.add(this)}disconected(){this.column.cells.delete(this)}}window.customElements.define(i.tagName,i);var tt=class extends i{static tagName="komp-table-header-cell";render(){return s(this,d(this.column,"header",this)),this}connected(){super.connected(),this.column.frozen&&this.table.observeResize(this)}disconnected(){this.column.frozen&&this.table.unobserveResize(this)}};window.customElements.define(tt.tagName,tt);class it{static Cell=i;static HeaderCell=tt;static assignableAttributes=["index","table","width","frozen","header","class","splitInto"];static assignableMethods=["record","headerChanged","indexChanged","widthChanged","render","initialize"];_attributes={};_is_initialized=!1;cells=new Set;toggles=new Set;constructor(r){const t={};e(this.constructor,"assignableAttributes").filter(e=>e).reverse().forEach(e=>{Array.isArray(e)?e.forEach(e=>{t[e]=t[e]||null}):Object.assign(t,e)}),Object.keys(t).forEach(i=>{Object.defineProperty(this,i,{configurable:!0,get:()=>"header"==i?null!=this._attributes.header?this._attributes.header:this.headerFallback():this._attributes[i],set:e=>{var t=this._attributes[i];e!==t&&(this._attributes[i]=e,this.attributeChangedCallback(i,t,e))}}),r.hasOwnProperty(i)?this[i]=r[i]:this[i]=t[i]}),e(this.constructor,"assignableMethods").filter(e=>e).reverse().forEach(e=>{e.forEach(t=>{if(r.hasOwnProperty(t)&&"function"==typeof r[t]){const i=this[t];this[t]=function(...e){return e.push(i),r[t].call(this,...e)}}})}),this.initialize(r),this._is_initialized=!0}initialize(e){}widthChanged(e,t){this._is_initialized&&this.table.setTemplateColumns()}indexChanged(e,t){e!=t&&(this.headerCell&&(this.headerCell.cellIndex=t),this.cells.forEach(e=>e.cellIndex=t))}headerChanged(e,t){this._is_initialized&&this.table.trigger("headerChanged",{detail:this})}classChanged(t,i){this.cells.forEach(e=>e.classList.remove(...t.split(" "))),this.cells.forEach(e=>e.classList.add(...i.split(" ")))}changed(e,t,i){}attributeChangedCallback(e,...t){return this[e+"Changed"]&&this[e+"Changed"].call(this,...t),this.changed(e,...t)}record(e){return e}headerFallback(){}renderHeader(){return this.headerCell=this.createHeader(),this.headerCell}createHeader(){var e=new this.constructor.HeaderCell({column:this,table:this.table,class:this.class,cellIndex:this.index}).render();return this.frozen&&e.classList.add("frozen","frozen-"+this.index),e}async renderCell(e,t){return this.createCell(e,t)}async createCell(e,t={}){t=new this.constructor.Cell(Object.assign({column:this,table:this.table,record:e?await d(this,"record",e):void 0,cellIndex:this.index,class:this.class},t));return e&&t.render(),this.frozen&&t.classList.add("frozen","frozen-"+this.index),t}remove(){this.headerCell.remove(),this.cells.forEach(e=>e.remove()),this.table.trigger("columnRemoved",{detail:this})}get offsetWidth(){return this.headerCell.offsetWidth}get offsetLeft(){return this.headerCell.offsetLeft}}class D extends t{static tagName="komp-table-group";get table(){return this.row?.table}get row(){return this.parentElement}get rowIndex(){return this.row.rowIndex}get cells(){return Array.from(this.querySelectorAll(this.table.cellSelector))}get rowCount(){return Math.max(...this.cells.map(e=>e.groupIndex))}append(...e){return super.append(...e)}}window.customElements.define(D.tagName,D);class rt extends t{static tagName="komp-table-row";static assignableAttributes=["rowIndex","table","height","record"];#rowCount=0;get cells(){return Array.from(this.querySelectorAll(this.table.cellSelector))}get rowCount(){return this.#rowCount}set rowCount(e){this.style.gridTemplateRows=`repeat(${e}, var(--row-size, auto))`,this.#rowCount=e}constructor(...e){super(...e),this.generatedGroupNames=new Map}rowIndexChanged(e,t){e!=t&&(this.style.gridRow=t)}heightChanged(e){this.parentElement&&this.table.setTemplateRows()}async renderColumn(i,r){if(i.splitInto){var n=await i.renderCell(null,{readonly:!0,disabled:!0}),s=(this.append(n),await("function"==typeof i.splitInto?i.splitInto(r):r[i.splitInto]));if(null==s||0==s.length)return n.toggleAttribute("disabled",!1),n;n=await Promise.all(await s.map(async(e,t)=>{e=await i.renderCell(e);return e.groupIndex=t+1,e}));let e="string"==typeof i.splitInto?i.splitInto:i.splitInto.name,t=("splitInto"!=e||(e=this.generatedGroupNames.get(i.splitInto))||(e="group-"+this.generatedGroupNames.size,this.generatedGroupNames.set(i.splitInto,e)),this.querySelector(D.tagName+`[data-name=${e}]`));return t||(t=new D({data:{name:e}}),this.append(t)),t.append(...n),n}return s=await i.renderCell(r),this.append(s),s}}window.customElements.define(rt.tagName,rt);class nt extends rt{static tagName="komp-table-header";rowIndexChanged(e,t){this.style.gridRow=t}}window.customElements.define(nt.tagName,nt);class st extends t{static assignableAttributes={data:[],columns:[]};static tagName="komp-table";static columnTypeRegistry={default:it};static Row=rt;static Header=nt;static events=["headerChanged","columnRemoved","columnsChanged"];frozenLeft=0;constructor(...e){super(...e),this.rowSelector=this.constructor.Row.tagName+", "+this.constructor.Header.tagName,this.cellSelector=x(Object.values(this.constructor.columnTypeRegistry).map(e=>[e.Cell.tagName,e.HeaderCell.tagName]).flat()).map(e=>e+":not([disabled])").join(", ")}async initialize(...e){e=super.initialize(...e);return await this.initializeColumns(),this.setTemplateColumns(),this.rendering=this.render(),e}remove(...e){this.resizeObserver&&this.resizeObserver.disconnect(),this.frozenColumnResizeObserver&&this.frozenColumnResizeObserver.disconnect(),this.interersectionObserver&&this.interersectionObserver.disconnect(),super.remove(...e)}async initializeColumns(){return this.columns=await Promise.all(await(await this.columns).map(this.initializeColumn,this)),this.columns}async initializeColumn(e,t){var i=(e=await e).type||"default";return new(this.constructor.columnTypeRegistry[i]||this.constructor.columnTypeRegistry.default)(Object.assign({table:this,index:t+1},e))}observeResize(e){this.frozenColumnResizeObserver||(this.frozenColumnResizeObserver=new ResizeObserver(e=>{this.frozenLeft=0,this.header.querySelectorAll(":scope > .frozen").forEach((e,t)=>{var i=e.offsetLeft-this.scrollLeft;this.style.setProperty("--frozen-position-"+e.cellIndex,i+"px"),this.frozenLeft=i+e.offsetWidth})})),this.frozenColumnResizeObserver.observe(e)}unobserveResize(e){this.frozenColumnResizeObserver&&this.frozenColumnResizeObserver.unobserve(e)}observeIntersection(e){return this.interersectionObserver||this.setInterersectionObserver(),this.interersectionObserverTargets||(this.interersectionObserverTargets=new Set),this.interersectionObserver.observe(e),this.interersectionObserverTargets.add(e),e}setInterersectionObserver(){let e=function e(t,i){return i(t)?t:t.parentElement?e(t.parentElement,i):null}(this,e=>e.scrollHeight>e.clientHeight);e==this.getRootNode().documentElement&&(e=null),this.interersectionObserver=new IntersectionObserver(e=>{e.forEach(e=>{this.querySelector(e.target.dataset.target)?.classList.toggle("show",e.intersectionRatio<=0)})},{root:e}),this.resizeObserver||(this.resizeObserver=new ResizeObserver(e=>{e.forEach(e=>e.target.resetInterersectionObserver())}),this.resizeObserver.observe(this))}resetInterersectionObserver(){this.interersectionObserver&&(this.interersectionObserver.disconnect(),this.setInterersectionObserver(),this.interersectionObserverTargets.forEach(e=>{this.interersectionObserver.observe(e)}))}async render(){this.innerHTML="",l(this,this.renderHeader()),await l(this,await this.renderRows());var e=this.columns.filter(e=>e.frozen);0<e.length&&(l(this,this.observeIntersection(w(this.localName+"-frozen-indicator",{class:"column",data:{target:this.localName+"-frozen-divider.column"}}))),l(this,w(this.localName+"-frozen-divider",{class:"column",style:{"grid-column":"1 / "+(e.length+1)}}))),this.setTemplateRows()}setTemplateColumns(){this.style.gridTemplateColumns=this.columns.map(e=>e.width||"var(--column-size)").join(" ")}setTemplateRows(){this.style.gridTemplateRows=[this.header.height||"var(--row-size)"].concat(this.rows.map(e=>e.height||"var(--row-size)"),"1fr").join(" ")}renderHeader(){return this.header=new this.constructor.Header({rowIndex:1,table:this,content:this.columns.map(this.renderColumnHeader,this)}),this.append(this.observeIntersection(w(this.localName+"-frozen-indicator",{class:"row",data:{target:this.localName+"-frozen-divider.row"}}))),this.append(w(this.localName+"-frozen-divider",{class:"row",style:{"grid-row":"1"}})),this.header}renderColumnHeader(e){return e.renderHeader()}async renderRows(){return Promise.all(await(await this.data).map((e,t)=>this.renderRow(e,t+2)))}async renderRow(t,e){const i=new this.constructor.Row({record:t,rowIndex:e,table:this});return this.columns.forEach(async e=>{i.renderColumn(e,t)}),i}appendRow(e,...t){return this.#spliceRow(e,0,t)}removeRow(e,t=1){return this.#spliceRow(e,t)}async#spliceRow(r,n,s=[],e){var t=()=>new Promise(async e=>{var t,i=await Promise.all(s.map(async(e,t)=>e instanceof this.constructor.Row?e:this.renderRow(e,r+t)));this.rows.slice(r-1,r-1+n).forEach(e=>e.remove()),0<i.length&&((t=this.rows[r-1])?await a(t,i):await o(this.rows[this.rows.length-1],i)),this.rows.forEach((e,t)=>e.rowIndex=t+1),this.setTemplateRows(),e(i)});return this.rendering?this.rendering=this.rendering.then(t):this.rendering=t(),this.rendering}sortRows(e){return Array.from(this.querySelectorAll(this.constructor.Row.tagName)).sort(e).map((e,t)=>{this.append(e),e.rowIndex=t+2})}get rows(){return Array.from(this.querySelectorAll(this.rowSelector))}get cells(){return Array.from(this.querySelectorAll(this.cellSelector))}async#spliceColumns(s,e,i=[],t=!0){i=await Promise.all(i.map(async(e,t)=>e instanceof it?e:this.initializeColumn(e,s+t-1)));let r;return t?r=this.columns.splice(s-1,e,...i):(r=this.columns.slice(s-1,s-1+e),this.columns=this.columns.toSpliced(s-1,e,...i)),this.columns.forEach((e,t)=>{e.index=t+1}),this.setTemplateColumns(),await this.rendering,r.forEach(e=>e.remove()),0<i.length&&(t=i.map(e=>e.headerCell||this.renderColumnHeader(e)),(e=this.header.children.item(s-1))?a(e,t):o(this.header.children,t),await Promise.all(await(await this.data).map(async(t,e)=>{const n=this.rows[e+1];return Promise.all(i.map(async r=>{var e=Array.from(r.cells).filter(e=>e.rowIndex==n.rowIndex);return 0==e.length?n.renderColumn(r,t):Promise.all(e.map(async e=>{let t=n;r.splitInto&&(t=e.parentElement);var i=Array.from(t.children).find(e=>e.cellIndex&&s<e.cellIndex);i?await a(i,e):await l(t,e)}))}))}))),i}spliceColumns(e,t,...i){return this.#spliceColumns(e,t,...i)}insertColumns(e,...t){return this.#spliceColumns(e,0,t)}addColumns(e,...t){return this.#spliceColumns(e,0,t,!1)}deleteColumn(e){return this.#spliceColumns(e.index,1)}removeColumn(e){return this.#spliceColumns(e.index,1,[],!1)}replaceColumn(e,...t){return this.#spliceColumns(e.index,1,t,!1)}at(t,i,r){var e=this.cells;return t<0&&(t+=Math.max(...e.map(e=>e.cellIndex))),i<0&&(i+=Math.max(...e.map(e=>e.rowIndex))),e.find(e=>{if(e.cellIndex==t&&e.rowIndex==i)return!e.groupIndex||!r||e.groupIndex==Math.min(r<0?e.parentElement.rowCount+r+1:r,e.parentElement.rowCount)})}slice(e,t){let r;e.groupIndex&&t.groupIndex&&e.parentElement.dataset.name==t.parentElement.dataset.name&&(r=e.parentElement.dataset.name);const[n,s]=[e.rowIndex,t.rowIndex].sort((e,t)=>e-t),[o,a]=[e.cellIndex,t.cellIndex].sort((e,t)=>e-t);let[l,c]=[e.groupIndex,t.groupIndex].sort((e,t)=>e-t);return e.rowIndex<t.rowIndex&&(l=e.groupIndex),t.rowIndex<e.rowIndex&&(l=t.groupIndex),this.rows.map((e,t,i)=>{if(W(e.rowIndex,n,s))return e.cells.map((e,t,i)=>W(e.cellIndex,o,a)?e.groupIndex&&e.parentElement.dataset.name==r?e.rowIndex==n&&e.rowIndex==s?W(e.groupIndex,l,c)?e:null:e.rowIndex==n?l<=e.groupIndex?e:null:e.rowIndex!=s||e.groupIndex<=c?e:null:e:null).filter(e=>null!=e).flat()}).filter(e=>null!=e).flat()}queryCell(e=""){return this.querySelector(this.cellSelector.split(", ").map(t=>e.split(", ").map(e=>t+e).join(", ")).join(", "))}queryCells(e=""){return this.querySelectorAll(this.cellSelector.split(", ").map(t=>e.split(", ").map(e=>t+e).join(", ")).join(", "))}static style=function(){return`
        ${this.tagName} {
            --column-size: max-content;
            --row-size: auto;
            --split-row-size: auto;
            display: inline-grid;
            align-content: start;
            position: relative;
        }
        ${this.tagName}-handles {
            display: contents;
        }
        ${this.tagName}-header,
        ${this.tagName}-row {
            display: grid;
            grid-template-columns: subgrid;
            grid-column: 1 / -1;
            grid-auto-flow: row dense;
        }

        komp-table-header {
            position: sticky;
            top: 0;
            cursor: default;
        }
        
        komp-table-group {
            display: grid;
            grid-column: 1 / -1;
            grid-row: 1;
            grid-template-columns: subgrid;
            grid-auto-rows: var(--split-row-size, var(--row-size, auto));
            pointer-events: none;
        }
        komp-table-group > * {
            pointer-events: auto;
        }
        
        ${this.tagName}-frozen-indicator {
            position: absolute;
            inset-inline-start: 0;
            inset-block-start: 0;
            block-size: 100%;
            inline-size: 1px;
            background: none;
            pointer-events: none;
        }
        ${this.tagName}-frozen-indicator.row {
            writing-mode: vertical-lr;
            grid-area: 1 / 1 / 1 / -1;
        }
        
        ${this.tagName}-frozen-divider {
            pointer-events: none;
            grid-row: 1 / -2;
            grid-column: 1;
            position: sticky;
            inset-inline-start: 0;
        }
        ${this.tagName}-frozen-divider.show:after {
            opacity: 0.1;
            inline-size: 10px;
        }
        ${this.tagName}-frozen-divider:after {
            content: '';
            position: absolute;
            inset-inline-start: 100%;
            inset-block-start: 0;
            block-size: 100%;
            inline-size: 0;
            background: linear-gradient(90deg, rgba(0,0,0,1), rgba(0,0,0,0));
            opacity: 0;
            transition: opacity 150ms, width 150ms;
        }
        ${this.tagName}-frozen-divider.row {
            writing-mode: vertical-lr;
            grid-column: 1 / -1;
            grid-row: 1;
        }
        ${this.tagName}-frozen-divider.row:after {
            background: linear-gradient(rgba(0,0,0,1), rgba(0,0,0,0))
        }

        ${this.tagName}-cell,
        ${this.tagName}-header-cell {
            grid-row: 1;
        }
        
        ${this.tagName}-header-cell.frozen,
        ${this.tagName}-cell.frozen {
            position: sticky;
        }
        
        ${this.tagName} .frozen-1 {
            left: var(--frozen-position-1, 0);
        }
        ${this.tagName} .frozen-2 {
            left: var(--frozen-position-2, 0);
        }
        ${this.tagName} .frozen-3 {
            left: var(--frozen-position-3, 0);
        }
        ${this.tagName} .frozen-4 {
            left: var(--frozen-position-4, 0);
        }
        ${this.tagName} .frozen-5 {
            left: var(--frozen-position-5, 0);
        }

        ${this.tagName}-cell               { z-index: 1; }
        ${this.tagName}-cell.frozen        { z-index: 100; }
        ${this.tagName}-header             { z-index: 110; }
        ${this.tagName}-header-cell.frozen { z-index: 115; }
        ${this.tagName}-frozen-divider     { z-index: 120; }
    `}}window.customElements.define(st.tagName,st);class ot extends Ve{static watch=["anchor"];static assignableAttributes={autoPlacement:!1,flip:!0,shift:!0,strategy:"absolute",placement:"top",arrow:!0,timeout:300};_showing=!1;constructor(e,...t){super(e,...t),this.anchorChanged(this.anchor,this.anchor),void 0===e&&(this.needsFirstRemoval=!0),this.addEventListener("mouseenter",this.show),this.addEventListener("mouseleave",this.hide)}connected(){if(super.connected(),this.getRootNode()==this.anchor.getRootNode()&&0==this._showing)return F(this),!1}anchorChanged(e,t){e&&e.removeEventListener&&(e.removeEventListener("mouseenter",this.show),e.removeEventListener("mouseleave",this.hide)),t&&t.addEventListener&&(t.addEventListener("mouseenter",this.show),t.addEventListener("mouseleave",this.hide))}show(){super.show(),window.activeTooltip&&window.activeTooltip!=this&&window.activeTooltip.hide(),window.activeTooltip=this}async remove(){await super.remove(),window.activeTooltip==this&&delete window.activeTooltip}}window.customElements.define("komp-tooltip",ot);class at extends ot{static assignableAttributes={mouseevent:"click",placement:"bottom",arrow:!1,removeOnBlur:!0,timeout:0};static bindMethods=["toggle"];connected(...e){return this.addEventListener("mouseenter",this.clearHide.bind(this)),"mouseenter"==this.mouseevent&&this.addEventListener("mouseleave",this.hide.bind(this)),super.connected(...e)}show(){super.show(),this.anchor.classList.add("-active")}hide(){super.hide(),this.anchor.classList.remove("-active")}anchorChanged(e,t){"mouseenter"==this.mouseevent?super.anchorChanged(e,t):(e&&e instanceof HTMLElement&&e.removeEventListener(this.mouseevent,this.toggle.bind(this)),t&&t instanceof HTMLElement&&t.addEventListener(this.mouseevent,this.toggle.bind(this)))}clearHide(){this._hideTimeout&&(clearTimeout(this._hideTimeout),delete this._hideTimeout)}}window.customElements.define("komp-dropdown",at);class lt extends t{static assignableAttributes={timeout:5e3,animation:!0,dismissable:!0};constructor(e,t){super(t),s(this,w({class:"komp-notification-body",content:e})),this.dismissable&&l(this,c({type:"button",class:"dismiss-button",content:`
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 25 25" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
                    <circle cx="13" cy="13" r="11" stroke-dasharray="0% 300%" />
                    <line x1="17" y1="9" x2="9" y2="17"></line><line x1="9" y1="9" x2="17" y2="17"></line>
                    </svg>`},e=>{this.remove()}))}connected(){this.dismissable&&(this.addEventListener("mouseenter",this.clearTimeout),this.addEventListener("mouseleave",this.restartTimeout),this.timer=this.querySelector(".dismiss-button circle").animate([{strokeDasharray:"300% 300%"},{strokeDasharray:"0% 300%"}],{duration:this.timeout,iterations:1}),this.timer.finished.then(()=>this.remove())),this.animation&&this.animate([{opacity:0,easing:"ease-out",marginBottom:-1*this.offsetHeight+"px"},{opaicty:1,marginBottom:"0px"}],Object.assign({duration:150,iterations:1},this.animation))}remove(...e){if(this.animation)return this.animate([{opaicty:1,marginBottom:"0px",easing:"ease-in"},{opacity:0,marginBottom:-1*this.offsetHeight+"px"}],Object.assign({duration:150,iterations:1},this.animation)).finished.then(()=>{super.remove.call(this,...e)});super.remove.call(this,...e)}clearTimeout(){this.timer.pause(),this.timer.currentTime=0}restartTimeout(){this.timer.play()}}window.customElements.define("komp-notification",lt);class ct extends t{static assignableAttributes=lt.assignableAttributes;constructor(...e){super(...e),this.setAttribute("popover","manual")}connected(){this.showPopover()}add(e,t){this.hidePopover(),this.showPopover();e=new lt(e,Object.assign({timeout:this.timeout,dismissable:this.dismissable},t));return l(this,e),e}static style=`
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
    `}window.customElements.define("komp-notification-center",ct);class ht extends t{static tagName="komp-dropzone";static assignableAttributes={enabled:!0,onFileDrop:null,overlay:{content:"Drag Here"}};static bindMethods=["windowDragEnter","windowDragLeave","windowDrop","drop","dragOver","dragEnter","dragLeave"];constructor(...e){super(...e),"object"!=typeof this.overlay||this.overlay instanceof HTMLElement||(this.overlay=w("komp-dropzone-overlay",Object.assign({},this.constructor.assignableAttributes.overlay,this.overlay)))}addEventListeners(){this.getRootNode()&&(this.getRootNode().addEventListener("dragenter",this.windowDragEnter),this.getRootNode().addEventListener("dragleave",this.windowDragLeave),this.getRootNode().addEventListener("drop",this.windowDrop)),this.addEventListener("drop",this.drop),this.addEventListener("dragover",this.dragOver),this.addEventListener("dragenter",this.dragEnter),this.addEventListener("dragleave",this.dragLeave)}removeEventListeners(){this.getRootNode()&&(this.getRootNode().removeEventListener("dragenter",this.windowDragEnter),this.getRootNode().removeEventListener("dragleave",this.windowDragLeave),this.getRootNode().removeEventListener("drop",this.windowDrop)),this.removeEventListener("drop",this.drop),this.removeEventListener("dragover",this.dragOver),this.removeEventListener("dragenter",this.dragEnter),this.removeEventListener("dragleave",this.dragLeave)}connected(){"static"==h(this,"position")&&(this.style.position="relative"),this.enabled&&this.addEventListeners()}disconnected(){this.enabled&&this.removeEventListeners()}enable(){this.enabled||(this.enabled=!0,this.addEventListeners())}disable(){0!=this.enabled&&(this.enabled=!1,this.removeEventListeners())}drop(e){e.target!=this&&!this.contains(e.target)||(e.preventDefault(),[...e.dataTransfer.files].forEach(e=>{this.onFileDrop&&this.onFileDrop(e),this.trigger("filedrop",e)}))}dragEnter(e){e.preventDefault(),this.overlay.classList.add("active")}dragLeave(e){e.preventDefault(),this.contains(e.relatedTarget)||this.overlay.classList.remove("active")}dragOver(e){e.preventDefault()}windowDragEnter(e){e.preventDefault(),e.relatedTarget&&e.relatedTarget.getRootNode()==this.getRootNode()||(this.overlay.classList.remove("active"),this.append(this.overlay))}windowDragLeave(e){e.preventDefault(),e.relatedTarget&&e.relatedTarget.getRootNode()==this.getRootNode()||this.overlay.remove()}windowDrop(e){e.preventDefault(),this.overlay.remove()}static style=`
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
    `}window.customElements.define(ht.tagName,ht);class n extends i{static tagName="komp-spreadsheet-cell";static assignableAttributes={readonly:!1};constructor(e,...t){super(e,...t),this.tabIndex=0,this.addEventListener("focusin",this.onFocusIn),this.addEventListener("focusout",this.onFocusOut),null!=e.disabled&&this.toggleAttribute("disabled",e.disabled)}onFocusIn(e){this.focusCell=w(this.table.tagName+"-focus"),this.focusCell.classList.toggle("frozen",this.classList.contains("frozen")),this.focusCell.classList.toggle("readonly",this.readonly),this.focusCell.style.setProperty("grid-column",this.cellIndex),this.groupIndex&&this.focusCell.style.setProperty("grid-row",this.groupIndex),this.parentElement.append(this.focusCell);var t=parseInt(h(this.focusCell,"outline-width"));const i=this.table.scrollLeft+this.table.frozenLeft,r=this.table.scrollTop+this.table.header.offsetHeight,n=this.table.scrollLeft+this.table.clientWidth,s=this.table.scrollTop+this.table.clientHeight,o=this.focusCell.offsetLeft-t,a=this.focusCell.offsetTop-t,l=this.focusCell.offsetLeft+this.focusCell.offsetWidth+t,c=this.focusCell.offsetTop+this.focusCell.offsetHeight+t;t={left:0,top:0};o<i?t.left=o-i:l>n&&(t.left=l-n),a<r?t.top=a-r:c>s&&(t.top=c-s),this.table.scrollBy(t)}onFocusOut(e){this.focusCell.remove(),delete this.focusCell}focusAdjacentCell(e){let t=this.cellIndex,i=this.rowIndex,r=this.groupIndex;"up"==e||"down"==e?i+="up"==e?-1:1:t+="left"==e?-1:1,r&&("up"==e?1==r?r=-1:(r--,i=this.rowIndex):"down"==e&&(r==this.parentElement.rowCount?r=1:(r++,i=this.rowIndex)));var n,s=this.table.at(t,i,r);return s&&(this.table.style.setProperty("scroll-snap-type","unset"),n=s.getBoundingClientRect(),this.table.getBoundingClientRect(),e=["left","up"].includes(e)?[n.x+1,n.y+1]:[n.x+n.width-1,n.y+n.height-1],document.elementFromPoint(...e),s.focus({preventScroll:!0}),this.table.style.removeProperty("scroll-snap-type")),s}async activate(t={}){if(!this.readonly&&void 0!==this.spawnInput&&null!==this.spawnInput){const i=await this.spawnInput(t);if(this.table.inputCell&&(this.table.inputCell.beforeRemove(),this.table.inputCell.remove(),delete this.table.inputCell),void 0!==(this.table.inputCell=i)&&null!==i&&!1!==i){i.style.setProperty("--remaining-width",this.table.offsetWidth-this.offsetLeft+"px"),i.style.setProperty("--remaining-height",this.table.offsetHeight-this.offsetTop+"px"),o(this,i),this.tabIndex=-1,i.beforeRemove=()=>{this.tabIndex=0,this.render()};let e=i.querySelector("[autofocus]");return(e=e||i.querySelector("input, textarea, select, [contenteditable]"))&&(t=()=>{e.focus(),e.showPicker&&e.showPicker()},e._loading&&e._loading instanceof Promise?e._loading.then(t):t()),i.addEventListener("keyup",e=>{"Escape"==e.key?(i.setAttribute("preventChange",!0),this.focus(),e.preventDefault()):this.table._enterDown||"Enter"!=e.key||![e.metaKey,e.ctrlKey,e.altKey,e.shiftKey].every(e=>0==e)||this.focusAdjacentCell("down")||this.focus()}),i.addEventListener("mousedown",e=>{i.contains(e.target)&&(i.clickedInside=!0,window.addEventListener("mouseup",e=>{delete i.clickedInside,i.contains(e.target)||this.focus()},{once:!0}))}),i.addEventListener("focusout",e=>{i.contains(e.relatedTarget)||i.clickedInside||(i.beforeRemove(),void 0!==i.checkValidity&&!i.checkValidity())||i.remove()}),i}}}createInput(e){return this.column.input(this.record,this,e)}async spawnInput(e){e=await this.createInput(e);return e&&w("komp-spreadsheet-input",{class:this.column.frozen?"frozen":"",style:{"grid-column":this.cellIndex,"grid-row":h(this,"grid-row")},content:{tag:"label",content:e,class:this.column.class,style:{"--padding":h(this,"padding")}}})}canCopy(){return!!this.column.copy}copy(){return this.column.copy(this)}canPaste(){return!!this.column.paste}paste(e){return this.column.paste(this,e)}clear(){this.column.clear(this),this.render()}contextMenu(e){return this.column?.contextMenu(e,this,this.column)}}window.customElements.define(n.tagName,n);class dt extends n{static tagName="komp-spreadsheet-header-cell";render(){return s(this,d(this.column,"header",this)),this}createInput(){if(this.column.headerEditable)return r.create("contentarea",Object.assign({record:this.column,attribute:"header"}))}canCopy(){return!0}copy(){return d(this.column,"header",this)}canPaste(){return!0}paste(e){return this.column.header=e}connected(){super.connected(),this.column.frozen&&this.table.observeResize(this)}disconnected(){this.column.frozen&&this.table.unobserveResize(this)}}window.customElements.define(dt.tagName,dt);class P extends it{static Cell=n;static HeaderCell=dt;static assignableAttributes={type:null,attribute:null,headerEditable:!0};static assignableMethods=["input","copy","paste"];initialize(e){this.configuredContextMenu=e.contextMenu,this.inputOptions=e.input}headerFallback(){return this.attribute}render(e){e=d(e,this.attribute);return e&&"string"==typeof e?e.replaceAll("\n","<br>"):e}copy(e){return d(e.record,this.attribute)}static pasteAccepts=["text/plain"];paste(e,t){e.record[this.attribute]=t}clear(e){e.record[this.attribute]=null}input(e,t,i){return r.create(this.type||"contentarea",Object.assign({record:e,attribute:this.attribute},this.inputOptions,i))}contextMenu(e,...t){return this.configuredContextMenu?this.configuredContextMenu(e,...t):e}}class ut extends P{paste=void 0;renderCell(e,t={}){return t.readonly=!0,super.renderCell(e,t)}}class pt extends P{static assignableAttributes={type:"number"};async paste(e,t){var i=parseFloat(t);return isNaN(i)?super.paste(e,t):super.paste(e,i)}}class mt extends P{static assignableAttributes={type:"checkbox"};input(e,t){t=t.querySelector("input");t.checked=!t.checked,q(t,"change")}render(e){return w("label",{content:r.create(this.type,Object.assign({record:e,attribute:this.attribute,name:this.attribute},this.inputOptions))})}paste(e,t){return super.paste(e,!!t)}}class gt extends P{static inputAttributes=["options"];static assignableAttributes={type:"select"};constructor(e){super(e),this.options=e.options}async input(e){return r.create(this.type,Object.assign({record:e,attribute:this.attribute,options:this.options},this.inputOptions))}}function ft(e){e.cellsDimensions=function(e){var t=this.querySelectorAll(this.tagName+"-cell"),t=t.item(t.length-1);return{width:t.offsetLeft+t.offsetWidth,height:t.offsetTop+t.offsetHeight}[e]}}function vt(e){this.include(ft),this.events.push("columnResize","rowResize"),this.assignableAttributes.resize=!0,this.assignableAttributes.resizeMin=5;const t=e.initialize,i=(e.initialize=function(...e){return!0===this.resize?this.resize=["columns","rows"]:!1===this.resize?this.resize=[]:"string"==typeof this.resize&&(this.resize=[this.resize]),this.addEventListenerFor(this.cellSelector,"mouseover",()=>{this.clearResizeHandles()}),this.addEventListener("mouseleave",()=>{this.clearResizeHandles()}),this.addEventListenerFor(".resizable","mouseover",e=>{this.showResizeHandleFor(e.delegateTarget)}),t.call(this,...e)},this.columnTypeRegistry.default.assignableAttributes.resize=!0,e.renderColumnHeader);e.renderColumnHeader=function(e,...t){t=i.call(this,e,...t);return this.resize.includes("columns")&&0!=e.resize&&t.classList.add("resizable","resizable-column"),t},e.clearResizeHandles=function(){this.resizing||this.querySelectorAll(this.tagName+"-resize-handle").forEach(e=>e.remove())},e.showResizeHandleFor=function(r){this.resizing||(this.clearResizeHandles(),["column","row"].forEach(e=>{var t,i;r.classList.contains("resizable-"+e)&&(t=c(this.tagName+"-resize-handle",{class:"resizable-"+e,content:[{tag:"handle-start"},{tag:"handle-end"}],style:{"grid-column":r.cellIndex,"grid-row":r.rowIndex}},"pointerdown",this.activateAxisResize.bind(this)),r.classList.contains("frozen")&&t.classList.add("frozen","frozen-"+r.cellIndex),(i="column"==e?r:r.row).previousElementSibling&&i.previousElementSibling.classList.contains("resizable-"+e)||t.querySelector("handle-start").remove(),t.cell=r,this.append(t))}))},e.activateAxisResize=function(e){this.setPointerCapture(e.pointerId),this.resizing=!0;var t=e.target.parentElement,i=this.getBoundingClientRect();let r=t.cell,{direction:n,axis:s,axisMin:o,axisMax:a,offset:l,slice:c,start:h,blockDimension:d,inlineDimension:u}=("handle-start"==e.target.localName&&(r=t.classList.contains("resizable-row")?this.at(r.cellIndex,r.rowIndex-1):r.previousElementSibling),t.classList.contains("resizable-row")?{direction:"Row",axis:"y",axisMin:r.offsetTop+this.resizeMin,axisMax:this.scrollHeight,offset:this.scrollTop-i.top,slice:r.row,start:e.y-r.offsetHeight,blockDimension:"width",inlineDimension:"height",inlinePosition:"Top",index:"rowIndex"}:{direction:"Column",axis:"x",axisMin:r.offsetLeft+this.resizeMin,axisMax:this.scrollWidth,offset:this.scrollLeft-i.left,slice:r.column,start:e.x-r.offsetWidth,blockDimension:"height",inlineDimension:"Width",inlinePosition:"Left",index:"cellIndex"});this.classList.add("resizing-"+n.toLowerCase());t=Array.from(this.querySelectorAll(this.constructor.Header.tagName+" > .selected"));let p;p=t.includes(r)?x(t.map(e=>"Column"==n?e.column:e.row)):(this.clearSelectedCells&&this.clearSelectedCells(),this.selectCells&&this.selectCells(r),[c]),this.clearOutlines&&this.clearOutlines();const m=w(this.constructor.tagName+"-drag-indicator",{class:n.toLowerCase(),style:{"inset-inline-start":e[s]+l+"px","block-size":this.cellsDimensions(d)+"px"}});function g(e){e=e[s]+l,e=Math.max(e,o);e=Math.min(e,a),m.style.insetInlineStart=e+"px"}this.append(m),this.addEventListener("pointermove",g),this.addEventListener("pointerup",e=>{let t=e[s]-h;t=Math.max(t,this.resizeMin),p.forEach(e=>{e[u.toLowerCase()]=t+"px"}),this.trigger(n.toLowerCase()+"Resize",{detail:{[n.toLowerCase()+"s"]:p}}),m.remove(),this.removeEventListener("pointermove",g),this.resizing=!1,this.classList.remove("resizing-"+n.toLowerCase()),this.releasePointerCapture(e.pointerId)},{once:!0})},Array.isArray(this.style)||(this.style=[this.style]),this.style.push(()=>`
        ${this.tagName} {
            --select-color: #1a73e8;
            --handle-size: 10px;
        }
        ${this.tagName}.resizing-column,
        ${this.tagName}.resizing-row {
            user-select: none;
            -webkit-user-select: none;
        }
        ${this.tagName}.resizing-column {
            cursor: col-resize !important;
        }
        ${this.tagName}.resizing-row {
            cursor: row-resize !important;
        }
        ${this.tagName}.resizing-row komp-spreadsheet-header-cell,
        ${this.tagName}.resizing-row komp-spreadsheet-cell {
            cursor: row-resize !important;
        }
        
        ${this.tagName}-header,
        ${this.tagName}-cell {
            user-select: none;
            -webkit-user-select: none;
        }
        ${this.tagName}-resize-handle {
            pointer-events: none;
            position: sticky;
            inset-block-start: 0;
            pointer-events: none;
            display: grid;
            grid-template-columns: auto auto;
            justify-content: space-between;
            align-items: center;
            cursor: col-resize;
        }
        ${this.tagName}-resize-handle.resizable-row {
            writing-mode: vertical-lr;
            cursor: row-resize;
        }
        ${this.tagName}-resize-handle handle-start,
        ${this.tagName}-resize-handle handle-end {
            pointer-events: auto;
            display: block;
            pointer-events: auto;
            block-size: 50%;
            max-block-size: 2em;
            inline-size: 11px;
            border: 3px none currentColor;
            border-inline-style: solid;
            opacity: 0.2;
            position: relative;
        }
        ${this.tagName}-resize-handle handle-start {
            grid-column: 1;
            inset-inline-start: -6px;
        }
        ${this.tagName}-resize-handle handle-end {
            grid-column: 2;
            inset-inline-end: -6px;
        }
        ${this.tagName}-resize-handle handle-start:hover,
        ${this.tagName}-resize-handle handle-end:hover {
            opacity: 1;
            border-color: var(--select-color);
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
        ${this.tagName}-resize-handle      { z-index: 200; }
        ${this.tagName}-drag-indicator     { z-index: 200; }
    `)}function yt(e){this.include(ft),this.events.push("columnReorder","rowReorder"),this.assignableAttributes.reorder=!0;const t=e.initialize,i=(e.initialize=function(...e){return!0===this.reorder?this.reorder=["columns","rows"]:!1===this.reorder?this.reorder=[]:"string"==typeof this.reorder&&(this.reorder=[this.reorder]),this.addEventListenerFor(this.cellSelector,"mouseover",()=>{this.clearReorderHandles()}),this.addEventListener("mouseleave",()=>{this.clearReorderHandles()}),this.addEventListenerFor(".reorderable","mouseover",e=>{this.showReorderHandleFor(e.delegateTarget)}),t.call(this,...e)},this.columnTypeRegistry.default.assignableAttributes.reorder=!0,e.renderColumnHeader),r=(e.renderColumnHeader=function(e,...t){t=i.call(this,e,...t);return this.reorder.includes("columns")&&0!=e.reorder&&t.classList.add("reorderable","reorderable-column"),t},this.columnTypeRegistry.default.prototype.renderCell);this.columnTypeRegistry.default.prototype.renderCell=async function(...e){e=await r.call(this,...e);return this.table.reorder.includes("rows")&&(e.classList.toggle("reorderable",1==e.cellIndex),e.classList.add("reorderable-row")),this.table.reorder.includes("columns")&&0!=this.reorder&&e.classList.add("reorderable-column"),e},e.clearReorderHandles=function(){this.reordering||this.querySelectorAll(this.tagName+"-reorder-handle").forEach(e=>e.remove())},e.showReorderHandleFor=function(t){this.reordering||(this.clearReorderHandles(),["column","row"].forEach(e=>{t.classList.contains("reorderable-"+e)&&(e=c(this.tagName+"-reorder-handle",{class:"reorderable-"+e,content:{horizontal:"row"==e}.horizontal?`
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        	 viewBox="0 0 2 18" xml:space="preserve" width="2" height="18" fill="currentColor" preserveAspectRatio="xMidYMid meet">
        <circle cy="6" cx="1" r="1"/>
        <circle cy="10" cx="1" r="1"/>
        <circle cy="14" cx="1" r="1"/>
        </svg>
        `:`
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    	 viewBox="0 0 24 2" xml:space="preserve" width="24" height="2" fill="currentColor" preserveAspectRatio="xMidYMid meet">
    <circle cy="1" cx="6" r="1"/>
    <circle cy="1" cx="12" r="1"/>
    <circle cy="1" cx="18" r="1"/>
    </svg>
    `,style:{"grid-column":t.cellIndex,"grid-row":t.rowIndex}},"pointerdown",this.activateAxisReorder.bind(this)),t.classList.contains("frozen")&&e.classList.add("frozen","frozen-"+t.cellIndex),e.cell=t,this.append(e))}))},e.activateAxisReorder=function(e){this.setPointerCapture(e.pointerId);const r=this.getRootNode(),n=(this.reordering=!0,this.classList.add("reordering"),e.currentTarget);e=n.cell;const s=this.getBoundingClientRect();let{slice:t,direction:o,index:a,sliceIndex:l,axis:c,inlinePosition:h,inlineDimension:d,blockDimension:i}=n.classList.contains("reorderable-row")?{slice:e.row,direction:"Row",index:"rowIndex",sliceIndex:"rowIndex",inverseDirection:"Column",axis:"y",inlinePosition:"Top",inlineDimension:"Height",blockDimension:"Width"}:{slice:e.column,direction:"Column",index:"cellIndex",sliceIndex:"index",inverseDirection:"Row",axis:"x",inlinePosition:"Left",inlineDimension:"Width",blockDimension:"Height"},u,p;if((p=this.selectedCells?Array.from(this.querySelectorAll(this.constructor.Header.tagName+" > .selected")):p)&&p.includes(e)){let i=(u=x(p.map(e=>"Column"==o?e.column:e.row)))[0];u=u.filter((e,t)=>e[l]-i[l]<=1&&(i=e,!0))}else u=[t];this.clearSelectedCells&&this.clearSelectedCells(),u.forEach(e=>e.cells.forEach(e=>{e.classList.add("selected"),e.cells.forEach(e=>e.classList.add("selected"))})),this.selectedCells&&this.outlineCells(this.selectedCells());const m=Math.min(...u.map(e=>e[l])),g=(n.style.inlineSize=u.map(e=>e["offset"+d]).reduce((e,t)=>e+t)+"px",n.style.blockSize=this.cellsDimensions(i.toLowerCase())+"px",n.style.insetInlineStart=n["offset"+h]+"px",n.style.removeProperty("grid-area"),n.classList.add("reordering"),w(this.constructor.tagName+"-placement-indicator",{class:o.toLowerCase(),style:{["grid-"+o.toLowerCase()]:m}})),f=(g[a]=m,this.append(g),this.cellSelector.split(", ").map(e=>e+(".reorderable-"+o.toLowerCase())));let v,y=!1;const b=e=>{var t=r.elementsFromPoint(e.x,e.y).find(e=>e.matches(f.join(",")))||v,e=(v=t,e[c]-s[h.toLowerCase()]-n["offset"+d]/2+this["scroll"+h]);if(e=(e=e<0?0:e)>this["scroll"+d]-n["offset"+d]?this["scroll"+d]-n["offset"+d]:e,n.style.insetInlineStart=e+"px",t){e=t[a]+(m<t[a]?1:0);if(g[a]!=e){if(y)return;let e=this["scroll"+h];!n.cell.frozen&&this.frozenLeft&&"Column"==o&&(e+=this.frozenLeft),e+=.05*this["client"+d];var i=this["scroll"+h]+.95*this["client"+d];t["offset"+h]+t["offset"+d]>i?(y=!0,this.scrollBy({[h.toLowerCase()]:t["offset"+d]})):t["offset"+h]<e&&(y=!0,this.scrollBy({[h.toLowerCase()]:-1*t["offset"+d]})),y&&setTimeout(()=>y=!1,100)}g[a]=e,g.style["grid-"+o.toLowerCase()]=e}};this.addEventListener("pointermove",b),this.addEventListener("pointerup",async e=>{var t;g[a]!=m&&(t=g[a]-(m<g[a]?u.length:0),"Column"==o?(this.columns.splice(m-1,u.length),await this.insertColumns(t,...u)):(u.forEach(e=>e.remove()),await this.appendRow(t,...u)),this.trigger(o.toLowerCase()+"Reorder",{detail:{fromIndex:m-1,toIndex:t-1}})),this.selectedCells&&(this.clearOutlines(),this.outlineCells(this.selectedCells())),g.remove(),this.removeEventListener("pointermove",b),this.classList.remove("reordering"),this.reordering=!1,this.showReorderHandleFor(n.cell),this.releasePointerCapture(e.pointerId)},{once:!0})},Array.isArray(this.style)||(this.style=[this.style]),this.style.push(()=>`
        ${this.tagName} {
            --select-color: #1a73e8;
            --handle-size: 10px;
            user-select: none;
        }
        ${this.tagName}.reordering {
            cursor: grabbing !important;
            user-select: none;
            -webkit-user-select: none;
        }
        ${this.tagName}.reordering komp-spreadsheet-header-cell,
        ${this.tagName}.reordering komp-spreadsheet-cell {
            cursor: grabbing !important;
        }
        ${this.tagName}-reorder-handle {
            position: sticky;
            inset-block-start: 0;
            pointer-events: none;
        }
        ${this.tagName}-reorder-handle.reorderable-row {
            writing-mode: vertical-lr;
        }
        ${this.tagName}-reorder-handle > svg {
            pointer-events: auto;
            inline-size: 100%;
            block-size: var(--handle-size);
            display: flex;
            cursor: grab;
            justify-content: center;
            padding-block: 4px;
        }
        ${this.tagName}-reorder-handle > svg:hover {
            background: rgba(26, 115, 232, 0.1);
        }
        ${this.tagName}-reorder-handle.reordering {
            position: absolute;
            background: rgba(0,0,0, 0.2);
            block-size: 100%;
            pointer-events: none;
            cursor: grabbing;
            pointer-events: none;
        }
        ${this.tagName}-reorder-handle.reordering > svg {
            pointer-events: none;
        }

        ${this.tagName}-placement-indicator {
            position: relative;
            inset-inline-start: -2px;
            pointer-events: none;
            inline-size: 3px;
            background: var(--select-color);
            z-index: 200;
            grid-row: 1 / -1;
        }
        ${this.tagName}-placement-indicator.row {
            writing-mode: vertical-lr;
            grid-column: 1 / -1;
        }
        ${this.tagName}-reorder-handle     { z-index: 200; }
    `)}class bt extends t{static tagName="komp-table-toggle";static assignableAttributes=["column","cellIndex"];cellIndexChanged(e,t){this.style.gridColumn=t}connected(){this.column.toggles.add(this)}disconected(){this.column.toggles.delete(this)}}window.customElements.define(bt.tagName,bt);class wt extends st{static tagName="komp-spreadsheet";static assignableAttributes={scrollSnap:!1};static columnTypeRegistry={select:gt,number:pt,checkbox:mt,radio:mt,readonly:ut,default:P};static events=["invalidPaste"];_copyData;initialize(){return this.scrollSnap&&this.classList.add("scroll-snap"),this.addEventListenerFor(this.cellSelector,"mousedown",e=>{0==e.button&&(this.clearSelectedCells(),this.activateMouseCellSelection(e.delegateTarget,e))}),this.addEventListenerFor(this.cellSelector,"dblclick",e=>{e.delegateTarget.activate()}),this.addEventListenerFor(this.tagName+"-reorder-handle",["click","contextmenu"],e=>{this.activateContextMenu(e),e.preventDefault()}),this.addEventListenerFor(this.cellSelector,"contextmenu",e=>{this.activateContextMenu(e),e.delegateTarget.classList.contains("selected")||(this.clearSelectedCells(),this.selectCells(e.delegateTarget,e.delegateTarget,!0)),e.preventDefault()}),this.addEventListenerFor(this.cellSelector,"keydown",async t=>{var e;["ArrowRight","ArrowLeft","ArrowDown","ArrowUp"].includes(t.key)?(t.preventDefault(),e=t.delegateTarget.focusAdjacentCell(t.key.replace("Arrow","").toLowerCase()),t.shiftKey?(this.selectStartCell=this.selectStartCell||t.delegateTarget,this.selectCells(this.selectStartCell,e,!0)):this.clearSelectedCells()):"Enter"==t.key&&t.delegateTarget==this.getRootNode().activeElement?(t.preventDefault(),t.delegateTarget.activate(),this._enterDown=!0,this.addEventListener("keyup",e=>{delete this._enterDown},{once:!0})):"Tab"==t.key?(t.preventDefault(),t.delegateTarget.focusAdjacentCell(t.shiftKey?"left":"right")):"Escape"==t.key?this.clearSelectedCells(""):["Backspace","Delete","Clear"].some(e=>e==t.key)?t.delegateTarget.clear():1==t.key.length&&[t.metaKey,t.ctrlKey,t.altKey].every(e=>0==e)&&(t.delegateTarget.activate({value:t.key}),t.preventDefault())}),super.initialize()}connected(...e){if(this.getRootNode())return this.cleanupEventListenerFor(this.getRootNode(),"paste",e=>{this.contains(document.activeElement)&&document.activeElement instanceof n&&(e.preventDefault(),0<e.clipboardData.files.length?this.pasteData(e.clipboardData.files):this.pasteData(e.clipboardData.getData("text/plain")))}),this.cleanupEventListenerFor(this.getRootNode(),"copy",e=>{this.contains(document.activeElement)&&document.activeElement instanceof n&&(e.preventDefault(),this.copyCells())}),super.connected(...e)}selectCells(e,t,i=!1){null==t&&(t=e),e.localName.includes("header")||t.localName.includes("header");const r=i?"selected":"selecting";this.queryCells("."+r).forEach(e=>e.classList.remove(r)),this.querySelectorAll(this.localName+"-outline:not(.copy)").forEach(e=>e.remove()),(t=e.localName.includes("header")?this.at(t.cellIndex,this.rows.length):t).localName.includes("header")&&(e=this.at(e.cellIndex,this.rows.length));e=this.slice(e,t);e.forEach(e=>{e.classList.add(r)}),i&&this.outlineCells(e)}selectedCells(){let e=this.queryCells(".selected");return e=0==e.length?this.queryCells(":focus"):e}clearSelectedCells(e=":not(.copy)"){delete this.selectStartCell,this.queryCells(".selecting"+e).forEach(e=>e.classList.remove("selecting")),this.queryCells(".selected"+e).forEach(e=>e.classList.remove("selected")),this.clearOutlines(e),this.inputCell&&(this.inputCell.beforeRemove(),this.inputCell.remove(),delete this.inputCell)}activateMouseCellSelection(t,e){var i=t.localName.includes("header");const r=e=>{e=U(e.target,this.cellSelector);e&&this.selectCells(t,e)};var n;e.shiftKey?(n=t,t=(t=this.queryCell(":focus"))||this.queryCell(".selecting"),e.preventDefault(),r({target:n})):i&&r({target:t}),this.getRootNode().addEventListener("mouseup",e=>{var e=U(e.target,this.cellSelector);e==t&&!e.localName.includes("header")||((e=this.queryCells(".selecting")).forEach(e=>{e.classList.remove("selecting"),e.classList.add("selected")}),this.outlineCells(e)),this.removeEventListener("mouseover",r),t.focus()},{once:!0}),this.addEventListener("mouseover",r)}clearOutlines(e=":not(.copy)"){this.querySelectorAll(this.localName+"-outline"+e).forEach(e=>e.remove())}outlineCells(e){x((e=Array.isArray(e)?e:Array.from(e)).map(e=>e.parentElement.dataset.name));var t=Math.min(...e.map(e=>e.offsetLeft)),i=Math.min(...e.map(e=>e.offsetTop)),r=Math.max(...e.map(e=>e.offsetLeft+e.offsetWidth)),e=Math.max(...e.map(e=>e.offsetTop+e.offsetHeight)),r=w(this.localName+"-outline",{style:{left:t+"px",top:i+"px",width:r-t+"px",height:e-i+"px"}});return this.append(r),r}activateContextMenu(e){var t=e.delegateTarget.cell||e.delegateTarget,i=this.renderContextMenu(t),r=e.target.getBoundingClientRect();this.contextMenu&&(this.contextMenu.hide(),delete this.contextMenu),this.contextMenu=new Ve({content:i,anchor:t,offset:{mainAxis:e.offsetX-r.width,crossAxis:e.offsetY},placement:"right-start",shift:!1,flip:!0,autoPlacement:!1,removeOnBlur:!0,autoUpdate:!1}),this.append(this.contextMenu)}renderContextMenu(e){if(e.contextMenu)return e.contextMenu(w("komp-spreadsheet-context-menu",{content:[c("button",{name:"copy",type:"button",content:"Copy",disabled:!e.canCopy||!e.canCopy()},e=>{this.copyCells(),this.contextMenu&&(this.contextMenu.remove(),delete this.contextMenu)}),c("button",{name:"paste",type:"button",content:"Paste",disabled:!e.canPaste||!(e.canPaste()&&(null!=window.navigator.clipboard.readText||this.copyData))},async e=>{null==window.navigator.clipboard.readText?this.pasteData(this.copyData):this.pasteData(await window.navigator.clipboard.readText()),this.contextMenu&&(this.contextMenu.remove(),delete this.contextMenu)})]}))}async copyCells(){var e=Array.from(this.selectedCells()).filter(e=>e.canCopy()),t=Object.values(K(e,"rowIndex")).map(async e=>(await Promise.all(e.map(async e=>{e=await e.copy();return"string"==typeof e&&(e.includes("\n")||e.includes("\t"))?'"'+e+'"':e}))).join("\t")),t=(await Promise.all(t)).join("\n");window.navigator.clipboard.writeText(t),this._copyData=t,this.clearSelectedCells(""),this.outlineCells(e).classList.add("copy")}pasteData(e){if(null!=e){var t=Object.values(K(Array.from(this.selectedCells()).filter(e=>e.canPaste()),"rowIndex"));let o;o="string"==typeof e?Y(e,"\n").map(e=>Y(e,"\t")):[[e]],t.forEach((e,t)=>{const s=t%o.length;e.forEach(async(e,t)=>{if(e.paste){var t=t%o[s].length,i=o[s][t];if("string"==typeof i)e.column.constructor.pasteAccepts.some(e=>"text/plain".match(new RegExp(e)))?await e.paste(i):this.trigger("invalidPaste",{detail:i});else{if(!(i instanceof FileList))return;var r=[];for(const n of i)e.column.constructor.pasteAccepts.some(e=>n.type.match(new RegExp(e)))?r.push(n):this.trigger("invalidPaste",{detail:i});0<r.length&&await e.paste(r)}e.render()}})}),this.querySelector(this.localName+"-outline.copy")?.remove()}}static style=`
        komp-spreadsheet {
            --select-color: #1a73e8;
            --scroll-start: 0px;
            overflow: auto;
            scroll-behavior: smooth;
        }
        komp-spreadsheet.scroll-snap {
            scroll-snap-type: both mandatory;
            scroll-padding-inline-start: var(--scroll-start);
        }
        komp-spreadsheet.scroll-snap komp-spreadsheet-cell {
            scroll-snap-stop: always;
            scroll-snap-align: start;
        }
        
        komp-spreadsheet-header-cell,
        komp-spreadsheet-cell {
            cursor: cell;
            user-select: none;
            position: relative;
        }
        komp-spreadsheet-focus {
            outline: 2px solid var(--select-color);
            outline-offset: -1px;
            pointer-events: none !important;
            grid-row: 1;
        }
        komp-spreadsheet-focus.frozen {
            position: sticky;
        }
        komp-spreadsheet-focus.readonly {
            outline-color: var(--disabled-color, #cecece)
        }
        
        komp-spreadsheet-cell.selected::after,
        komp-spreadsheet-cell.selecting::after {
            content: '';
            position: absolute;
            inset: 0;
            background: rgba(26, 115, 232, 0.1);
            z-index: 30;
            pointer-events: none;
        }
        komp-spreadsheet komp-table-header > *:focus,
        komp-spreadsheet komp-table-header > *.selecting,
        komp-spreadsheet komp-table-header > *.selected {
            box-shadow: inset 0 2px 0 0 rgba(26, 115, 232, 1), inset 0 0 0 999px rgba(26, 115, 232, 0.1);
            outline: none !important;
        }
        
        komp-spreadsheet-input {
            position: relative;
        }
        komp-spreadsheet-input > label {
            position: absolute;
            top: 0;
            left: 0;
            width: auto;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 100%;
            min-width: 100%;
            background: white;
            box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.35);
            outline: 2px solid var(--select-color);
            outline-offset: -1px;
        }
        komp-spreadsheet-input > label > input,
        komp-spreadsheet-input > label > textarea,
        komp-spreadsheet-input > label > select,
        komp-spreadsheet-input > label > komp-content-area {
            background: none;
            width: auto;
            min-height: 100%;
            min-width: 100%;
            outline: none;
            padding: var(--padding, unset);
            border: none;
        }
        komp-spreadsheet-input komp-content-area {
            width: max-content;
            max-width: var(--remaining-width);
            max-height: var(--remaining-height);
        }
        komp-spreadsheet-input > label > input {
            width: 1px; // make so doesn't initially overflow column
        }
        
        komp-spreadsheet-context-menu {
            display: block;
            border-radius: 0.35em;
            background: white;
            padding: 0.5em;
            font-size: 0.8em;
            box-shadow: 0 2px 12px 2px rgba(0,0,0, 0.2), 0 1px 2px 1px rgba(0,0,0, 0.3);
        }
        komp-spreadsheet-context-menu > button {
            display: block;
            width: 100%;
            outline: none;
            appearance: none;
            border: none;
            background:none;
            padding: 0.2em 0.5em;
            border-radius: 0.25em;
        }
        komp-spreadsheet-context-menu > button:disabled {
            opacity: 0.5;
        }
        komp-spreadsheet-context-menu > button:disabled:hover {
            background: white;
            color: inherit;
        }
        komp-spreadsheet-context-menu > button:focus,
        komp-spreadsheet-context-menu > button:hover {
            background: rgba(26, 115, 232, 0.2);
        }
        komp-spreadsheet-context-menu > button:hover {
            color: var(--select-color);
        }
        
        komp-spreadsheet-outline {
            position: absolute;
            pointer-events: none;
            outline: 1px solid var(--select-color);
        }
        komp-spreadsheet-outline.copy {
            outline: 2px dashed var(--select-color);
        }
        
        
        komp-spreadsheet-cell               { z-index: 1; }
        komp-spreadsheet-focus              { z-index: 25; }
        komp-spreadsheet-input              { z-index: 26; }

        komp-spreadsheet-cell.frozen                   { z-index: 100; }
        komp-spreadsheet-focus.frozen                  { z-index: 101; }
        komp-spreadsheet-input.frozen                  { z-index: 102; }
        komp-spreadsheet komp-table-header             { z-index: 110; }
        komp-spreadsheet komp-table-header > .frozen   { z-index: 111; }
        
        komp-spreadsheet-outline            { z-index: 201; }
        komp-spreadsheet komp-floater       { z-index: 300; }
        komp-spreadsheet komp-tooltip       { z-index: 300; }
    `}wt.include(vt),wt.include(yt),window.customElements.define(wt.tagName,wt);var xt=Object.freeze({__proto__:null,AutoGrid:G,ContentArea:Ke,Dropdown:at,Dropzone:ht,Element:t,Floater:Ve,Input:r,Modal:X,NotificationCenter:ct,Spreadsheet:wt,Table:st,Tooltip:ot});Object.keys(xt).forEach(e=>{window[e]=xt[e]}),window.plugins={resizable:vt,reorderable:yt,collapsible:function(t){this.assignableAttributes.collapseTo="auto";const i=t.initialize,r=(t.initialize=function(...e){return this.collapseObserver=new ResizeObserver(e=>{e.forEach(e=>e.target.resize())}),i.call(this,...e)},t.collapseToChanged=function(e,t){this.style.setProperty("--collapseTo",t)},t.remove),n=(t.remove=function(...e){return t.collapseObserver.disconnect(),r.call(this,...e)},this.Row.prototype.initialize),s=(this.Row.prototype.initialize=function(...e){n.call(this,...e),this.expandedTarget=null,this.expandedTargets=new Set},this.Row.prototype.connected),o=(this.Row.prototype.connected=function(...e){s.call(this,...e),this.table.collapseObserver.observe(this)},this.Row.prototype.disconected),a=(this.Row.prototype.disconected=function(...e){o.call(this,...e),this.table.collapseObserver.unobserve(this)},this.Row.prototype.resetExpand=function(){this.style.removeProperty("--expandTo"),this.expandedTarget=Array.from(this.expandedTargets.values()).sort((e,t)=>t.scrollHeight-e.scrollHeight)[0],this.expandedTarget&&(this.expandedTarget.style.setProperty("max-height","unset"),this.style.setProperty("--expandTo",this.expandedTarget.scrollHeight+"px"),this.expandedTarget.style.removeProperty("max-height"))},this.Row.prototype.resize=function(){this.hasAttribute("collapsed");var e=this.toggleAttribute("collapsed",this.scrollHeight>this.clientHeight);this.querySelectorAll("komp-table-toggle").forEach(e=>e.remove()),this.querySelectorAll("[collapse-toggle]").forEach(e=>e.removeAttribute("collapse-toggle")),e&&this.cells.concat(Array.from(this.querySelectorAll(D.tagName))).filter(e=>e.scrollHeight>this.clientHeight).forEach(e=>{this.renderTargetToggles(e)}),this.expandedTarget&&this.renderTargetToggles(this.expandedTarget,!1)},this.Row.prototype.renderTargetToggles=function(t,i){t instanceof D?x(t.cells.map(e=>e.column)).forEach(e=>{this.renderToggle(e,t,i)}):this.renderToggle(t.column,t,i)},this.Row.prototype.renderToggle=function(e,t,i=!0){t.setAttribute("collapse-toggle",i?"expand":"collapse"),this.prepend(new bt({class:t.classList.contains("frozen")?" frozen":"",column:e,cellIndex:e.index,content:c({type:"button",content:`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${i?"expand":"collapse"}"><polyline points="1 1 7 7 13 1"></polyline></svg>`},e=>{i?this.expandedTargets.add(t):this.expandedTargets.clear(),this.resetExpand()})}))},this.columnTypeRegistry.default.prototype.indexChanged);this.columnTypeRegistry.default.prototype.indexChanged=function(e,t){a.call(this,e,t),this.toggles&&this.toggles.forEach(e=>e.cellIndex=t)},Array.isArray(this.style)||(this.style=[this.style]),this.style.push(()=>`
        ${this.tagName} {
            --collapseTo: auto;
        }
        komp-table-row,
        komp-table-toggle,
        komp-table-group,
        komp-table-row > komp-table-cell,
        komp-table-row > komp-spreadsheet-cell {
            max-height: var(--expandTo, var(--collapseTo));
        }
        komp-table-group[collapse-toggle],
        komp-table-cell[collapse-toggle],
        komp-spreadsheet-cell[collapse-toggle] {
            padding-bottom: 16px;
        }
        komp-table-row {
            overflow: clip;
        }
        komp-table-toggle {
            display: flex;
            flex-direction: column;
            justify-content: end;
            text-align: center;
            z-index: 2;
            grid-row: 1 / -1;
            pointer-events: none;
        }
        komp-table-toggle:hover {
            color: var(--select-color);
        }
        komp-table-toggle:hover svg {
            opacity: 1;
        }
        komp-table-toggle.frozen { z-index: 101}
        komp-table-toggle button {
            outline: none;
            appearance: none;
            border: none;
            padding: 0;
            margin: 0;
            text-decoration: none;
            color: inherit;
            pointer-events: auto;
            
            background: linear-gradient(rgba(255,255,255, 0), rgba(255,255,255, 0.7) 30%, white);
            cursor: pointer;
            font-size: 0.8em;
            
            padding: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        komp-table-toggle svg {
            display: inline-block;
            opacity: 0.5;
        }
        komp-table-toggle svg.collapse {
            transform: rotate(180deg)
        }
    `)}},document.addEventListener("DOMContentLoaded",function(){_(document,".js-toggle-source","click",e=>{document.querySelector(e.delegateTarget.getAttribute("rel")).classList.toggle("hide")})})}();