"use strict";(self.webpackChunkconvexit_variant=self.webpackChunkconvexit_variant||[]).push([[160],{26160:(e,t,n)=>{n.r(t),n.d(t,{default:()=>f});var r=n(16735),l=n(35466),a=n(87386),o=n(41957),c=n(31743),i=n(30251);function u(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,l,a=[],o=!0,c=!1;try{for(n=n.call(e);!(o=(r=n.next()).done)&&(a.push(r.value),!t||a.length!==t);o=!0);}catch(e){c=!0,l=e}finally{try{o||null==n.return||n.return()}finally{if(c)throw l}}return a}}(e,t)||function(e,t){if(e){if("string"==typeof e)return s(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?s(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function s(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function f(){var e=u((0,l.useState)(!1),2),t=e[0],n=e[1],s=u((0,l.useState)([]),2),f=s[0],m=s[1],p=(0,l.useRef)(null),v=(0,i.$G)().t;return(0,l.useEffect)((function(){n(!0),r.Z.findWithNoToken("company.note/responsible/",null,null).then((function(e){m(e.data),n(!1)})).catch((function(e){console.log(e),n(!1)}))}),[]),(0,l.useEffect)((function(){var e;null!==p.current&&(null===(e=p.current)||void 0===e||e.scrollIntoView({behavior:"smooth",block:"center",inline:"start"}))}),[p.current]),l.createElement("div",{className:"flex h-full flex-1 flex-col"},l.createElement("div",{ref:p,className:"flex h-9   items-center bg-secondary-600 pr-2"},l.createElement("div",{className:"flex w-full items-center justify-center "},l.createElement("span",{className:"flex items-center text-xl uppercase text-white "},v("ResponsibleGaming")))),l.createElement("div",{className:"flex  flex-col gap-3 px-6 py-4 pb-20 text-white"},!t&&(null==f?void 0:f.note)&&l.createElement(l.Fragment,null,(0,a.ZP)(f.note)),!t&&!(null!=f&&f.note)&&l.createElement(c.Z,{message:"responsible and conditions not available now."})),t&&l.createElement(o.Z,null))}}}]);