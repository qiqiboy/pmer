(function(e,t){typeof exports==="object"&&typeof module!=="undefined"?t(exports):typeof define==="function"&&define.amd?define(["exports"],t):(e=e||self,t(e.pmer={}))})(this,function(e){"use strict";e.PMER_MESSAGE_ID=0;var t="PMER_MESSAGE_IDENT";var n=false;try{window.postMessage({toString:function e(){n=true}},"*")}catch(e){}function r(e){return"PMER_REPLY::".concat(e)}function i(e){return/^PMER_REPLY::/.test(e)}function o(e){return e.window===e}function a(e,t,r,i){if(n){t=JSON.stringify(t)}if(o(e)){e.postMessage(t,r||"*",i)}else{e.postMessage(t,i)}}function f(e){var t=e.data;if(n){try{t=JSON.parse(e.data)}catch(e){}}e.parsedData=t;return e}function s(n,i,o,f,s){return new Promise(function(u,d){var p=e.PMER_MESSAGE_ID++;var _;if(Array.isArray(f)){var y=[f];s=y[0];f=y[1]}a(n,{__ident__:t,id:p,type:i,payload:o},f,s);c(r(i),function(e,t){clearTimeout(_);if(t.parsedData.error){d(new Error(e))}else{u(e)}},function(e){return e.parsedData.id===p})})}function u(e,n,o){function s(s){var u=f(s);var c=u.parsedData;if(typeof c==="object"){var d=c.id,p=c.type,_=c.payload,y=c.__ident__;if(!Array.isArray(e)){e=[e]}if(y===t&&e.some(function(e){return e==="*"||e===p})&&(!o||o(u))){var E=n(_,u);var v=function e(n){var i=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;a(u.source,{__ident__:t,id:d,type:r(p),payload:n,error:i},u.origin)};if(u.source&&!i(p)){if(typeof E==="object"&&typeof E.then==="function"){E.then(v,function(e){return v(e instanceof Error?e.message:e,true)})}else{v(E)}}}}}function u(){window.removeEventListener("message",s,false)}window.addEventListener("message",s,false);return u}function c(e,t,n){var r=u(e,function(){r();return t.apply(void 0,arguments)},n);return r}e.PMER_IDENT=t;e.addListener=u;e.addListenerOnce=c;e.postMessage=s;Object.defineProperty(e,"__esModule",{value:true})});
