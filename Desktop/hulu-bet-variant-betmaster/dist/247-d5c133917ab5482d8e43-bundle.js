"use strict";(self.webpackChunkconvexit_variant=self.webpackChunkconvexit_variant||[]).push([[247],{39247:(e,t,n)=>{n.r(t),n.d(t,{default:()=>m});var r=n(41957),l=n(16735),a=n(35466),o=n(87386),u=n(31743),c=n(30251),i=n(92255);function f(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,l,a=[],o=!0,u=!1;try{for(n=n.call(e);!(o=(r=n.next()).done)&&(a.push(r.value),!t||a.length!==t);o=!0);}catch(e){u=!0,l=e}finally{try{o||null==n.return||n.return()}finally{if(u)throw l}}return a}}(e,t)||function(e,t){if(e){if("string"==typeof e)return s(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?s(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function s(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function m(){var e=f((0,a.useState)(),2),t=(e[0],e[1]),n=(0,i.v9)((function(e){return e.configuration.configurations})),s=(0,a.useRef)(null),m=(0,c.$G)().t,v=f((0,a.useState)(!1),2),y=v[0],p=v[1];return(0,a.useEffect)((function(){p(!0),l.Z.findWithNoToken("company.note/rules/",null,null).then((function(e){var n=e.data;t(n),p(!1)})).catch((function(e){console.log(e),p(!1)}))}),[]),(0,a.useEffect)((function(){var e;null!==s.current&&(null===(e=s.current)||void 0===e||e.scrollIntoView({behavior:"smooth",block:"center",inline:"start"}))}),[s.current]),a.createElement("div",{className:"relative h-full w-full"},a.createElement("div",{ref:s,className:"flex h-9   items-center bg-secondary-600 pr-2"},a.createElement("div",{className:"flex w-full items-center justify-center "},a.createElement("span",{className:"flex items-center text-xl uppercase text-white "},m("About")))),a.createElement("div",{className:"flex  h-full w-full flex-col gap-3 px-6 py-4 text-white"},!y&&(null==n?void 0:n.about_company)&&a.createElement(a.Fragment,null,(0,o.ZP)(null==n?void 0:n.about_company)),!y&&!(null!=n&&n.about_company)&&a.createElement(u.Z,{message:"Information is not available now."})),y&&a.createElement(r.Z,null))}}}]);