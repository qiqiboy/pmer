var e=0;var n=new Error("PMER_POST_MESSAGE_TIMEOUT");var t="PMER_MESSAGE_IDENT";function r(e){return"PMER_REPLY::".concat(e)}window.addEventListener("unhandledrejection",function(e){if(e.reason===n){e.preventDefault()}});function i(i,o,f){var s=arguments.length>3&&arguments[3]!==undefined?arguments[3]:"*";var u=arguments.length>4?arguments[4]:undefined;return new Promise(function(d,c){var v=e++;var _;i.postMessage({__ident__:t,id:v,type:o,message:f},s,u);var E=a(r(o),function(e){clearTimeout(_);d(e)},v);_=setTimeout(function(){E();c(n)},60*1e3)})}function o(e,n,i){function o(o){if(typeof o.data==="object"){var a=o.data,f=a.id,s=a.type,u=a.message,d=a.__ident__;if(!Array.isArray(e)){e=[e]}if(d===t&&e.length&&e.some(function(e){return e==="*"||e===s})&&(!i||f===i)){var c=n(u,o);if(typeof c!=="undefined"&&o.source){var v=function e(n){o.source.postMessage({__ident__:t,id:i,type:r(s),message:n},o.origin)};if(typeof c==="object"&&typeof c.then==="function"){c.then(v)}else{v(c)}}}}}function a(){window.removeEventListener("message",o,false)}window.addEventListener("message",o,false);return a}function a(e,n,t){var r=o(e,function(){r();return n.apply(void 0,arguments)},t);return r}export{o as addListener,a as addListenerOnce,e as mid,i as postMessage};