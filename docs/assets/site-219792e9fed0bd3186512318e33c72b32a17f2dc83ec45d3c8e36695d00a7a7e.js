!function(){"use strict";function s(t,i,e,s,n={}){(e=Array.isArray(e)?e:[e]).forEach(e=>{t.addEventListener(e,e=>{e.target.matches(i)?(e.delegateTarget=e.target,s(e)):e.target.closest(i)&&(e.delegateTarget=e.target.closest(i),s(e))},n)})}const D=["accept","accept-charset","accesskey","action","align","allow","alt","async","autocapitalize","autocomplete","autofocus","autoplay","background","bgcolor","border","buffered","capture","challenge","charset","checked","cite","class","code","codebase","color","cols","colspan","content","contenteditable","contextmenu","controls","coords","crossorigin","csp","data","data-*","datetime","decoding","default","defer","dir","dirname","disabled","download","draggable","dropzone","enctype","enterkeyhint","for","form","formaction","formenctype","formmethod","formnovalidate","formtarget","headers","height","hidden","high","href","hreflang","http-equiv","icon","id","importance","integrity","intrinsicsize","inputmode","ismap","itemprop","keytype","kind","label","lang","language","loading","list","loop","low","manifest","max","maxlength","minlength","media","method","min","multiple","muted","name","novalidate","open","optimum","pattern","ping","placeholder","popover","popovertarget","popovertargetaction","poster","preload","radiogroup","readonly","referrerpolicy","rel","required","reversed","rows","rowspan","sandbox","scope","scoped","selected","shape","size","sizes","slot","span","spellcheck","src","srcdoc","srclang","srcset","start","step","style","summary","tabindex","target","title","translate","type","usemap","value","width","wrap","aria","aria-*","xmlns"],H=["disabled","readOnly","multiple","checked","autobuffer","autoplay","controls","loop","selected","hidden","scoped","async","defer","reversed","isMap","seemless","muted","required","autofocus","noValidate","formNoValidate","open","pubdate","itemscope","indeterminate"],M=["accent-height","accumulate","additive","alignment-baseline","alphabetic","amplitude","arabic-form","ascent","attributeName","attributeType","azimuth","baseFrequency","baseline-shift","baseProfile","bbox","begin","bias","by","calcMode","cap-height","class","clip","clipPathUnits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","crossorigin","cursor","cx","cy","d","decelerate","descent","diffuseConstant","direction","display","divisor","dominant-baseline","dur","dx","dy","edgeMode","elevation","enable-background","end","exponent","fill","fill-opacity","fill-rule","filter","filterUnits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","format","from","fr","fx","fy","g1","g2","glyph-name","glyph-orientation-horizontal","glyph-orientation-vertical","glyphRef","gradientTransform","gradientUnits","hanging","height","href","hreflang","horiz-adv-x","horiz-origin-x","id","ideographic","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kernelMatrix","kernelUnitLength","kerning","keyPoints","keySplines","keyTimes","lang","lengthAdjust","letter-spacing","lighting-color","limitingConeAngle","local","marker-end","marker-mid","marker-start","markerHeight","markerUnits","markerWidth","mask","maskContentUnits","maskUnits","mathematical","max","media","method","min","mode","name","numOctaves","offset","opacity","operator","order","orient","orientation","origin","overflow","overline-position","overline-thickness","panose-1","paint-order","path","pathLength","patternContentUnits","patternTransform","patternUnits","ping","pointer-events","points","pointsAtX","pointsAtY","pointsAtZ","preserveAlpha","preserveAspectRatio","primitiveUnits","r","radius","referrerPolicy","refX","refY","rel","rendering-intent","repeatCount","repeatDur","requiredExtensions","requiredFeatures","restart","result","rotate","rx","ry","scale","seed","shape-rendering","slope","spacing","specularConstant","specularExponent","speed","spreadMethod","startOffset","stdDeviation","stemh","stemv","stitchTiles","stop-color","stop-opacity","strikethrough-position","strikethrough-thickness","string","stroke","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke-width","style","surfaceScale","systemLanguage","tabindex","tableValues","target","targetX","targetY","text-anchor","text-decoration","text-rendering","textLength","to","transform","transform-origin","type","u1","u2","underline-position","underline-thickness","unicode","unicode-bidi","unicode-range","units-per-em","v-alphabetic","v-hanging","v-ideographic","v-mathematical","values","vector-effect","version","vert-adv-y","vert-origin-x","vert-origin-y","viewBox","visibility","width","widths","word-spacing","writing-mode","x","x-height","x1","x2","xChannelSelector","xlink:actuate","xlink:arcrole","xlink:href Deprecated","xlink:role","xlink:show","xlink:title","xlink:type","xml:base","xml:lang","xml:space","y","y1","y2","yChannelSelector","z","zoomAndPan"];function o(e,t){e.innerHTML="",l(e,t)}function $(t,i={}){Object.keys(i).forEach(e=>function t(i,s,n){n instanceof Promise?n.then(e=>t(i,s,e)):!1?(n.addListener(e=>t(i,s,e)),"content"==s?o(i,n.value):t(i,s,n.value)):"value"==s?i.value=n:"data"==s&&"object"==typeof n?Object.keys(n).forEach(e=>{i.dataset[e]="object"==typeof n[e]?JSON.stringify(n[e]):n[e]}):"style"==s&&"object"==typeof n?Object.keys(n).forEach(t=>{let e=n[t];(e,!1)&&(e.addListener(e=>{null===e?i.style.removeProperty(t):i.style.setProperty(t,e)}),e=e.value),null===e?i.style.removeProperty(t):i.style.setProperty(t,e)}):"content"==s||"children"==s?o(i,n):s.match(/^on[a-z]/)?i[s]=n:H.find(e=>e.toUpperCase()==s.toUpperCase())?(s=H.find(e=>e.toUpperCase()==s.toUpperCase()),i[s]=!1!==n):(D.find(e=>s.match(new RegExp(e)))||M.includes(s))&&i.setAttribute(s,n)}(t,e,i[e]))}function w(e="div",t={},i){"object"==typeof e&&("string"==typeof t&&(i=t),e=(t=e).tag||"div");let s;return"svg"==e&&(t.xmlns=t.xmlns||"http://www.w3.org/2000/svg"),$(s=t.xmlns||i?document.createElementNS(t.xmlns||i,e):document.createElement(e),t),s}function a(e,t){if(Array.isArray(t)||t instanceof NodeList||t instanceof HTMLCollection){for(var i=Array.from(t);0<i.length;)e=a(e,i.pop());return e}if(Array.isArray(e)||e instanceof NodeList||e instanceof HTMLCollection)return a(e[0],t);if(e.parentNode)return t instanceof Node||(t=new Text(t)),e.parentNode.insertBefore(t,e),t;throw"argument of insertBefore unsupported"}function F(e){return e instanceof NodeList||e instanceof Array||e instanceof HTMLCollection?(e=Array.from(e)).forEach(F):e.parentNode.removeChild(e),e}function l(t,i,s,n,r){if(r=r||"append",Array.isArray(i)||i instanceof NodeList||i instanceof HTMLCollection){let e=Array.from(i);(e="prepend"==r?e.reverse():e).forEach(e=>l(t,e,s,n,r))}else if(s instanceof Element){let e=Array.from(arguments).slice(1).filter(e=>e instanceof Element);(e="prepend"==r?e.reverse():e).forEach(e=>l(t,e,void 0,n,r))}else if("boolean"!=typeof s&&(n=s,s=void 0),null!=i){var e;if(i instanceof Promise||i.then){const o=document.createElement("span");return t[r](o),i.then(e=>{l(o,e,s,n),a(o,o.childNodes),F(o)})}return i instanceof Element||i instanceof Node?t[r](i):"function"==typeof i?l(t,i.bind(n)(t),s,n):"object"==typeof i?t[r](w(i,t.namespaceURI)):s?t[r](i):((e=document.createElement("div")).innerHTML=i,t[r](...e.childNodes))}}function h(e,t){return getComputedStyle(e).getPropertyValue(t)}function c(e,t){if(Array.isArray(t)||t instanceof NodeList||t instanceof HTMLCollection){for(var i=Array.from(t);0<i.length;)e=c(e,i.shift());return e}if(Array.isArray(e)||e instanceof NodeList||e instanceof HTMLCollection)return c(e[e.length-1],t);if(e.parentNode)return t instanceof Node||(t=new Text(t)),e.parentNode.insertBefore(t,e.nextSibling),t;throw"argument of insertAfter unsupported"}function d(...e){let t=e.pop(),i=e.pop();"string"==typeof i||Array.isArray(i)||(e=e.concat(i),i="click"),"string"!=typeof e[0]&&e.unshift("button");const s=w(...e);return(i=Array.isArray(i)?i:[i]).forEach(e=>s.addEventListener(e,t)),s}function q(e,t,i){return i=Object.assign({bubbles:!0,cancelable:!0},i),e.dispatchEvent(new CustomEvent(t,i))}function B(e){return e&&e.constructor&&e.call&&e.apply}function W(e,t,i,s=!0){var[t,i]=[t,i].sort((e,t)=>e-t);return s?t<=e&&e<=i:t<e&&e<i}let U=0;function V(){return"komp-ref-"+ ++U}function r(e,t,...i){t=e[t];return B(t)?t.call(e,...i):t}function K(e,t){t(e);e=Object.getPrototypeOf(e);e&&K(e,t)}function e(e,t){let i=[];return K(e,e=>{e.hasOwnProperty(t)&&i.push(e[t])}),i}function x(e,t){if(!Array.isArray(e))return e;const i=[];return t=t||((e,t)=>!t.includes(e)),e.forEach(e=>{t(e,i)&&i.push(e)}),i}function Y(e,t){return e.matches?e.matches(t)?e:e.closest(t):null}function X(e,i){const s={};return e.forEach(e=>{let t;t=B(i)?s[i(e)]:r(e,i),s[t]=s[t]||[],s[t].push(e)}),s}function G(e,t){var i=[];let s=0,n="",r=!1;for(;s<e.length;){var o=e.at(s);'"'==o&&r&&e.at(s+1)==t?r=!1:'"'!=o||r||0!=s&&e.at(s-1)!=t?r||o!=t?n+=o:(i.push(n),n=""):r=!0,s++}return i.push(n),i}const J=new Set(["string","number","boolean"]);function Z(e){return(Array.isArray(e.type)?e.type:[e.type]).every(e=>J.has(e))}const Q=new FinalizationRegistry(e=>{for(const t of e)u.manifest.delete(t)});class u extends HTMLElement{static tagName="komp-element";static manifest=new Map;static assignableAttributes={};static assignableMethods=[];static bindMethods=[];static style="";static watch=[];static events=["afterRemove","beforeRemove","beforeConnect","afterConnect","beforeDisconnect","afterDisconnect"];static get observedAttributes(){return this.watch}static include(e){this._plugins||(this._plugins=[]),this._plugins.includes(e.name)||(this._plugins.push(e.name),e.call(this,this.prototype))}_assignableAttributes={};_attributes={};_refIds=[];_cleanupCallbacks=[];is_initialized=!1;constructor(o={}){super();const a=Object.assign({},o);e(this.constructor,"bindMethods").filter(e=>e).reverse().forEach(e=>{e.forEach(e=>{this[e]=this[e].bind(this)})}),e(this.constructor,"assignableAttributes").filter(e=>e).reverse().forEach(e=>{Array.isArray(e)?(console.warn(`[Komps] assignableAttributes on ${this.constructor.name} uses deprecated array format. Convert to object schema: { attr: { type, default, null } }`),e.forEach(e=>{this._assignableAttributes[e]=this._assignableAttributes[e]||{type:"object",default:null,null:!0}})):Object.assign(this._assignableAttributes,e)}),Object.keys(this._assignableAttributes).forEach(s=>{let e=this._assignableAttributes[s];"object"==typeof e&&null!=e&&null!=e.type||(console.warn(`[Komps] assignableAttributes on ${this.constructor.name} is direct value. Convert to object schema: { attr: { type, default, null } }`),e={type:"object",default:e,null:!0});const n=Z(e),r=s+"_ref";var t,i;Object.defineProperty(this,s,{configurable:!0,get:()=>this._attributes[s],set:e=>{var t,i=this._attributes[s];e!==i&&(this._attributes[s]=e,this.attributeChangedCallback(s,i,e),n?null==e?this.removeAttribute(s):"boolean"==typeof e?this.toggleAttribute(s,e):this.setAttribute(s,e):(i=this.getAttribute(r),null!=e?i?u.manifest.set(i,e):(t=V(),this.setAttribute(r,t),this._refIds.push(t),u.manifest.set(t,e)):i&&(u.manifest.delete(i),this.removeAttribute(r))))}}),o.hasOwnProperty(s)?(this[s]=o[s],delete a[s]):(i=this.getAttribute(r))&&u.manifest.has(i)?(i=u.manifest.get(i),t=V(),this.setAttribute(r,t),this._refIds.push(t),u.manifest.set(t,i),this._attributes[s]=i):n&&this.hasAttribute(s)?(t=this.getAttribute(s),i=Array.isArray(e.type)?e.type[0]:e.type,this._attributes[s]="boolean"===i||("number"===i?Number(t):t)):this._attributes[s]=e.default}),Q.register(this,this._refIds),e(this.constructor,"assignableMethods").filter(e=>e).reverse().forEach(e=>{e.forEach(t=>{if(o.hasOwnProperty(t)&&"function"==typeof o[t]){const i=this[t];this[t]=function(...e){return e.push(i),o[t].call(this,...e)},delete a[t]}})}),e(this.constructor,"events").filter(e=>e).reverse().forEach(e=>{e.forEach(e=>{var t="on"+e[0].toUpperCase()+e.slice(1);o.hasOwnProperty(t)&&(this.addEventListener(e,o[t]),delete a[t])})}),Object.keys(a).forEach(e=>{null==a[e]&&delete a[e]}),$(this,a)}initialize(){Object.keys(this._assignableAttributes).forEach(e=>{var t=this._assignableAttributes[e],t="object"==typeof t&&null!=t&&null!=t.type&&Z(t),i=this.getAttribute(e+"_ref");!t&&i&&u.manifest.has(i)?this[e]=u.manifest.get(i):(!(i=this.getAttribute(e)||this.dataset[e]||this[e])&&this.dataset[e]&&console.warn("[Komps] assigning attributes via data- is deprecated."),"content"==e&&i?(this.removeAttribute("content"),o(this,i)):null!==i&&(this[e]=i)),t&&null!=this._attributes[e]&&!this.hasAttribute(e)&&("boolean"==typeof(i=this._attributes[e])?this.toggleAttribute(e,i):this.setAttribute(e,i))})}connected(){}async connectedCallback(){if(this.trigger("beforeConnect"),this.appendStyle(),!this.is_initialized&&!this.initializing){if(!(this.initializing=!0)===await this.initialize())return;this.is_initialized=!0,delete this.initializing}this.connected(),this.trigger("afterConnect")}disconnected(){}disconnectedCallback(){this.trigger("beforeDisconnect"),this._cleanupCallbacks.forEach(e=>e()),this._cleanupCallbacks=[],this.disconnected(),this.trigger("afterDisconnect")}changed(e,t,i){}attributeChangedCallback(e,...t){return this[e+"Changed"]&&this[e+"Changed"](...t),this.trigger(e+"Changed",{detail:t}),this.changed(e,...t)}appendStyle(){if(this.constructor.style){const i=this.getRootNode();i&&i.adoptedStyleSheets&&!i.adoptedStyleSheets.find(e=>e.id==this.constructor.name)&&K(this.constructor,t=>{var e;t.hasOwnProperty("style")&&t.renderStyle&&i&&i.adoptedStyleSheets&&!i.adoptedStyleSheets.find(e=>e.id==t.name)&&(e=t.renderStyle())&&i.adoptedStyleSheets.push(e)})}}static renderStyle(){if(!this.style)return null;var e=new CSSStyleSheet;e.id=this.name;let t="";const i=e=>Array.isArray(e)?e.map(i).join("\n"):B(e)?e.call(this):e||void 0;return K(this,e=>{t+=i(e.style)}),e.replaceSync(t),e}async remove(e){return this.trigger("beforeRemove"),e&&await e(),super.remove(),this.trigger("afterRemove"),this}addEventListenerFor(...e){s(this,...e)}cleanupEventListenerFor(...e){this._cleanupCallbacks.push(()=>{e[0].removeEventListener(...e.slice(1))}),e[0].addEventListener(...e.slice(1))}trigger(...e){q(this,...e)}}class ee extends u{static observer=new ResizeObserver(e=>{e.forEach(e=>e.target.resize())});static assignableAttributes={columnWidth:{type:"string",default:"max-content",null:!1},method:{type:"string",default:"pop",null:!1}};static assignableMethods=["initialTemplate"];connected(){this.enable()}disconnected(){this.disable()}cells(e){return Array.from(e.children).map(e=>["grid","inline-grid"].includes(getComputedStyle(e).display)?this.cells(e):e.dataset.autoGridIgnore?null:e).flat().filter(e=>null!==e)}disable(){this.constructor.observer.unobserve(this)}enable(){this.constructor.observer.observe(this)}initialTemplate(e){return e.map(e=>this.columnWidth).join(" ")}resize(){const t=getComputedStyle(this);for(var e,i=this.cells(this),s=this.initialTemplate(i).split(/(?<!\,)\s+/);this.style.setProperty("grid-template-columns",s.join(" ")),e=i.some(e=>e.offsetLeft<this.offsetLeft-parseFloat(t.paddingLeft))||i.some(e=>e.offsetLeft+e.offsetWidth>this.offsetLeft+this.offsetWidth-parseFloat(t.paddingRight)),s[this.method](),1<=s.length&&e;);}static style=`
        auto-grid {
            display: grid;
            grid-template-columns: auto;
        }
    `}window.customElements.define("auto-grid",ee);class te extends u{static tagName="komp-modal";constructor(...e){super(...e),this.container=w(this.tagName+"-popover",{popover:"manual"})}connected(){if(this.parentElement.localName!=this.localName+"-popover"){var e=Array.from(this.parentElement.querySelectorAll("komp-modal-popover"));let t=Math.max(...e.map(e=>parseInt(e.dataset.modalOrder||"0")));t++,e.forEach(e=>{e.dataset.modalOrder=e.dataset.modalOrder||t++}),this.replaceWith(this.container),this.container.addEventListener("click",e=>{e.target==this.container&&this.remove()}),this.container.append(this),this.container.append(w(this.tagName+"-close",{content:d({content:'<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'},this.remove.bind(this))})),this.container.showPopover()}}remove(){var e=this.container.parentElement;return this.container.remove(),e&&(e=Array.from(e.querySelectorAll(this.localName+"-popover")).sort((e,t)=>parseInt(t.dataset.modalOrder)-parseInt(e.dataset.modalOrder))[0])&&delete e.dataset.modalOrder,super.remove()}static style=function(){return`
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
    `}}window.customElements.define(te.tagName,te);const ie=["start","end"],se=["top","right","bottom","left"].reduce((e,t)=>e.concat(t,t+"-"+ie[0],t+"-"+ie[1]),[]),k=Math.min,C=Math.max,ne=Math.round,re=Math.floor,g=e=>({x:e,y:e}),oe={left:"right",right:"left",bottom:"top",top:"bottom"};function ae(e,t,i){return C(e,k(t,i))}function E(e,t){return"function"==typeof e?e(t):e}function z(e){return e.split("-")[0]}function L(e){return e.split("-")[1]}function le(e){return"x"===e?"y":"x"}function ce(e){return"y"===e?"height":"width"}function A(e){e=e[0];return"t"===e||"b"===e?"y":"x"}function he(e){return le(A(e))}function de(e,t,i){void 0===i&&(i=!1);var s=L(e),e=he(e),n=ce(e);let r="x"===e?s===(i?"end":"start")?"right":"left":"start"===s?"bottom":"top";return[r=t.reference[n]>t.floating[n]?be(r):r,be(r)]}function ue(e){return e.includes("start")?e.replace("start","end"):e.replace("end","start")}const pe=["left","right"],me=["right","left"],fe=["top","bottom"],ge=["bottom","top"];function ye(e,t,i,s){const n=L(e);let r=function(e,t,i){switch(e){case"top":case"bottom":return i?t?me:pe:t?pe:me;case"left":case"right":return t?fe:ge;default:return[]}}(z(e),"start"===i,s);return r=n&&(r=r.map(e=>e+"-"+n),t)?r.concat(r.map(ue)):r}function be(e){var t=z(e);return oe[t]+e.slice(t.length)}function ve(e){return"number"!=typeof e?{top:0,right:0,bottom:0,left:0,...e}:{top:e,right:e,bottom:e,left:e}}function y(e){var{x:e,y:t,width:i,height:s}=e;return{width:i,height:s,top:t,left:e,right:e+i,bottom:t+s,x:e,y:t}}function we(e,t,i){var{reference:s,floating:n}=e,e=A(t),r=he(t),o=ce(r),a=z(t),l="y"===e,c=s.x+s.width/2-n.width/2,h=s.y+s.height/2-n.height/2,d=s[o]/2-n[o]/2;let u;switch(a){case"top":u={x:c,y:s.y-n.height};break;case"bottom":u={x:c,y:s.y+s.height};break;case"right":u={x:s.x+s.width,y:h};break;case"left":u={x:s.x-n.width,y:h};break;default:u={x:s.x,y:s.y}}switch(L(t)){case"start":u[r]-=d*(i&&l?-1:1);break;case"end":u[r]+=d*(i&&l?-1:1)}return u}async function xe(e,t){var{x:i,y:s,platform:n,rects:r,elements:o,strategy:a}=e,{boundary:t="clippingAncestors",rootBoundary:e="viewport",elementContext:l="floating",altBoundary:c=!1,padding:h=0}=E(t=void 0===t?{}:t,e),h=ve(h),c=o[c?"floating"===l?"reference":"floating":l],d=y(await n.getClippingRect({element:null==(d=await(null==n.isElement?void 0:n.isElement(c)))||d?c:c.contextElement||await(null==n.getDocumentElement?void 0:n.getDocumentElement(o.floating)),boundary:t,rootBoundary:e,strategy:a})),c="floating"===l?{x:i,y:s,width:r.floating.width,height:r.floating.height}:r.reference,t=await(null==n.getOffsetParent?void 0:n.getOffsetParent(o.floating)),e=await(null==n.isElement?void 0:n.isElement(t))&&await(null==n.getScale?void 0:n.getScale(t))||{x:1,y:1},l=y(n.convertOffsetParentRelativeRectToViewportRelativeRect?await n.convertOffsetParentRelativeRectToViewportRelativeRect({elements:o,rect:c,offsetParent:t,strategy:a}):c);return{top:(d.top-l.top+h.top)/e.y,bottom:(l.bottom-d.bottom+h.bottom)/e.y,left:(d.left-l.left+h.left)/e.x,right:(l.right-d.right+h.right)/e.x}}const ke=50;function Ce(e){var t=k(...e.map(e=>e.left)),i=k(...e.map(e=>e.top));return{x:t,y:i,width:C(...e.map(e=>e.right))-t,height:C(...e.map(e=>e.bottom))-i}}const Ee=new Set(["left","top"]);function ze(){return"undefined"!=typeof window}function p(e){return Le(e)?(e.nodeName||"").toLowerCase():"#document"}function b(e){return(null==e||null==(e=e.ownerDocument)?void 0:e.defaultView)||window}function f(e){return null==(e=(Le(e)?e.ownerDocument:e.document)||window.document)?void 0:e.documentElement}function Le(e){return ze()&&(e instanceof Node||e instanceof b(e).Node)}function v(e){return!!ze()&&(e instanceof Element||e instanceof b(e).Element)}function m(e){return!!ze()&&(e instanceof HTMLElement||e instanceof b(e).HTMLElement)}function Ae(e){return!(!ze()||"undefined"==typeof ShadowRoot)&&(e instanceof ShadowRoot||e instanceof b(e).ShadowRoot)}function T(e){var{overflow:e,overflowX:t,overflowY:i,display:s}=N(e);return/auto|scroll|overlay|hidden|clip/.test(e+i+t)&&"inline"!==s&&"contents"!==s}function Te(e){try{if(e.matches(":popover-open"))return!0}catch(e){}try{return e.matches(":modal")}catch(e){return!1}}const Re=/transform|translate|scale|rotate|perspective|filter/,Ne=/paint|layout|strict|content/,t=e=>!!e&&"none"!==e;let Oe;function Se(e){e=v(e)?N(e):e;return t(e.transform)||t(e.translate)||t(e.scale)||t(e.rotate)||t(e.perspective)||!Ie()&&(t(e.backdropFilter)||t(e.filter))||Re.test(e.willChange||"")||Ne.test(e.contain||"")}function Ie(){return Oe=null==Oe?"undefined"!=typeof CSS&&CSS.supports&&CSS.supports("-webkit-backdrop-filter","none"):Oe}function R(e){return/^(html|body|#document)$/.test(p(e))}function N(e){return b(e).getComputedStyle(e)}function _e(e){return v(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function O(e){return"html"!==p(e)&&(e=e.assignedSlot||e.parentNode||Ae(e)&&e.host||f(e),Ae(e))?e.host:e}function S(e,t,i){void 0===t&&(t=[]),void 0===i&&(i=!0);var s=function e(t){var i=O(t);return R(i)?(t.ownerDocument||t).body:m(i)&&T(i)?i:e(i)}(e),e=s===(null==(e=e.ownerDocument)?void 0:e.body),n=b(s);return e?(e=je(n),t.concat(n,n.visualViewport||[],T(s)?s:[],e&&i?S(e):[])):t.concat(s,S(s,[],i))}function je(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function Pe(e){var t=N(e);let i=parseFloat(t.width)||0,s=parseFloat(t.height)||0;var t=m(e),n=t?e.offsetWidth:i,t=t?e.offsetHeight:s,e=ne(i)!==n||ne(s)!==t;return e&&(i=n,s=t),{width:i,height:s,$:e}}function De(e){return v(e)?e:e.contextElement}function I(e){e=De(e);if(!m(e))return g(1);var t=e.getBoundingClientRect(),{width:e,height:i,$:s}=Pe(e);let n=(s?ne(t.width):t.width)/e,r=(s?ne(t.height):t.height)/i;return n&&Number.isFinite(n)||(n=1),r&&Number.isFinite(r)||(r=1),{x:n,y:r}}const He=g(0);function Me(e){e=b(e);return Ie()&&e.visualViewport?{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}:He}function _(e,i,t,s){void 0===i&&(i=!1),void 0===t&&(t=!1);var n=e.getBoundingClientRect(),r=De(e);let o=g(1);i&&(s?v(s)&&(o=I(s)):o=I(e));i=r,void 0===(e=t)&&(e=!1);t=!(t=s)||e&&t!==b(i)||!e?g(0):Me(r);let a=(n.left+t.x)/o.x,l=(n.top+t.y)/o.y,c=n.width/o.x,h=n.height/o.y;if(r){var i=b(r),d=s&&v(s)?b(s):s;let e=i,t=je(e);for(;t&&s&&d!==e;){var u=I(t),p=t.getBoundingClientRect(),m=N(t),f=p.left+(t.clientLeft+parseFloat(m.paddingLeft))*u.x,p=p.top+(t.clientTop+parseFloat(m.paddingTop))*u.y;a*=u.x,l*=u.y,c*=u.x,h*=u.y,a+=f,l+=p,e=b(t),t=je(e)}}return y({width:c,height:h,x:a,y:l})}function $e(e,t){var i=_e(e).scrollLeft;return t?t.left+i:_(f(e)).left+i}function Fe(e,t){var i=e.getBoundingClientRect();return{x:i.left+t.scrollLeft-$e(e,i),y:i.top+t.scrollTop}}const qe=25;function Be(e,t,i){let s;var n,r,o;return y(s="viewport"===t?function(e,t){var i,s,n=b(e),e=f(e),n=n.visualViewport;let r=e.clientWidth,o=e.clientHeight,a=0,l=0;return n&&(r=n.width,o=n.height,Ie()&&"fixed"!==t||(a=n.offsetLeft,l=n.offsetTop)),(t=$e(e))<=0?(i=(n=e.ownerDocument).body,s=getComputedStyle(i),n="CSS1Compat"===n.compatMode&&parseFloat(s.marginLeft)+parseFloat(s.marginRight)||0,(s=Math.abs(e.clientWidth-i.clientWidth-n))<=qe&&(r-=s)):t<=qe&&(r+=t),{width:r,height:o,x:a,y:l}}(e,i):"document"===t?function(e){var t=f(e),i=_e(e),s=e.ownerDocument.body,n=C(t.scrollWidth,t.clientWidth,s.scrollWidth,s.clientWidth),r=C(t.scrollHeight,t.clientHeight,s.scrollHeight,s.clientHeight);let o=-i.scrollLeft+$e(e);return e=-i.scrollTop,"rtl"===N(s).direction&&(o+=C(t.clientWidth,s.clientWidth)-n),{width:n,height:r,x:o,y:e}}(f(e)):v(t)?(r=(i=_(n=t,!0,"fixed"===(i=i))).top+n.clientTop,i=i.left+n.clientLeft,o=m(n)?I(n):g(1),{width:n.clientWidth*o.x,height:n.clientHeight*o.y,x:i*o.x,y:r*o.y}):(n=Me(e),{x:t.x-n.x,y:t.y-n.y,width:t.width,height:t.height}))}function We(e,t){var i=t.get(e);if(i)return i;let s=S(e,[],!1).filter(e=>v(e)&&"body"!==p(e)),n=null;var r="fixed"===N(e).position;let o=r?O(e):e;for(;v(o)&&!R(o);){var a=N(o),l=Se(o),l=(l||"fixed"!==a.position||(n=null),r?!l&&!n:!l&&"static"===a.position&&!!n&&("absolute"===n.position||"fixed"===n.position)||T(o)&&!l&&function e(t,i){t=O(t);return!(t===i||!v(t)||R(t))&&("fixed"===N(t).position||e(t,i))}(e,o));l?s=s.filter(e=>e!==o):n=a,o=O(o)}return t.set(e,s),s}function Ue(e){return"static"===N(e).position}function Ve(e,t){if(!m(e)||"fixed"===N(e).position)return null;if(t)return t(e);let i=e.offsetParent;return i=f(e)===i?i.ownerDocument.body:i}function Ke(t,e){var i,s=b(t);if(Te(t))return s;if(!m(t)){let e=O(t);for(;e&&!R(e);){if(v(e)&&!Ue(e))return e;e=O(e)}return s}let n=Ve(t,e);for(;n&&(i=n,/^(table|td|th)$/.test(p(i)))&&Ue(n);)n=Ve(n,e);return(!(n&&R(n)&&Ue(n))||Se(n))&&(n||function(e){let t=O(e);for(;m(t)&&!R(t);){if(Se(t))return t;if(Te(t))return null;t=O(t)}return null}(t))||s}const Ye={convertOffsetParentRelativeRectToViewportRelativeRect:function(e){var{elements:e,rect:t,offsetParent:i,strategy:s}=e,s="fixed"===s,n=f(i),e=!!e&&Te(e.floating);if(i===n||e&&s)return t;let r={scrollLeft:0,scrollTop:0},o=g(1);var e=g(0),a=m(i),l=((a||!a&&!s)&&("body"===p(i)&&!T(n)||(r=_e(i)),a)&&(l=_(i),o=I(i),e.x=l.x+i.clientLeft,e.y=l.y+i.clientTop),!n||a||s?g(0):Fe(n,r));return{width:t.width*o.x,height:t.height*o.y,x:t.x*o.x-r.scrollLeft*o.x+e.x+l.x,y:t.y*o.y-r.scrollTop*o.y+e.y+l.y}},getDocumentElement:f,getClippingRect:function(e){var{element:t,boundary:e,rootBoundary:i,strategy:s}=e,n=[..."clippingAncestors"===e?Te(t)?[]:We(t,this._c):[].concat(e),i];let r=(e=Be(t,n[0],s)).top,o=e.right,a=e.bottom,l=e.left;for(let e=1;e<n.length;e++){var c=Be(t,n[e],s);r=C(c.top,r),o=k(c.right,o),a=k(c.bottom,a),l=C(c.left,l)}return{width:o-l,height:a-r,x:l,y:r}},getOffsetParent:Ke,getElementRects:async function(e){var t=this.getOffsetParent||Ke,i=await(0,this.getDimensions)(e.floating);return{reference:function(e,t,i){var s=m(t);const n=f(t);e=_(e,!0,i="fixed"===i,t);let r={scrollLeft:0,scrollTop:0};const o=g(0);function a(){o.x=$e(n)}!s&&i||("body"===p(t)&&!T(n)||(r=_e(t)),s?(l=_(t,!0,i,t),o.x=l.x+t.clientLeft,o.y=l.y+t.clientTop):n&&a()),i&&!s&&n&&a();var l=!n||s||i?g(0):Fe(n,r);return{x:e.left+r.scrollLeft-o.x-l.x,y:e.top+r.scrollTop-o.y-l.y,width:e.width,height:e.height}}(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:i.width,height:i.height}}},getClientRects:function(e){return Array.from(e.getClientRects())},getDimensions:function(e){var{width:e,height:t}=Pe(e);return{width:e,height:t}},getScale:I,isElement:v,isRTL:function(e){return"rtl"===N(e).direction}};function Xe(e,t){return e.x===t.x&&e.y===t.y&&e.width===t.width&&e.height===t.height}function Ge(h,t){let d=null,u;const p=f(h);function m(){var e;clearTimeout(u),null!=(e=d)&&e.disconnect(),d=null}return function i(s,n){void 0===s&&(s=!1),void 0===n&&(n=1),m();const r=h.getBoundingClientRect();var{left:e,top:o,width:a,height:l}=r;if(s||t(),a&&l){s={rootMargin:-re(o)+"px "+-re(p.clientWidth-(e+a))+"px "+-re(p.clientHeight-(o+l))+"px "+-re(e)+"px",threshold:C(0,k(1,n))||1};let t=!0;try{d=new IntersectionObserver(c,{...s,root:p.ownerDocument})}catch(e){d=new IntersectionObserver(c,s)}function c(e){if((e=e[0].intersectionRatio)!==n){if(!t)return i();e?i(!1,e):u=setTimeout(()=>{i(!1,1e-7)},1e3)}1!==e||Xe(r,h.getBoundingClientRect())||i(),t=!1}d.observe(h)}}(!0),m}function Je(i,t,s,e){void 0===e&&(e={});const{ancestorScroll:n=!0,ancestorResize:r=!0,elementResize:o="function"==typeof ResizeObserver,layoutShift:a="function"==typeof IntersectionObserver,animationFrame:l=!1}=e,c=De(i),h=n||r?[...c?S(c):[],...t?S(t):[]]:[],d=(h.forEach(e=>{n&&e.addEventListener("scroll",s,{passive:!0}),r&&e.addEventListener("resize",s)}),c&&a?Ge(c,s):null);let u=-1,p=null;o&&(p=new ResizeObserver(e=>{var[e]=e;e&&e.target===c&&p&&t&&(p.unobserve(t),cancelAnimationFrame(u),u=requestAnimationFrame(()=>{var e;null!=(e=p)&&e.observe(t)})),s()}),c&&!l&&p.observe(c),t)&&p.observe(t);let m,f=l?_(i):null;return l&&function e(){const t=_(i);f&&!Xe(f,t)&&s();f=t;m=requestAnimationFrame(e)}(),s(),()=>{var e;h.forEach(e=>{n&&e.removeEventListener("scroll",s),r&&e.removeEventListener("resize",s)}),null!=d&&d(),null!=(e=p)&&e.disconnect(),p=null,l&&cancelAnimationFrame(m)}}const Ze=y=>({name:"arrow",options:y,async fn(e){var{x:t,y:i,placement:s,rects:n,platform:r,elements:o,middlewareData:a}=e,{element:e,padding:l=0}=E(y,e)||{};if(null==e)return{};var l=ve(l),t={x:t,y:i},i=he(s),c=ce(i),h=await r.getDimensions(e),d="y"===i,u=d?"top":"left",p=d?"bottom":"right",d=d?"clientHeight":"clientWidth",m=n.reference[c]+n.reference[i]-t[i]-n.floating[c],f=t[i]-n.reference[i],e=await(null==r.getOffsetParent?void 0:r.getOffsetParent(e));let g=e?e[d]:0;m=m/2-f/2,f=(g=g&&await(null==r.isElement?void 0:r.isElement(e))?g:o.floating[d]||n.floating[c])/2-h[c]/2-1,r=k(l[u],f),e=k(l[p],f),o=r,d=g-h[c]-e,u=g/2-h[c]/2+m,l=ae(o,u,d),p=!a.arrow&&null!=L(s)&&u!==l&&n.reference[c]/2-(u<o?r:e)-h[c]/2<0,f=p?u<o?u-o:u-d:0;return{[i]:t[i]+f,data:{[i]:l,centerOffset:u-l-f,...p&&{alignmentOffset:f}},reset:p}}}),Qe=(e,t,i)=>{var s=new Map,i={platform:Ye,...i},s={...i.platform,_c:s};return(async(t,i,e)=>{var{placement:s="bottom",strategy:n="absolute",middleware:r=[],platform:o}=e,a=o.detectOverflow?o:{...o,detectOverflow:xe},l=await(null==o.isRTL?void 0:o.isRTL(i));let c=await o.getElementRects({reference:t,floating:i,strategy:n}),{x:h,y:d}=we(c,s,l),u=s,p=0;var m={};for(let e=0;e<r.length;e++){var f,g,y,b,v=r[e];v&&({name:v,fn:f}=v,{x:f,y:g,data:y,reset:b}=await f({x:h,y:d,initialPlacement:s,placement:u,strategy:n,middlewareData:m,rects:c,platform:a,elements:{reference:t,floating:i}}),h=null!=f?f:h,d=null!=g?g:d,m[v]={...m[v],...y},b)&&p<ke&&(p++,"object"==typeof b&&(b.placement&&(u=b.placement),b.rects&&(c=!0===b.rects?await o.getElementRects({reference:t,floating:i,strategy:n}):b.rects),{x:h,y:d}=we(c,u,l)),e=-1)}return{x:h,y:d,placement:u,strategy:n,middlewareData:m}})(e,t,{...i,platform:s})};class n extends u{static tagName="komp-floater";static assignableAttributes={content:{type:["string","HTMLElement","array","object"],default:null,null:!0},anchor:{type:"HTMLElement",default:null,null:!0},placement:{type:"string",default:void 0,null:!0},strategy:{type:"string",default:"absolute",null:!1},flip:{type:["boolean","object"],default:null,null:!0},offset:{type:["boolean","object"],default:null,null:!0},shift:{type:["boolean","object"],default:!0,null:!1},arrow:{type:["boolean","number"],default:null,null:!0},autoPlacement:{type:["boolean","object"],default:!0,null:!1},inline:{type:["boolean","object"],default:null,null:!0},autoUpdate:{type:["boolean","object"],default:{},null:!1},removeOnBlur:{type:"boolean",default:!1,null:!1},container:{type:["string","HTMLElement"],default:null,null:!0},timeout:{type:"number",default:0,null:!1},onHide:{type:"function",default:null,null:!0},onShow:{type:"function",default:null,null:!0},scope:{type:"string",default:null,null:!0}};static bindMethods=["show","hide","checkFocus","checkEscape"];static middlewares={size:function(v){return{name:"size",options:v=void 0===v?{}:v,async fn(e){var{placement:t,rects:i,platform:s,elements:n}=e;const{apply:r=()=>{},...o}=E(v,e);var a=await s.detectOverflow(e,o),l=z(t),c=L(t),t="y"===A(t),{width:i,height:h}=i.floating;let d,u;"top"===l||"bottom"===l?(d=l,u=c===(await(null==s.isRTL?void 0:s.isRTL(n.floating))?"start":"end")?"left":"right"):(u=l,d="end"===c?"top":"bottom");var l=h-a.top-a.bottom,p=i-a.left-a.right,m=k(h-a[d],l),f=k(i-a[u],p),g=!e.middlewareData.shift;let y=m,b=f;null!=(m=e.middlewareData.shift)&&m.enabled.x&&(b=p),null!=(f=e.middlewareData.shift)&&f.enabled.y&&(y=l),g&&!c&&(m=C(a.left,0),p=C(a.right,0),f=C(a.top,0),l=C(a.bottom,0),t?b=i-2*(0!==m||0!==p?m+p:C(a.left,a.right)):y=h-2*(0!==f||0!==l?f+l:C(a.top,a.bottom))),await r({...e,availableWidth:b,availableHeight:y});g=await s.getDimensions(n.floating);return i!==g.width||h!==g.height?{reset:{rects:!0}}:{}}}},shift:function(m){return{name:"shift",options:m=void 0===m?{}:m,async fn(e){var{x:t,y:i,placement:s,platform:n}=e;const{mainAxis:r=!0,crossAxis:o=!1,limiter:a={fn:e=>{var{x:e,y:t}=e;return{x:e,y:t}}},...l}=E(m,e);var c,h={x:t,y:i},n=await n.detectOverflow(e,l),s=A(z(s)),d=le(s);let u=h[d],p=h[s];r&&(h=u+n["y"===d?"top":"left"],c=u-n["y"===d?"bottom":"right"],u=ae(h,u,c)),o&&(h=p+n["y"===s?"top":"left"],c=p-n["y"===s?"bottom":"right"],p=ae(h,p,c));n=a.fn({...e,[d]:u,[s]:p});return{...n,data:{x:n.x-t,y:n.y-i,enabled:{[d]:r,[s]:o}}}}}},autoPlacement:function(g){return{name:"autoPlacement",options:g=void 0===g?{}:g,async fn(e){var{rects:t,middlewareData:i,placement:s,platform:n,elements:r}=e;const{crossAxis:o=!1,alignment:a,allowedPlacements:l=se,autoAlignment:c=!0,...h}=E(g,e);var d,u,p=void 0!==a||l===se?(u=c,p=l,((d=a||null)?[...p.filter(e=>L(e)===d),...p.filter(e=>L(e)!==d)]:p.filter(e=>z(e)===e)).filter(e=>!d||L(e)===d||!!u&&ue(e)!==e)):l,e=await n.detectOverflow(e,h),m=(null==(m=i.autoPlacement)?void 0:m.index)||0,f=p[m];return null==f?{}:(t=de(f,t,await(null==n.isRTL?void 0:n.isRTL(r.floating))),s!==f?{reset:{placement:p[0]}}:(n=[e[z(f)],e[t[0]],e[t[1]]],e=[...(null==(r=i.autoPlacement)?void 0:r.overflows)||[],{placement:f,overflows:n}],(t=p[m+1])?{data:{index:m+1,overflows:e},reset:{placement:t}}:(f=(null==(r=(i=e.map(e=>{var t=L(e.placement);return[e.placement,t&&o?e.overflows.slice(0,2).reduce((e,t)=>e+t,0):e.overflows[0],e.overflows]}).sort((e,t)=>e[1]-t[1])).filter(e=>e[2].slice(0,L(e[0])?2:3).every(e=>e<=0))[0])?void 0:r[0])||i[0][0])!==s?{data:{index:m+1,overflows:e},reset:{placement:f}}:{}))}}},flip:function(C){return{name:"flip",options:C=void 0===C?{}:C,async fn(e){const{placement:t,middlewareData:i,rects:s,initialPlacement:n,platform:r,elements:o}=e,{mainAxis:a=!0,crossAxis:l=!0,fallbackPlacements:c,fallbackStrategy:h="bestFit",fallbackAxisSideDirection:d="none",flipAlignment:u=!0,...p}=E(C,e);if(null==(m=i.arrow)||!m.alignmentOffset){var m=z(t);const x=A(n);var f=z(n)===n,g=await(null==r.isRTL?void 0:r.isRTL(o.floating)),f=c||(f||!u?[be(n)]:(y=be(f=n),[ue(f),y,ue(y)]));const k="none"!==d;!c&&k&&f.push(...ye(n,u,d,g));var y=[n,...f],f=await r.detectOverflow(e,p),e=[],b=(null==(v=i.flip)?void 0:v.overflows)||[];if(a&&e.push(f[m]),l&&(v=de(t,s,g),e.push(f[v[0]],f[v[1]])),b=[...b,{placement:t,overflows:e}],!e.every(e=>e<=0)){var v,w,g=((null==(m=i.flip)?void 0:m.index)||0)+1,f=y[g];if(f)if(!("alignment"===l&&x!==A(f))||b.every(e=>A(e.placement)!==x||0<e.overflows[0]))return{data:{index:g,overflows:b},reset:{placement:f}};let e=null==(v=b.filter(e=>e.overflows[0]<=0).sort((e,t)=>e.overflows[1]-t.overflows[1])[0])?void 0:v.placement;if(!e)switch(h){case"bestFit":{const t=null==(w=b.filter(e=>{return!k||(e=A(e.placement))===x||"y"===e}).map(e=>[e.placement,e.overflows.filter(e=>0<e).reduce((e,t)=>e+t,0)]).sort((e,t)=>e[1]-t[1])[0])?void 0:w[0];t&&(e=t);break}case"initialPlacement":e=n}if(t!==e)return{reset:{placement:e}}}}return{}}}},inline:function(o){return{name:"inline",options:o=void 0===o?{}:o,async fn(e){const{placement:c,elements:t,rects:i,platform:s,strategy:n}=e,{padding:r=2,x:h,y:d}=E(o,e);e=Array.from(await(null==s.getClientRects?void 0:s.getClientRects(t.reference))||[]);const u=function(e){var t=e.slice().sort((e,t)=>e.y-t.y),i=[];let s=null;for(let e=0;e<t.length;e++){var n=t[e];!s||n.y-s.y>s.height/2?i.push([n]):i[i.length-1].push(n),s=n}return i.map(e=>y(Ce(e)))}(e),p=y(Ce(e)),m=ve(r);e=await s.getElementRects({reference:{getBoundingClientRect:function(){if(2===u.length&&u[0].left>u[1].right&&null!=h&&null!=d)return u.find(e=>h>e.left-m.left&&h<e.right+m.right&&d>e.top-m.top&&d<e.bottom+m.bottom)||p;if(2<=u.length){var e,t;if("y"===A(c))return i=u[0],s=u[u.length-1],n="top"===z(c),{top:e=i.top,bottom:r=s.bottom,left:t=(n?i:s).left,right:n=(n?i:s).right,width:n-t,height:r-e,x:t,y:e};const o="left"===z(c),a=C(...u.map(e=>e.right)),l=k(...u.map(e=>e.left));var i=u.filter(e=>o?e.left===l:e.right===a),s=i[0].top,n=i[i.length-1].bottom,r=l;return{top:s,bottom:n,left:r,right:a,width:a-r,height:n-s,x:r,y:s}}return p}},floating:t.floating,strategy:n});return i.reference.x!==e.reference.x||i.reference.y!==e.reference.y||i.reference.width!==e.reference.width||i.reference.height!==e.reference.height?{reset:{rects:e}}:{}}}},arrow:Ze,offset:function(o){return{name:"offset",options:o=void 0===o?0:o,async fn(e){var t,{x:i,y:s,placement:n,middlewareData:r}=e,e=await async function(e,t){var{placement:i,platform:s,elements:n}=e,s=await(null==s.isRTL?void 0:s.isRTL(n.floating)),n=z(i),r=L(i),i="y"===A(i),n=Ee.has(n)?-1:1,s=s&&i?-1:1;let{mainAxis:o,crossAxis:a,alignmentAxis:l}="number"==typeof(t=E(t,e))?{mainAxis:t,crossAxis:0,alignmentAxis:null}:{mainAxis:t.mainAxis||0,crossAxis:t.crossAxis||0,alignmentAxis:t.alignmentAxis};return r&&"number"==typeof l&&(a="end"===r?-1*l:l),i?{x:a*s,y:o*n}:{x:o*n,y:a*s}}(e,o);return n===(null==(t=r.offset)?void 0:t.placement)&&null!=(t=r.arrow)&&t.alignmentOffset?{}:{x:i+e.x,y:s+e.y,data:{...e,placement:n}}}}}};showing=!1;initialize(){if(super.initialize(),"string"==typeof this.anchor)this.anchor=this.getRootNode().querySelector(this.anchor);else if(!(this.anchor instanceof Element)){const e=this.anchor;this.anchor={getBoundingClientRect(){return{width:0,height:0,x:e.x,y:e.y,left:e.x,right:e.x,top:e.y,bottom:e.y}}}}this.middleware=[],Object.keys(this.constructor.middlewares).forEach(e=>{this[e]&&("arrow"==e?(this.classList.add("komp-floater-arrow"),this.middleware.push(Ze({element:this.initializeArrow()}))):this.middleware.push(this.constructor.middlewares[e](!0===this[e]?{}:this[e])))})}connected(){if(this.style.position=this.strategy,!this.anchor)throw"Floater needs anchor to position to.";this._cleanupCallbacks.push(Je(this.anchor,this,this.updatePosition.bind(this),this.autoUpdate)),this.classList.add("-in"),this.addEventListener("animationend",()=>{this.classList.remove("-in")},{once:!0}),this.removeOnBlur&&(this.cleanupEventListenerFor(this.getRootNode().body,"focusin",this.checkFocus),this.cleanupEventListenerFor(this.getRootNode().body,"click",this.checkFocus),this.cleanupEventListenerFor(this.getRootNode().body,"keyup",this.checkEscape))}initializeArrow(){var e;return this.querySelector("komp-floater-arrow-locator")?this.querySelector("komp-floater-arrow-locator"):(e=w("komp-floater-arrow-locator"),this.prepend(e),"number"==typeof this.arrow&&this.style.setProperty("--arrow-size",this.arrow+"px"),this.offset||(this.offset=!0===this.arrow?10:this.arrow),"none"!=h(this,"box-shadow")&&(this.style.filter=h(this,"box-shadow").split(/(?<!\([^\)]*),/).map(e=>`drop-shadow(${e.trim().split(/(?<!\([^\)]*)\s/).slice(0,4).join(" ")})`).join(" "),this.style.boxShadow="none"),e)}updatePosition(){Qe(this.anchor,this,{strategy:this.strategy,placement:this.placement,middleware:this.middleware}).then(this.computePosition.bind(this))}computePosition({x:e,y:t,placement:i,middlewareData:s}){if(this.style.left=e+"px",this.style.top=t+"px",this.classList.remove("-top","-left","-bottom","-right"),this.classList.add("-"+i.split("-")[0]),s.arrow){const{x:e,y:t}=s.arrow;null!=e&&(this.style.setProperty("--arrow-left",e+"px"),this.querySelector("komp-floater-arrow-locator").style.setProperty("left",e+"px")),null!=t&&(this.style.setProperty("--arrow-top",t+"px"),this.querySelector("komp-floater-arrow-locator").style.setProperty("top",e+"px"))}}checkFocus(e){e.defaultPrevented||e.target==this||e.target==this.anchor||this.contains(e.target)||this.anchor.contains&&this.anchor.contains(e.target)||this.hide()}checkEscape(e){27==e.which&&this.hide()}remove(){return new Promise(e=>{this.classList.add("-out");var t=()=>{this.classList.remove("-out"),super.remove().then(e)};"none"!=h(this,"animation-name")?this.addEventListener("animationend",t,{once:!0}):t()})}show(){if(this._hideTimeout&&(clearTimeout(this._hideTimeout),delete this._hideTimeout),this._removing)return this._removing.then(this.show);if("string"==typeof this.container&&(this.container=this.closest(this.container)||this.anchor.closest&&this.anchor.closest(this.container)),null==this.container&&(this.container=this.parentElement||this.anchor.parentElement),!this.parentElement){if(this.showing=!0,this.onShow&&0==this.onShow())return;this.scope&&(window.activeTooltips||(window.activeTooltips={}),window.activeTooltips[this.scope]&&window.activeTooltips[this.scope]!=this&&window.activeTooltips[this.scope].hideNow(),window.activeTooltips[this.scope]=this),this.container.append(this),this.trigger("shown")}return this}hideNow(){this.hideAfterTimeout()}hide(){if(!this._hideTimeout&&!this._hiding)return new Promise(e=>{this._hideTimeout=setTimeout(()=>{this.hideAfterTimeout(),e()},this.timeout)})}hideAfterTimeout(){return this.parentElement?this._removing=this.remove().then(()=>{this.showing=!1,this.trigger("hidden"),this.onHide&&this.onHide(),delete this._hideTimeout,delete this._removing}):this}toggle(e){return this[(e="boolean"!=typeof e?null!==this.offsetParent:e)?"hide":"show"](),this}static style=`
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
    `}window.customElements.get("komp-floater")||window.customElements.define("komp-floater",n);class et extends u{static tagName="komp-content-area";static assignableAttributes={onchange:{type:"function",default:null,null:!0}};static assignableMethods=["load"];get value(){return this.dump(this.innerHTML.replaceAll("<br>","\n").replaceAll(/<[^\>]+>/g,""))}set value(e){o(this,this.load(e))}constructor(e={}){var t=(e=Object.assign({tabIndex:0,contenteditable:!0},e)).content;delete e.content,super(e),this.value=t||e.value,this.valueWas=this.value,this.addEventListener("focusout",this.onFocusOut),this.addEventListener("focusin",this.onFocusIn)}onFocusIn(){var e,t;this.valueWas=this.value,e=this,(t=document.createRange()).selectNodeContents(e),t.collapse(!1),(e=window.getSelection()).removeAllRanges(),e.addRange(t)}onFocusOut(){var e=this.value;this.valueWas!=e&&(this.onchange&&this.onchange(e,this.valueWas),this.trigger("change",e,this.valueWas),this.valueWas=e)}dump(e){return e.trimEnd()}load(e){return e="string"==typeof e?e.replaceAll("\n","<br>"):e}select(){var e=document.createRange(),t=(e.selectNodeContents(this),window.getSelection());t.removeAllRanges(),t.addRange(e)}static style=`
        komp-content-area {
            appearance: textfield;
            background-color: white;
            border-width: 1px;
            padding: 0.22em;
            display: inline-block;
            min-width: 4ch;
        }
    `}window.customElements.define(et.tagName,et);class j{static assignableAttributes={target:{type:"object",default:null,null:!0},attribute:{type:"string",default:null,null:!0},dump:{type:"function",default:(e,t)=>e,null:!1},load:{type:"function",default:(e,t)=>e,null:!1}};static create(e,t={}){return this.new(e,t).input}static new(e,t={}){var i={button:ot,checkbox:it,radio:it,select:at,date:st,textarea:rt,"datetime-local":nt,contentarea:tt}[e];return new(i||this)(Object.assign({type:e},t))}constructor(t={}){if(t&&void 0!==t.record&&void 0===t.target){t=Object.assign({},t,{target:t.record});try{console.warn('[Komps Input] option "record" is deprecated; use "target" instead.')}catch(e){}}let i=this.constructor.assignableAttributes;Array.isArray(this.constructor.assignableAttributes)&&(console.warn(`[Komps] assignableAttributes on ${this.constructor.name} uses deprecated array format. Convert to object schema: { attr: { type, default, null } }`),i={},this.constructor.assignableAttributes.forEach(e=>{i[e]=i[e]||{type:"object",default:null,null:!0}}));const s=t;Object.keys(i).forEach(e=>{null!=t[e]&&(this[e]=t[e]||i[e].default),delete s[e]}),"function"!=typeof this.dump&&(this.dump=e=>e),"function"!=typeof this.load&&(this.load=e=>e),this.input=this.createInput(function(t,i){const s={};return Object.keys(t).forEach(function(e){i.includes(e)||(s[e]=t[e])}),s}(s,["load","dump"])),this.input._loading=this._load(null,t.value),this.setupInputListener(this.inputChange.bind(this)),this.setupTargetListener(this.targetChange.bind(this))}get value(){this.input.value}set value(e){this.input.value=e}createInput(e={}){return w("input",Object.assign({type:e.type},e))}setupInputListener(e){this.input.addEventListener("change",e.bind(this)),this.input.addEventListener("blur",e.bind(this))}setupRecordListener(e){try{console.warn("[Komps Input] setupRecordListener is deprecated; use setupTargetListener instead.")}catch(e){}return this.setupTargetListener(e)}setupTargetListener(e){this.target&&this.target.addEventListener&&this.target.addEventListener("change",e),this.target&&this.target.addListener&&this.target.addListener(e)}inputChange(e){if(!this._dumping){if(this.input.closest("[preventChange]"))return!1;this._dump(),this._dumping=new Promise(e=>{setTimeout(()=>{delete this._dumping,e()},50)})}}recordChange(){try{console.warn("[Komps Input] recordChange is deprecated; use targetChange instead.")}catch(e){}return this.targetChange()}targetChange(){this.input._loading=this._load()}_load(e,t){t=this.load(t||this._loadValue(),this.target,{explicitValue:t});null!=t&&(this.input.value=t)}_loadValue(){if(this.target)return function e(t,i,s){var n=(i=Array.isArray(i)?i:[i])[0];return i=i.slice(1),null!=t[n]?0<i.length?e(t[n],i,s):r(t,n):s}(this.target,this.attribute)}_dump(e,t){t=this.dump(t||this.input.value,this.target);return this._dumpValue(t)}_dumpValue(e){let t=Array.isArray(this.attribute)?this.attribute:[this.attribute];return t=t.concat([e]),function e(t,...i){var s;return 2==i.length?t[i[0]]=i[1]:(t[s=i.shift()]instanceof Object||(t[s]={}),Array.isArray(t[s])?t[s]=e(Array.from(t[s]),...i):t[s]=e(Object.assign({},t[s]),...i)),t}(this.target,...t),e}}class tt extends j{createInput(e){return new et(e)}}class it extends j{async _load(){var e=this.load(await this._loadValue()),t="on"==this.input.value||this.input.value;this.input.multiple?this.input.checked=!!Array.isArray(e)&&e.includes(t):this.input.checked=e==t}_dump(){let e,t="on"==this.input.value||this.input.value;var i;return e=this.input.multiple?(i=this._loadValue()||[],this.input.checked?i.includes(t)?this.dump(i):this.dump(i.concat(t)):this.dump(i.filter(e=>e!=t))):"boolean"==typeof t?this.dump(this.input.checked?t:!t):this.dump(this.input.checked?this.input.value:null),this._dumpValue(e)}setupInputListener(e){this.input.addEventListener("change",e.bind(this))}}class st extends j{setupInputListener(){this.input.addEventListener("blur",this.inputChange.bind(this))}async _load(e){let t=await this._loadValue();return t instanceof Date&&(t=[t.getUTCFullYear(),(t.getMonth()+1).toString().padStart(2,"0"),t.getDate().toString().padStart(2,"0")].join("-")),super._load(e,t)}_dump(e){let t=this.input.value;""==t&&(t=null),super._dump(e,t)}}class nt extends j{async _load(e){let t=await this._loadValue();t instanceof Date&&(t=[[t.getUTCFullYear(),(t.getMonth()+1).toString().padStart(2,"0"),t.getDate().toString().padStart(2,"0")].join("-"),"T",[t.getHours().toString().padStart(2,"0"),t.getMinutes().toString().padStart(2,"0")].join(":")].join("")),super._load(e,t)}}class rt extends j{createInput(e){return w("textarea",e)}}class ot extends j{createInput(e){return w("button",e)}setupInputListener(){this.input.addEventListener("click",this._dump.bind(this))}_load(){}}class at extends j{createInput(e={}){const t=w("select",e);return e.includeBlank&&t.append(w("option",Object.assign({content:"Unset",value:null},e.includeBlank))),e.options&&e.options.forEach(e=>{t.append(w("option",{content:Array.isArray(e)?e[1]:e,value:Array.isArray(e)?e[0]:e}))}),t}async _load(e){if(this.input.multiple){const t=this.load(await this._loadValue());this.input.querySelectorAll("option").forEach(e=>{t.includes(e.value)?e.setAttribute("selected",!0):e.removeAttribute("selected")})}else super._load()}_dump(e){var t;if(this.input.multiple)return t=Array.from(this.input.options).filter(e=>e.selected).map(e=>e.value),this._dumpValue(this.dump(t)),t;{let e=this.input.value;return"null"==e&&(e=null),e=this.dump(e),this._dumpValue(e),e}}}class lt extends u{static tagName="komp-table-cell";static assignableAttributes={record:{type:["object","function"],default:null,null:!0},column:{type:"object",default:null,null:!0},table:{type:"object",default:null,null:!0},cellIndex:{type:"number",default:null,null:!0},groupIndex:{type:"number",default:null,null:!0}};get row(){let e=this.parentElement;for(;e instanceof this.constructor;)e=e.parentElement;return e}get rowIndex(){return this.row.rowIndex}get cellIndex(){return this.column.index}get cells(){return Array.from(this.querySelectorAll(this.table.cellSelector))}get disabled(){this.readAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get readonly(){this.readAttribute("readonly")}set readonly(e){this.toggleAttribute("readonly",e)}cellIndexChanged(e,t){this.style.gridColumn=t,this.column.frozen&&(this.classList.remove("frozen-"+e),this.classList.add("frozen-"+t))}groupIndexChanged(e,t){this.style.gridRow=t}render(){return o(this,r(this.column,"render",this.record,this)),this}connected(){this.column.cells.add(this)}disconected(){this.column.cells.delete(this)}}window.customElements.define(lt.tagName,lt);var ct=class extends lt{static tagName="komp-table-header-cell";render(){return o(this,r(this.column,"header",this)),this}connected(){super.connected(),this.column.frozen&&this.table.observeResize(this)}disconnected(){this.column.frozen&&this.table.unobserveResize(this)}};window.customElements.define(ct.tagName,ct);class ht{static Cell=lt;static HeaderCell=ct;static assignableAttributes={index:{type:"number",default:null,null:!0},table:{type:"object",default:null,null:!0},width:{type:"string",default:null,null:!0},frozen:{type:"boolean",default:!1,null:!1},header:{type:["function","string"],default:null,null:!0},class:{type:"string",default:null,null:!0},splitInto:{type:["function","string"],default:null,null:!0}};static assignableMethods=["record","headerChanged","indexChanged","widthChanged","render","initialize"];_attributes={};_is_initialized=!1;cells=new Set;toggles=new Set;constructor(s){const t={};e(this.constructor,"assignableAttributes").filter(e=>e).reverse().forEach(e=>{Array.isArray(e)?(console.warn(`[Komps] assignableAttributes on ${this.constructor.name} uses deprecated array format. Convert to object schema: { attr: { type, default, null } }`),e.forEach(e=>{t[e]=t[e]||{type:"object",default:null,null:!0}})):Object.assign(t,e)}),Object.keys(t).forEach(i=>{Object.defineProperty(this,i,{configurable:!0,get:()=>"header"==i?null!=this._attributes.header?this._attributes.header:this.headerFallback():this._attributes[i],set:e=>{var t=this._attributes[i];e!==t&&(this._attributes[i]=e,this.attributeChangedCallback(i,t,e))}}),s.hasOwnProperty(i)?this[i]=s[i]:this[i]=t[i].default}),e(this.constructor,"assignableMethods").filter(e=>e).reverse().forEach(e=>{e.forEach(t=>{if(s.hasOwnProperty(t)&&"function"==typeof s[t]){const i=this[t];this[t]=function(...e){return e.push(i),s[t].call(this,...e)}}})}),this.initialize(s),this._is_initialized=!0}initialize(e){}widthChanged(e,t){this._is_initialized&&this.table.setTemplateColumns()}indexChanged(e,t){e!=t&&(this.headerCell&&(this.headerCell.cellIndex=t),this.cells.forEach(e=>e.cellIndex=t),this.frozen)&&this.table.renderFrozenDivider()}headerChanged(e,t){this._is_initialized&&this.table.trigger("headerChanged",{detail:this})}classChanged(t,i){this.cells.forEach(e=>e.classList.remove(...t.split(" "))),this.cells.forEach(e=>e.classList.add(...i.split(" ")))}changed(e,t,i){}attributeChangedCallback(e,...t){return this[e+"Changed"]&&this[e+"Changed"].call(this,...t),this.changed(e,...t)}record(e){return e}headerFallback(){}renderHeader(){return this.headerCell=this.createHeader(),this.headerCell}createHeader(){var e=new this.constructor.HeaderCell({column:this,table:this.table,class:this.class,cellIndex:this.index}).render();return this.frozen&&e.classList.add("frozen","frozen-"+this.index),e}async renderCell(e,t){return this.createCell(e,t)}async createCell(e,t={}){t=new this.constructor.Cell(Object.assign({column:this,table:this.table,record:e?await r(this,"record",e):void 0,cellIndex:this.index,class:this.class},t));return e&&t.render(),this.frozen&&t.classList.add("frozen","frozen-"+this.index),t}remove(e={}){this.headerCell.remove(),this.cells.forEach(e=>e.remove()),this.cells.clear(),1!=e.silent&&this.table.trigger("columnRemoved",{detail:this})}get offsetWidth(){return this.headerCell.offsetWidth}get offsetLeft(){return this.headerCell.offsetLeft}}class P extends u{static tagName="komp-table-group";get table(){return this.row?.table}get row(){return this.parentElement}get rowIndex(){return this.row.rowIndex}get cells(){return Array.from(this.querySelectorAll(this.table.cellSelector))}get rowCount(){return Math.max(...this.cells.map(e=>e.groupIndex))}append(...e){return super.append(...e)}}window.customElements.define(P.tagName,P);class dt extends u{static tagName="komp-table-row";static assignableAttributes={rowIndex:{type:"number",default:null,null:!0},table:{type:"object",default:null,null:!0},height:{type:"string",default:null,null:!0},record:{type:"object",default:null,null:!0}};#rowCount=0;get cells(){return Array.from(this.querySelectorAll(this.table.cellSelector))}get rowCount(){return this.#rowCount}set rowCount(e){this.style.gridTemplateRows=`repeat(${e}, var(--row-size, auto))`,this.#rowCount=e}constructor(...e){super(...e),this.generatedGroupNames=new Map}rowIndexChanged(e,t){e!=t&&(this.style.gridRow=t)}heightChanged(e){this.parentElement&&this.table.setTemplateRows()}async renderColumn(i,s){if(i.splitInto){var n=await i.renderCell(null,{readonly:!0,disabled:!0}),r=(this.append(n),await("function"==typeof i.splitInto?i.splitInto(s):s[i.splitInto]));if(null==r||0==r.length)return n.toggleAttribute("disabled",!1),n;n=await Promise.all(await r.map(async(e,t)=>{e=await i.renderCell(e);return e.groupIndex=t+1,e}));let e="string"==typeof i.splitInto?i.splitInto:i.splitInto.name,t=("splitInto"!=e||(e=this.generatedGroupNames.get(i.splitInto))||(e="group-"+this.generatedGroupNames.size,this.generatedGroupNames.set(i.splitInto,e)),this.querySelector(P.tagName+`[data-name=${e}]`));return t||(t=new P({data:{name:e}}),this.append(t)),t.append(...n),n}return r=await i.renderCell(s),this.append(r),r}}window.customElements.define(dt.tagName,dt);class ut extends dt{static tagName="komp-table-header";rowIndexChanged(e,t){this.style.gridRow=t}}window.customElements.define(ut.tagName,ut);class pt extends u{static assignableAttributes={data:{type:"array",default:[],null:!1},columns:{type:"array",default:[],null:!1}};static tagName="komp-table";static columnTypeRegistry={default:ht};static Row=dt;static Header=ut;static events=["headerChanged","columnRemoved","columnsChanged","afterRender"];frozenLeft=0;constructor(...e){super(...e),this.rowSelector=this.constructor.Row.tagName+", "+this.constructor.Header.tagName,this.cellSelector=x(Object.values(this.constructor.columnTypeRegistry).map(e=>[e.Cell.tagName,e.HeaderCell.tagName]).flat()).map(e=>e+":not([disabled])").join(", ")}async initialize(...e){e=await super.initialize(...e);return await this.initializeColumns(),this.setTemplateColumns(),this.rendering=this.render(),await this.rendering,e}remove(...e){this.resizeObserver&&this.resizeObserver.disconnect(),this.frozenColumnResizeObserver&&this.frozenColumnResizeObserver.disconnect(),this.interersectionObserver&&this.interersectionObserver.disconnect(),super.remove(...e)}async initializeColumns(){return this.columns=await Promise.all(await(await this.columns).map(this.initializeColumn,this)),this.columns}async initializeColumn(e,t){var i=(e=await e).type||"default";return new(this.constructor.columnTypeRegistry[i]||this.constructor.columnTypeRegistry.default)(Object.assign({table:this,index:t+1},e))}observeResize(e){this.frozenColumnResizeObserver||(this.frozenColumnResizeObserver=new ResizeObserver(e=>{this.frozenLeft=0,this.header.querySelectorAll(":scope > .frozen").forEach((e,t)=>{var i=e.offsetLeft-this.scrollLeft;this.style.setProperty("--frozen-position-"+e.cellIndex,i+"px"),this.frozenLeft=i+e.offsetWidth})})),this.frozenColumnResizeObserver.observe(e)}unobserveResize(e){this.frozenColumnResizeObserver&&this.frozenColumnResizeObserver.unobserve(e)}observeIntersection(e){return this.interersectionObserver||this.setInterersectionObserver(),this.interersectionObserverTargets||(this.interersectionObserverTargets=new Set),this.interersectionObserver.observe(e),this.interersectionObserverTargets.add(e),e}setInterersectionObserver(){let e=function e(t,i){return i(t)?t:t.parentElement?e(t.parentElement,i):null}(this,e=>e.scrollHeight>e.clientHeight);e==this.getRootNode().documentElement&&(e=null),this.interersectionObserver=new IntersectionObserver(e=>{e.forEach(e=>{this.querySelector(e.target.dataset.target)?.classList.toggle("show",e.intersectionRatio<=0)})},{root:e}),this.resizeObserver||(this.resizeObserver=new ResizeObserver(e=>{e.forEach(e=>e.target.resetInterersectionObserver())}),this.resizeObserver.observe(this))}resetInterersectionObserver(){this.interersectionObserver&&(this.interersectionObserver.disconnect(),this.setInterersectionObserver(),this.interersectionObserverTargets.forEach(e=>{this.interersectionObserver.observe(e)}))}async render(){this.innerHTML="",l(this,this.renderHeader()),await l(this,await this.renderRows()),this.renderFrozenDivider(),this.setTemplateRows(),this.trigger("afterRender")}renderFrozenDivider(){var t,i=this.columns.filter(e=>e.frozen);if(0<i.length){this.querySelector(this.localName+"-frozen-indicator.column")||(t=this.observeIntersection(w(this.localName+"-frozen-indicator",{class:"column",data:{target:this.localName+"-frozen-divider.column"}})),l(this,t));let e=this.querySelector(this.localName+"-frozen-divider.column");e||l(this,e=w(this.localName+"-frozen-divider",{class:"column"})),e.style.setProperty("grid-column","1 / "+(i.length+1))}else this.querySelector(this.localName+"-frozen-indicator.column")?.remove(),this.querySelector(this.localName+"-frozen-divider.column")?.remove()}setTemplateColumns(){this.style.gridTemplateColumns=this.columns.map(e=>e.width||"var(--column-size)").join(" ")}setTemplateRows(){var e=Array.from(this.querySelectorAll(this.constructor.Row.tagName));this.style.gridTemplateRows=[this.header.height||"var(--row-size)"].concat(e.map(e=>e.height||"var(--row-size)"),"auto").join(" ")}renderHeader(){return this.header=new this.constructor.Header({rowIndex:1,table:this,content:this.columns.map(this.renderColumnHeader,this)}),this.append(this.observeIntersection(w(this.localName+"-frozen-indicator",{class:"row",data:{target:this.localName+"-frozen-divider.row"}}))),this.append(w(this.localName+"-frozen-divider",{class:"row",style:{"grid-row":"1"}})),this.header}renderColumnHeader(e){return e.renderHeader()}async renderRows(){return Promise.all(await(await this.data).map((e,t)=>this.renderRow(e,t+2)))}async renderRow(t,e){const i=new this.constructor.Row({record:t,rowIndex:e,table:this});return this.columns.forEach(async e=>{i.renderColumn(e,t)}),i}appendRow(e,...t){return this.#spliceRow(e,0,t)}removeRow(e,t=1){return this.#spliceRow(e,t)}async#spliceRow(s,n,r=[],e){var t=()=>new Promise(async e=>{var t,i=await Promise.all(r.map(async(e,t)=>e instanceof this.constructor.Row?e:this.renderRow(e,s+t)));this.rows.slice(s-1,s-1+n).forEach(e=>e.remove()),0<i.length&&((t=this.rows[s-1])?await a(t,i):await c(this.rows[this.rows.length-1],i)),this.rows.forEach((e,t)=>e.rowIndex=t+1),this.setTemplateRows(),e(i)});return this.rendering?this.rendering=this.rendering.then(t):this.rendering=t(),this.rendering}sortRows(e){return Array.from(this.querySelectorAll(this.constructor.Row.tagName)).sort(e).map((e,t)=>{this.append(e),e.rowIndex=t+2})}get rows(){return Array.from(this.querySelectorAll(this.rowSelector))}get cells(){return Array.from(this.querySelectorAll(this.cellSelector))}async#spliceColumns(r,e,i=[],t=!0){i=await Promise.all(i.map(async(e,t)=>e instanceof ht?e:this.initializeColumn(e,r+t-1)));let s;var n;return t?s=this.columns.splice(r-1,e,...i):(s=this.columns.slice(r-1,r-1+e),this.columns=this.columns.toSpliced(r-1,e,...i)),this.columns.forEach((e,t)=>{e.index=t+1}),this.setTemplateColumns(),await this.rendering,s.forEach(e=>e.remove({silent:t})),0<i.length&&(e=i.map(e=>e.headerCell||this.renderColumnHeader(e)),(n=this.header.children.item(r-1))?a(n,e):c(this.header.children,e),await Promise.all(await(await this.data).map(async(t,e)=>{const n=this.rows[e+1];return Promise.all(i.map(async s=>{var e=Array.from(s.cells).filter(e=>e.rowIndex==n.rowIndex);return 0==e.length?n.renderColumn(s,t):Promise.all(e.map(async e=>{let t=n;s.splitInto&&(t=e.parentElement);var i=Array.from(t.children).find(e=>e.cellIndex&&r<e.cellIndex);i?await a(i,e):await l(t,e)}))}))}))),i}spliceColumns(e,t,...i){return this.#spliceColumns(e,t,...i)}insertColumns(e,...t){return this.#spliceColumns(e,0,t)}addColumns(e,...t){return this.#spliceColumns(e,0,t,!1)}deleteColumn(e){return this.deleteColumns([e])}async deleteColumns(e,t){let i=[e.shift()];const s=[i];e.forEach(e=>{i[i.length-1].index==e.index-1?i.push(e):(i=[e],s.push(i))});for(const n of s)await this.spliceColumns(n[0].index,n.length,[],t);return e}removeColumn(e){return this.deleteColumns([e],!1)}removeColumns(e){return this.deleteColumns(e,!1)}replaceColumn(e,...t){return this.#spliceColumns(e.index,1,t,!1)}at(t,i,s){var e=this.cells;return t<0&&(t+=Math.max(...e.map(e=>e.cellIndex))),i<0&&(i+=Math.max(...e.map(e=>e.rowIndex))),e.find(e=>{if(e.cellIndex==t&&e.rowIndex==i)return!e.groupIndex||!s||e.groupIndex==Math.min(s<0?e.parentElement.rowCount+s+1:s,e.parentElement.rowCount)})}slice(e,t){let s;e.groupIndex&&t.groupIndex&&e.parentElement.dataset.name==t.parentElement.dataset.name&&(s=e.parentElement.dataset.name);const[n,r]=[e.rowIndex,t.rowIndex].sort((e,t)=>e-t),[o,a]=[e.cellIndex,t.cellIndex].sort((e,t)=>e-t);let[l,c]=[e.groupIndex,t.groupIndex].sort((e,t)=>e-t);return e.rowIndex<t.rowIndex&&(l=e.groupIndex),t.rowIndex<e.rowIndex&&(l=t.groupIndex),this.rows.map((e,t,i)=>{if(W(e.rowIndex,n,r))return e.cells.map((e,t,i)=>W(e.cellIndex,o,a)?e.groupIndex&&e.parentElement.dataset.name==s?e.rowIndex==n&&e.rowIndex==r?W(e.groupIndex,l,c)?e:null:e.rowIndex==n?l<=e.groupIndex?e:null:e.rowIndex!=r||e.groupIndex<=c?e:null:e:null).filter(e=>null!=e).flat()}).filter(e=>null!=e).flat()}queryCell(e=""){return this.querySelector(this.cellSelector.split(", ").map(t=>e.split(", ").map(e=>t+e).join(", ")).join(", "))}queryCells(e=""){return this.querySelectorAll(this.cellSelector.split(", ").map(t=>e.split(", ").map(e=>t+e).join(", ")).join(", "))}static style=function(){return`
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

        ${this.tagName}-cell[disabled]     { z-index: 1; }
        ${this.tagName}-cell               { z-index: 2; }
        ${this.tagName}-cell.frozen        { z-index: 100; }
        ${this.tagName}-header             { z-index: 110; }
        ${this.tagName}-header-cell.frozen { z-index: 115; }
        ${this.tagName}-frozen-divider     { z-index: 120; }
    `}}window.customElements.define(pt.tagName,pt);class mt extends n{static tagName="komp-tooltip";static watch=["anchor"];static assignableAttributes={autoPlacement:{type:"boolean",default:!1,null:!1},flip:{type:"boolean",default:!0,null:!1},shift:{type:"boolean",default:!0,null:!1},strategy:{type:"string",default:"absolute",null:!1},placement:{type:"string",default:"top",null:!1},arrow:{type:"boolean",default:!0,null:!1},timeout:{type:"number",default:300,null:!1},scope:{type:"string",default:"general",null:!1}};constructor(e={},...t){super(e,...t),this.anchorChanged(this.anchor,this.anchor),void 0===e&&(this.needsFirstRemoval=!0),0!=e.enabled&&this.enable()}enable(){this.anchor.addEventListener("mouseenter",this.show),this.anchor.addEventListener("mouseleave",this.hide),this.addEventListener("mouseenter",this.show),this.addEventListener("mouseleave",this.hide)}disable(){this.anchor.removeEventListener("mouseenter",this.show),this.anchor.removeEventListener("mouseleave",this.hide),this.removeEventListener("mouseenter",this.show),this.removeEventListener("mouseleave",this.hide)}connected(){if(super.connected(),this.getRootNode()==this.anchor.getRootNode()&&0==this.showing)return F(this),!1}anchorChanged(e,t){e&&e.removeEventListener&&(e.removeEventListener("mouseenter",this.show),e.removeEventListener("mouseleave",this.hide)),t&&t.addEventListener&&(t.addEventListener("mouseenter",this.show),t.addEventListener("mouseleave",this.hide))}async remove(){await super.remove(),window.activeTooltips[this.scope]==this&&delete window.activeTooltips[this.scope]}}window.customElements.define("komp-tooltip",mt);class ft extends n{static watch=["anchor"];static assignableAttributes={mouseevent:{type:"string",default:"click",null:!1},placement:{type:"string",default:"bottom",null:!1},autoPlacement:{type:"boolean",default:!1,null:!1},flip:{type:"boolean",default:!0,null:!1},shift:{type:"boolean",default:!0,null:!1},strategy:{type:"string",default:"absolute",null:!1},arrow:{type:"boolean",default:!1,null:!1},removeOnBlur:{type:"boolean",default:!0,null:!1},timeout:{type:"number",default:0,null:!1}};static bindMethods=["toggle"];constructor(e,...t){super(e,...t),this.anchorChanged(this.anchor,this.anchor),void 0===e&&(this.needsFirstRemoval=!0)}connected(...e){super.connected(...e),this.addEventListener("mouseenter",this.#clearHide.bind(this)),"mouseenter"==this.mouseevent&&this.addEventListener("mouseleave",this.hide.bind(this))}show(){return super.show(),this.anchor.classList.add("-active"),this}hide(){return super.hide(),this.anchor.classList.remove("-active"),this}anchorChanged(e,t){"mouseenter"==this.mouseevent?super.anchorChanged(e,t):(e&&e instanceof HTMLElement&&e.removeEventListener(this.mouseevent,this.toggle.bind(this)),t&&t instanceof HTMLElement&&t.addEventListener(this.mouseevent,this.toggle.bind(this)))}#clearHide(){this._hideTimeout&&(clearTimeout(this._hideTimeout),delete this._hideTimeout)}}window.customElements.define("komp-dropdown",ft);class gt extends u{static assignableAttributes={timeout:{type:"number",default:5e3,null:!1},animation:{type:["boolean","object"],default:!0,null:!1},dismissable:{type:"boolean",default:!0,null:!1}};constructor(e,t){super(t),o(this,w({class:"komp-notification-body",content:e})),this.dismissable&&l(this,d({type:"button",class:"dismiss-button",content:`
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 25 25" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
                    <circle cx="13" cy="13" r="11" stroke-dasharray="0% 300%" />
                    <line x1="17" y1="9" x2="9" y2="17"></line><line x1="9" y1="9" x2="17" y2="17"></line>
                    </svg>`},e=>{this.remove()}))}connected(){this.dismissable&&(this.addEventListener("mouseenter",this.clearTimeout),this.addEventListener("mouseleave",this.restartTimeout),this.timer=this.querySelector(".dismiss-button circle").animate([{strokeDasharray:"300% 300%"},{strokeDasharray:"0% 300%"}],{duration:Number(this.timeout),iterations:1}),this.timer.finished.then(()=>this.remove())),this.animation&&this.animate([{opacity:0,easing:"ease-out",marginBottom:-1*this.offsetHeight+"px"},{opaicty:1,marginBottom:"0px"}],Object.assign({duration:150,iterations:1},this.animation))}remove(...e){if(this.animation)return this.animate([{opaicty:1,marginBottom:"0px",easing:"ease-in"},{opacity:0,marginBottom:-1*this.offsetHeight+"px"}],Object.assign({duration:150,iterations:1},this.animation)).finished.then(()=>{super.remove.call(this,...e)});super.remove.call(this,...e)}clearTimeout(){this.timer.pause(),this.timer.currentTime=0}restartTimeout(){this.timer.play()}}window.customElements.define("komp-notification",gt);class yt extends u{static assignableAttributes=gt.assignableAttributes;constructor(...e){super(...e),this.setAttribute("popover","manual")}connected(){this.showPopover()}add(e,t){this.hidePopover(),this.showPopover();e=new gt(e,Object.assign({timeout:this.timeout,dismissable:this.dismissable},t));return l(this,e),e}static style=`
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
    `}window.customElements.define("komp-notification-center",yt);class bt extends u{static tagName="komp-dropzone";static assignableAttributes={enabled:{type:"boolean",default:!0,null:!1},onFileDrop:{type:"function",default:null,null:!0},dragHereOverlay:{type:["object","HTMLElement"],default:{class:"drag-here",content:"Drag Here"},null:!1},dragOverOverlay:{type:["object","HTMLElement"],default:{class:"drag-over",content:"Drop Here"},null:!1}};static bindMethods=["windowDragEnter","windowDragLeave","windowDrop","drop","dragOver","dragEnter","dragLeave"];constructor(e={},...t){super(e,...t),e.overlay&&(console.warn("Dropzone.overlay option is deprecated use dragHereOverlay and/or dragOverOverlay"),e.dragHereOverlay||(this.dragHereOverlay=e.overlay),e.dragOverOverlay||(this.dragOverOverlay=e.overlay)),"object"!=typeof this.dragHereOverlay||this.dragHereOverlay instanceof HTMLElement||(this.dragHereOverlay=w("komp-dropzone-overlay",Object.assign({},this.constructor.assignableAttributes.dragHereOverlay.default,this.dragHereOverlay))),"object"!=typeof this.dragOverOverlay||this.dragOverOverlay instanceof HTMLElement||(this.dragOverOverlay=w("komp-dropzone-overlay",Object.assign({},this.constructor.assignableAttributes.dragOverOverlay.default,this.dragOverOverlay)))}addEventListeners(){this.getRootNode()&&(this.getRootNode().addEventListener("dragenter",this.windowDragEnter),this.getRootNode().addEventListener("dragleave",this.windowDragLeave),this.getRootNode().addEventListener("drop",this.windowDrop)),this.addEventListener("drop",this.drop),this.addEventListener("dragover",this.dragOver),this.addEventListener("dragenter",this.dragEnter),this.addEventListener("dragleave",this.dragLeave)}removeEventListeners(){this.getRootNode()&&(this.getRootNode().removeEventListener("dragenter",this.windowDragEnter),this.getRootNode().removeEventListener("dragleave",this.windowDragLeave),this.getRootNode().removeEventListener("drop",this.windowDrop)),this.removeEventListener("drop",this.drop),this.removeEventListener("dragover",this.dragOver),this.removeEventListener("dragenter",this.dragEnter),this.removeEventListener("dragleave",this.dragLeave)}connected(){"static"==h(this,"position")&&(this.style.position="relative"),this.enabled&&this.addEventListeners()}disconnected(){this.enabled&&this.removeEventListeners()}enable(){this.enabled||(this.enabled=!0,this.addEventListeners())}disable(){0!=this.enabled&&(this.enabled=!1,this.removeEventListeners())}drop(e){e.target!=this&&!this.contains(e.target)||(e.preventDefault(),[...e.dataTransfer.files].forEach(e=>{this.onFileDrop&&this.onFileDrop(e),this.trigger("filedrop",e)}))}dragEnter(e){e.preventDefault(),this.dragHereOverlay.remove(),this.append(this.dragOverOverlay)}dragLeave(e){e.preventDefault(),this.contains(e.relatedTarget)||(this.dragOverOverlay.remove(),this.append(this.dragHereOverlay))}dragOver(e){e.preventDefault()}windowDragEnter(e){e.preventDefault(),e.relatedTarget&&e.relatedTarget.getRootNode()==this.getRootNode()||(this.dragOverOverlay.remove(),this.append(this.dragHereOverlay))}windowDragLeave(e){e.preventDefault(),e.relatedTarget&&e.relatedTarget.getRootNode()==this.getRootNode()||(this.dragOverOverlay.remove(),this.dragHereOverlay.remove())}windowDrop(e){e.preventDefault(),this.dragOverOverlay.remove(),this.dragHereOverlay.remove()}static style=`
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
        komp-dropzone-overlay.drag-over {
            background: rgba(0,0,0, 0.3);
            color: black;
        }
    `}window.customElements.define(bt.tagName,bt);class i extends lt{static tagName="komp-spreadsheet-cell";static assignableAttributes={readonly:{type:"boolean",default:!1,null:!1}};constructor(e,...t){super(e,...t),this.tabIndex=0,this.addEventListener("focusin",this.onFocusIn),this.addEventListener("focusout",this.onFocusOut),null!=e.disabled&&this.toggleAttribute("disabled",e.disabled)}onFocusIn(e){this.focusCell=w(this.table.tagName+"-focus"),this.focusCell.classList.toggle("frozen",this.classList.contains("frozen")),this.focusCell.classList.toggle("readonly",this.readonly),this.focusCell.style.setProperty("grid-column",this.cellIndex),this.groupIndex&&this.focusCell.style.setProperty("grid-row",this.groupIndex),this.parentElement.append(this.focusCell);var t=parseInt(h(this.focusCell,"outline-width"));const i=this.table.scrollLeft+this.table.frozenLeft,s=this.table.scrollTop+this.table.header.offsetHeight,n=this.table.scrollLeft+this.table.clientWidth,r=this.table.scrollTop+this.table.clientHeight,o=this.focusCell.offsetLeft-t,a=this.focusCell.offsetTop-t,l=this.focusCell.offsetLeft+this.focusCell.offsetWidth+t,c=this.focusCell.offsetTop+this.focusCell.offsetHeight+t;t={left:0,top:0};o<i?t.left=o-i:l>n&&(t.left=l-n),a<s?t.top=a-s:c>r&&(t.top=c-r),this.table.scrollBy(t)}onFocusOut(e){this.focusCell.remove(),delete this.focusCell}focusAdjacentCell(e){let t=this.cellIndex,i=this.rowIndex,s=this.groupIndex;"up"==e||"down"==e?i+="up"==e?-1:1:t+="left"==e?-1:1,s&&("up"==e?1==s?s=-1:(s--,i=this.rowIndex):"down"==e&&(s==this.parentElement.rowCount?s=1:(s++,i=this.rowIndex)));var n,r=this.table.at(t,i,s);return r&&(this.table.style.setProperty("scroll-snap-type","unset"),n=r.getBoundingClientRect(),this.table.getBoundingClientRect(),e=["left","up"].includes(e)?[n.x+1,n.y+1]:[n.x+n.width-1,n.y+n.height-1],document.elementFromPoint(...e),r.focus({preventScroll:!0}),this.table.style.removeProperty("scroll-snap-type")),r}async activate(e={}){if(!this.readonly&&void 0!==this.spawnInput&&null!==this.spawnInput){const t=await this.spawnInput(e);if(void 0!==t&&null!==t&&!1!==t){this.tabIndex=-1,t.addEventListener("hidden",()=>{this.tabIndex=0,this.render()});let e=t.querySelector("[autofocus]");if(e=e||t.querySelector("input, textarea, select, [contenteditable]")){const i=()=>{e.focus(),e.showPicker&&e.showPicker()};e._loading&&e._loading instanceof Promise?e._loading.then(()=>setTimeout(i,50)):setTimeout(i,50)}return t.addEventListener("keyup",e=>{"Escape"==e.key?(t.setAttribute("preventChange",!0),this.focus(),e.preventDefault()):"Enter"==e.key&&!1!==this.column.onEnter(e)&&!this.table._enterDown&&[e.metaKey,e.ctrlKey,e.altKey,e.shiftKey].every(e=>0==e)&&(e.preventDefault(),this.focusAdjacentCell("down")||(this.focus(),t.hide()))}),t.addEventListener("keydown",e=>{"Enter"==e.key&&!1!==this.column.onEnter(e)&&[e.metaKey,e.ctrlKey,e.altKey,e.shiftKey].every(e=>0==e)&&e.preventDefault()}),t}}}createInput(e){return this.column.input(this.record,this,e)}async spawnInput(e){var e=await this.createInput(e);return e&&(c(this,e=new n({class:"komp-spreadsheet-input",anchor:this,style:{"--padding":h(this,"padding"),"--cell-width":this.offsetWidth+"px","--cell-height":this.offsetHeight+"px","--remaining-width":this.table.offsetWidth-this.offsetLeft+"px","--remaining-height":this.table.offsetHeight-this.offsetTop+"px"},content:{tag:"label",content:e,class:this.column.class},placement:"bottom-start",autoPlacement:{alignment:"start",allowedPlacements:["top","bottom"]},removeOnBlur:!0,offset:({rects:e})=>({mainAxis:-e.reference.height})})),e.show())}canCopy(){return!!this.column.copy}copy(){return this.column.copy(this)}canPaste(){return!!this.column.paste}paste(e){return this.column.paste(this,e)}clear(){this.column.clear(this),this.render()}contextMenu(e){return this.column?.contextMenu(e,this,this.column)}}window.customElements.define(i.tagName,i);class vt extends i{static tagName="komp-spreadsheet-header-cell";render(){return o(this,r(this.column,"header",this)),this}createInput(){if(this.column.headerEditable)return j.create("contentarea",Object.assign({record:this.column,attribute:"header"}))}canCopy(){return!0}copy(){return r(this.column,"header",this)}canPaste(){return!0}paste(e){return this.column.header=e}connected(){super.connected(),this.column.frozen&&this.table.observeResize(this)}disconnected(){this.column.frozen&&this.table.unobserveResize(this)}}window.customElements.define(vt.tagName,vt);class wt extends ht{static Cell=i;static HeaderCell=vt;static assignableAttributes={type:{type:"string",default:null,null:!0},attribute:{type:"string",default:null,null:!0},headerEditable:{type:"boolean",default:!0,null:!1}};static assignableMethods=["input","copy","paste"];initialize(e){this.configuredContextMenu=e.contextMenu,this.inputOptions=e.input,e.hasOwnProperty("copy")&&!e.copy&&(this.copy=void 0),e.hasOwnProperty("paste")&&!e.paste&&(this.paste=void 0)}headerFallback(){return this.attribute}render(e){e=r(e,this.attribute);return e&&"string"==typeof e?e.replaceAll("\n","<br>"):e}copy(e){return r(e.record,this.attribute)}static pasteAccepts=["text/plain"];paste(e,t){e.record[this.attribute]=t}clear(e){e.record[this.attribute]=null}input(e,t,i){return j.create(this.type||"contentarea",Object.assign({record:e,attribute:this.attribute,autofocus:!0},this.inputOptions,i))}contextMenu(e,...t){return this.configuredContextMenu?this.configuredContextMenu(e,...t):e}onEnter(){}}class xt extends wt{paste=void 0;renderCell(e,t={}){return t.readonly=!0,super.renderCell(e,t)}}class kt extends wt{static assignableAttributes={type:{type:"string",default:"number",null:!1}};async paste(e,t){var i=parseFloat(t);return isNaN(i)?super.paste(e,t):super.paste(e,i)}}class Ct extends wt{static assignableAttributes={type:{type:"string",default:"checkbox",null:!1}};input(e,t){t=t.querySelector("input");t.checked=!t.checked,q(t,"change")}render(e){return w("label",{content:j.create(this.type,Object.assign({record:e,attribute:this.attribute,name:this.attribute},this.inputOptions))})}paste(e,t){return super.paste(e,!!t)}}class Et extends wt{static inputAttributes=["options"];static assignableAttributes={type:{type:"string",default:"select",null:!1}};constructor(e){super(e),this.options=e.options}async input(e){return j.create(this.type,Object.assign({record:e,attribute:this.attribute,options:this.options,autofocus:!0},this.inputOptions))}}function zt(e){e.cellsDimensions=function(e){var t=this.querySelectorAll(this.cellSelector),t=t.item(t.length-1);return{width:t.offsetLeft+t.offsetWidth,height:t.offsetTop+t.offsetHeight}[e]}}function Lt(e){this.include(zt),this.events.push("columnResize","rowResize"),this.assignableAttributes.resize={type:["boolean","string","array"],default:!0,null:!1},this.assignableAttributes.resizeMin={type:"number",default:5,null:!1};const t=e.initialize,i=(e.initialize=function(...e){return!0===this.resize?this.resize=["columns","rows"]:!1===this.resize?this.resize=[]:"string"==typeof this.resize&&(this.resize=[this.resize]),this.addEventListenerFor(this.cellSelector,"mouseover",()=>{this.clearResizeHandles()}),this.addEventListener("mouseleave",()=>{this.clearResizeHandles()}),this.addEventListenerFor(".resizable","mouseover",e=>{this.showResizeHandleFor(e.delegateTarget)}),t.call(this,...e)},this.columnTypeRegistry.default.assignableAttributes.resize={type:"boolean",default:!0,null:!1},e.renderColumnHeader);e.renderColumnHeader=function(e,...t){t=i.call(this,e,...t);return this.resize.includes("columns")&&0!=e.resize&&t.classList.add("resizable","resizable-column"),t},e.clearResizeHandles=function(){this.resizing||this.querySelectorAll(this.tagName+"-resize-handle").forEach(e=>e.remove())},e.showResizeHandleFor=function(s){this.resizing||(this.clearResizeHandles(),["column","row"].forEach(e=>{var t,i;s.classList.contains("resizable-"+e)&&(t=d(this.tagName+"-resize-handle",{class:"resizable-"+e,content:[{tag:"handle-start"},{tag:"handle-end"}],style:{"grid-column":s.cellIndex,"grid-row":s.rowIndex}},"pointerdown",this.activateAxisResize.bind(this)),s.classList.contains("frozen")&&t.classList.add("frozen","frozen-"+s.cellIndex),(i="column"==e?s:s.row).previousElementSibling&&i.previousElementSibling.classList.contains("resizable-"+e)||t.querySelector("handle-start").remove(),t.cell=s,this.append(t))}))},e.activateAxisResize=function(e){this.setPointerCapture(e.pointerId),this.resizing=!0;var t=e.target.parentElement,i=this.getBoundingClientRect();let s=t.cell,{direction:n,axis:r,axisMin:o,axisMax:a,offset:l,slice:c,start:h,blockDimension:d,inlineDimension:u,sliceType:p,sliceIndex:m}=("handle-start"==e.target.localName&&(s=t.classList.contains("resizable-row")?this.at(s.cellIndex,s.rowIndex-1):s.previousElementSibling),t.classList.contains("resizable-row")?{direction:"Row",axis:"y",axisMin:s.offsetTop+this.resizeMin,axisMax:this.scrollHeight,offset:this.scrollTop-i.top,slice:s.row,start:e.y-s.offsetHeight,blockDimension:"width",inlineDimension:"height",inlinePosition:"Top",index:"rowIndex",sliceIndex:"rowIndex",sliceType:"rows"}:{direction:"Column",axis:"x",axisMin:s.offsetLeft+this.resizeMin,axisMax:this.scrollWidth,offset:this.scrollLeft-i.left,slice:s.column,start:e.x-s.offsetWidth,blockDimension:"height",inlineDimension:"Width",inlinePosition:"Left",index:"cellIndex",sliceIndex:"index",sliceType:"columns"});this.classList.add("resizing-"+n.toLowerCase());t=Array.from(this.querySelectorAll(this.constructor.Header.tagName+" > .selected"));let f;f=t.includes(s)?x(t.map(e=>"Column"==n?e.column:e.row)):(this.clearSelectedCells&&this.clearSelectedCells(),this.selectCells&&this.selectCells(s),[c]),this.clearOutlines&&this.clearOutlines();const g=w(this.constructor.tagName+"-drag-indicator",{class:n.toLowerCase(),style:{"inset-inline-start":e[r]+l+"px","block-size":this.cellsDimensions(d)+"px"}});function y(e){e=e[r]+l,e=Math.max(e,o);e=Math.min(e,a),g.style.insetInlineStart=e+"px"}this.append(g),this.addEventListener("pointermove",y),this.addEventListener("pointerup",e=>{let t=e[r]-h;t=Math.max(t,this.resizeMin);const i=Math.min(...f.map(e=>e[m]));this[p].filter(e=>e[m]<i).forEach(e=>{e[u.toLowerCase()]=e.cells.values().toArray().at(0)["offset"+u]+"px"}),f.forEach(e=>{e[u.toLowerCase()]=t+"px"}),this.trigger(n.toLowerCase()+"Resize",{detail:{[p]:f}}),g.remove(),this.removeEventListener("pointermove",y),setTimeout(()=>{this.resizing=!1,this.classList.remove("resizing-"+n.toLowerCase()),this.releasePointerCapture(e.pointerId)})},{once:!0})},Array.isArray(this.style)||(this.style=[this.style]),this.style.push(()=>`
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
    `)}function At(e){this.include(zt),this.events.push("columnReorder","rowReorder"),this.assignableAttributes.reorder={type:["boolean","string","array"],default:!0,null:!1};const t=e.initialize,i=(e.initialize=function(...e){return!0===this.reorder?this.reorder=["columns","rows"]:!1===this.reorder?this.reorder=[]:"string"==typeof this.reorder&&(this.reorder=[this.reorder]),this.addEventListenerFor(this.cellSelector,"mouseover",()=>{this.clearReorderHandles()}),this.addEventListener("mouseleave",()=>{this.clearReorderHandles()}),this.addEventListenerFor(".reorderable","mouseover",e=>{this.showReorderHandleFor(e.delegateTarget)}),t.call(this,...e)},this.columnTypeRegistry.default.assignableAttributes.reorder={type:"boolean",default:!0,null:!1},e.renderColumnHeader),s=(e.renderColumnHeader=function(e,...t){t=i.call(this,e,...t);return this.reorder.includes("columns")&&0!=e.reorder&&t.classList.add("reorderable","reorderable-column"),t},this.columnTypeRegistry.default.prototype.renderCell);this.columnTypeRegistry.default.prototype.renderCell=async function(...e){e=await s.call(this,...e);return this.table.reorder.includes("rows")&&(e.classList.toggle("reorderable",1==e.cellIndex),e.classList.add("reorderable-row")),this.table.reorder.includes("columns")&&0!=this.reorder&&e.classList.add("reorderable-column"),e},e.clearReorderHandles=function(){this.reordering||this.querySelectorAll(this.tagName+"-reorder-handle").forEach(e=>e.remove())},e.showReorderHandleFor=function(t){this.reordering||(this.clearReorderHandles(),["column","row"].forEach(e=>{t.classList.contains("reorderable-"+e)&&(e=d(this.tagName+"-reorder-handle",{class:"reorderable-"+e,content:{horizontal:"row"==e}.horizontal?`
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
    `,style:{"grid-column":t.cellIndex,"grid-row":t.rowIndex}},"pointerdown",this.activateAxisReorder.bind(this)),t.classList.contains("frozen")&&e.classList.add("frozen","frozen-"+t.cellIndex),e.cell=t,this.append(e))}))},e.activateAxisReorder=function(e){this.setPointerCapture(e.pointerId);const s=this.getRootNode(),n=(this.reordering=!0,this.classList.add("reordering"),e.currentTarget);e=n.cell;const r=this.getBoundingClientRect();let{slice:t,direction:o,index:a,sliceIndex:l,axis:c,inlinePosition:h,inlineDimension:d,blockDimension:i}=n.classList.contains("reorderable-row")?{slice:e.row,direction:"Row",index:"rowIndex",sliceIndex:"rowIndex",inverseDirection:"Column",axis:"y",inlinePosition:"Top",inlineDimension:"Height",blockDimension:"Width"}:{slice:e.column,direction:"Column",index:"cellIndex",sliceIndex:"index",inverseDirection:"Row",axis:"x",inlinePosition:"Left",inlineDimension:"Width",blockDimension:"Height"},u,p;if((p=this.selectedCells?Array.from(this.querySelectorAll(this.constructor.Header.tagName+" > .selected")):p)&&p.includes(e)){let i=(u=x(p.map(e=>"Column"==o?e.column:e.row)))[0];u=u.filter((e,t)=>e[l]-i[l]<=1&&(i=e,!0))}else u=[t];this.clearSelectedCells&&this.clearSelectedCells(),u.forEach(e=>e.cells.forEach(e=>{e.classList.add("selected"),e.cells.forEach(e=>e.classList.add("selected"))})),this.selectedCells&&this.outlineCells(this.selectedCells());const m=Math.min(...u.map(e=>e[l])),f=(n.style.inlineSize=u.map(e=>e["offset"+d]).reduce((e,t)=>e+t)+"px",n.style.blockSize=this.cellsDimensions(i.toLowerCase())+"px",n.style.insetInlineStart=n["offset"+h]+"px",n.style.removeProperty("grid-area"),n.classList.add("reordering"),w(this.constructor.tagName+"-placement-indicator",{class:o.toLowerCase(),style:{["grid-"+o.toLowerCase()]:m}})),g=(f[a]=m,this.append(f),this.cellSelector.split(", ").map(e=>e+(".reorderable-"+o.toLowerCase())));let y,b=!1;const v=e=>{var t=s.elementsFromPoint(e.x,e.y).find(e=>e.matches(g.join(",")))||y,e=(y=t,e[c]-r[h.toLowerCase()]-n["offset"+d]/2+this["scroll"+h]);if(e=(e=e<0?0:e)>this["scroll"+d]-n["offset"+d]?this["scroll"+d]-n["offset"+d]:e,n.style.insetInlineStart=e+"px",t){e=t[a]+(m<t[a]?1:0);if(f[a]!=e){if(b)return;let e=this["scroll"+h];!n.cell.frozen&&this.frozenLeft&&"Column"==o&&(e+=this.frozenLeft),e+=.05*this["client"+d];var i=this["scroll"+h]+.95*this["client"+d];t["offset"+h]+t["offset"+d]>i?(b=!0,this.scrollBy({[h.toLowerCase()]:t["offset"+d]})):t["offset"+h]<e&&(b=!0,this.scrollBy({[h.toLowerCase()]:-1*t["offset"+d]})),b&&setTimeout(()=>b=!1,100)}f[a]=e,f.style["grid-"+o.toLowerCase()]=e}};this.addEventListener("pointermove",v),this.addEventListener("pointerup",async e=>{var t;f[a]!=m&&(t=f[a]-(m<f[a]?u.length:0),"Column"==o?(this.columns.splice(m-1,u.length),await this.insertColumns(t,...u)):(u.forEach(e=>e.remove()),await this.appendRow(t,...u)),this.trigger(o.toLowerCase()+"Reorder",{detail:{fromIndex:m-1,toIndex:t-1}})),this.selectedCells&&(this.clearOutlines(),this.outlineCells(this.selectedCells())),f.remove(),this.removeEventListener("pointermove",v),setTimeout(()=>{this.classList.remove("reordering"),this.reordering=!1,this.showReorderHandleFor(n.cell),this.releasePointerCapture(e.pointerId)})},{once:!0})},Array.isArray(this.style)||(this.style=[this.style]),this.style.push(()=>`
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
    `)}class Tt extends u{static tagName="komp-table-toggle";static assignableAttributes={column:{type:"object",default:null,null:!0},cellIndex:{type:"number",default:null,null:!0}};cellIndexChanged(e,t){this.style.gridColumn=t}connected(){this.column.toggles.add(this)}disconected(){this.column.toggles.delete(this)}}window.customElements.define(Tt.tagName,Tt);class Rt extends pt{static tagName="komp-spreadsheet";static assignableAttributes={scrollSnap:{type:"boolean",default:!1,null:!1}};static columnTypeRegistry={select:Et,number:kt,checkbox:Ct,radio:Ct,readonly:xt,default:wt};static events=["invalidPaste"];initialize(){return this.scrollSnap&&this.classList.add("scroll-snap"),this.addEventListenerFor(this.cellSelector,"mousedown",e=>{0==e.button&&(this.clearSelectedCells(),this.activateMouseCellSelection(e.delegateTarget,e))}),this.addEventListenerFor(this.cellSelector,"dblclick",e=>{e.delegateTarget.activate()}),this.addEventListenerFor(this.tagName+"-reorder-handle",["click","contextmenu"],e=>{this.activateContextMenu(e),e.preventDefault()}),this.addEventListenerFor(this.cellSelector,"contextmenu",e=>{this.activateContextMenu(e),e.delegateTarget.classList.contains("selected")||(this.clearSelectedCells(),this.selectCells(e.delegateTarget,e.delegateTarget,!0)),e.preventDefault()}),this.addEventListenerFor(this.cellSelector,"keydown",async t=>{var e;["ArrowRight","ArrowLeft","ArrowDown","ArrowUp"].includes(t.key)?(t.preventDefault(),e=t.delegateTarget.focusAdjacentCell(t.key.replace("Arrow","").toLowerCase()),t.shiftKey?(this.selectStartCell=this.selectStartCell||t.delegateTarget,this.selectCells(this.selectStartCell,e,!0)):this.clearSelectedCells()):"Enter"==t.key&&t.delegateTarget==this.getRootNode().activeElement?(t.preventDefault(),t.delegateTarget.activate(),this._enterDown=!0,this.addEventListener("keyup",e=>{delete this._enterDown},{once:!0})):"Tab"==t.key?(t.preventDefault(),t.delegateTarget.focusAdjacentCell(t.shiftKey?"left":"right")):"Escape"==t.key?this.clearSelectedCells(""):["Backspace","Delete","Clear"].some(e=>e==t.key)?t.delegateTarget.clear():1==t.key.length&&[t.metaKey,t.ctrlKey,t.altKey].every(e=>0==e)&&(t.delegateTarget.activate({value:t.key}),t.preventDefault())}),super.initialize()}connected(...e){if(this.getRootNode())return this.cleanupEventListenerFor(this.getRootNode(),"paste",e=>{this.contains(document.activeElement)&&document.activeElement instanceof i&&(e.preventDefault(),0<e.clipboardData.files.length?this.pasteData(e.clipboardData.files):this.pasteData(e.clipboardData.getData("text/plain")))}),this.cleanupEventListenerFor(this.getRootNode(),"copy",e=>{this.contains(document.activeElement)&&document.activeElement instanceof i&&(e.preventDefault(),this.copyCells())}),super.connected(...e)}selectCells(e,t,i=!1){null==t&&(t=e),e.localName.includes("header")||t.localName.includes("header");const s=i?"selected":"selecting";this.queryCells("."+s).forEach(e=>e.classList.remove(s)),this.querySelectorAll(this.localName+"-outline:not(.copy)").forEach(e=>e.remove()),(t=e.localName.includes("header")?this.at(t.cellIndex,this.rows.length):t).localName.includes("header")&&(e=this.at(e.cellIndex,this.rows.length));e=this.slice(e,t);e.forEach(e=>{e.classList.add(s)}),i&&this.outlineCells(e)}selectedCells(){let e=this.queryCells(".selected");return e=0==e.length?this.queryCells(":focus"):e}clearSelectedCells(e=":not(.copy)"){delete this.selectStartCell,this.queryCells(".selecting"+e).forEach(e=>e.classList.remove("selecting")),this.queryCells(".selected"+e).forEach(e=>e.classList.remove("selected")),this.clearOutlines(e)}activateMouseCellSelection(t,e){var i=t.localName.includes("header");const s=e=>{e=Y(e.target,this.cellSelector);e&&this.selectCells(t,e)};var n;e.shiftKey?(n=t,t=(t=this.queryCell(":focus"))||this.queryCell(".selecting"),e.preventDefault(),s({target:n})):i&&s({target:t}),this.getRootNode().addEventListener("mouseup",e=>{var e=Y(e.target,this.cellSelector);e==t&&!e.localName.includes("header")||((e=this.queryCells(".selecting")).forEach(e=>{e.classList.remove("selecting"),e.classList.add("selected")}),this.outlineCells(e)),this.removeEventListener("mouseover",s),t.focus()},{once:!0}),this.addEventListener("mouseover",s)}clearOutlines(e=":not(.copy)"){this.querySelectorAll(this.localName+"-outline"+e).forEach(e=>e.remove())}outlineCells(e){x((e=Array.isArray(e)?e:Array.from(e)).map(e=>e.parentElement.dataset.name));var t=Math.min(...e.map(e=>e.offsetLeft)),i=Math.min(...e.map(e=>e.offsetTop)),s=Math.max(...e.map(e=>e.offsetLeft+e.offsetWidth)),e=Math.max(...e.map(e=>e.offsetTop+e.offsetHeight)),s=w(this.localName+"-outline",{style:{left:t+"px",top:i+"px",width:s-t+"px",height:e-i+"px"}});return this.append(s),s}activateContextMenu(e){var t=e.delegateTarget.cell||e.delegateTarget,i=this.renderContextMenu(t),s=e.target.getBoundingClientRect();this.contextMenu&&(this.contextMenu.hide(),delete this.contextMenu),this.contextMenu=new n({content:i,anchor:t,offset:{mainAxis:e.offsetX-s.width,crossAxis:e.offsetY},placement:"right-start",shift:!1,flip:!0,autoPlacement:!1,removeOnBlur:!0,autoUpdate:!1}),this.append(this.contextMenu)}renderContextMenu(e){if(e.contextMenu)return e.contextMenu(w("komp-spreadsheet-context-menu",{content:[d("button",{name:"copy",type:"button",content:"Copy",disabled:!e.canCopy||!e.canCopy()},e=>{this.copyCells(),this.contextMenu&&(this.contextMenu.remove(),delete this.contextMenu)}),d("button",{name:"paste",type:"button",content:"Paste",disabled:!e.canPaste||!(e.canPaste()&&(null!=window.navigator.clipboard.readText||this.copyData))},async e=>{window.navigator.permissions.query({name:"clipboard-read",requestedOrigin:window.location.origin}).then(async()=>{this.pasteData(await window.navigator.clipboard.readText())},()=>{this.renderPasteModal()})})]}))}renderPasteModal(){var e=window.navigator.userAgent.toLowerCase().includes("mac")?"&#8984;":"Ctrl";this.getRootNode().body.append(new te({class:"paste-modal",content:[{tag:"h1",content:"Copying and Pasting"},{tag:"p",content:"These actions are unavailable using the Edit menus, but you can still use:",style:{"margin-block":"1em"}},{class:"flex text-center",style:{display:"flex",gap:"1em"},content:[{content:[{tag:"h1",content:e+"C"},{content:"copy"}]},{content:[{tag:"h1",content:e+"X"},{content:"cut"}]},{content:[{tag:"h1",content:e+"V"},{content:"paste"}]}]}]}))}async copyCells(){var e=Array.from(this.selectedCells()).filter(e=>e.canCopy()),t=Object.values(X(e,"rowIndex")).map(async e=>(await Promise.all(e.map(async e=>{e=await e.copy();return"string"==typeof e&&(e.includes("\n")||e.includes("\t"))?'"'+e+'"':e}))).join("\t")),t=(await Promise.all(t)).join("\n");window.navigator.clipboard.writeText(t),this.clearSelectedCells(""),this.outlineCells(e).classList.add("copy")}pasteData(e){if(null!=e){var t=Object.values(X(Array.from(this.selectedCells()).filter(e=>e.canPaste()),"rowIndex"));let o;o="string"==typeof e?G(e,"\n").map(e=>G(e,"\t")):[[e]],t.forEach((e,t)=>{const r=t%o.length;e.forEach(async(e,t)=>{if(e.paste){var t=t%o[r].length,i=o[r][t];if("string"==typeof i)e.column.constructor.pasteAccepts.some(e=>"text/plain".match(new RegExp(e)))?await e.paste(i):this.trigger("invalidPaste",{detail:i});else{if(!(i instanceof FileList))return;var s=[];for(const n of i)e.column.constructor.pasteAccepts.some(e=>n.type.match(new RegExp(e)))?s.push(n):this.trigger("invalidPaste",{detail:i});0<s.length&&await e.paste(s)}e.render()}})}),this.querySelector(this.localName+"-outline.copy")?.remove()}}static style=`
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
        
        .komp-spreadsheet-input {
            position: relative;
        }
        .komp-spreadsheet-input > label {
            min-height: var(--cell-height);
            min-width: var(--cell-width);
            width: auto;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background: white;
            box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.35);
            outline: 2px solid var(--select-color);
            outline-offset: -1px;
        }
        .komp-spreadsheet-input > label > input,
        .komp-spreadsheet-input > label > textarea,
        .komp-spreadsheet-input > label > select,
        .komp-spreadsheet-input > label > komp-content-area {
            background: none;
            width: auto;
            min-height: 100%;
            min-width: 100%;
            outline: none;
            padding: var(--padding, unset);
            border: none;
        }
        .komp-spreadsheet-input komp-content-area {
            width: max-content;
            max-width: var(--remaining-width);
            max-height: var(--remaining-height);
        }
        .komp-spreadsheet-input > label > input {
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
        
        komp-spreadsheet komp-floater {
            user-select: text;
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
        
        komp-modal.paste-modal {
            background: white;
            padding: 1em;
        }
    `}Rt.include(Lt),Rt.include(At),window.customElements.define(Rt.tagName,Rt);class Nt extends u{static tagName="komp-search-field";static assignableMethods=["renderResult","renderResults"];static events=["select","search","results"];static assignableAttributes={placeholder:{type:"string",default:"Search",null:!1},inline:{type:"boolean",default:!1,null:!1},minLength:{type:"number",default:3,null:!1},debounce:{type:"number",default:300,null:!1},empty:{type:["string","HTMLElement","function","boolean"],default:"Nothing Found",null:!1},input:{type:["function","HTMLInputElement"],default:e=>w("input",e),null:!1},search:{type:"function",default:e=>[],null:!1},select:{type:"function",default:(e,t)=>null,null:!1},result:{type:"function",default:e=>JSON.stringify(e),null:!1}};query="";results=[];initialize(e={}){super.initialize(),this.input=r(this,"input",{placeholder:this.placeholder}),this.input.addEventListener("keyup",this._keyup.bind(this)),this.input.addEventListener("keydown",this._keydown.bind(this)),this.input.addEventListener("focus",this._inputFocus.bind(this)),l(this,this.input),this.resultsList=w("div",{class:"komp-search-field-results"}),s(this.resultsList,"button","click",this._select.bind(this)),this.resultsList.addEventListener("keydown",this._keydown.bind(this)),this._search=function(t,i){let s;return function(...e){clearTimeout(s),s=setTimeout(()=>t.apply(this,e),i)}}(this._search.bind(this),this.debounce),this._floaterOptions=e.floater}buttonResult(e,t){return this.trigger("select",{detail:[e?.result,this.query,t]}),e.result}async _search(e){0!==e.length&&(this.trigger("search",{detail:[e]}),this.results=await this.search(e),this.showResults(),o(this.resultsList,this.renderResults(this.results)))}async _select(e,t){t=this.buttonResult(t||e.delegateTarget,e);t&&0!=this.select(t,this.query)&&(e.preventDefault(),e.stopPropagation(),this.clearSearch(),this.clearResults(),this.input.focus())}renderResult(e){var t=w("button",{type:"button",content:this.result(e)});return t.result=e,t}renderResults(e=[]){return this.query.length>=this.minLength&&0===e.length&&!1!==this.empty?r(this,this.empty,this.query):e.map(this.renderResult,this)}showResults(){this.inline?c(this.input,this.resultsList):(this.floater||(this.floater=new n(Object.assign({content:this.resultsList,placement:"bottom-start",autoPlacement:{allowedPlacements:["bottom-start","top-start"]},anchor:this,removeOnBlur:!0},this._floaterOptions))),this.floater.show())}hideResults(){this.inline?this.resultsList.remove():this.floater&&this.floater.hide()}clearSearch(){this.query="",this.input.value=""}clearResults(){this.resultsList.innerHTML=""}_keyup(e){var t,i=this.input.value;if("Enter"===e.key&&i.length>=this.minLength&&(t=this.resultsList.querySelector("button:focus, button.focus")||this.resultsList.querySelector("button")))return e.preventDefault(),q(t,"click");i!==this.query&&((this.query=i).length>=this.minLength?this._search(i):this.clearResults())}_keydown(e){var t;"ArrowDown"===e.key||"ArrowUp"===e.key?(e.preventDefault(),e.stopPropagation(),(t=this.resultsList.querySelector("button:focus, button.focus"))?"BUTTON"===(t=t["ArrowUp"===e.key?"previousElementSibling":"nextElementSibling"])?.tagName?t.focus():"ArrowUp"===e.key&&this.input.focus():"ArrowDown"===e.key&&this.resultsList.querySelector("button")?.focus()):"Enter"===e.key&&e.target===this.input&&e.preventDefault()}_inputFocus(){this.query.length>=this.minLength&&0<this.results.length&&this.showResults()}static style=`
        komp-search-field {
            display: inline-block;
            position: relative;
        }
        .komp-search-field-results {
            background: white;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        }
        .komp-search-field-results button {
            border: none;
            background: none;
            display: block;
            padding: 0;
        }
    `}window.customElements.define(Nt.tagName,Nt);var Ot=Object.freeze({__proto__:null,AutoGrid:ee,ContentArea:et,Dropdown:ft,Dropzone:bt,Element:u,Floater:n,Form:class{static inputTypes=["text","tel","password","radio","checkbox","textarea","select","date","datetime-local","button","number","range"];static create(e,t={}){return this.new(e,t).el}static new(e,t={}){return new this(e,t)}constructor(e,t={}){this.target=e;const{content:i,beforeSubmit:s,afterSubmit:n,...r}=t||{};this.beforeSubmit=s,this.afterSubmit=n,this.el=w("form",r),this.el.addEventListener("submit",this.onSubmit.bind(this)),this.constructor.inputTypes.forEach(i=>{this[i]=(e,t)=>this.input(e,Object.assign({},t,{type:i}))}),"function"==typeof i&&o(this.el,i(this))}id(e,t={}){return this._uid||(this._uid=Math.random().toString(36).slice(2)),[this._uid,e,t&&t.value].filter(Boolean).join("-")}input(e,t={}){const{type:i="text",...s}=t;t=this.id(e,t);return j.create(i,Object.assign({target:this.target,attribute:e,id:t},s))}label(e,t,i){let s=t,n=i||{};return"object"!=typeof s||s instanceof Node||(n=s||{},s=void 0),null==s&&(s=String(e).replace(/[_-]+/g," ").replace(/\w\S*/g,e=>e.charAt(0).toUpperCase()+e.slice(1))),w("label",Object.assign({for:this.id(e,n),content:s},n))}submit(e,t){let i="Save",s=t||{};"object"==typeof e?(s=e||{},i=s.content||i):null!=e&&(i=e);t=Object.assign({},s.attrs||{},{type:"submit"}),e=Object.assign({},s);return delete e.attrs,delete e.content,w("button",Object.assign({content:i},e,{attrs:t}))}async onSubmit(e){e.preventDefault(),this.disbableButtons(),this.el.querySelector("button")?.focus(),this.el.dispatchEvent(new CustomEvent("beforeSubmit"));try{if("function"==typeof this.beforeSubmit)if(!1===await this.beforeSubmit(this.target))return;if(this.target&&"function"==typeof this.target.save)if(!1===await this.target.save())return;"function"==typeof this.afterSubmit&&await this.afterSubmit(this.target),this.el.dispatchEvent(new CustomEvent("afterSubmit"))}finally{this.enableButtons()}}disbableButtons(){return this.submitButtons=[],this.el.querySelectorAll("button").forEach(e=>{"submit"===(e.getAttribute("type")||"submit")&&(e.disabled=!0,this.submitButtons.push([e,e.innerHTML]),e.innerHTML="&#8729;&#8729;&#8729;")}),this.submitButtons}enableButtons(){this.submitButtons&&this.submitButtons.forEach(([e,t])=>{e.disabled=!1,e.innerHTML=t})}},Input:j,Modal:te,NotificationCenter:yt,SearchField:Nt,Spreadsheet:Rt,Table:pt,Tooltip:mt});Object.keys(Ot).forEach(e=>{"Element"!==e&&(window[e]=Ot[e])}),window.plugins={resizable:Lt,reorderable:At,collapsible:function(e){this.assignableAttributes.collapseTo={type:"string",default:"auto",null:!1};const t=e.initialize,i=(e.initialize=function(...e){return this.collapseObserver=new ResizeObserver(e=>{e.forEach(e=>e.target.resize())}),t.call(this,...e)},e.collapseToChanged=function(e,t){this.style.setProperty("--collapseTo",t)},e.remove),s=(e.remove=function(...e){return this.collapseObserver.disconnect(),i.call(this,...e)},this.Row.prototype.initialize),n=(this.Row.prototype.initialize=function(...e){s.call(this,...e),this.expandedTarget=null,this.expandedTargets=new Set},this.Row.prototype.connected),r=(this.Row.prototype.connected=function(...e){n.call(this,...e),this.table.collapseObserver.observe(this)},this.Row.prototype.disconected),o=(this.Row.prototype.disconected=function(...e){r.call(this,...e),this.table.collapseObserver.unobserve(this)},this.Row.prototype.resetExpand=function(){this.style.removeProperty("--expandTo"),this.expandedTarget=Array.from(this.expandedTargets.values()).sort((e,t)=>t.scrollHeight-e.scrollHeight)[0],this.expandedTarget&&(this.expandedTarget.style.setProperty("max-height","unset"),this.style.setProperty("--expandTo",this.expandedTarget.scrollHeight+"px"),this.expandedTarget.style.removeProperty("max-height"))},this.Row.prototype.resize=function(){this.hasAttribute("collapsed");var e=this.toggleAttribute("collapsed",this.scrollHeight>this.offsetHeight);this.querySelectorAll("komp-table-toggle").forEach(e=>e.remove()),this.querySelectorAll("[collapse-toggle]").forEach(e=>e.removeAttribute("collapse-toggle")),e&&this.cells.concat(Array.from(this.querySelectorAll(P.tagName))).filter(e=>e.scrollHeight>this.offsetHeight).forEach(e=>{this.renderTargetToggles(e)}),this.expandedTarget&&this.renderTargetToggles(this.expandedTarget,!1)},this.Row.prototype.renderTargetToggles=function(t,i){t instanceof P?x(t.cells.map(e=>e.column)).forEach(e=>{this.renderToggle(e,t,i)}):this.renderToggle(t.column,t,i)},this.Row.prototype.renderToggle=function(e,t,i=!0){t.setAttribute("collapse-toggle",i?"expand":"collapse"),this.prepend(new Tt({class:t.classList.contains("frozen")?" frozen":"",column:e,cellIndex:e.index,content:d({type:"button",content:`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${i?"expand":"collapse"}"><polyline points="1 1 7 7 13 1"></polyline></svg>`},e=>{i?this.expandedTargets.add(t):this.expandedTargets.clear(),this.resetExpand()})}))},this.columnTypeRegistry.default.prototype.indexChanged);this.columnTypeRegistry.default.prototype.indexChanged=function(e,t){o.call(this,e,t),this.toggles&&this.toggles.forEach(e=>e.cellIndex=t)},Array.isArray(this.style)||(this.style=[this.style]),this.style.push(()=>`
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
            z-index: 3;
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
    `)}},document.addEventListener("DOMContentLoaded",function(){s(document,".js-toggle-source","click",e=>{document.querySelector(e.delegateTarget.getAttribute("rel")).classList.toggle("hide")})})}();