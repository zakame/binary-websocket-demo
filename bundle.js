!function(e){function n(n){for(var t,r,a=n[0],i=n[1],s=0,u=[];s<a.length;s++)r=a[s],o[r]&&u.push(o[r][0]),o[r]=0;for(t in i)Object.prototype.hasOwnProperty.call(i,t)&&(e[t]=i[t]);for(c&&c(n);u.length;)u.shift()()}var t={},o={4:0};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.e=function(e){var n=[],t=o[e];if(0!==t)if(t)n.push(t[2]);else{var a=new Promise(function(n,r){t=o[e]=[n,r]});n.push(t[2]=a);var i=document.getElementsByTagName("head")[0],s=document.createElement("script");s.charset="utf-8",s.timeout=120,r.nc&&s.setAttribute("nonce",r.nc),s.src=r.p+""+e+".bundle.js";var c=setTimeout(function(){u({type:"timeout",target:s})},12e4);function u(n){s.onerror=s.onload=null,clearTimeout(c);var t=o[e];if(0!==t){if(t){var r=n&&("load"===n.type?"missing":n.type),a=n&&n.target&&n.target.src,i=new Error("Loading chunk "+e+" failed.\n("+r+": "+a+")");i.type=r,i.request=a,t[1](i)}o[e]=void 0}}s.onerror=s.onload=u,i.appendChild(s)}return Promise.all(n)},r.m=e,r.c=t,r.d=function(e,n,t){r.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:t})},r.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},r.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(n,"a",n),n},r.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},r.p="",r.oe=function(e){throw console.error(e),e};var a=window.webpackJsonp=window.webpackJsonp||[],i=a.push.bind(a);a.push=n,a=a.slice();for(var s=0;s<a.length;s++)n(a[s]);var c=i;r(r.s=6)}({11:function(e,n){},6:function(e,n,t){t(11),Promise.all([t.e(0),t.e(2),t.e(3)]).then(function(){t(5),t(4)}).catch(t.oe),Promise.all([t.e(0),t.e(1)]).then(function(){var e=[t(3),t(0)];(function(e,n){"use strict";var t=12038;Date.fromEpoch=function(e){var n=new Date(0);return n.setUTCSeconds(e),n},n.options.deferUpdates=!0,n.bindingHandlers.localDateTime={update:function(e,t){var o=Date.fromEpoch(n.unwrap(t()));e.innerHTML=o.toLocaleDateString()+" "+o.toLocaleTimeString()}},n.applyBindings(new function(){var o=this,r=new e.LiveApi({appId:t});o.tabs=["AUDJPY","GBPJPY","USDJPY","R_50","R_100"],o.chosenTabId=n.observable(),o.chosenTabData=n.observable(),o.chosenTabError=n.observable(),o.ticks=n.observableArray([]),o.maxTicks=n.observable(300),o.chosenTabTicks=n.computed(function(){return o.ticks().slice(0-o.maxTicks())}),o.isLoading=n.observable(!0),o.unsubscribeTimeElapsed=n.observable(),o.subscribeTimeElapsed=n.observable(),o.goToTab=function(e){if(o.chosenTabId()!==e){var n;o.chosenTabError(!1),o.isLoading(!0);var t=Date.now();r.unsubscribeFromAllTicks().then(function(){o.chosenTabData(!1),o.ticks([]),o.unsubscribeTimeElapsed(Date.now()-t),n=Date.now(),o.chosenTabId(e),e.match(/^R/)||(e="frx"+e)}).then(function(){return r.getTickHistory(e,{end:"latest",subscribe:1})}).catch(function(e){var n=e.error?e.error.error.message:e.message;o.chosenTabError(n),o.isLoading(!1)}).then(function(){o.subscribeTimeElapsed(Date.now()-n)})}},r.events.on("history",function(e){for(var n=[],t=0;t<e.history.prices.length;t++)n.push({position:Date.fromEpoch(e.history.times[t]),value:e.history.prices[t]});o.ticks(n)}),r.events.on("tick",function(e){o.chosenTabData(e.tick),o.ticks.push({position:Date.fromEpoch(e.tick.epoch),value:e.tick.quote}),o.isLoading(!1)}),o.goToTab(o.tabs[o.tabs.length-1])})}).apply(null,e)}).catch(t.oe)}});