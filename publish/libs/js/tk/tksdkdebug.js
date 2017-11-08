;(function () {
    var DEV = false ;
    var _getUrlParams = function(key){
        // var urlAdd = decodeURI(window.location.href);
        var urlAdd = decodeURIComponent(window.location.href);
        var urlIndex = urlAdd.indexOf("?");
        var urlSearch = urlAdd.substring(urlIndex + 1);
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");   //reg表示匹配出:$+url传参数名字=值+$,并且$可以不存在，这样会返回一个数组
        var arr = urlSearch.match(reg);
        if(arr != null) {
            return arr[2];
        } else {
            return "";
        }
    };
    try{
        DEV = window.__SDKDEV__ ;
    }catch (e){
        DEV = false ;
    }
    var debug = (DEV || _getUrlParams('debug') );
    if(window.localStorage){
        var debugStr =  debug ? '*' : 'none'
        window.localStorage.setItem('debug' ,debugStr );
    }
})();

!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.io=e():t.io=e()}(this,function(){return function(t){function e(r){if(n[r])return n[r].exports;var o=n[r]={exports:{},id:r,loaded:!1};return t[r].call(o.exports,o,o.exports,e),o.loaded=!0,o.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){"use strict";function r(t,e){"object"===("undefined"==typeof t?"undefined":o(t))&&(e=t,t=void 0),e=e||{};var n,r=i(t),s=r.source,u=r.id,h=r.path,f=p[u]&&h in p[u].nsps,l=e.forceNew||e["force new connection"]||!1===e.multiplex||f;return l?(c("ignoring socket cache for %s",s),n=a(s,e)):(p[u]||(c("new io instance for %s",s),p[u]=a(s,e)),n=p[u]),r.query&&!e.query&&(e.query=r.query),n.socket(r.path,e)}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i=n(1),s=n(7),a=n(13),c=n(3)("socket.io-client");t.exports=e=r;var p=e.managers={};e.protocol=s.protocol,e.connect=r,e.Manager=n(13),e.Socket=n(39)},function(t,e,n){(function(e){"use strict";function r(t,n){var r=t;n=n||e.location,null==t&&(t=n.protocol+"//"+n.host),"string"==typeof t&&("/"===t.charAt(0)&&(t="/"===t.charAt(1)?n.protocol+t:n.host+t),/^(https?|wss?):\/\//.test(t)||(i("protocol-less url %s",t),t="undefined"!=typeof n?n.protocol+"//"+t:"https://"+t),i("parse %s",t),r=o(t)),r.port||(/^(http|ws)$/.test(r.protocol)?r.port="80":/^(http|ws)s$/.test(r.protocol)&&(r.port="443")),r.path=r.path||"/";var s=r.host.indexOf(":")!==-1,a=s?"["+r.host+"]":r.host;return r.id=r.protocol+"://"+a+":"+r.port,r.href=r.protocol+"://"+a+(n&&n.port===r.port?"":":"+r.port),r}var o=n(2),i=n(3)("socket.io-client:url");t.exports=r}).call(e,function(){return this}())},function(t,e){var n=/^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,r=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];t.exports=function(t){var e=t,o=t.indexOf("["),i=t.indexOf("]");o!=-1&&i!=-1&&(t=t.substring(0,o)+t.substring(o,i).replace(/:/g,";")+t.substring(i,t.length));for(var s=n.exec(t||""),a={},c=14;c--;)a[r[c]]=s[c]||"";return o!=-1&&i!=-1&&(a.source=e,a.host=a.host.substring(1,a.host.length-1).replace(/;/g,":"),a.authority=a.authority.replace("[","").replace("]","").replace(/;/g,":"),a.ipv6uri=!0),a}},function(t,e,n){(function(r){function o(){return!("undefined"==typeof window||!window.process||"renderer"!==window.process.type)||("undefined"!=typeof document&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||"undefined"!=typeof window&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))}function i(t){var n=this.useColors;if(t[0]=(n?"%c":"")+this.namespace+(n?" %c":" ")+t[0]+(n?"%c ":" ")+"+"+e.humanize(this.diff),n){var r="color: "+this.color;t.splice(1,0,r,"color: inherit");var o=0,i=0;t[0].replace(/%[a-zA-Z%]/g,function(t){"%%"!==t&&(o++,"%c"===t&&(i=o))}),t.splice(i,0,r)}}function s(){return"object"==typeof console&&console.log&&Function.prototype.apply.call(console.log,console,arguments)}function a(t){try{null==t?e.storage.removeItem("debug"):e.storage.debug=t}catch(n){}}function c(){var t;try{t=e.storage.debug}catch(n){}return!t&&"undefined"!=typeof r&&"env"in r&&(t=r.env.DEBUG),t}function p(){try{return window.localStorage}catch(t){}}e=t.exports=n(5),e.log=s,e.formatArgs=i,e.save=a,e.load=c,e.useColors=o,e.storage="undefined"!=typeof chrome&&"undefined"!=typeof chrome.storage?chrome.storage.local:p(),e.colors=["lightseagreen","forestgreen","goldenrod","dodgerblue","darkorchid","crimson"],e.formatters.j=function(t){try{return JSON.stringify(t)}catch(e){return"[UnexpectedJSONParseError]: "+e.message}},e.enable(c())}).call(e,n(4))},function(t,e){function n(){throw new Error("setTimeout has not been defined")}function r(){throw new Error("clearTimeout has not been defined")}function o(t){if(u===setTimeout)return setTimeout(t,0);if((u===n||!u)&&setTimeout)return u=setTimeout,setTimeout(t,0);try{return u(t,0)}catch(e){try{return u.call(null,t,0)}catch(e){return u.call(this,t,0)}}}function i(t){if(h===clearTimeout)return clearTimeout(t);if((h===r||!h)&&clearTimeout)return h=clearTimeout,clearTimeout(t);try{return h(t)}catch(e){try{return h.call(null,t)}catch(e){return h.call(this,t)}}}function s(){y&&l&&(y=!1,l.length?d=l.concat(d):m=-1,d.length&&a())}function a(){if(!y){var t=o(s);y=!0;for(var e=d.length;e;){for(l=d,d=[];++m<e;)l&&l[m].run();m=-1,e=d.length}l=null,y=!1,i(t)}}function c(t,e){this.fun=t,this.array=e}function p(){}var u,h,f=t.exports={};!function(){try{u="function"==typeof setTimeout?setTimeout:n}catch(t){u=n}try{h="function"==typeof clearTimeout?clearTimeout:r}catch(t){h=r}}();var l,d=[],y=!1,m=-1;f.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];d.push(new c(t,e)),1!==d.length||y||o(a)},c.prototype.run=function(){this.fun.apply(null,this.array)},f.title="browser",f.browser=!0,f.env={},f.argv=[],f.version="",f.versions={},f.on=p,f.addListener=p,f.once=p,f.off=p,f.removeListener=p,f.removeAllListeners=p,f.emit=p,f.prependListener=p,f.prependOnceListener=p,f.listeners=function(t){return[]},f.binding=function(t){throw new Error("process.binding is not supported")},f.cwd=function(){return"/"},f.chdir=function(t){throw new Error("process.chdir is not supported")},f.umask=function(){return 0}},function(t,e,n){function r(t){var n,r=0;for(n in t)r=(r<<5)-r+t.charCodeAt(n),r|=0;return e.colors[Math.abs(r)%e.colors.length]}function o(t){function n(){if(n.enabled){var t=n,r=+new Date,o=r-(p||r);t.diff=o,t.prev=p,t.curr=r,p=r;for(var i=new Array(arguments.length),s=0;s<i.length;s++)i[s]=arguments[s];i[0]=e.coerce(i[0]),"string"!=typeof i[0]&&i.unshift("%O");var a=0;i[0]=i[0].replace(/%([a-zA-Z%])/g,function(n,r){if("%%"===n)return n;a++;var o=e.formatters[r];if("function"==typeof o){var s=i[a];n=o.call(t,s),i.splice(a,1),a--}return n}),e.formatArgs.call(t,i);var c=n.log||e.log||console.log.bind(console);c.apply(t,i)}}return n.namespace=t,n.enabled=e.enabled(t),n.useColors=e.useColors(),n.color=r(t),"function"==typeof e.init&&e.init(n),n}function i(t){e.save(t),e.names=[],e.skips=[];for(var n=("string"==typeof t?t:"").split(/[\s,]+/),r=n.length,o=0;o<r;o++)n[o]&&(t=n[o].replace(/\*/g,".*?"),"-"===t[0]?e.skips.push(new RegExp("^"+t.substr(1)+"$")):e.names.push(new RegExp("^"+t+"$")))}function s(){e.enable("")}function a(t){var n,r;for(n=0,r=e.skips.length;n<r;n++)if(e.skips[n].test(t))return!1;for(n=0,r=e.names.length;n<r;n++)if(e.names[n].test(t))return!0;return!1}function c(t){return t instanceof Error?t.stack||t.message:t}e=t.exports=o.debug=o["default"]=o,e.coerce=c,e.disable=s,e.enable=i,e.enabled=a,e.humanize=n(6),e.names=[],e.skips=[],e.formatters={};var p},function(t,e){function n(t){if(t=String(t),!(t.length>100)){var e=/^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(t);if(e){var n=parseFloat(e[1]),r=(e[2]||"ms").toLowerCase();switch(r){case"years":case"year":case"yrs":case"yr":case"y":return n*u;case"days":case"day":case"d":return n*p;case"hours":case"hour":case"hrs":case"hr":case"h":return n*c;case"minutes":case"minute":case"mins":case"min":case"m":return n*a;case"seconds":case"second":case"secs":case"sec":case"s":return n*s;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return n;default:return}}}}function r(t){return t>=p?Math.round(t/p)+"d":t>=c?Math.round(t/c)+"h":t>=a?Math.round(t/a)+"m":t>=s?Math.round(t/s)+"s":t+"ms"}function o(t){return i(t,p,"day")||i(t,c,"hour")||i(t,a,"minute")||i(t,s,"second")||t+" ms"}function i(t,e,n){if(!(t<e))return t<1.5*e?Math.floor(t/e)+" "+n:Math.ceil(t/e)+" "+n+"s"}var s=1e3,a=60*s,c=60*a,p=24*c,u=365.25*p;t.exports=function(t,e){e=e||{};var i=typeof t;if("string"===i&&t.length>0)return n(t);if("number"===i&&isNaN(t)===!1)return e["long"]?o(t):r(t);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(t))}},function(t,e,n){function r(){}function o(t){var n=""+t.type;return e.BINARY_EVENT!==t.type&&e.BINARY_ACK!==t.type||(n+=t.attachments+"-"),t.nsp&&"/"!==t.nsp&&(n+=t.nsp+","),null!=t.id&&(n+=t.id),null!=t.data&&(n+=JSON.stringify(t.data)),h("encoded %j as %s",t,n),n}function i(t,e){function n(t){var n=d.deconstructPacket(t),r=o(n.packet),i=n.buffers;i.unshift(r),e(i)}d.removeBlobs(t,n)}function s(){this.reconstructor=null}function a(t){var n=0,r={type:Number(t.charAt(0))};if(null==e.types[r.type])return u();if(e.BINARY_EVENT===r.type||e.BINARY_ACK===r.type){for(var o="";"-"!==t.charAt(++n)&&(o+=t.charAt(n),n!=t.length););if(o!=Number(o)||"-"!==t.charAt(n))throw new Error("Illegal attachments");r.attachments=Number(o)}if("/"===t.charAt(n+1))for(r.nsp="";++n;){var i=t.charAt(n);if(","===i)break;if(r.nsp+=i,n===t.length)break}else r.nsp="/";var s=t.charAt(n+1);if(""!==s&&Number(s)==s){for(r.id="";++n;){var i=t.charAt(n);if(null==i||Number(i)!=i){--n;break}if(r.id+=t.charAt(n),n===t.length)break}r.id=Number(r.id)}return t.charAt(++n)&&(r=c(r,t.substr(n))),h("decoded %s as %j",t,r),r}function c(t,e){try{t.data=JSON.parse(e)}catch(n){return u()}return t}function p(t){this.reconPack=t,this.buffers=[]}function u(){return{type:e.ERROR,data:"parser error"}}var h=n(3)("socket.io-parser"),f=n(8),l=n(9),d=n(11),y=n(12);e.protocol=4,e.types=["CONNECT","DISCONNECT","EVENT","ACK","ERROR","BINARY_EVENT","BINARY_ACK"],e.CONNECT=0,e.DISCONNECT=1,e.EVENT=2,e.ACK=3,e.ERROR=4,e.BINARY_EVENT=5,e.BINARY_ACK=6,e.Encoder=r,e.Decoder=s,r.prototype.encode=function(t,n){if(t.type!==e.EVENT&&t.type!==e.ACK||!l(t.data)||(t.type=t.type===e.EVENT?e.BINARY_EVENT:e.BINARY_ACK),h("encoding packet %j",t),e.BINARY_EVENT===t.type||e.BINARY_ACK===t.type)i(t,n);else{var r=o(t);n([r])}},f(s.prototype),s.prototype.add=function(t){var n;if("string"==typeof t)n=a(t),e.BINARY_EVENT===n.type||e.BINARY_ACK===n.type?(this.reconstructor=new p(n),0===this.reconstructor.reconPack.attachments&&this.emit("decoded",n)):this.emit("decoded",n);else{if(!y(t)&&!t.base64)throw new Error("Unknown type: "+t);if(!this.reconstructor)throw new Error("got binary data when not reconstructing a packet");n=this.reconstructor.takeBinaryData(t),n&&(this.reconstructor=null,this.emit("decoded",n))}},s.prototype.destroy=function(){this.reconstructor&&this.reconstructor.finishedReconstruction()},p.prototype.takeBinaryData=function(t){if(this.buffers.push(t),this.buffers.length===this.reconPack.attachments){var e=d.reconstructPacket(this.reconPack,this.buffers);return this.finishedReconstruction(),e}return null},p.prototype.finishedReconstruction=function(){this.reconPack=null,this.buffers=[]}},function(t,e,n){function r(t){if(t)return o(t)}function o(t){for(var e in r.prototype)t[e]=r.prototype[e];return t}t.exports=r,r.prototype.on=r.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this},r.prototype.once=function(t,e){function n(){this.off(t,n),e.apply(this,arguments)}return n.fn=e,this.on(t,n),this},r.prototype.off=r.prototype.removeListener=r.prototype.removeAllListeners=r.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this;var n=this._callbacks["$"+t];if(!n)return this;if(1==arguments.length)return delete this._callbacks["$"+t],this;for(var r,o=0;o<n.length;o++)if(r=n[o],r===e||r.fn===e){n.splice(o,1);break}return this},r.prototype.emit=function(t){this._callbacks=this._callbacks||{};var e=[].slice.call(arguments,1),n=this._callbacks["$"+t];if(n){n=n.slice(0);for(var r=0,o=n.length;r<o;++r)n[r].apply(this,e)}return this},r.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]},r.prototype.hasListeners=function(t){return!!this.listeners(t).length}},function(t,e,n){(function(e){function r(t){if(!t||"object"!=typeof t)return!1;if(o(t)){for(var n=0,i=t.length;n<i;n++)if(r(t[n]))return!0;return!1}if("function"==typeof e.Buffer&&e.Buffer.isBuffer&&e.Buffer.isBuffer(t)||"function"==typeof e.ArrayBuffer&&t instanceof ArrayBuffer||s&&t instanceof Blob||a&&t instanceof File)return!0;if(t.toJSON&&"function"==typeof t.toJSON&&1===arguments.length)return r(t.toJSON(),!0);for(var c in t)if(Object.prototype.hasOwnProperty.call(t,c)&&r(t[c]))return!0;return!1}var o=n(10),i=Object.prototype.toString,s="function"==typeof e.Blob||"[object BlobConstructor]"===i.call(e.Blob),a="function"==typeof e.File||"[object FileConstructor]"===i.call(e.File);t.exports=r}).call(e,function(){return this}())},function(t,e){var n={}.toString;t.exports=Array.isArray||function(t){return"[object Array]"==n.call(t)}},function(t,e,n){(function(t){function r(t,e){if(!t)return t;if(s(t)){var n={_placeholder:!0,num:e.length};return e.push(t),n}if(i(t)){for(var o=new Array(t.length),a=0;a<t.length;a++)o[a]=r(t[a],e);return o}if("object"==typeof t&&!(t instanceof Date)){var o={};for(var c in t)o[c]=r(t[c],e);return o}return t}function o(t,e){if(!t)return t;if(t&&t._placeholder)return e[t.num];if(i(t))for(var n=0;n<t.length;n++)t[n]=o(t[n],e);else if("object"==typeof t)for(var r in t)t[r]=o(t[r],e);return t}var i=n(10),s=n(12),a=Object.prototype.toString,c="function"==typeof t.Blob||"[object BlobConstructor]"===a.call(t.Blob),p="function"==typeof t.File||"[object FileConstructor]"===a.call(t.File);e.deconstructPacket=function(t){var e=[],n=t.data,o=t;return o.data=r(n,e),o.attachments=e.length,{packet:o,buffers:e}},e.reconstructPacket=function(t,e){return t.data=o(t.data,e),t.attachments=void 0,t},e.removeBlobs=function(t,e){function n(t,a,u){if(!t)return t;if(c&&t instanceof Blob||p&&t instanceof File){r++;var h=new FileReader;h.onload=function(){u?u[a]=this.result:o=this.result,--r||e(o)},h.readAsArrayBuffer(t)}else if(i(t))for(var f=0;f<t.length;f++)n(t[f],f,t);else if("object"==typeof t&&!s(t))for(var l in t)n(t[l],l,t)}var r=0,o=t;n(o),r||e(o)}}).call(e,function(){return this}())},function(t,e){(function(e){function n(t){return e.Buffer&&e.Buffer.isBuffer(t)||e.ArrayBuffer&&t instanceof ArrayBuffer}t.exports=n}).call(e,function(){return this}())},function(t,e,n){"use strict";function r(t,e){if(!(this instanceof r))return new r(t,e);t&&"object"===("undefined"==typeof t?"undefined":o(t))&&(e=t,t=void 0),e=e||{},e.path=e.path||"/socket.io",this.nsps={},this.subs=[],this.opts=e,this.reconnection(e.reconnection!==!1),this.reconnectionAttempts(e.reconnectionAttempts||1/0),this.reconnectionDelay(e.reconnectionDelay||1e3),this.reconnectionDelayMax(e.reconnectionDelayMax||5e3),this.randomizationFactor(e.randomizationFactor||.5),this.backoff=new l({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(null==e.timeout?2e4:e.timeout),this.readyState="closed",this.uri=t,this.connecting=[],this.lastPing=null,this.encoding=!1,this.packetBuffer=[];var n=e.parser||c;this.encoder=new n.Encoder,this.decoder=new n.Decoder,this.autoConnect=e.autoConnect!==!1,this.autoConnect&&this.open()}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i=n(14),s=n(39),a=n(8),c=n(7),p=n(41),u=n(42),h=n(3)("socket.io-client:manager"),f=n(37),l=n(43),d=Object.prototype.hasOwnProperty;t.exports=r,r.prototype.emitAll=function(){this.emit.apply(this,arguments);for(var t in this.nsps)d.call(this.nsps,t)&&this.nsps[t].emit.apply(this.nsps[t],arguments)},r.prototype.updateSocketIds=function(){for(var t in this.nsps)d.call(this.nsps,t)&&(this.nsps[t].id=this.generateId(t))},r.prototype.generateId=function(t){return("/"===t?"":t+"#")+this.engine.id},a(r.prototype),r.prototype.reconnection=function(t){return arguments.length?(this._reconnection=!!t,this):this._reconnection},r.prototype.reconnectionAttempts=function(t){return arguments.length?(this._reconnectionAttempts=t,this):this._reconnectionAttempts},r.prototype.reconnectionDelay=function(t){return arguments.length?(this._reconnectionDelay=t,this.backoff&&this.backoff.setMin(t),this):this._reconnectionDelay},r.prototype.randomizationFactor=function(t){return arguments.length?(this._randomizationFactor=t,this.backoff&&this.backoff.setJitter(t),this):this._randomizationFactor},r.prototype.reconnectionDelayMax=function(t){return arguments.length?(this._reconnectionDelayMax=t,this.backoff&&this.backoff.setMax(t),this):this._reconnectionDelayMax},r.prototype.timeout=function(t){return arguments.length?(this._timeout=t,this):this._timeout},r.prototype.maybeReconnectOnOpen=function(){!this.reconnecting&&this._reconnection&&0===this.backoff.attempts&&this.reconnect()},r.prototype.open=r.prototype.connect=function(t,e){if(h("readyState %s",this.readyState),~this.readyState.indexOf("open"))return this;h("opening %s",this.uri),this.engine=i(this.uri,this.opts);var n=this.engine,r=this;this.readyState="opening",this.skipReconnect=!1;var o=p(n,"open",function(){r.onopen(),t&&t()}),s=p(n,"error",function(e){if(h("connect_error"),r.cleanup(),r.readyState="closed",r.emitAll("connect_error",e),t){var n=new Error("Connection error");n.data=e,t(n)}else r.maybeReconnectOnOpen()});if(!1!==this._timeout){var a=this._timeout;h("connect attempt will timeout after %d",a);var c=setTimeout(function(){h("connect attempt timed out after %d",a),o.destroy(),n.close(),n.emit("error","timeout"),r.emitAll("connect_timeout",a)},a);this.subs.push({destroy:function(){clearTimeout(c)}})}return this.subs.push(o),this.subs.push(s),this},r.prototype.onopen=function(){h("open"),this.cleanup(),this.readyState="open",this.emit("open");var t=this.engine;this.subs.push(p(t,"data",u(this,"ondata"))),this.subs.push(p(t,"ping",u(this,"onping"))),this.subs.push(p(t,"pong",u(this,"onpong"))),this.subs.push(p(t,"error",u(this,"onerror"))),this.subs.push(p(t,"close",u(this,"onclose"))),this.subs.push(p(this.decoder,"decoded",u(this,"ondecoded")))},r.prototype.onping=function(){this.lastPing=new Date,this.emitAll("ping")},r.prototype.onpong=function(){this.emitAll("pong",new Date-this.lastPing)},r.prototype.ondata=function(t){this.decoder.add(t)},r.prototype.ondecoded=function(t){this.emit("packet",t)},r.prototype.onerror=function(t){h("error",t),this.emitAll("error",t)},r.prototype.socket=function(t,e){function n(){~f(o.connecting,r)||o.connecting.push(r)}var r=this.nsps[t];if(!r){r=new s(this,t,e),this.nsps[t]=r;var o=this;r.on("connecting",n),r.on("connect",function(){r.id=o.generateId(t)}),this.autoConnect&&n()}return r},r.prototype.destroy=function(t){var e=f(this.connecting,t);~e&&this.connecting.splice(e,1),this.connecting.length||this.close()},r.prototype.packet=function(t){h("writing packet %j",t);var e=this;t.query&&0===t.type&&(t.nsp+="?"+t.query),e.encoding?e.packetBuffer.push(t):(e.encoding=!0,this.encoder.encode(t,function(n){for(var r=0;r<n.length;r++)e.engine.write(n[r],t.options);e.encoding=!1,e.processPacketQueue()}))},r.prototype.processPacketQueue=function(){if(this.packetBuffer.length>0&&!this.encoding){var t=this.packetBuffer.shift();this.packet(t)}},r.prototype.cleanup=function(){h("cleanup");for(var t=this.subs.length,e=0;e<t;e++){var n=this.subs.shift();n.destroy()}this.packetBuffer=[],this.encoding=!1,this.lastPing=null,this.decoder.destroy()},r.prototype.close=r.prototype.disconnect=function(){h("disconnect"),this.skipReconnect=!0,this.reconnecting=!1,"opening"===this.readyState&&this.cleanup(),this.backoff.reset(),this.readyState="closed",this.engine&&this.engine.close()},r.prototype.onclose=function(t){h("onclose"),this.cleanup(),this.backoff.reset(),this.readyState="closed",this.emit("close",t),this._reconnection&&!this.skipReconnect&&this.reconnect()},r.prototype.reconnect=function(){if(this.reconnecting||this.skipReconnect)return this;var t=this;if(this.backoff.attempts>=this._reconnectionAttempts)h("reconnect failed"),this.backoff.reset(),this.emitAll("reconnect_failed"),this.reconnecting=!1;else{var e=this.backoff.duration();h("will wait %dms before reconnect attempt",e),this.reconnecting=!0;var n=setTimeout(function(){t.skipReconnect||(h("attempting reconnect"),t.emitAll("reconnect_attempt",t.backoff.attempts),t.emitAll("reconnecting",t.backoff.attempts),t.skipReconnect||t.open(function(e){e?(h("reconnect attempt error"),t.reconnecting=!1,t.reconnect(),t.emitAll("reconnect_error",e.data)):(h("reconnect success"),t.onreconnect())}))},e);this.subs.push({destroy:function(){clearTimeout(n)}})}},r.prototype.onreconnect=function(){var t=this.backoff.attempts;this.reconnecting=!1,this.backoff.reset(),this.updateSocketIds(),this.emitAll("reconnect",t)}},function(t,e,n){t.exports=n(15)},function(t,e,n){t.exports=n(16),t.exports.parser=n(23)},function(t,e,n){(function(e){function r(t,n){if(!(this instanceof r))return new r(t,n);n=n||{},t&&"object"==typeof t&&(n=t,t=null),t?(t=u(t),n.hostname=t.host,n.secure="https"===t.protocol||"wss"===t.protocol,n.port=t.port,t.query&&(n.query=t.query)):n.host&&(n.hostname=u(n.host).host),this.secure=null!=n.secure?n.secure:e.location&&"https:"===location.protocol,n.hostname&&!n.port&&(n.port=this.secure?"443":"80"),this.agent=n.agent||!1,this.hostname=n.hostname||(e.location?location.hostname:"localhost"),this.port=n.port||(e.location&&location.port?location.port:this.secure?443:80),this.query=n.query||{},"string"==typeof this.query&&(this.query=f.decode(this.query)),this.upgrade=!1!==n.upgrade,this.path=(n.path||"/engine.io").replace(/\/$/,"")+"/",this.forceJSONP=!!n.forceJSONP,this.jsonp=!1!==n.jsonp,this.forceBase64=!!n.forceBase64,this.enablesXDR=!!n.enablesXDR,this.timestampParam=n.timestampParam||"t",this.timestampRequests=n.timestampRequests,this.transports=n.transports||["polling","websocket"],this.transportOptions=n.transportOptions||{},this.readyState="",this.writeBuffer=[],this.prevBufferLen=0,this.policyPort=n.policyPort||843,this.rememberUpgrade=n.rememberUpgrade||!1,this.binaryType=null,this.onlyBinaryUpgrades=n.onlyBinaryUpgrades,this.perMessageDeflate=!1!==n.perMessageDeflate&&(n.perMessageDeflate||{}),!0===this.perMessageDeflate&&(this.perMessageDeflate={}),this.perMessageDeflate&&null==this.perMessageDeflate.threshold&&(this.perMessageDeflate.threshold=1024),this.pfx=n.pfx||null,this.key=n.key||null,this.passphrase=n.passphrase||null,this.cert=n.cert||null,this.ca=n.ca||null,this.ciphers=n.ciphers||null,this.rejectUnauthorized=void 0===n.rejectUnauthorized||n.rejectUnauthorized,this.forceNode=!!n.forceNode;var o="object"==typeof e&&e;o.global===o&&(n.extraHeaders&&Object.keys(n.extraHeaders).length>0&&(this.extraHeaders=n.extraHeaders),n.localAddress&&(this.localAddress=n.localAddress)),this.id=null,this.upgrades=null,this.pingInterval=null,this.pingTimeout=null,this.pingIntervalTimer=null,this.pingTimeoutTimer=null,this.open()}function o(t){var e={};for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e}var i=n(17),s=n(8),a=n(3)("engine.io-client:socket"),c=n(37),p=n(23),u=n(2),h=n(38),f=n(31);t.exports=r,r.priorWebsocketSuccess=!1,s(r.prototype),r.protocol=p.protocol,r.Socket=r,r.Transport=n(22),r.transports=n(17),r.parser=n(23),r.prototype.createTransport=function(t){a('creating transport "%s"',t);var e=o(this.query);e.EIO=p.protocol,e.transport=t;var n=this.transportOptions[t]||{};this.id&&(e.sid=this.id);var r=new i[t]({query:e,socket:this,agent:n.agent||this.agent,hostname:n.hostname||this.hostname,port:n.port||this.port,secure:n.secure||this.secure,path:n.path||this.path,forceJSONP:n.forceJSONP||this.forceJSONP,jsonp:n.jsonp||this.jsonp,forceBase64:n.forceBase64||this.forceBase64,enablesXDR:n.enablesXDR||this.enablesXDR,timestampRequests:n.timestampRequests||this.timestampRequests,timestampParam:n.timestampParam||this.timestampParam,policyPort:n.policyPort||this.policyPort,pfx:n.pfx||this.pfx,key:n.key||this.key,passphrase:n.passphrase||this.passphrase,cert:n.cert||this.cert,ca:n.ca||this.ca,ciphers:n.ciphers||this.ciphers,rejectUnauthorized:n.rejectUnauthorized||this.rejectUnauthorized,perMessageDeflate:n.perMessageDeflate||this.perMessageDeflate,extraHeaders:n.extraHeaders||this.extraHeaders,forceNode:n.forceNode||this.forceNode,localAddress:n.localAddress||this.localAddress,requestTimeout:n.requestTimeout||this.requestTimeout,protocols:n.protocols||void 0});return r},r.prototype.open=function(){var t;if(this.rememberUpgrade&&r.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1)t="websocket";else{if(0===this.transports.length){var e=this;return void setTimeout(function(){e.emit("error","No transports available")},0)}t=this.transports[0]}this.readyState="opening";try{t=this.createTransport(t)}catch(n){return this.transports.shift(),void this.open()}t.open(),this.setTransport(t)},r.prototype.setTransport=function(t){a("setting transport %s",t.name);var e=this;this.transport&&(a("clearing existing transport %s",this.transport.name),this.transport.removeAllListeners()),this.transport=t,t.on("drain",function(){e.onDrain()}).on("packet",function(t){e.onPacket(t)}).on("error",function(t){e.onError(t)}).on("close",function(){e.onClose("transport close")})},r.prototype.probe=function(t){function e(){if(f.onlyBinaryUpgrades){var e=!this.supportsBinary&&f.transport.supportsBinary;h=h||e}h||(a('probe transport "%s" opened',t),u.send([{type:"ping",data:"probe"}]),u.once("packet",function(e){if(!h)if("pong"===e.type&&"probe"===e.data){if(a('probe transport "%s" pong',t),f.upgrading=!0,f.emit("upgrading",u),!u)return;r.priorWebsocketSuccess="websocket"===u.name,a('pausing current transport "%s"',f.transport.name),f.transport.pause(function(){h||"closed"!==f.readyState&&(a("changing transport and sending upgrade packet"),p(),f.setTransport(u),u.send([{type:"upgrade"}]),f.emit("upgrade",u),u=null,f.upgrading=!1,f.flush())})}else{a('probe transport "%s" failed',t);var n=new Error("probe error");n.transport=u.name,f.emit("upgradeError",n)}}))}function n(){h||(h=!0,p(),u.close(),u=null)}function o(e){var r=new Error("probe error: "+e);r.transport=u.name,n(),a('probe transport "%s" failed because of error: %s',t,e),f.emit("upgradeError",r)}function i(){o("transport closed")}function s(){o("socket closed")}function c(t){u&&t.name!==u.name&&(a('"%s" works - aborting "%s"',t.name,u.name),n())}function p(){u.removeListener("open",e),u.removeListener("error",o),u.removeListener("close",i),f.removeListener("close",s),f.removeListener("upgrading",c)}a('probing transport "%s"',t);var u=this.createTransport(t,{probe:1}),h=!1,f=this;r.priorWebsocketSuccess=!1,u.once("open",e),u.once("error",o),u.once("close",i),this.once("close",s),this.once("upgrading",c),u.open()},r.prototype.onOpen=function(){if(a("socket open"),this.readyState="open",r.priorWebsocketSuccess="websocket"===this.transport.name,this.emit("open"),this.flush(),"open"===this.readyState&&this.upgrade&&this.transport.pause){a("starting upgrade probes");for(var t=0,e=this.upgrades.length;t<e;t++)this.probe(this.upgrades[t])}},r.prototype.onPacket=function(t){if("opening"===this.readyState||"open"===this.readyState||"closing"===this.readyState)switch(a('socket receive: type "%s", data "%s"',t.type,t.data),this.emit("packet",t),this.emit("heartbeat"),t.type){case"open":this.onHandshake(h(t.data));break;case"pong":this.setPing(),this.emit("pong");break;case"error":var e=new Error("server error");e.code=t.data,this.onError(e);break;case"message":this.emit("data",t.data),this.emit("message",t.data)}else a('packet received with socket readyState "%s"',this.readyState)},r.prototype.onHandshake=function(t){this.emit("handshake",t),this.id=t.sid,this.transport.query.sid=t.sid,this.upgrades=this.filterUpgrades(t.upgrades),this.pingInterval=t.pingInterval,this.pingTimeout=t.pingTimeout,this.onOpen(),"closed"!==this.readyState&&(this.setPing(),this.removeListener("heartbeat",this.onHeartbeat),this.on("heartbeat",this.onHeartbeat))},r.prototype.onHeartbeat=function(t){clearTimeout(this.pingTimeoutTimer);var e=this;e.pingTimeoutTimer=setTimeout(function(){"closed"!==e.readyState&&e.onClose("ping timeout")},t||e.pingInterval+e.pingTimeout)},r.prototype.setPing=function(){var t=this;clearTimeout(t.pingIntervalTimer),t.pingIntervalTimer=setTimeout(function(){a("writing ping packet - expecting pong within %sms",t.pingTimeout),t.ping(),t.onHeartbeat(t.pingTimeout)},t.pingInterval)},r.prototype.ping=function(){var t=this;this.sendPacket("ping",function(){t.emit("ping")})},r.prototype.onDrain=function(){this.writeBuffer.splice(0,this.prevBufferLen),this.prevBufferLen=0,0===this.writeBuffer.length?this.emit("drain"):this.flush()},r.prototype.flush=function(){"closed"!==this.readyState&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length&&(a("flushing %d packets in socket",this.writeBuffer.length),this.transport.send(this.writeBuffer),this.prevBufferLen=this.writeBuffer.length,this.emit("flush"))},r.prototype.write=r.prototype.send=function(t,e,n){return this.sendPacket("message",t,e,n),this},r.prototype.sendPacket=function(t,e,n,r){if("function"==typeof e&&(r=e,e=void 0),"function"==typeof n&&(r=n,n=null),"closing"!==this.readyState&&"closed"!==this.readyState){n=n||{},n.compress=!1!==n.compress;var o={type:t,data:e,options:n};this.emit("packetCreate",o),this.writeBuffer.push(o),r&&this.once("flush",r),this.flush()}},r.prototype.close=function(){function t(){r.onClose("forced close"),a("socket closing - telling transport to close"),r.transport.close()}function e(){r.removeListener("upgrade",e),r.removeListener("upgradeError",e),t()}function n(){r.once("upgrade",e),r.once("upgradeError",e)}if("opening"===this.readyState||"open"===this.readyState){this.readyState="closing";var r=this;this.writeBuffer.length?this.once("drain",function(){this.upgrading?n():t()}):this.upgrading?n():t()}return this},r.prototype.onError=function(t){a("socket error %j",t),r.priorWebsocketSuccess=!1,this.emit("error",t),this.onClose("transport error",t)},r.prototype.onClose=function(t,e){if("opening"===this.readyState||"open"===this.readyState||"closing"===this.readyState){a('socket close with reason: "%s"',t);var n=this;clearTimeout(this.pingIntervalTimer),clearTimeout(this.pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),this.readyState="closed",this.id=null,this.emit("close",t,e),n.writeBuffer=[],n.prevBufferLen=0}},r.prototype.filterUpgrades=function(t){for(var e=[],n=0,r=t.length;n<r;n++)~c(this.transports,t[n])&&e.push(t[n]);return e}}).call(e,function(){return this}())},function(t,e,n){(function(t){function r(e){var n,r=!1,a=!1,c=!1!==e.jsonp;if(t.location){var p="https:"===location.protocol,u=location.port;u||(u=p?443:80),r=e.hostname!==location.hostname||u!==e.port,a=e.secure!==p}if(e.xdomain=r,e.xscheme=a,n=new o(e),"open"in n&&!e.forceJSONP)return new i(e);if(!c)throw new Error("JSONP disabled");return new s(e)}var o=n(18),i=n(20),s=n(34),a=n(35);e.polling=r,e.websocket=a}).call(e,function(){return this}())},function(t,e,n){(function(e){var r=n(19);t.exports=function(t){var n=t.xdomain,o=t.xscheme,i=t.enablesXDR;try{if("undefined"!=typeof XMLHttpRequest&&(!n||r))return new XMLHttpRequest}catch(s){}try{if("undefined"!=typeof XDomainRequest&&!o&&i)return new XDomainRequest}catch(s){}if(!n)try{
return new(e[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP")}catch(s){}}}).call(e,function(){return this}())},function(t,e){try{t.exports="undefined"!=typeof XMLHttpRequest&&"withCredentials"in new XMLHttpRequest}catch(n){t.exports=!1}},function(t,e,n){(function(e){function r(){}function o(t){if(c.call(this,t),this.requestTimeout=t.requestTimeout,this.extraHeaders=t.extraHeaders,e.location){var n="https:"===location.protocol,r=location.port;r||(r=n?443:80),this.xd=t.hostname!==e.location.hostname||r!==t.port,this.xs=t.secure!==n}}function i(t){this.method=t.method||"GET",this.uri=t.uri,this.xd=!!t.xd,this.xs=!!t.xs,this.async=!1!==t.async,this.data=void 0!==t.data?t.data:null,this.agent=t.agent,this.isBinary=t.isBinary,this.supportsBinary=t.supportsBinary,this.enablesXDR=t.enablesXDR,this.requestTimeout=t.requestTimeout,this.pfx=t.pfx,this.key=t.key,this.passphrase=t.passphrase,this.cert=t.cert,this.ca=t.ca,this.ciphers=t.ciphers,this.rejectUnauthorized=t.rejectUnauthorized,this.extraHeaders=t.extraHeaders,this.create()}function s(){for(var t in i.requests)i.requests.hasOwnProperty(t)&&i.requests[t].abort()}var a=n(18),c=n(21),p=n(8),u=n(32),h=n(3)("engine.io-client:polling-xhr");t.exports=o,t.exports.Request=i,u(o,c),o.prototype.supportsBinary=!0,o.prototype.request=function(t){return t=t||{},t.uri=this.uri(),t.xd=this.xd,t.xs=this.xs,t.agent=this.agent||!1,t.supportsBinary=this.supportsBinary,t.enablesXDR=this.enablesXDR,t.pfx=this.pfx,t.key=this.key,t.passphrase=this.passphrase,t.cert=this.cert,t.ca=this.ca,t.ciphers=this.ciphers,t.rejectUnauthorized=this.rejectUnauthorized,t.requestTimeout=this.requestTimeout,t.extraHeaders=this.extraHeaders,new i(t)},o.prototype.doWrite=function(t,e){var n="string"!=typeof t&&void 0!==t,r=this.request({method:"POST",data:t,isBinary:n}),o=this;r.on("success",e),r.on("error",function(t){o.onError("xhr post error",t)}),this.sendXhr=r},o.prototype.doPoll=function(){h("xhr poll");var t=this.request(),e=this;t.on("data",function(t){e.onData(t)}),t.on("error",function(t){e.onError("xhr poll error",t)}),this.pollXhr=t},p(i.prototype),i.prototype.create=function(){var t={agent:this.agent,xdomain:this.xd,xscheme:this.xs,enablesXDR:this.enablesXDR};t.pfx=this.pfx,t.key=this.key,t.passphrase=this.passphrase,t.cert=this.cert,t.ca=this.ca,t.ciphers=this.ciphers,t.rejectUnauthorized=this.rejectUnauthorized;var n=this.xhr=new a(t),r=this;try{h("xhr open %s: %s",this.method,this.uri),n.open(this.method,this.uri,this.async);try{if(this.extraHeaders){n.setDisableHeaderCheck&&n.setDisableHeaderCheck(!0);for(var o in this.extraHeaders)this.extraHeaders.hasOwnProperty(o)&&n.setRequestHeader(o,this.extraHeaders[o])}}catch(s){}if("POST"===this.method)try{this.isBinary?n.setRequestHeader("Content-type","application/octet-stream"):n.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch(s){}try{n.setRequestHeader("Accept","*/*")}catch(s){}"withCredentials"in n&&(n.withCredentials=!0),this.requestTimeout&&(n.timeout=this.requestTimeout),this.hasXDR()?(n.onload=function(){r.onLoad()},n.onerror=function(){r.onError(n.responseText)}):n.onreadystatechange=function(){if(2===n.readyState){var t;try{t=n.getResponseHeader("Content-Type")}catch(e){}"application/octet-stream"===t&&(n.responseType="arraybuffer")}4===n.readyState&&(200===n.status||1223===n.status?r.onLoad():setTimeout(function(){r.onError(n.status)},0))},h("xhr data %s",this.data),n.send(this.data)}catch(s){return void setTimeout(function(){r.onError(s)},0)}e.document&&(this.index=i.requestsCount++,i.requests[this.index]=this)},i.prototype.onSuccess=function(){this.emit("success"),this.cleanup()},i.prototype.onData=function(t){this.emit("data",t),this.onSuccess()},i.prototype.onError=function(t){this.emit("error",t),this.cleanup(!0)},i.prototype.cleanup=function(t){if("undefined"!=typeof this.xhr&&null!==this.xhr){if(this.hasXDR()?this.xhr.onload=this.xhr.onerror=r:this.xhr.onreadystatechange=r,t)try{this.xhr.abort()}catch(n){}e.document&&delete i.requests[this.index],this.xhr=null}},i.prototype.onLoad=function(){var t;try{var e;try{e=this.xhr.getResponseHeader("Content-Type")}catch(n){}t="application/octet-stream"===e?this.xhr.response||this.xhr.responseText:this.xhr.responseText}catch(n){this.onError(n)}null!=t&&this.onData(t)},i.prototype.hasXDR=function(){return"undefined"!=typeof e.XDomainRequest&&!this.xs&&this.enablesXDR},i.prototype.abort=function(){this.cleanup()},i.requestsCount=0,i.requests={},e.document&&(e.attachEvent?e.attachEvent("onunload",s):e.addEventListener&&e.addEventListener("beforeunload",s,!1))}).call(e,function(){return this}())},function(t,e,n){function r(t){var e=t&&t.forceBase64;u&&!e||(this.supportsBinary=!1),o.call(this,t)}var o=n(22),i=n(31),s=n(23),a=n(32),c=n(33),p=n(3)("engine.io-client:polling");t.exports=r;var u=function(){var t=n(18),e=new t({xdomain:!1});return null!=e.responseType}();a(r,o),r.prototype.name="polling",r.prototype.doOpen=function(){this.poll()},r.prototype.pause=function(t){function e(){p("paused"),n.readyState="paused",t()}var n=this;if(this.readyState="pausing",this.polling||!this.writable){var r=0;this.polling&&(p("we are currently polling - waiting to pause"),r++,this.once("pollComplete",function(){p("pre-pause polling complete"),--r||e()})),this.writable||(p("we are currently writing - waiting to pause"),r++,this.once("drain",function(){p("pre-pause writing complete"),--r||e()}))}else e()},r.prototype.poll=function(){p("polling"),this.polling=!0,this.doPoll(),this.emit("poll")},r.prototype.onData=function(t){var e=this;p("polling got data %s",t);var n=function(t,n,r){return"opening"===e.readyState&&e.onOpen(),"close"===t.type?(e.onClose(),!1):void e.onPacket(t)};s.decodePayload(t,this.socket.binaryType,n),"closed"!==this.readyState&&(this.polling=!1,this.emit("pollComplete"),"open"===this.readyState?this.poll():p('ignoring poll - transport state "%s"',this.readyState))},r.prototype.doClose=function(){function t(){p("writing close packet"),e.write([{type:"close"}])}var e=this;"open"===this.readyState?(p("transport open - closing"),t()):(p("transport not open - deferring close"),this.once("open",t))},r.prototype.write=function(t){var e=this;this.writable=!1;var n=function(){e.writable=!0,e.emit("drain")};s.encodePayload(t,this.supportsBinary,function(t){e.doWrite(t,n)})},r.prototype.uri=function(){var t=this.query||{},e=this.secure?"https":"http",n="";!1!==this.timestampRequests&&(t[this.timestampParam]=c()),this.supportsBinary||t.sid||(t.b64=1),t=i.encode(t),this.port&&("https"===e&&443!==Number(this.port)||"http"===e&&80!==Number(this.port))&&(n=":"+this.port),t.length&&(t="?"+t);var r=this.hostname.indexOf(":")!==-1;return e+"://"+(r?"["+this.hostname+"]":this.hostname)+n+this.path+t}},function(t,e,n){function r(t){this.path=t.path,this.hostname=t.hostname,this.port=t.port,this.secure=t.secure,this.query=t.query,this.timestampParam=t.timestampParam,this.timestampRequests=t.timestampRequests,this.readyState="",this.agent=t.agent||!1,this.socket=t.socket,this.enablesXDR=t.enablesXDR,this.pfx=t.pfx,this.key=t.key,this.passphrase=t.passphrase,this.cert=t.cert,this.ca=t.ca,this.ciphers=t.ciphers,this.rejectUnauthorized=t.rejectUnauthorized,this.forceNode=t.forceNode,this.extraHeaders=t.extraHeaders,this.localAddress=t.localAddress}var o=n(23),i=n(8);t.exports=r,i(r.prototype),r.prototype.onError=function(t,e){var n=new Error(t);return n.type="TransportError",n.description=e,this.emit("error",n),this},r.prototype.open=function(){return"closed"!==this.readyState&&""!==this.readyState||(this.readyState="opening",this.doOpen()),this},r.prototype.close=function(){return"opening"!==this.readyState&&"open"!==this.readyState||(this.doClose(),this.onClose()),this},r.prototype.send=function(t){if("open"!==this.readyState)throw new Error("Transport not open");this.write(t)},r.prototype.onOpen=function(){this.readyState="open",this.writable=!0,this.emit("open")},r.prototype.onData=function(t){var e=o.decodePacket(t,this.socket.binaryType);this.onPacket(e)},r.prototype.onPacket=function(t){this.emit("packet",t)},r.prototype.onClose=function(){this.readyState="closed",this.emit("close")}},function(t,e,n){(function(t){function r(t,n){var r="b"+e.packets[t.type]+t.data.data;return n(r)}function o(t,n,r){if(!n)return e.encodeBase64Packet(t,r);var o=t.data,i=new Uint8Array(o),s=new Uint8Array(1+o.byteLength);s[0]=v[t.type];for(var a=0;a<i.length;a++)s[a+1]=i[a];return r(s.buffer)}function i(t,n,r){if(!n)return e.encodeBase64Packet(t,r);var o=new FileReader;return o.onload=function(){t.data=o.result,e.encodePacket(t,n,!0,r)},o.readAsArrayBuffer(t.data)}function s(t,n,r){if(!n)return e.encodeBase64Packet(t,r);if(g)return i(t,n,r);var o=new Uint8Array(1);o[0]=v[t.type];var s=new k([o.buffer,t.data]);return r(s)}function a(t){try{t=d.decode(t,{strict:!1})}catch(e){return!1}return t}function c(t,e,n){for(var r=new Array(t.length),o=l(t.length,n),i=function(t,n,o){e(n,function(e,n){r[t]=n,o(e,r)})},s=0;s<t.length;s++)i(s,t[s],o)}var p,u=n(24),h=n(9),f=n(25),l=n(26),d=n(27);t&&t.ArrayBuffer&&(p=n(29));var y="undefined"!=typeof navigator&&/Android/i.test(navigator.userAgent),m="undefined"!=typeof navigator&&/PhantomJS/i.test(navigator.userAgent),g=y||m;e.protocol=3;var v=e.packets={open:0,close:1,ping:2,pong:3,message:4,upgrade:5,noop:6},b=u(v),w={type:"error",data:"parser error"},k=n(30);e.encodePacket=function(e,n,i,a){"function"==typeof n&&(a=n,n=!1),"function"==typeof i&&(a=i,i=null);var c=void 0===e.data?void 0:e.data.buffer||e.data;if(t.ArrayBuffer&&c instanceof ArrayBuffer)return o(e,n,a);if(k&&c instanceof t.Blob)return s(e,n,a);if(c&&c.base64)return r(e,a);var p=v[e.type];return void 0!==e.data&&(p+=i?d.encode(String(e.data),{strict:!1}):String(e.data)),a(""+p)},e.encodeBase64Packet=function(n,r){var o="b"+e.packets[n.type];if(k&&n.data instanceof t.Blob){var i=new FileReader;return i.onload=function(){var t=i.result.split(",")[1];r(o+t)},i.readAsDataURL(n.data)}var s;try{s=String.fromCharCode.apply(null,new Uint8Array(n.data))}catch(a){for(var c=new Uint8Array(n.data),p=new Array(c.length),u=0;u<c.length;u++)p[u]=c[u];s=String.fromCharCode.apply(null,p)}return o+=t.btoa(s),r(o)},e.decodePacket=function(t,n,r){if(void 0===t)return w;if("string"==typeof t){if("b"===t.charAt(0))return e.decodeBase64Packet(t.substr(1),n);if(r&&(t=a(t),t===!1))return w;var o=t.charAt(0);return Number(o)==o&&b[o]?t.length>1?{type:b[o],data:t.substring(1)}:{type:b[o]}:w}var i=new Uint8Array(t),o=i[0],s=f(t,1);return k&&"blob"===n&&(s=new k([s])),{type:b[o],data:s}},e.decodeBase64Packet=function(t,e){var n=b[t.charAt(0)];if(!p)return{type:n,data:{base64:!0,data:t.substr(1)}};var r=p.decode(t.substr(1));return"blob"===e&&k&&(r=new k([r])),{type:n,data:r}},e.encodePayload=function(t,n,r){function o(t){return t.length+":"+t}function i(t,r){e.encodePacket(t,!!s&&n,!1,function(t){r(null,o(t))})}"function"==typeof n&&(r=n,n=null);var s=h(t);return n&&s?k&&!g?e.encodePayloadAsBlob(t,r):e.encodePayloadAsArrayBuffer(t,r):t.length?void c(t,i,function(t,e){return r(e.join(""))}):r("0:")},e.decodePayload=function(t,n,r){if("string"!=typeof t)return e.decodePayloadAsBinary(t,n,r);"function"==typeof n&&(r=n,n=null);var o;if(""===t)return r(w,0,1);for(var i,s,a="",c=0,p=t.length;c<p;c++){var u=t.charAt(c);if(":"===u){if(""===a||a!=(i=Number(a)))return r(w,0,1);if(s=t.substr(c+1,i),a!=s.length)return r(w,0,1);if(s.length){if(o=e.decodePacket(s,n,!1),w.type===o.type&&w.data===o.data)return r(w,0,1);var h=r(o,c+i,p);if(!1===h)return}c+=i,a=""}else a+=u}return""!==a?r(w,0,1):void 0},e.encodePayloadAsArrayBuffer=function(t,n){function r(t,n){e.encodePacket(t,!0,!0,function(t){return n(null,t)})}return t.length?void c(t,r,function(t,e){var r=e.reduce(function(t,e){var n;return n="string"==typeof e?e.length:e.byteLength,t+n.toString().length+n+2},0),o=new Uint8Array(r),i=0;return e.forEach(function(t){var e="string"==typeof t,n=t;if(e){for(var r=new Uint8Array(t.length),s=0;s<t.length;s++)r[s]=t.charCodeAt(s);n=r.buffer}e?o[i++]=0:o[i++]=1;for(var a=n.byteLength.toString(),s=0;s<a.length;s++)o[i++]=parseInt(a[s]);o[i++]=255;for(var r=new Uint8Array(n),s=0;s<r.length;s++)o[i++]=r[s]}),n(o.buffer)}):n(new ArrayBuffer(0))},e.encodePayloadAsBlob=function(t,n){function r(t,n){e.encodePacket(t,!0,!0,function(t){var e=new Uint8Array(1);if(e[0]=1,"string"==typeof t){for(var r=new Uint8Array(t.length),o=0;o<t.length;o++)r[o]=t.charCodeAt(o);t=r.buffer,e[0]=0}for(var i=t instanceof ArrayBuffer?t.byteLength:t.size,s=i.toString(),a=new Uint8Array(s.length+1),o=0;o<s.length;o++)a[o]=parseInt(s[o]);if(a[s.length]=255,k){var c=new k([e.buffer,a.buffer,t]);n(null,c)}})}c(t,r,function(t,e){return n(new k(e))})},e.decodePayloadAsBinary=function(t,n,r){"function"==typeof n&&(r=n,n=null);for(var o=t,i=[];o.byteLength>0;){for(var s=new Uint8Array(o),a=0===s[0],c="",p=1;255!==s[p];p++){if(c.length>310)return r(w,0,1);c+=s[p]}o=f(o,2+c.length),c=parseInt(c);var u=f(o,0,c);if(a)try{u=String.fromCharCode.apply(null,new Uint8Array(u))}catch(h){var l=new Uint8Array(u);u="";for(var p=0;p<l.length;p++)u+=String.fromCharCode(l[p])}i.push(u),o=f(o,c)}var d=i.length;i.forEach(function(t,o){r(e.decodePacket(t,n,!0),o,d)})}}).call(e,function(){return this}())},function(t,e){t.exports=Object.keys||function(t){var e=[],n=Object.prototype.hasOwnProperty;for(var r in t)n.call(t,r)&&e.push(r);return e}},function(t,e){t.exports=function(t,e,n){var r=t.byteLength;if(e=e||0,n=n||r,t.slice)return t.slice(e,n);if(e<0&&(e+=r),n<0&&(n+=r),n>r&&(n=r),e>=r||e>=n||0===r)return new ArrayBuffer(0);for(var o=new Uint8Array(t),i=new Uint8Array(n-e),s=e,a=0;s<n;s++,a++)i[a]=o[s];return i.buffer}},function(t,e){function n(t,e,n){function o(t,r){if(o.count<=0)throw new Error("after called too many times");--o.count,t?(i=!0,e(t),e=n):0!==o.count||i||e(null,r)}var i=!1;return n=n||r,o.count=t,0===t?e():o}function r(){}t.exports=n},function(t,e,n){var r;(function(t,o){!function(i){function s(t){for(var e,n,r=[],o=0,i=t.length;o<i;)e=t.charCodeAt(o++),e>=55296&&e<=56319&&o<i?(n=t.charCodeAt(o++),56320==(64512&n)?r.push(((1023&e)<<10)+(1023&n)+65536):(r.push(e),o--)):r.push(e);return r}function a(t){for(var e,n=t.length,r=-1,o="";++r<n;)e=t[r],e>65535&&(e-=65536,o+=w(e>>>10&1023|55296),e=56320|1023&e),o+=w(e);return o}function c(t,e){if(t>=55296&&t<=57343){if(e)throw Error("Lone surrogate U+"+t.toString(16).toUpperCase()+" is not a scalar value");return!1}return!0}function p(t,e){return w(t>>e&63|128)}function u(t,e){if(0==(4294967168&t))return w(t);var n="";return 0==(4294965248&t)?n=w(t>>6&31|192):0==(4294901760&t)?(c(t,e)||(t=65533),n=w(t>>12&15|224),n+=p(t,6)):0==(4292870144&t)&&(n=w(t>>18&7|240),n+=p(t,12),n+=p(t,6)),n+=w(63&t|128)}function h(t,e){e=e||{};for(var n,r=!1!==e.strict,o=s(t),i=o.length,a=-1,c="";++a<i;)n=o[a],c+=u(n,r);return c}function f(){if(b>=v)throw Error("Invalid byte index");var t=255&g[b];if(b++,128==(192&t))return 63&t;throw Error("Invalid continuation byte")}function l(t){var e,n,r,o,i;if(b>v)throw Error("Invalid byte index");if(b==v)return!1;if(e=255&g[b],b++,0==(128&e))return e;if(192==(224&e)){if(n=f(),i=(31&e)<<6|n,i>=128)return i;throw Error("Invalid continuation byte")}if(224==(240&e)){if(n=f(),r=f(),i=(15&e)<<12|n<<6|r,i>=2048)return c(i,t)?i:65533;throw Error("Invalid continuation byte")}if(240==(248&e)&&(n=f(),r=f(),o=f(),i=(7&e)<<18|n<<12|r<<6|o,i>=65536&&i<=1114111))return i;throw Error("Invalid UTF-8 detected")}function d(t,e){e=e||{};var n=!1!==e.strict;g=s(t),v=g.length,b=0;for(var r,o=[];(r=l(n))!==!1;)o.push(r);return a(o)}var y="object"==typeof e&&e,m=("object"==typeof t&&t&&t.exports==y&&t,"object"==typeof o&&o);m.global!==m&&m.window!==m||(i=m);var g,v,b,w=String.fromCharCode,k={version:"2.1.2",encode:h,decode:d};r=function(){return k}.call(e,n,e,t),!(void 0!==r&&(t.exports=r))}(this)}).call(e,n(28)(t),function(){return this}())},function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children=[],t.webpackPolyfill=1),t}},function(t,e){!function(){"use strict";for(var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",n=new Uint8Array(256),r=0;r<t.length;r++)n[t.charCodeAt(r)]=r;e.encode=function(e){var n,r=new Uint8Array(e),o=r.length,i="";for(n=0;n<o;n+=3)i+=t[r[n]>>2],i+=t[(3&r[n])<<4|r[n+1]>>4],i+=t[(15&r[n+1])<<2|r[n+2]>>6],i+=t[63&r[n+2]];return o%3===2?i=i.substring(0,i.length-1)+"=":o%3===1&&(i=i.substring(0,i.length-2)+"=="),i},e.decode=function(t){var e,r,o,i,s,a=.75*t.length,c=t.length,p=0;"="===t[t.length-1]&&(a--,"="===t[t.length-2]&&a--);var u=new ArrayBuffer(a),h=new Uint8Array(u);for(e=0;e<c;e+=4)r=n[t.charCodeAt(e)],o=n[t.charCodeAt(e+1)],i=n[t.charCodeAt(e+2)],s=n[t.charCodeAt(e+3)],h[p++]=r<<2|o>>4,h[p++]=(15&o)<<4|i>>2,h[p++]=(3&i)<<6|63&s;return u}}()},function(t,e){(function(e){function n(t){for(var e=0;e<t.length;e++){var n=t[e];if(n.buffer instanceof ArrayBuffer){var r=n.buffer;if(n.byteLength!==r.byteLength){var o=new Uint8Array(n.byteLength);o.set(new Uint8Array(r,n.byteOffset,n.byteLength)),r=o.buffer}t[e]=r}}}function r(t,e){e=e||{};var r=new i;n(t);for(var o=0;o<t.length;o++)r.append(t[o]);return e.type?r.getBlob(e.type):r.getBlob()}function o(t,e){return n(t),new Blob(t,e||{})}var i=e.BlobBuilder||e.WebKitBlobBuilder||e.MSBlobBuilder||e.MozBlobBuilder,s=function(){try{var t=new Blob(["hi"]);return 2===t.size}catch(e){return!1}}(),a=s&&function(){try{var t=new Blob([new Uint8Array([1,2])]);return 2===t.size}catch(e){return!1}}(),c=i&&i.prototype.append&&i.prototype.getBlob;t.exports=function(){return s?a?e.Blob:o:c?r:void 0}()}).call(e,function(){return this}())},function(t,e){e.encode=function(t){var e="";for(var n in t)t.hasOwnProperty(n)&&(e.length&&(e+="&"),e+=encodeURIComponent(n)+"="+encodeURIComponent(t[n]));return e},e.decode=function(t){for(var e={},n=t.split("&"),r=0,o=n.length;r<o;r++){var i=n[r].split("=");e[decodeURIComponent(i[0])]=decodeURIComponent(i[1])}return e}},function(t,e){t.exports=function(t,e){var n=function(){};n.prototype=e.prototype,t.prototype=new n,t.prototype.constructor=t}},function(t,e){"use strict";function n(t){var e="";do e=s[t%a]+e,t=Math.floor(t/a);while(t>0);return e}function r(t){var e=0;for(u=0;u<t.length;u++)e=e*a+c[t.charAt(u)];return e}function o(){var t=n(+new Date);return t!==i?(p=0,i=t):t+"."+n(p++)}for(var i,s="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""),a=64,c={},p=0,u=0;u<a;u++)c[s[u]]=u;o.encode=n,o.decode=r,t.exports=o},function(t,e,n){(function(e){function r(){}function o(t){i.call(this,t),this.query=this.query||{},a||(e.___eio||(e.___eio=[]),a=e.___eio),this.index=a.length;var n=this;a.push(function(t){n.onData(t)}),this.query.j=this.index,e.document&&e.addEventListener&&e.addEventListener("beforeunload",function(){n.script&&(n.script.onerror=r)},!1)}var i=n(21),s=n(32);t.exports=o;var a,c=/\n/g,p=/\\n/g;s(o,i),o.prototype.supportsBinary=!1,o.prototype.doClose=function(){this.script&&(this.script.parentNode.removeChild(this.script),this.script=null),this.form&&(this.form.parentNode.removeChild(this.form),this.form=null,this.iframe=null),i.prototype.doClose.call(this)},o.prototype.doPoll=function(){var t=this,e=document.createElement("script");this.script&&(this.script.parentNode.removeChild(this.script),this.script=null),e.async=!0,e.src=this.uri(),e.onerror=function(e){t.onError("jsonp poll error",e)};var n=document.getElementsByTagName("script")[0];n?n.parentNode.insertBefore(e,n):(document.head||document.body).appendChild(e),this.script=e;var r="undefined"!=typeof navigator&&/gecko/i.test(navigator.userAgent);r&&setTimeout(function(){var t=document.createElement("iframe");document.body.appendChild(t),document.body.removeChild(t)},100)},o.prototype.doWrite=function(t,e){function n(){r(),e()}function r(){if(o.iframe)try{o.form.removeChild(o.iframe)}catch(t){o.onError("jsonp polling iframe removal error",t)}try{var e='<iframe src="javascript:0" name="'+o.iframeId+'">';i=document.createElement(e)}catch(t){i=document.createElement("iframe"),i.name=o.iframeId,i.src="javascript:0"}i.id=o.iframeId,o.form.appendChild(i),o.iframe=i}var o=this;if(!this.form){var i,s=document.createElement("form"),a=document.createElement("textarea"),u=this.iframeId="eio_iframe_"+this.index;s.className="socketio",s.style.position="absolute",s.style.top="-1000px",s.style.left="-1000px",s.target=u,s.method="POST",s.setAttribute("accept-charset","utf-8"),a.name="d",s.appendChild(a),document.body.appendChild(s),this.form=s,this.area=a}this.form.action=this.uri(),r(),t=t.replace(p,"\\\n"),this.area.value=t.replace(c,"\\n");try{this.form.submit()}catch(h){}this.iframe.attachEvent?this.iframe.onreadystatechange=function(){"complete"===o.iframe.readyState&&n()}:this.iframe.onload=n}}).call(e,function(){return this}())},function(t,e,n){(function(e){function r(t){var e=t&&t.forceBase64;e&&(this.supportsBinary=!1),this.perMessageDeflate=t.perMessageDeflate,this.usingBrowserWebSocket=h&&!t.forceNode,this.protocols=t.protocols,this.usingBrowserWebSocket||(l=o),i.call(this,t)}var o,i=n(22),s=n(23),a=n(31),c=n(32),p=n(33),u=n(3)("engine.io-client:websocket"),h=e.WebSocket||e.MozWebSocket;if("undefined"==typeof window)try{o=n(36)}catch(f){}var l=h;l||"undefined"!=typeof window||(l=o),t.exports=r,c(r,i),r.prototype.name="websocket",r.prototype.supportsBinary=!0,r.prototype.doOpen=function(){if(this.check()){var t=this.uri(),e=this.protocols,n={agent:this.agent,perMessageDeflate:this.perMessageDeflate};n.pfx=this.pfx,n.key=this.key,n.passphrase=this.passphrase,n.cert=this.cert,n.ca=this.ca,n.ciphers=this.ciphers,n.rejectUnauthorized=this.rejectUnauthorized,this.extraHeaders&&(n.headers=this.extraHeaders),this.localAddress&&(n.localAddress=this.localAddress);try{this.ws=this.usingBrowserWebSocket?e?new l(t,e):new l(t):new l(t,e,n)}catch(r){return this.emit("error",r)}void 0===this.ws.binaryType&&(this.supportsBinary=!1),this.ws.supports&&this.ws.supports.binary?(this.supportsBinary=!0,this.ws.binaryType="nodebuffer"):this.ws.binaryType="arraybuffer",this.addEventListeners()}},r.prototype.addEventListeners=function(){var t=this;this.ws.onopen=function(){t.onOpen()},this.ws.onclose=function(){t.onClose()},this.ws.onmessage=function(e){t.onData(e.data)},this.ws.onerror=function(e){t.onError("websocket error",e)}},r.prototype.write=function(t){function n(){r.emit("flush"),setTimeout(function(){r.writable=!0,r.emit("drain")},0)}var r=this;this.writable=!1;for(var o=t.length,i=0,a=o;i<a;i++)!function(t){s.encodePacket(t,r.supportsBinary,function(i){if(!r.usingBrowserWebSocket){var s={};if(t.options&&(s.compress=t.options.compress),r.perMessageDeflate){var a="string"==typeof i?e.Buffer.byteLength(i):i.length;a<r.perMessageDeflate.threshold&&(s.compress=!1)}}try{r.usingBrowserWebSocket?r.ws.send(i):r.ws.send(i,s)}catch(c){u("websocket closed before onclose event")}--o||n()})}(t[i])},r.prototype.onClose=function(){i.prototype.onClose.call(this)},r.prototype.doClose=function(){"undefined"!=typeof this.ws&&this.ws.close()},r.prototype.uri=function(){var t=this.query||{},e=this.secure?"wss":"ws",n="";this.port&&("wss"===e&&443!==Number(this.port)||"ws"===e&&80!==Number(this.port))&&(n=":"+this.port),this.timestampRequests&&(t[this.timestampParam]=p()),this.supportsBinary||(t.b64=1),t=a.encode(t),t.length&&(t="?"+t);var r=this.hostname.indexOf(":")!==-1;return e+"://"+(r?"["+this.hostname+"]":this.hostname)+n+this.path+t},r.prototype.check=function(){return!(!l||"__initialize"in l&&this.name===r.prototype.name)}}).call(e,function(){return this}())},function(t,e){},function(t,e){var n=[].indexOf;t.exports=function(t,e){if(n)return t.indexOf(e);for(var r=0;r<t.length;++r)if(t[r]===e)return r;return-1}},function(t,e){(function(e){var n=/^[\],:{}\s]*$/,r=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,o=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,i=/(?:^|:|,)(?:\s*\[)+/g,s=/^\s+/,a=/\s+$/;t.exports=function(t){return"string"==typeof t&&t?(t=t.replace(s,"").replace(a,""),e.JSON&&JSON.parse?JSON.parse(t):n.test(t.replace(r,"@").replace(o,"]").replace(i,""))?new Function("return "+t)():void 0):null}}).call(e,function(){return this}())},function(t,e,n){"use strict";function r(t,e,n){this.io=t,this.nsp=e,this.json=this,this.ids=0,this.acks={},this.receiveBuffer=[],this.sendBuffer=[],this.connected=!1,this.disconnected=!0,n&&n.query&&(this.query=n.query),this.io.autoConnect&&this.open()}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i=n(7),s=n(8),a=n(40),c=n(41),p=n(42),u=n(3)("socket.io-client:socket"),h=n(31);t.exports=e=r;var f={connect:1,connect_error:1,connect_timeout:1,connecting:1,disconnect:1,error:1,reconnect:1,reconnect_attempt:1,reconnect_failed:1,reconnect_error:1,reconnecting:1,ping:1,pong:1},l=s.prototype.emit;s(r.prototype),r.prototype.subEvents=function(){if(!this.subs){var t=this.io;this.subs=[c(t,"open",p(this,"onopen")),c(t,"packet",p(this,"onpacket")),c(t,"close",p(this,"onclose"))]}},r.prototype.open=r.prototype.connect=function(){return this.connected?this:(this.subEvents(),this.io.open(),"open"===this.io.readyState&&this.onopen(),this.emit("connecting"),this)},r.prototype.send=function(){var t=a(arguments);return t.unshift("message"),this.emit.apply(this,t),this},r.prototype.emit=function(t){if(f.hasOwnProperty(t))return l.apply(this,arguments),this;var e=a(arguments),n={type:i.EVENT,data:e};return n.options={},n.options.compress=!this.flags||!1!==this.flags.compress,"function"==typeof e[e.length-1]&&(u("emitting packet with ack id %d",this.ids),this.acks[this.ids]=e.pop(),n.id=this.ids++),this.connected?this.packet(n):this.sendBuffer.push(n),delete this.flags,this},r.prototype.packet=function(t){t.nsp=this.nsp,this.io.packet(t)},r.prototype.onopen=function(){if(u("transport is open - connecting"),"/"!==this.nsp)if(this.query){var t="object"===o(this.query)?h.encode(this.query):this.query;u("sending connect packet with query %s",t),this.packet({type:i.CONNECT,query:t})}else this.packet({type:i.CONNECT})},r.prototype.onclose=function(t){u("close (%s)",t),this.connected=!1,this.disconnected=!0,delete this.id,this.emit("disconnect",t)},r.prototype.onpacket=function(t){if(t.nsp===this.nsp)switch(t.type){case i.CONNECT:this.onconnect();break;case i.EVENT:this.onevent(t);break;case i.BINARY_EVENT:this.onevent(t);break;case i.ACK:this.onack(t);break;case i.BINARY_ACK:this.onack(t);break;case i.DISCONNECT:this.ondisconnect();break;case i.ERROR:this.emit("error",t.data)}},r.prototype.onevent=function(t){var e=t.data||[];u("emitting event %j",e),null!=t.id&&(u("attaching ack callback to event"),e.push(this.ack(t.id))),this.connected?l.apply(this,e):this.receiveBuffer.push(e)},r.prototype.ack=function(t){var e=this,n=!1;return function(){if(!n){n=!0;var r=a(arguments);u("sending ack %j",r),e.packet({type:i.ACK,id:t,data:r})}}},r.prototype.onack=function(t){var e=this.acks[t.id];"function"==typeof e?(u("calling ack %s with %j",t.id,t.data),e.apply(this,t.data),delete this.acks[t.id]):u("bad ack %s",t.id)},r.prototype.onconnect=function(){this.connected=!0,this.disconnected=!1,this.emit("connect"),this.emitBuffered()},r.prototype.emitBuffered=function(){var t;for(t=0;t<this.receiveBuffer.length;t++)l.apply(this,this.receiveBuffer[t]);for(this.receiveBuffer=[],t=0;t<this.sendBuffer.length;t++)this.packet(this.sendBuffer[t]);this.sendBuffer=[]},r.prototype.ondisconnect=function(){u("server disconnect (%s)",this.nsp),this.destroy(),this.onclose("io server disconnect")},r.prototype.destroy=function(){if(this.subs){for(var t=0;t<this.subs.length;t++)this.subs[t].destroy();this.subs=null}this.io.destroy(this)},r.prototype.close=r.prototype.disconnect=function(){return this.connected&&(u("performing disconnect (%s)",this.nsp),this.packet({type:i.DISCONNECT})),this.destroy(),this.connected&&this.onclose("io client disconnect"),this},r.prototype.compress=function(t){return this.flags=this.flags||{},this.flags.compress=t,this}},function(t,e){function n(t,e){var n=[];e=e||0;for(var r=e||0;r<t.length;r++)n[r-e]=t[r];return n}t.exports=n},function(t,e){"use strict";function n(t,e,n){return t.on(e,n),{destroy:function(){t.removeListener(e,n)}}}t.exports=n},function(t,e){var n=[].slice;t.exports=function(t,e){if("string"==typeof e&&(e=t[e]),"function"!=typeof e)throw new Error("bind() requires a function");var r=n.call(arguments,2);return function(){return e.apply(t,r.concat(n.call(arguments)))}}},function(t,e){function n(t){t=t||{},this.ms=t.min||100,this.max=t.max||1e4,this.factor=t.factor||2,this.jitter=t.jitter>0&&t.jitter<=1?t.jitter:0,this.attempts=0}t.exports=n,n.prototype.duration=function(){var t=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),n=Math.floor(e*this.jitter*t);t=0==(1&Math.floor(10*e))?t-n:t+n}return 0|Math.min(t,this.max)},n.prototype.reset=function(){this.attempts=0},n.prototype.setMin=function(t){this.ms=t},n.prototype.setMax=function(t){this.max=t},n.prototype.setJitter=function(t){this.jitter=t}}])});
//# sourceMappingURL=socket.io.js.map
/*global L*/
'use strict';
/*
 * Class EventDispatcher provides event handling to sub-classes.
 * It is inherited from Publisher, Room, etc.
 */
var TK = TK || {};
TK.EventDispatcher = function (spec) {
    var that = {};
    var isArray = function (object){
        return  object && typeof object==='object' &&
            typeof object.length==='number' &&
            typeof object.splice==='function' &&
            //判断length属性是否是可枚举的 对于数组 将得到false
            !(object.propertyIsEnumerable('length'));
    }
    // Private vars
    spec.dispatcher = {};
    spec.dispatcher.eventListeners = {};
    spec.dispatcher.backupListerners = {};
    // Public functions

    // It adds an event listener attached to an event type.
    that.addEventListener = function (eventType, listener , backupid ) {
        if (spec.dispatcher.eventListeners[eventType] === undefined) {
            spec.dispatcher.eventListeners[eventType] = [];
        }
        spec.dispatcher.eventListeners[eventType].push(listener);
        if(backupid){
            if (spec.dispatcher.backupListerners[backupid] === undefined) {
                spec.dispatcher.backupListerners[backupid] = [];
            }
            spec.dispatcher.backupListerners[backupid].push({eventType:eventType ,listener:listener });
        }
    };

    // It removes an available event listener.
    that.removeEventListener = function (eventType, listener) {
        var index;
		if(!spec.dispatcher.eventListeners[eventType]){ L.Logger.info('[tk-sdk]not event type: ' +eventType);  return ;} ;
        index = spec.dispatcher.eventListeners[eventType].indexOf(listener);
        if (index !== -1) {
            spec.dispatcher.eventListeners[eventType].splice(index, 1);
        }
    };
	
    // It removes all event listener.
    that.removeAllEventListener = function (eventTypeArr) {
        if( isArray(eventTypeArr) ){
            for(var i in eventTypeArr){
                var eventType = eventTypeArr[i] ;
                delete spec.dispatcher.eventListeners[eventType] ;
            }
        }else if(typeof eventTypeArr === "string"){
			delete spec.dispatcher.eventListeners[eventTypeArr] ;  
		}else if(typeof eventTypeArr === "object"){
            for(var key in eventTypeArr){
                var eventType = key  , listener = eventTypeArr[key];
                that.removeEventListener(eventType , listener);
            }
		}		  
    };

    // It dispatch a new event to the event listeners, based on the type
    // of event. All events are intended to be TalkEvents.
    that.dispatchEvent = function (event , log ) {
        var listener;
        log = log!=undefined?log:true ;
        if(log){
            L.Logger.debug('[tk-sdk]dispatchEvent , event type: ' + event.type);
        }
        for (listener in spec.dispatcher.eventListeners[event.type]) {
            if (spec.dispatcher.eventListeners[event.type].hasOwnProperty(listener)) {
                spec.dispatcher.eventListeners[event.type][listener](event);
            }
        }
    };

    that.removeBackupListerner = function (backupid) {
        if(backupid){
            if( spec.dispatcher.backupListerners[backupid] ){
                for(var i=0; i<spec.dispatcher.backupListerners[backupid].length ; i++){
                    var backupListernerInfo = spec.dispatcher.backupListerners[backupid][i] ;
                    that.removeEventListener(backupListernerInfo.eventType , backupListernerInfo.listener);
                }
                spec.dispatcher.backupListerners[backupid].length = 0 ;
                delete spec.dispatcher.backupListerners[backupid] ;
            }
        }
    };

    return that;
};

// **** EVENTS ****

/*
 * Class TalkEvent represents a generic Event in the library.
 * It handles the type of event, that is important when adding
 * event listeners to EventDispatchers and dispatching new events.
 * A TalkEvent can be initialized this way:
 * var event = TalkEvent({type: "room-connected"});
 */
TK.TalkEvent = function (spec) {
    var that = {};

    // Event type. Examples are: 'room-connected', 'stream-added', etc.
    that.type = spec.type;

    return that;
};

/*
 * Class RoomEvent represents an Event that happens in a Room. It is a
 * TalkEvent.
 * It is usually initialized as:
 * var roomEvent = RoomEvent({type:"room-connected", streams:[stream1, stream2]});
 * Event types:
 * 'room-connected' - points out that the user has been successfully connected to the room.
 * 'room-disconnected' - shows that the user has been already disconnected.
 */
TK.RoomEvent = function (spec) {
    var that = TK.TalkEvent(spec);

    // A list with the streams that are published in the room.
    that.streams = spec.streams;
    that.message = spec.message;
    that.user = spec.user;

    return that;
};

/*
 * Class StreamEvent represents an event related to a stream. It is a TalkEvent.
 * It is usually initialized this way:
 * var streamEvent = StreamEvent({type:"stream-added", stream:stream1});
 * Event types:
 * 'stream-added' - indicates that there is a new stream available in the room.
 * 'stream-removed' - shows that a previous available stream has been removed from the room.
 */
TK.StreamEvent = function (spec) {
    var that = TK.TalkEvent(spec);

    // The stream related to this event.
    that.stream = spec.stream;
    that.message = spec.message;
    that.bandwidth = spec.bandwidth;
    that.attrs = spec.attrs ;
    return that;
};

/*
 * Class PublisherEvent represents an event related to a publisher. It is a TalkEvent.
 * It usually initializes as:
 * var publisherEvent = PublisherEvent({})
 * Event types:
 * 'access-accepted' - indicates that the user has accepted to share his camera and microphone
 */
TK.PublisherEvent = function (spec) {
    var that = TK.TalkEvent(spec);

    return that;
};
/*global L, RTCSessionDescription, webkitRTCPeerConnection, RTCIceCandidate*/
'use strict';

var TK = TK || {};

TK.TkChromeStableStack = function (spec) {
    var that = {},
        WebkitRTCPeerConnection = webkitRTCPeerConnection,
        defaultSimulcastSpatialLayers = 2;

    that.pcConfig = {
        'iceServers': []
    };


    that.con = {'optional': [{'DtlsSrtpKeyAgreement': true}]};

    if (spec.iceServers !== undefined) {
        that.pcConfig.iceServers = spec.iceServers;
    }

    if (spec.audio === undefined) {
        spec.audio = true;
    }

    if (spec.video === undefined) {
        spec.video = true;
    }

    that.mediaConstraints = {
        mandatory: {
            'OfferToReceiveVideo': spec.video,
            'OfferToReceiveAudio': spec.audio
        }
    };

    var errorCallback = function (message) {
        L.Logger.error('[tk-sdk]Error in Stack ', message);
    };

    that.peerConnection = new WebkitRTCPeerConnection(that.pcConfig, that.con);

    var addSim = function (spatialLayers) {
      var line = 'a=ssrc-group:SIM';
      spatialLayers.forEach(function(spatialLayerId) {
        line += ' ' + spatialLayerId;
      });
      return line + '\r\n';
    };

    var addGroup = function(spatialLayerId, spatialLayerIdRtx) {
      return 'a=ssrc-group:FID ' + spatialLayerId + ' ' + spatialLayerIdRtx + '\r\n';
    };

    var addSpatialLayer = function (cname, msid, mslabel, label, spatialLayerId, 
        spatialLayerIdRtx) {
      return  'a=ssrc:' + spatialLayerId + ' cname:' + cname +'\r\n' +
              'a=ssrc:' + spatialLayerId + ' msid:' + msid + '\r\n' +
              'a=ssrc:' + spatialLayerId + ' mslabel:' + mslabel + '\r\n' +
              'a=ssrc:' + spatialLayerId + ' label:' + label + '\r\n' +
              'a=ssrc:' + spatialLayerIdRtx + ' cname:' + cname +'\r\n' +
              'a=ssrc:' + spatialLayerIdRtx + ' msid:' + msid + '\r\n' +
              'a=ssrc:' + spatialLayerIdRtx + ' mslabel:' + mslabel + '\r\n' +
              'a=ssrc:' + spatialLayerIdRtx + ' label:' + label + '\r\n';
    };

    var enableSimulcast = function (sdp) {
      var result, matchGroup;
      if (!spec.video) {
        return sdp;
      }
      if (!spec.simulcast) {
        return sdp;
      }

      // TODO(javier): Improve the way we check for current video ssrcs
      matchGroup = sdp.match(/a=ssrc-group:FID ([0-9]*) ([0-9]*)\r?\n/);
      if (!matchGroup || (matchGroup.length <= 0)) {
        return sdp;
      }

      var numSpatialLayers = spec.simulcast.numSpatialLayers || defaultSimulcastSpatialLayers;
      var baseSsrc = parseInt(matchGroup[1]);
      var baseSsrcRtx = parseInt(matchGroup[2]);
      var cname = sdp.match(new RegExp('a=ssrc:' + matchGroup[1] + ' cname:(.*)\r?\n'))[1];
      var msid = sdp.match(new RegExp('a=ssrc:' + matchGroup[1] + ' msid:(.*)\r?\n'))[1];
      var mslabel = sdp.match(new RegExp('a=ssrc:' + matchGroup[1] + ' mslabel:(.*)\r?\n'))[1];
      var label = sdp.match(new RegExp('a=ssrc:' + matchGroup[1] + ' label:(.*)\r?\n'))[1];

      sdp.match(new RegExp('a=ssrc:' + matchGroup[1] + '.*\r?\n', 'g')).forEach(function(line) {
        sdp = sdp.replace(line, '');
      });
      sdp.match(new RegExp('a=ssrc:' + matchGroup[2] + '.*\r?\n', 'g')).forEach(function(line) {
        sdp = sdp.replace(line, '');
      });

      var spatialLayers = [baseSsrc];
      var spatialLayersRtx = [baseSsrcRtx];

      for (var i = 1; i < numSpatialLayers; i++) {
        spatialLayers.push(baseSsrc + i * 1000);
        spatialLayersRtx.push(baseSsrcRtx + i * 1000);
      }

      result = addSim(spatialLayers);
      var spatialLayerId;
      var spatialLayerIdRtx;
      for (var spatialLayerIndex in spatialLayers) {
        spatialLayerId = spatialLayers[spatialLayerIndex];
        spatialLayerIdRtx = spatialLayersRtx[spatialLayerIndex];
        result += addGroup(spatialLayerId, spatialLayerIdRtx);
      }

      for (var spatialLayerIndex in spatialLayers) {
        spatialLayerId = spatialLayers[spatialLayerIndex];
        spatialLayerIdRtx = spatialLayersRtx[spatialLayerIndex];
        result += addSpatialLayer(cname, msid, mslabel, label, spatialLayerId, spatialLayerIdRtx);
      }
      result += 'a=x-google-flag:conference\r\n';
      return sdp.replace(matchGroup[0], result);
    };

    var setMaxBW = function (sdp) {
        var r, a;
        if (spec.video && spec.maxVideoBW) {
            sdp = sdp.replace(/b=AS:.*\r\n/g, '');
            a = sdp.match(/m=video.*\r\n/);
            if (a == null) {
                a = sdp.match(/m=video.*\n/);
            }
            if (a && (a.length > 0)) {
                r = a[0] + 'b=AS:' + spec.maxVideoBW + '\r\n';
                sdp = sdp.replace(a[0], r);
            }
        }

        if (spec.audio && spec.maxAudioBW) {
            a = sdp.match(/m=audio.*\r\n/);
            if (a == null) {
                a = sdp.match(/m=audio.*\n/);
            }
            if (a && (a.length > 0)) {
                r = a[0] + 'b=AS:' + spec.maxAudioBW + '\r\n';
                sdp = sdp.replace(a[0], r);
            }
        }
        return sdp;
    };

    var enableOpusNacks = function (sdp) {
        var sdpMatch;
        sdpMatch = sdp.match(/a=rtpmap:(.*)opus.*\r\n/);
        if (sdpMatch !== null){
           var theLine = sdpMatch[0] + 'a=rtcp-fb:' + sdpMatch[1] + 'nack' + '\r\n';
           sdp = sdp.replace(sdpMatch[0], theLine);
        }

        return sdp;
    };

    /**
     * Closes the connection.
     */
    that.close = function () {
        that.state = 'closed';
        that.peerConnection.close();
    };

    spec.localCandidates = [];

    that.peerConnection.onicecandidate = function (event) {
        var candidateObject = {};
        if (!event.candidate) {
            L.Logger.info('[tk-sdk]Gathered all candidates. Sending END candidate');
            candidateObject = {
                sdpMLineIndex: -1 ,
                sdpMid: 'end',
                candidate: 'end'
            };
        }else{

            if (!event.candidate.candidate.match(/a=/)) {
                event.candidate.candidate = 'a=' + event.candidate.candidate;
            }

            candidateObject = {
                sdpMLineIndex: event.candidate.sdpMLineIndex,
                sdpMid: event.candidate.sdpMid,
                candidate: event.candidate.candidate
            };
        }

        if (spec.remoteDescriptionSet) {
            spec.callback({type: 'candidate', candidate: candidateObject});
        } else {
            spec.localCandidates.push(candidateObject);
            L.Logger.info('[tk-sdk]Storing candidate: ', spec.localCandidates.length, candidateObject);
        }

    };

    that.peerConnection.onaddstream = function (stream) {
        if (that.onaddstream) {
            that.onaddstream(stream);
        }
    };

    that.peerConnection.onremovestream = function (stream) {
        if (that.onremovestream) {
            that.onremovestream(stream);
        }
    };

    that.peerConnection.oniceconnectionstatechange = function (ev) {
        if (that.oniceconnectionstatechange){
            that.oniceconnectionstatechange(ev.target.iceConnectionState);
        }
    };

    var localDesc;
    var remoteDesc;

    var setLocalDesc = function (isSubscribe, sessionDescription) {
        if (!isSubscribe) {
          sessionDescription.sdp = enableSimulcast(sessionDescription.sdp);
        }
        sessionDescription.sdp = setMaxBW(sessionDescription.sdp);
        sessionDescription.sdp = enableOpusNacks(sessionDescription.sdp);
        sessionDescription.sdp = sessionDescription.sdp.replace(/a=ice-options:google-ice\r\n/g,  '');
        sessionDescription.sdp = sessionDescription.sdp.replace(/a=rtcp-fb:\d+ transport-cc\r\n/g, '');//cyj

        spec.callback({
            type: sessionDescription.type,
            sdp: sessionDescription.sdp
        });
        localDesc = sessionDescription;
        //that.peerConnection.setLocalDescription(sessionDescription);
    };

    var setLocalDescp2p = function (sessionDescription) {
        sessionDescription.sdp = setMaxBW(sessionDescription.sdp);
        spec.callback({
            type: sessionDescription.type,
            sdp: sessionDescription.sdp
        });
        localDesc = sessionDescription;
        that.peerConnection.setLocalDescription(sessionDescription);
    };

    that.updateSpec = function (config, callback){
        if (config.maxVideoBW || config.maxAudioBW ){
            if (config.maxVideoBW){
                L.Logger.debug ('[tk-sdk]Maxvideo Requested:', config.maxVideoBW,
                                'limit:', spec.limitMaxVideoBW);
                if (config.maxVideoBW > spec.limitMaxVideoBW) {
                    config.maxVideoBW = spec.limitMaxVideoBW;
                }
                spec.maxVideoBW = config.maxVideoBW;
                L.Logger.debug ('[tk-sdk]Result', spec.maxVideoBW);
            }
            if (config.maxAudioBW) {
                if (config.maxAudioBW > spec.limitMaxAudioBW) {
                    config.maxAudioBW = spec.limitMaxAudioBW;
                }
                spec.maxAudioBW = config.maxAudioBW;
            }

            localDesc.sdp = setMaxBW(localDesc.sdp);
            if (config.Sdp || config.maxAudioBW){
                L.Logger.debug('[tk-sdk]Updating with SDP renegotiation', spec.maxVideoBW, spec.maxAudioBW);
                that.peerConnection.setLocalDescription(localDesc, function () {
                    remoteDesc.sdp = setMaxBW(remoteDesc.sdp);
                    that.peerConnection.setRemoteDescription(
                      new RTCSessionDescription(remoteDesc), function () {
                        spec.remoteDescriptionSet = true;
                        spec.callback({type:'updatestream', sdp: localDesc.sdp});
                      });
                }, function (error){
                    L.Logger.error('[tk-sdk]Error updating configuration', error);
                    callback('error');
                });

            } else {
                L.Logger.debug ('[tk-sdk]Updating without SDP renegotiation, ' +
                                'newVideoBW:', spec.maxVideoBW,
                                'newAudioBW:', spec.maxAudioBW);
                spec.callback({type:'updatestream', sdp: localDesc.sdp});
            }
        }
        if (config.minVideoBW || (config.slideShowMode!==undefined) ||
            (config.muteStream !== undefined) || (config.qualityLayer !== undefined)){
            L.Logger.debug ('[tk-sdk]MinVideo Changed to ', config.minVideoBW);
            L.Logger.debug ('[tk-sdk]SlideShowMode Changed to ', config.slideShowMode);
            L.Logger.debug ('[tk-sdk]muteStream changed to ', config.muteStream);
            spec.callback({type: 'updatestream', config:config});
        }
    };

    that.createOffer = function (isSubscribe) {
        if (isSubscribe === true) {
            that.peerConnection.createOffer(setLocalDesc.bind(null, isSubscribe), errorCallback,
                that.mediaConstraints);
        } else {
            that.mediaConstraints = {
                mandatory: {
                    'OfferToReceiveVideo': false,
                    'OfferToReceiveAudio': false
                }
            };
            that.peerConnection.createOffer(setLocalDesc.bind(null, isSubscribe), errorCallback, 
                that.mediaConstraints);
        }

    };

    that.addStream = function (stream) {
        if(!stream){
           L.Logger.error('[tk-sdk]chromeStableStack addStream : stream is not exist!' );
           return;
        }
        that.peerConnection.addStream(stream);
    };

     //xueqiang change
    that.removeStream = function (stream) {
        that.peerConnection.removeStream(stream);
    };

    that.getStats = function() {
        var RR = that.peerConnection.getStats();
        return RR;
    };
    
    spec.remoteCandidates = [];

    spec.remoteDescriptionSet = false;

    that.processSignalingMessage = function (msg) {
        L.Logger.info("[tk-sdk]Process Signaling Message", msg);

        if (msg.type === 'offer') {
            msg.sdp = setMaxBW(msg.sdp);
            that.peerConnection.setRemoteDescription(new RTCSessionDescription(msg), function () {
                that.peerConnection.createAnswer(setLocalDescp2p, function (error) {
                    L.Logger.error('[tk-sdk]Error: ', error);
                }, that.mediaConstraints);
                spec.remoteDescriptionSet = true;
            }, function (error) {
                L.Logger.error('[tk-sdk]Error setting Remote Description', error);
            });


        } else if (msg.type === 'answer') {
            L.Logger.info('[tk-sdk]Set remote and local description');
            L.Logger.debug('[tk-sdk]Remote Description', msg.sdp);
            L.Logger.debug('[tk-sdk]Local Description', localDesc.sdp);

            msg.sdp = setMaxBW(msg.sdp);

            remoteDesc = msg;
            that.peerConnection.setLocalDescription(localDesc, function () {
                that.peerConnection.setRemoteDescription(
                  new RTCSessionDescription(msg), function () {
                    spec.remoteDescriptionSet = true;
                    L.Logger.info('[tk-sdk]Candidates to be added: ', spec.remoteCandidates.length,
                                  spec.remoteCandidates);
                    while (spec.remoteCandidates.length > 0) {
                        // IMPORTANT: preserve ordering of candidates
                        that.peerConnection.addIceCandidate(spec.remoteCandidates.shift());
                    }
                    L.Logger.info('[tk-sdk]Local candidates to send:', spec.localCandidates.length);
                    while (spec.localCandidates.length > 0) {
                        // IMPORTANT: preserve ordering of candidates
                        spec.callback({type: 'candidate', candidate: spec.localCandidates.shift()});
                    }
                  });
            });

        } else if (msg.type === 'candidate') {
            try {
                var obj;
                if (typeof(msg.candidate) === 'object') {
                    obj = msg.candidate;
                } else {
                    obj = JSON.parse(msg.candidate);
                }
                if (obj.candidate === 'end') {
                    // ignore the end candidate for chrome
                    return;
                }
                obj.candidate = obj.candidate.replace(/a=/g, '');
                obj.sdpMLineIndex = parseInt(obj.sdpMLineIndex);
                var candidate = new RTCIceCandidate(obj);
                if (spec.remoteDescriptionSet) {
                    that.peerConnection.addIceCandidate(candidate);
                } else {
                    spec.remoteCandidates.push(candidate);
                }
            } catch (e) {
                L.Logger.error('[tk-sdk]Error parsing candidate', msg.candidate);
            }
        }
    };

    return that;
};
/*global L, RTCSessionDescription, webkitRTCPeerConnection, RTCIceCandidate*/
'use strict';

var TK = TK || {};

TK.nativeEntry = function () {
    var native_entry = document.createElement('embed');
    document.body.appendChild(native_entry);
    native_entry.setAttribute('id', 'tknative');
    native_entry.setAttribute('mainentry', true);
    native_entry.setAttribute('hidden', true);
    native_entry.setAttribute('type', 'application/x-ppapi-proxy');
    return native_entry;
};

TK.nativePeerConnection = function (spec) {
    var that = {};

    var connection_callbacks = {};
    var connection_id = spec.cnnId;

    that.onicecandidate = null;

    that.onaddstream = null;

    that.onremovestream = null;

    that.oniceconnectionstatechange = null;

    var messageCallback = function(msg)
    {
        //alert(msg.data.name);
        var funcName = msg.data.name;
        var cnnid = msg.data.connectionId;
        if (cnnid != connection_id)
        {
            return;
        }

        if (funcName === "onLocalDescription")
        {
            var strSdp = msg.data.sdp;
            var sdpObj = {};
            sdpObj.sdp = strSdp;
            sdpObj.type = "offer";
            connection_callbacks["createOffer_suc"](sdpObj);
            delete connection_callbacks["createOffer_suc"];
            delete connection_callbacks["createOffer_fai"];
        }

        if (funcName === "onIceCandidate")
        {
            if (that.onicecandidate) {
                var event = {};
                event.candidate = {};
                event.candidate.sdpMLineIndex = msg.data.sdpMLineIndex;
                event.candidate.sdpMid = msg.data.sdpMid;
                event.candidate.candidate = msg.data.candidate;
                that.onicecandidate(event);
            }
        }

        if (funcName === "onIceStatusChanged")
        {
            var state = msg.data.state;
            if (state == 2 || state == 3)
            {
            }
        }

        if (funcName === "onAddStream")
        {
            that.onaddstream({stream: {}});
        }

        if (funcName === "onRemoveStream")
        {
        }        
    };

    tknative.addEventListener("message", messageCallback, false);

    that.close = function () {
        tknative.postMessage({command: "closeConnection", streamId: connection_id.toString()});
    };

    that.createOffer = function (successCallback, failureCallback, isSubscribe) {
        if (!isSubscribe)
        {
            isSubscribe = false;
        }
        tknative.postMessage({command: "createOffer", streamId: connection_id.toString(), includeLocalMedia: !isSubscribe, hasAudio: true, hasVideo: true});
        connection_callbacks["createOffer_suc"] = successCallback;
        connection_callbacks["createOffer_fai"] = failureCallback;
    };

    that.setRemoteDescription = function (sessionDescription, successCallback, errorCallback) {
        tknative.postMessage({command: "setRemoteDescription", sdpAnswer: sessionDescription.sdp, streamId: connection_id.toString()});

        if (successCallback && typeof successCallback === "function") {
            successCallback();    
        }
        
        // connection_callbacks["setRemoteDescription_suc"] = successCallback;
        // connection_callbacks["setRemoteDescription_fai"] = failureCallback;
    };

    that.addIceCandidate = function (candidateObj) {
        var cand = candidateObj.candidate;
        // todo...
        //var sdpMid = candidateObj.sdpMid;
        var lineIndex = candidateObj.sdpMLineIndex
        tknative.postMessage({command: "setIceCandidate", candidate: cand, sdpMid: 0, sdpMLineIndex: lineIndex, streamId: connection_id.toString()});
    };

    that.addStream = function (stream) {
        tknative.postMessage({command: "addStream", streamId: connection_id.toString()});
    };

    that.removeStream = function (stream) {
        tknative.postMessage({command: "removeStream", streamId: connection_id.toString()});  
    };

    that.setLocalDescription = function (sessionDescription) {

    };

    that.getStats = function() {
        return {};
    }

    return that;
};
/*global L, RTCSessionDescription, webkitRTCPeerConnection, RTCIceCandidate*/
'use strict';

var TK = TK || {};

TK.TkNativeStack = function (spec) {
    var that = {},
        WebkitRTCPeerConnection = TK.nativePeerConnection,
        defaultSimulcastSpatialLayers = 2;

    that.pcConfig = {
        'iceServers': []
    };

    that.con = {'optional': [{'DtlsSrtpKeyAgreement': true}]};

    if (spec.iceServers !== undefined) {
        that.pcConfig.iceServers = spec.iceServers;
    }

    if (spec.audio === undefined) {
        spec.audio = true;
    }

    if (spec.video === undefined) {
        spec.video = true;
    }

    that.mediaConstraints = {
        mandatory: {
            'OfferToReceiveVideo': spec.video,
            'OfferToReceiveAudio': spec.audio
        }
    };

    var errorCallback = function (message) {
        L.Logger.error('Error in Stack ', message);
    };

    that.peerConnection = new WebkitRTCPeerConnection(spec);

    var addSim = function (spatialLayers) {
      var line = 'a=ssrc-group:SIM';
      spatialLayers.forEach(function(spatialLayerId) {
        line += ' ' + spatialLayerId;
      });
      return line + '\r\n';
    };

    var addGroup = function(spatialLayerId, spatialLayerIdRtx) {
      return 'a=ssrc-group:FID ' + spatialLayerId + ' ' + spatialLayerIdRtx + '\r\n';
    };

    var addSpatialLayer = function (cname, msid, mslabel, label, spatialLayerId, 
        spatialLayerIdRtx) {
      return  'a=ssrc:' + spatialLayerId + ' cname:' + cname +'\r\n' +
              'a=ssrc:' + spatialLayerId + ' msid:' + msid + '\r\n' +
              'a=ssrc:' + spatialLayerId + ' mslabel:' + mslabel + '\r\n' +
              'a=ssrc:' + spatialLayerId + ' label:' + label + '\r\n' +
              'a=ssrc:' + spatialLayerIdRtx + ' cname:' + cname +'\r\n' +
              'a=ssrc:' + spatialLayerIdRtx + ' msid:' + msid + '\r\n' +
              'a=ssrc:' + spatialLayerIdRtx + ' mslabel:' + mslabel + '\r\n' +
              'a=ssrc:' + spatialLayerIdRtx + ' label:' + label + '\r\n';
    };

    var enableSimulcast = function (sdp) {
      var result, matchGroup;
      if (!spec.video) {
        return sdp;
      }
      if (!spec.simulcast) {
        return sdp;
      }

      // TODO(javier): Improve the way we check for current video ssrcs
      matchGroup = sdp.match(/a=ssrc-group:FID ([0-9]*) ([0-9]*)\r?\n/);
      if (!matchGroup || (matchGroup.length <= 0)) {
        return sdp;
      }

      var numSpatialLayers = spec.simulcast.numSpatialLayers || defaultSimulcastSpatialLayers;
      var baseSsrc = parseInt(matchGroup[1]);
      var baseSsrcRtx = parseInt(matchGroup[2]);
      var cname = sdp.match(new RegExp('a=ssrc:' + matchGroup[1] + ' cname:(.*)\r?\n'))[1];
      var msid = sdp.match(new RegExp('a=ssrc:' + matchGroup[1] + ' msid:(.*)\r?\n'))[1];
      var mslabel = sdp.match(new RegExp('a=ssrc:' + matchGroup[1] + ' mslabel:(.*)\r?\n'))[1];
      var label = sdp.match(new RegExp('a=ssrc:' + matchGroup[1] + ' label:(.*)\r?\n'))[1];

      sdp.match(new RegExp('a=ssrc:' + matchGroup[1] + '.*\r?\n', 'g')).forEach(function(line) {
        sdp = sdp.replace(line, '');
      });
      sdp.match(new RegExp('a=ssrc:' + matchGroup[2] + '.*\r?\n', 'g')).forEach(function(line) {
        sdp = sdp.replace(line, '');
      });

      var spatialLayers = [baseSsrc];
      var spatialLayersRtx = [baseSsrcRtx];

      for (var i = 1; i < numSpatialLayers; i++) {
        spatialLayers.push(baseSsrc + i * 1000);
        spatialLayersRtx.push(baseSsrcRtx + i * 1000);
      }

      result = addSim(spatialLayers);
      var spatialLayerId;
      var spatialLayerIdRtx;
      for (var spatialLayerIndex in spatialLayers) {
        spatialLayerId = spatialLayers[spatialLayerIndex];
        spatialLayerIdRtx = spatialLayersRtx[spatialLayerIndex];
        result += addGroup(spatialLayerId, spatialLayerIdRtx);
      }

      for (var spatialLayerIndex in spatialLayers) {
        spatialLayerId = spatialLayers[spatialLayerIndex];
        spatialLayerIdRtx = spatialLayersRtx[spatialLayerIndex];
        result += addSpatialLayer(cname, msid, mslabel, label, spatialLayerId, spatialLayerIdRtx);
      }
      result += 'a=x-google-flag:conference\r\n';
      return sdp.replace(matchGroup[0], result);
    };

    var setMaxBW = function (sdp) {
        var r, a;
        if (spec.video && spec.maxVideoBW) {
            sdp = sdp.replace(/b=AS:.*\r\n/g, '');
            a = sdp.match(/m=video.*\r\n/);
            if (a == null) {
                a = sdp.match(/m=video.*\n/);
            }
            if (a && (a.length > 0)) {
                r = a[0] + 'b=AS:' + spec.maxVideoBW + '\r\n';
                sdp = sdp.replace(a[0], r);
            }
        }

        if (spec.audio && spec.maxAudioBW) {
            a = sdp.match(/m=audio.*\r\n/);
            if (a == null) {
                a = sdp.match(/m=audio.*\n/);
            }
            if (a && (a.length > 0)) {
                r = a[0] + 'b=AS:' + spec.maxAudioBW + '\r\n';
                sdp = sdp.replace(a[0], r);
            }
        }
        return sdp;
    };

    var enableOpusNacks = function (sdp) {
        var sdpMatch;
        sdpMatch = sdp.match(/a=rtpmap:(.*)opus.*\r\n/);
        if (sdpMatch !== null){
           var theLine = sdpMatch[0] + 'a=rtcp-fb:' + sdpMatch[1] + 'nack' + '\r\n';
           sdp = sdp.replace(sdpMatch[0], theLine);
        }

        return sdp;
    };

    /**
     * Closes the connection.
     */
    that.close = function () {
        that.state = 'closed';
        that.peerConnection.close();
    };

    spec.localCandidates = [];

    that.peerConnection.onicecandidate = function (event) {
        var candidateObject = {};
        if (!event.candidate) {
            L.Logger.info('Gathered all candidates. Sending END candidate');
            candidateObject = {
                sdpMLineIndex: -1 ,
                sdpMid: 'end',
                candidate: 'end'
            };
        }else{

            if (!event.candidate.candidate.match(/a=/)) {
                event.candidate.candidate = 'a=' + event.candidate.candidate;
            }

            candidateObject = {
                sdpMLineIndex: event.candidate.sdpMLineIndex,
                sdpMid: event.candidate.sdpMid,
                candidate: event.candidate.candidate
            };
        }

        if (spec.remoteDescriptionSet) {
            spec.callback({type: 'candidate', candidate: candidateObject});
        } else {
            spec.localCandidates.push(candidateObject);
            L.Logger.info('Storing candidate: ', spec.localCandidates.length, candidateObject);
        }

    };

    that.peerConnection.onaddstream = function (stream) {
        if (that.onaddstream) {
            that.onaddstream(stream);
        }
    };

    that.peerConnection.onremovestream = function (stream) {
        if (that.onremovestream) {
            that.onremovestream(stream);
        }
    };

    that.peerConnection.oniceconnectionstatechange = function (ev) {
        if (that.oniceconnectionstatechange){
            that.oniceconnectionstatechange(ev.target.iceConnectionState);
        }
    };

    var localDesc;
    var remoteDesc;

    var setLocalDesc = function (isSubscribe, sessionDescription) {
        if (!isSubscribe) {
          sessionDescription.sdp = enableSimulcast(sessionDescription.sdp);
        }
        sessionDescription.sdp = setMaxBW(sessionDescription.sdp);
        sessionDescription.sdp = enableOpusNacks(sessionDescription.sdp);
        sessionDescription.sdp = sessionDescription.sdp.replace(/a=ice-options:google-ice\r\n/g,
                                                                '');
        spec.callback({
            type: sessionDescription.type,
            sdp: sessionDescription.sdp
        });
        localDesc = sessionDescription;
        //that.peerConnection.setLocalDescription(sessionDescription);
    };

    var setLocalDescp2p = function (sessionDescription) {
        sessionDescription.sdp = setMaxBW(sessionDescription.sdp);
        spec.callback({
            type: sessionDescription.type,
            sdp: sessionDescription.sdp
        });
        localDesc = sessionDescription;
        that.peerConnection.setLocalDescription(sessionDescription);
    };

    that.updateSpec = function (config, callback){
        if (config.maxVideoBW || config.maxAudioBW ){
            if (config.maxVideoBW){
                L.Logger.debug ('Maxvideo Requested:', config.maxVideoBW,
                                'limit:', spec.limitMaxVideoBW);
                if (config.maxVideoBW > spec.limitMaxVideoBW) {
                    config.maxVideoBW = spec.limitMaxVideoBW;
                }
                spec.maxVideoBW = config.maxVideoBW;
                L.Logger.debug ('Result', spec.maxVideoBW);
            }
            if (config.maxAudioBW) {
                if (config.maxAudioBW > spec.limitMaxAudioBW) {
                    config.maxAudioBW = spec.limitMaxAudioBW;
                }
                spec.maxAudioBW = config.maxAudioBW;
            }

            localDesc.sdp = setMaxBW(localDesc.sdp);
            if (config.Sdp || config.maxAudioBW){
                L.Logger.debug('Updating with SDP renegotiation', spec.maxVideoBW, spec.maxAudioBW);
                remoteDesc.sdp = setMaxBW(remoteDesc.sdp);
                that.peerConnection.setRemoteDescription(remoteDesc, function () {
                    spec.remoteDescriptionSet = true;
                    spec.callback({type:'updatestream', sdp: localDesc.sdp});
                });

            } else {
                L.Logger.debug ('Updating without SDP renegotiation, ' +
                                'newVideoBW:', spec.maxVideoBW,
                                'newAudioBW:', spec.maxAudioBW);
                spec.callback({type:'updatestream', sdp: localDesc.sdp});
            }
        }
        if (config.minVideoBW || (config.slideShowMode!==undefined) ||
            (config.muteStream !== undefined) || (config.qualityLayer !== undefined)){
            L.Logger.debug ('MinVideo Changed to ', config.minVideoBW);
            L.Logger.debug ('SlideShowMode Changed to ', config.slideShowMode);
            L.Logger.debug ('muteStream changed to ', config.muteStream);
            spec.callback({type: 'updatestream', config:config});
        }
    };

    that.createOffer = function (isSubscribe) {
        that.peerConnection.createOffer(setLocalDesc.bind(null, isSubscribe), errorCallback, isSubscribe);
    };

    that.addStream = function (stream) {
        if(!stream){
           L.Logger.error('nativeStack addStream : stream is not exist!' );
           return;
        }
        that.peerConnection.addStream(stream);
    };

    that.removeStream = function (stream) {
        that.peerConnection.removeStream(stream);
    };

    that.getStats = function() {
        var RR = that.peerConnection.getStats();
        return RR;
    };
    
    spec.remoteCandidates = [];

    spec.remoteDescriptionSet = false;

    that.processSignalingMessage = function (msg) {
        L.Logger.info("Process Signaling Message", msg);

        // todo...
        // 这里应该不需要offer了吧？
        if (msg.type === 'offer') {
            msg.sdp = setMaxBW(msg.sdp);
            that.peerConnection.setRemoteDescription(msg.sdp, setLocalDescp2p, function (error) {
                    L.Logger.error('Error: ', error);
                });
        } else if (msg.type === 'answer') {
            L.Logger.info('Set remote and local description');
            L.Logger.debug('Remote Description', msg.sdp);
            L.Logger.debug('Local Description', localDesc.sdp);

            msg.sdp = setMaxBW(msg.sdp);

            that.peerConnection.setRemoteDescription(
              new RTCSessionDescription(msg), function () {
                spec.remoteDescriptionSet = true;
                L.Logger.info('Candidates to be added: ', spec.remoteCandidates.length,
                              spec.remoteCandidates);
                while (spec.remoteCandidates.length > 0) {
                    // IMPORTANT: preserve ordering of candidates
                    that.peerConnection.addIceCandidate(spec.remoteCandidates.shift());
                }
                L.Logger.info('Local candidates to send:', spec.localCandidates.length);
                while (spec.localCandidates.length > 0) {
                    // IMPORTANT: preserve ordering of candidates
                    spec.callback({type: 'candidate', candidate: spec.localCandidates.shift()});
                }
            });

        } else if (msg.type === 'candidate') {
            try {
                var obj;
                if (typeof(msg.candidate) === 'object') {
                    obj = msg.candidate;
                } else {
                    obj = JSON.parse(msg.candidate);
                }
                if (obj.candidate === 'end') {
                    // ignore the end candidate for chrome
                    return;
                }
                obj.candidate = obj.candidate.replace(/a=/g, '');
                obj.sdpMLineIndex = parseInt(obj.sdpMLineIndex);
                var candidate = new RTCIceCandidate(obj);
                if (spec.remoteDescriptionSet) {
                    that.peerConnection.addIceCandidate(candidate);
                } else {
                    spec.remoteCandidates.push(candidate);
                }
            } catch (e) {
                L.Logger.error('Error parsing candidate', msg.candidate);
            }
        }
    };

    return that;
};
/*global L, window, chrome, navigator*/
'use strict';
var TK = TK || {};

TK.sessionId = 103;

TK.Connection = function (spec) {
    var that = {};

    spec.sessionId = (TK.sessionId += 1);

    // Check which WebRTC Stack is installed.
    that.browser = TK.getBrowser();

    if (that.browser === 'fake') {
        L.Logger.warning('[tk-sdk]Publish/subscribe video/audio streams not supported in erizofc yet');
        that = TK.FcStack(spec);
    } else if (that.browser === 'mozilla') {
        L.Logger.debug('[tk-sdk]Firefox Stack');
        that = TK.FirefoxStack(spec);
    } else if (that.browser === 'bowser'){
        L.Logger.debug('[tk-sdk]Bowser Stack');
        that = TK.BowserStack(spec);
    } else if (that.browser === 'chrome-stable' || that.browser === 'electron') {
        L.Logger.debug('[tk-sdk]Chrome Stable Stack');
        that = TK.TkChromeStableStack(spec);
    } else {
        L.Logger.error('[tk-sdk]No stack available for this browser');
        throw 'WebRTC stack not available';
    }

    if (TK.end_type !== null && TK.end_type !== undefined && TK.end_type === 1) {
        L.Logger.debug('Talk-Client Stack');
        that = TK.TkNativeStack(spec);
    }

    if (!that.updateSpec){
        that.updateSpec = function(newSpec, callback){
            L.Logger.error('[tk-sdk]Update Configuration not implemented in this browser');
            if (callback)
                callback ('unimplemented');
        };
    }

    return that;
};

TK.getBrowser = function () {
    var browser = 'none';

    if (typeof module!=='undefined' && module.exports){
        browser = 'fake';
    }else if (window.navigator.userAgent.match('Firefox') !== null) {
        // Firefox
        browser = 'mozilla';
    } else if (window.navigator.userAgent.match('Bowser') !== null){
        browser = 'bowser';
    } else if (window.navigator.userAgent.match('Chrome') !== null) {
        browser = 'chrome-stable';
        if (window.navigator.userAgent.match('Electron') !== null) {
            browser = 'electron';
        }
    } else if (window.navigator.userAgent.match('Safari') !== null) {
        browser = 'bowser';
    } else if (window.navigator.userAgent.match('AppleWebKit') !== null) {
        browser = 'bowser';
    }
    return browser;
};


  /*global L, document*/
'use strict';
/*
 * Class Stream represents a local or a remote Stream in the Room. It will handle the WebRTC stream
 * and identify the stream and where it should be drawn.
 */
var TK = TK || {};
TK.Stream = function (spec) {
    var that = TK.EventDispatcher(spec),
        getFrame, controlHandler;

    that.stream = spec.stream;
    that.url = spec.url;
    that.recording = spec.recording;
    that.room = undefined;
    that.playing = false;
    that.local = false;
    that.video = spec.video;
    that.audio = spec.audio;
    that.screen = spec.screen;
    that.videoSize = spec.videoSize;
    that.videoFrameRate = spec.videoFrameRate;
    that.extensionId = spec.extensionId;
    that.desktopStreamId = spec.desktopStreamId;
    that.videoMuted = false;
    that.audioMuted = false;
    that.attributes = spec.attributes ;

    if (that.videoSize !== undefined &&
        (!(that.videoSize instanceof Array) ||
        that.videoSize.length !== 4)) {
        throw Error('Invalid Video Size');
    }
    if (spec.local === undefined || spec.local === true) {
        that.local = true;
    }

    // Public functions

    that.getID = function () {
        var id;
        // Unpublished local streams don't yet have an ID.
        if (that.local && !spec.streamID) {
            id = 'local';
        }
        else {
            id = spec.streamID;
        }
        return id;
    };

    // Get attributes of this stream.
    that.getAttributes = function () {
        return spec.attributes;
    };

    // Changes the attributes of this stream in the room.
    that.setAttributes = function () {
        L.Logger.error('[tk-sdk]Failed to set attributes data. This Stream object has not been published.');
    };

    that.updateLocalAttributes = function (attrs) {
        if(attrs && typeof attrs === 'object'){
            for(var key in attrs){
                spec.attributes[key] = attrs[key] ;
            }
        }
    };

    // Indicates if the stream has audio activated
    that.hasAudio = function () {
        return spec.audio;
    };

    // Indicates if the stream has video activated
    that.hasVideo = function () {
        return spec.video;
    };

    // Indicates if the stream has data activated
    that.hasData = function () {
        return spec.data;
    };

    // Indicates if the stream has screen activated
    that.hasScreen = function () {
        return spec.screen;
    };

    // Sends data through this stream.
    that.sendData = function () {
        L.Logger.error('[tk-sdk]Failed to send data. This Stream object has not that channel enabled.');
    };

    // Initializes the stream and tries to retrieve a stream from local video and audio
    // We need to call this method before we can publish it in the room.
    that.init = function () {
        var streamEvent;
        try {
            if ((spec.audio || spec.video || spec.screen) && spec.url === undefined) {
                L.Logger.info('[tk-sdk]Requested access to local media');
                var videoOpt = spec.video;
                if (videoOpt === true || spec.screen === true) {
                    videoOpt = videoOpt === true ? {} : videoOpt;
                    if (that.videoSize !== undefined) {
                        videoOpt.mandatory = videoOpt.mandatory || {};
                        videoOpt.mandatory.minWidth = that.videoSize[0];
                        videoOpt.mandatory.minHeight = that.videoSize[1];
                        videoOpt.mandatory.maxWidth = that.videoSize[2];
                        videoOpt.mandatory.maxHeight = that.videoSize[3];
                    }

                    if (that.videoFrameRate !== undefined) {
                        videoOpt.optional = videoOpt.optional || [];
                        videoOpt.optional.push({minFrameRate: that.videoFrameRate[0]});
                        videoOpt.optional.push({maxFrameRate: that.videoFrameRate[1]});
                    }

                } else if (spec.screen === true && videoOpt === undefined) {
                    videoOpt = true;
                }
                var opt = {
                    video: videoOpt,
                    audio: spec.audio,
                    fake: spec.fake,
                    screen: spec.screen,
                    extensionId: that.extensionId,
                    desktopStreamId: that.desktopStreamId
                };
                var _handlerGotStream = function (stream) {
                    L.Logger.info('[tk-sdk]User has granted access to local media.');
                    that.stream = stream;

                    streamEvent = TK.StreamEvent({type: 'access-accepted'});
                    that.dispatchEvent(streamEvent);

                    that.stream.getTracks().forEach(function (track) {
                        track.onended = function () {
                            that.stream.getTracks().forEach(function (track) {
                                track.onended = null;
                            });
                            streamEvent = TK.StreamEvent({
                                type: 'stream-ended', stream: that,
                                msg: track.kind
                            });
                            that.dispatchEvent(streamEvent);
                        };
                    });

                };
                var _handlerfailStream = function (error) {
                    L.Logger.error('[tk-sdk]Failed to get access to local media. Error name was ' +
                        error.name + '.', error);
                    var streamEvent = TK.StreamEvent({type: 'access-denied', msg: error});
                    that.dispatchEvent(streamEvent);
                };

                TK.AVMgr.getUserMedia(_handlerGotStream, _handlerfailStream, opt);

            } else {
                streamEvent = TK.StreamEvent({type: 'access-accepted'});
                that.dispatchEvent(streamEvent);
            }
        } catch (e) {
            L.Logger.error('[tk-sdk]Failed to get access to local media. Error was ' + e + '.');
            streamEvent = TK.StreamEvent({type: 'access-denied', msg: e});
            that.dispatchEvent(streamEvent);
        }
    };

    that.close = function () {
        if (that.local) {
            if (that.room !== undefined) {
                that.room.unpublish(that);
            }
            // Remove HTML element
            that.hide();
            if (that.stream !== undefined) {
                that.stream.getTracks().forEach(function (track) {
                    track.onended = null;
                    track.stop();
                });
            }
            that.stream = undefined;
        }
    };

    that.play = function (elementID, options) {
        options = options || {};
        that.elementID = elementID;
        var player;
        /* if (that.hasVideo() || this.hasScreen()) {*/
        // Draw on HTML
        if (elementID !== undefined) {
            player = new TK.VideoPlayer({
                id: that.getID(),
                stream: that,
                elementID: elementID,
                options: options
            });
            that.player = player;
            that.playing = true;
        }
        /*        } else if (that.hasAudio) {
         player = new TK.AudioPlayer({id: that.getID(),
         stream: that,
         elementID: elementID,
         options: options});
         that.player = player;
         that.playing = true;
         }*/
    };

    that.stop = function () {
        if (that.playing) {
            if (that.player !== undefined) {
                that.player.destroy();
                that.playing = false;
            }
        }
    };

    that.show = function () {
        if (that.player !== undefined ) {
            that.player.showVideo();
        }
    };

    that.hide = function () {
        if (that.player !== undefined ) {
            that.player.hideVideo();
        }
    };

    getFrame = function () {
        if (that.player !== undefined && that.stream !== undefined) {
            var video = that.player.video,

                style = document.defaultView.getComputedStyle(video),
                width = parseInt(style.getPropertyValue('width'), 10),
                height = parseInt(style.getPropertyValue('height'), 10),
                left = parseInt(style.getPropertyValue('left'), 10),
                top = parseInt(style.getPropertyValue('top'), 10);

            var div;
            if (typeof that.elementID === 'object' &&
                typeof that.elementID.appendChild === 'function') {
                div = that.elementID;
            }
            else {
                div = document.getElementById(that.elementID);
            }

            var divStyle = document.defaultView.getComputedStyle(div),
                divWidth = parseInt(divStyle.getPropertyValue('width'), 10),
                divHeight = parseInt(divStyle.getPropertyValue('height'), 10),

                canvas = document.createElement('canvas'),
                context;

            canvas.id = 'testing';
            canvas.width = divWidth;
            canvas.height = divHeight;
            canvas.setAttribute('style', 'display: none');
            //document.body.appendChild(canvas);
            context = canvas.getContext('2d');

            context.drawImage(video, left, top, width, height);

            return canvas;
        } else {
            return null;
        }
    };

    that.getVideoFrameURL = function (format) {
        var canvas = getFrame();
        if (canvas !== null) {
            if (format) {
                return canvas.toDataURL(format);
            } else {
                return canvas.toDataURL();
            }
        } else {
            return null;
        }
    };

    that.getVideoFrame = function () {
        var canvas = getFrame();
        if (canvas !== null) {
            return canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
        } else {
            return null;
        }
    };

    that.checkOptions = function (config, isUpdate) {
        //TODO: Check for any incompatible options
        if (isUpdate === true) {  // We are updating the stream
            if (config.video || config.audio || config.screen) {
                L.Logger.warning('[tk-sdk]Cannot update type of subscription');
                config.video = undefined;
                config.audio = undefined;
                config.screen = undefined;
            }
        } else {  // on publish or subscribe
            if (that.local === false) { // check what we can subscribe to
                if (config.video === true && that.hasVideo() === false) {
                    L.Logger.warning('[tk-sdk]Trying to subscribe to video when there is no ' +
                        'video, won\'t subscribe to video');
                    config.video = false;
                }
                if (config.audio === true && that.hasAudio() === false) {
                    L.Logger.warning('[tk-sdk]Trying to subscribe to audio when there is no ' +
                        'audio, won\'t subscribe to audio');
                    config.audio = false;
                }
            }
        }
        if (that.local === false) {
            if (!that.hasVideo() && (config.slideShowMode === true)) {
                L.Logger.warning('[tk-sdk]Cannot enable slideShowMode if it is not a video ' +
                    'subscription, please check your parameters');
                config.slideShowMode = false;
            }
        }
    };

    that.updateMuteToServer = function (callback) {
        if (that.room && that.room.p2p) {
            L.Logger.warning('[tk-sdk]muteAudio is not implemented in p2p streams');
            callback('error');
            return;
        }

        if (that.pc === undefined) {
            return;
        }

        var config = {muteStream: {video:that.videoMuted, audio:that.audioMuted}};
        that.checkOptions(config, true);
        that.pc.updateSpec(config, callback);
    };
    that._setQualityLayer = function (spatialLayer, temporalLayer, callback) {
        if (that.room && that.room.p2p) {
            L.Logger.warning('[tk-sdk]setQualityLayer is not implemented in p2p streams');
            callback('error');
            return;
        }
        var config = {qualityLayer: {spatialLayer: spatialLayer, temporalLayer: temporalLayer}};
        that.checkOptions(config, true);
        that.pc.updateSpec(config, callback);
    };

    controlHandler = function (handlers, publisherSide, enable) {

        if (publisherSide !== true) publisherSide = false;

        handlers = (typeof handlers === 'string') ? [handlers] : handlers;
        handlers = (handlers instanceof Array) ? handlers : [];

        if (handlers.length > 0) {
            that.room.sendControlMessage(that, 'control', {
                name: 'controlhandlers',
                enable: enable,
                publisherSide: publisherSide,
                handlers: handlers
            });
        }
    };

    that.disableHandlers = function (handlers, publisherSide) {
        controlHandler(handlers, publisherSide, false);
    };

    that.enableHandlers = function (handlers, publisherSide) {
        controlHandler(handlers, publisherSide, true);
    };

    that.updateConfiguration = function (config, callback) {
        if (config === undefined)
            return;
        if (that.pc) {
            that.checkOptions(config, true);
            if (that.local) {
                if (that.room.p2p) {
                    for (var index in that.pc) {
                        that.pc[index].updateSpec(config, callback);
                    }
                } else {
                    that.pc.updateSpec(config, callback);
                }

            } else {
                that.pc.updateSpec(config, callback);
            }
        } else {
            callback('This stream has no peerConnection attached, ignoring');
        }
    };

    that.muteVideo = function (mute, callback) {
        if (that.videoMuted == mute)
            return;
		that.videoMuted = mute ;
        if (that.stream !== undefined) {
            that.stream.getTracks().forEach(function (track) {
                if (track.kind === 'video') {
                    track.enabled = !mute;
                }
            });

            that.updateMuteToServer(callback);
        } else {
            L.Logger.warning("[tk-sdk]not deviceStream to muteVideo");
        };
    };

    that.muteAudio = function (mute, callback) {

        if (that.audioMuted == mute)
            return;

        that.audioMuted = mute;
        if (that.stream !== undefined) {
            that.stream.getTracks().forEach(function (track) {
                if (track.kind === 'audio') {
                    track.enabled = !mute;
                }
            });

            that.updateMuteToServer(callback);
        } else {
            L.Logger.warning("[tk-sdk]not deviceStream to muteVideo");
        }

    };

    return that;
};
/*global L, document*/
'use strict';
/*
 * Class Stream represents a local or a remote Stream in the Room. It will handle the WebRTC stream
 * and identify the stream and where it should be drawn.
 */
var TK = TK || {};

TK.NativeStream = function (spec) {
    var that = TK.EventDispatcher(spec),
        getFrame, controlHandler;

    that.stream = spec.stream;
    that.url = spec.url;
    that.recording = spec.recording;
    that.room = undefined;
    that.playing = false;
    that.local = false;
    that.video = spec.video;
    that.audio = spec.audio;
    that.screen = spec.screen;
    that.videoSize = spec.videoSize;
    that.videoFrameRate = spec.videoFrameRate;
    that.extensionId = spec.extensionId;
    that.desktopStreamId = spec.desktopStreamId;
    that.videoMuted = false;
    that.audioMuted = false;

    if (that.videoSize !== undefined &&
        (!(that.videoSize instanceof Array) ||
        that.videoSize.length !== 4)) {
        throw Error('Invalid Video Size');
    }
    if (spec.local === undefined || spec.local === true) {
        that.local = true;
    }

    // Public functions

    that.getID = function () {
        var id;
        // Unpublished local streams don't yet have an ID.
        if (that.local && !spec.streamID) {
            id = 'local';
        }
        else {
            id = spec.streamID;
        }
        return id;
    };

    // Get attributes of this stream.
    that.getAttributes = function () {
        return spec.attributes;
    };

    // Changes the attributes of this stream in the room.
    that.setAttributes = function () {
        L.Logger.error('Failed to set attributes data. This Stream object has not been published.');
    };

    that.updateLocalAttributes = function (attrs) {
        if(attrs && typeof attrs === 'object'){
            for(var key in attrs){
                spec.attributes[key] = attrs[key] ;
            }
        }
    };

    // Indicates if the stream has audio activated
    that.hasAudio = function () {
        return spec.audio;
    };

    // Indicates if the stream has video activated
    that.hasVideo = function () {
        return spec.video;
    };

    // Indicates if the stream has data activated
    that.hasData = function () {
        return spec.data;
    };

    // Indicates if the stream has screen activated
    that.hasScreen = function () {
        return spec.screen;
    };

    // Sends data through this stream.
    that.sendData = function () {
        L.Logger.error('Failed to send data. This Stream object has not that channel enabled.');
    };

    // Initializes the stream and tries to retrieve a stream from local video and audio
    // We need to call this method before we can publish it in the room.
    that.init = function () {
        var streamEvent;
        try {
            if ((spec.audio || spec.video || spec.screen) && spec.url === undefined) {
                L.Logger.info('Requested access to local media');
                var videoOpt = spec.video;
                if (videoOpt === true || spec.screen === true) {
                    videoOpt = videoOpt === true ? {} : videoOpt;
                    if (that.videoSize !== undefined) {
                        videoOpt.mandatory = videoOpt.mandatory || {};
                        videoOpt.mandatory.minWidth = that.videoSize[0];
                        videoOpt.mandatory.minHeight = that.videoSize[1];
                        videoOpt.mandatory.maxWidth = that.videoSize[2];
                        videoOpt.mandatory.maxHeight = that.videoSize[3];
                    }

                    if (that.videoFrameRate !== undefined) {
                        videoOpt.optional = videoOpt.optional || [];
                        videoOpt.optional.push({minFrameRate: that.videoFrameRate[0]});
                        videoOpt.optional.push({maxFrameRate: that.videoFrameRate[1]});
                    }

                } else if (spec.screen === true && videoOpt === undefined) {
                    videoOpt = true;
                }
                var opt = {
                    video: videoOpt,
                    audio: spec.audio,
                    fake: spec.fake,
                    screen: spec.screen,
                    extensionId: that.extensionId,
                    desktopStreamId: that.desktopStreamId
                };
                // todo...
                // 在nativeAVMgr中构造流
                // 在nativePeerConnection中构造流
                var _handlerGotStream = function (stream) {
                    L.Logger.info('User has granted access to local media.');
                    that.stream = stream;

                    streamEvent = TK.StreamEvent({type: 'access-accepted'});
                    that.dispatchEvent(streamEvent);

                    // that.stream.getTracks().forEach(function (track) {
                    //     track.onended = function () {
                    //         that.stream.getTracks().forEach(function (track) {
                    //             track.onended = null;
                    //         });
                    //         streamEvent = TK.StreamEvent({
                    //             type: 'stream-ended', stream: that,
                    //             msg: track.kind
                    //         });
                    //         that.dispatchEvent(streamEvent);
                    //     };
                    // });

                };
                var _handlerfailStream = function (error) {
                    L.Logger.error('Failed to get access to local media. Error name was ' +
                        error.name + '.', error);
                    var streamEvent = TK.StreamEvent({type: 'access-denied', msg: error});
                    that.dispatchEvent(streamEvent);
                };

                TK.AVMgr.getUserMedia(_handlerGotStream, _handlerfailStream, opt);

            } else {
                streamEvent = TK.StreamEvent({type: 'access-accepted'});
                that.dispatchEvent(streamEvent);
            }
        } catch (e) {
            L.Logger.error('Failed to get access to local media. Error was ' + e + '.');
            streamEvent = TK.StreamEvent({type: 'access-denied', msg: e});
            that.dispatchEvent(streamEvent);
        }
    };

    that.close = function () {
        if (that.local) {
            if (that.room !== undefined) {
                that.room.unpublish(that);
            }
            // Remove HTML element
            that.hide();
            // if (that.stream !== undefined) {
            //     that.stream.getTracks().forEach(function (track) {
            //         track.onended = null;
            //         track.stop();
            //     });
            // }
            that.stream = undefined;
        }
    };

    that.play = function (elementID, options) {
        options = options || {};
        that.elementID = elementID;
        var player;
        /* if (that.hasVideo() || this.hasScreen()) {*/
        // Draw on HTML
        if (elementID !== undefined) {
            player = new TK.NativeVideoPlayer({
                id: that.getID(),
                stream: that,
                elementID: elementID,
                options: options
            });
            that.player = player;
            that.playing = true;
            if (that.local) {
                tknative.postMessage({command: "playStream", connectionId: that.getID().toString(), isLocal: true});
            }
            else {
                tknative.postMessage({command: "playStream", connectionId: that.getID().toString(), isLocal: false});   
            }
        }
        /*        } else if (that.hasAudio) {
         player = new TK.AudioPlayer({id: that.getID(),
         stream: that,
         elementID: elementID,
         options: options});
         that.player = player;
         that.playing = true;
         }*/
    };

    that.stop = function () {
        if (that.playing) {
            if (that.player !== undefined) {
                that.player.destroy();
                that.playing = false;
            }

            if (that.local) {
                tknative.postMessage({command: "stopStream", connectionId: that.getID().toString(), isLocal: true});
            }
            else {
                tknative.postMessage({command: "stopStream", connectionId: that.getID().toString(), isLocal: false});   
            }
        }
    };

    that.show = function () {
        if (that.player !== undefined ) {
            that.player.showVideo();
        }
    };

    that.hide = function () {
        if (that.player !== undefined ) {
            that.player.hideVideo();
        }
    };

    getFrame = function () {
        if (that.player !== undefined && that.stream !== undefined) {
            var video = that.player.video,

                style = document.defaultView.getComputedStyle(video),
                width = parseInt(style.getPropertyValue('width'), 10),
                height = parseInt(style.getPropertyValue('height'), 10),
                left = parseInt(style.getPropertyValue('left'), 10),
                top = parseInt(style.getPropertyValue('top'), 10);

            var div;
            if (typeof that.elementID === 'object' &&
                typeof that.elementID.appendChild === 'function') {
                div = that.elementID;
            }
            else {
                div = document.getElementById(that.elementID);
            }

            var divStyle = document.defaultView.getComputedStyle(div),
                divWidth = parseInt(divStyle.getPropertyValue('width'), 10),
                divHeight = parseInt(divStyle.getPropertyValue('height'), 10),

                canvas = document.createElement('canvas'),
                context;

            canvas.id = 'testing';
            canvas.width = divWidth;
            canvas.height = divHeight;
            canvas.setAttribute('style', 'display: none');
            //document.body.appendChild(canvas);
            context = canvas.getContext('2d');

            context.drawImage(video, left, top, width, height);

            return canvas;
        } else {
            return null;
        }
    };

    that.getVideoFrameURL = function (format) {
        var canvas = getFrame();
        if (canvas !== null) {
            if (format) {
                return canvas.toDataURL(format);
            } else {
                return canvas.toDataURL();
            }
        } else {
            return null;
        }
    };

    that.getVideoFrame = function () {
        var canvas = getFrame();
        if (canvas !== null) {
            return canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
        } else {
            return null;
        }
    };

    that.checkOptions = function (config, isUpdate) {
        //TODO: Check for any incompatible options
        if (isUpdate === true) {  // We are updating the stream
            if (config.video || config.audio || config.screen) {
                L.Logger.warning('Cannot update type of subscription');
                config.video = undefined;
                config.audio = undefined;
                config.screen = undefined;
            }
        } else {  // on publish or subscribe
            if (that.local === false) { // check what we can subscribe to
                if (config.video === true && that.hasVideo() === false) {
                    L.Logger.warning('Trying to subscribe to video when there is no ' +
                        'video, won\'t subscribe to video');
                    config.video = false;
                }
                if (config.audio === true && that.hasAudio() === false) {
                    L.Logger.warning('Trying to subscribe to audio when there is no ' +
                        'audio, won\'t subscribe to audio');
                    config.audio = false;
                }
            }
        }
        if (that.local === false) {
            if (!that.hasVideo() && (config.slideShowMode === true)) {
                L.Logger.warning('Cannot enable slideShowMode if it is not a video ' +
                    'subscription, please check your parameters');
                config.slideShowMode = false;
            }
        }
    };

    that.updateMuteToServer = function (callback) {
        if (that.room && that.room.p2p) {
            L.Logger.warning('muteAudio is not implemented in p2p streams');
            callback('error');
            return;
        }

        if (that.pc === undefined) {
            return;
        }

        var config = {muteStream: {video:that.videoMuted, audio:that.audioMuted}};
        that.checkOptions(config, true);
        that.pc.updateSpec(config, callback);
    };
    that._setQualityLayer = function (spatialLayer, temporalLayer, callback) {
        if (that.room && that.room.p2p) {
            L.Logger.warning('setQualityLayer is not implemented in p2p streams');
            callback('error');
            return;
        }
        var config = {qualityLayer: {spatialLayer: spatialLayer, temporalLayer: temporalLayer}};
        that.checkOptions(config, true);
        that.pc.updateSpec(config, callback);
    };

    controlHandler = function (handlers, publisherSide, enable) {

        if (publisherSide !== true) publisherSide = false;

        handlers = (typeof handlers === 'string') ? [handlers] : handlers;
        handlers = (handlers instanceof Array) ? handlers : [];

        if (handlers.length > 0) {
            that.room.sendControlMessage(that, 'control', {
                name: 'controlhandlers',
                enable: enable,
                publisherSide: publisherSide,
                handlers: handlers
            });
        }
    };

    that.disableHandlers = function (handlers, publisherSide) {
        controlHandler(handlers, publisherSide, false);
    };

    that.enableHandlers = function (handlers, publisherSide) {
        controlHandler(handlers, publisherSide, true);
    };

    that.updateConfiguration = function (config, callback) {
        if (config === undefined)
            return;
        if (that.pc) {
            that.checkOptions(config, true);
            if (that.local) {
                if (that.room.p2p) {
                    for (var index in that.pc) {
                        that.pc[index].updateSpec(config, callback);
                    }
                } else {
                    that.pc.updateSpec(config, callback);
                }

            } else {
                that.pc.updateSpec(config, callback);
            }
        } else {
            callback('This stream has no peerConnection attached, ignoring');
        }
    };

    that.muteVideo = function (mute, callback) {
        if (that.videoMuted == mute)
            return;
		that.videoMuted = mute ;
        // todo...
        // C++增加muteVideo接口
        tknative.postMessage({command: "enableVideo", enable: !mute});
        if (that.stream !== undefined) {
        //     that.stream.getTracks().forEach(function (track) {
        //         if (track.kind === 'video') {
        //             track.enabled = !mute;
        //         }
        //     });

            that.updateMuteToServer(callback);
        } else {
            L.Logger.warning("not deviceStream to muteVideo");
        };
    };

    that.muteAudio = function (mute, callback) {

        if (that.audioMuted == mute)
            return;

        that.audioMuted = mute;
        // todo...
        // C++增加muteAudio接口
        tknative.postMessage({command: "enableAudio", enable: !mute});
        if (that.stream !== undefined) {
        //     that.stream.getTracks().forEach(function (track) {
        //         if (track.kind === 'audio') {
        //             track.enabled = !mute;
        //         }
        //     });

            that.updateMuteToServer(callback);
        } else {
            L.Logger.warning("not deviceStream to muteVideo");
        }

    };

    return that;
};
/*global L, io*/
/*
 * Class Room represents a Talk Room. It will handle the connection, local stream publication and
 * remote stream subscription.
 * Typical Room initialization would be:
 * var room = TK.Room({token:'213h8012hwduahd-321ueiwqewq'});
 * It also handles RoomEvents and StreamEvents. For example:
 * Event 'room-connected' points out that the user has been successfully connected to the room.
 * Event 'room-disconnected' shows that the user has been already disconnected.
 * Event 'stream-added' indicates that there is a new stream available in the room.
 * Event 'stream-removed' shows that a previous available stream has been removed from the room.
 */


//var io = require('rpc.socket.io');
var TK = TK || {};
var tknative ;
TK.Initialize = function ( istTkNative  , end_type) {
    if(istTkNative){
        if (end_type !== 1) return;
        tknative = tknative || TK.nativeEntry();
        TK.end_type = end_type;
        TK.AVMgr = null ;
        TK.AVMgr = TK.NativeAVMgr();
        TK.Stream = null;
        TK.Stream = TK.NativeStream;
        TK.VideoPlayer = null;
        TK.VideoPlayer = TK.NativeVideoPlayer;
    }
};

TK.Room = function () {
    'use strict';

    var VERSION = "2017-07-10 v1";
    var spec={};
    var that = TK.EventDispatcher(spec),
        connectSocket,
        sendMessageSocket,
        sendSDPSocket,
        sendDataSocket,
        updateAttributes,
        removeStream,
        DISCONNECTED = 0,
        CONNECTING = 1,
        CONNECTED = 2;

    var _room_host,
        _room_port,
        _room_uri,
        _room_id,
        _room_type=0,
        _room_name,
        _room_properties,
        _room_video_width = 320,
        _room_video_height = 240,
        _room_video_fps = 15,
        _room_video_maxbps = 256,
        _room_max_videocount = 6,
        _configuration,
        _testIP,
        _testPort,
        _default_stream,
        _myself = {} ,
        _avmgr ,
        _isIpFalsification = false ,
        _ipFalsification = window.location.hostname ,
        _isPlayback = false ,
        _isGetFileList = true ,
        _recordfilepath = undefined ,
        _rtcStatsrObserverIntervalTime = 3000 ,
        _isGetRtcStatsrObserver = false ;

    var HTTP = "https://";
    var WEBFUNC_CHECKroom = "/ClientAPI/checkroom";
    var WEBFUNC_GETCONFIG = "/ClientAPI/getconfig";
    var WEBFUNC_GETFILELIST = "/ClientAPI/getroomfile";
    var WEBFUNC_UPLOADDOCUMENT = "/ClientAPI/uploaddocument";
    var WEBFUNC_DELROOMFILE = "/ClientAPI/delroomfile";

    var _room_filelist;

    var _room_msglistok = false;
    var _room_earlymsgs = {};

    that.remoteStreams = {};
    that.localStreams = {};
    that.roomID = '';
    that.socket = {};
  
    that.p2p = false;
    that.state = DISCONNECTED;
    var _users={};
    var _rolelist = {} ;

    var ERR_OK = 0;
    var ERR_INTERNAL_EXCEPTION = -1;
    var ERR_NOT_INITIALIZED = 1;
    var ERR_INVALID_STATUS = 2;
    var ERR_HTTP_REQUEST_FAILED = 3;
    var ERR_BAD_PARAMETERS = 4;
    var ERR_NO_THIS_USER = 5;
    var ERR_USER_NOT_PUBLISHING = 6;
    var ERR_USER_NOT_PLAYING = 7;

    var STATUS_IDLE = 0;
    var STATUS_CHECKING = 1;
    var STATUS_GETTINGCFG = 2;
    var STATUS_CONNECTING = 3;
    var STATUS_CONNECTED = 4;
    var STATUS_JOINING = 5;
    var STATUS_ALLREADY = 6;
    var STATUS_DISCONNECTING = 7;
    var STATUS_DISCONNECTED = 8;

    var VIDEO_DEFINES = [ [176, 144],[320, 240],[640, 480], [1280, 720], [1920, 1080] ];

    var _status=STATUS_IDLE;

    var xmlhttp;
    var jsonRpcClient;

    // Private functions
    function count(obj){
        var objType = typeof obj;
        if(objType == "string"){
            return obj.length;
        }else if(objType == "object"){
            var objLen = 0;
            for(var i in obj){
                objLen++;
            }
            return objLen;
        }
        return false;
    }

    // It removes the stream from HTML and close the PeerConnection associated
    removeStream = function (stream) {
        if (stream.stream !== undefined) {

            // Remove HTML element
            stream.hide();

            // Close PC stream
            if (stream.pc) {
              stream.pc.close();
              delete stream.pc;
            }
            if (stream.local) {
                stream.stream.stop();
            }
            delete stream.stream;
        }
    };

    sendDataSocket = function (stream, msg) {
        if (stream.local) {
            sendMessageSocket('sendDataStream', {id: stream.getID(), msg: msg});
        } else {
            L.Logger.error('[tk-sdk]You can not send data through a remote stream');
        }
    };

    updateAttributes = function(stream, attrs) {
        if (stream.local) {
            stream.updateLocalAttributes(attrs);
            sendMessageSocket('updateStreamAttributes', {id: stream.getID(), attrs: attrs});
        } else {
            L.Logger.error('[tk-sdk]You can not update attributes in a remote stream');
        }
    };


    /*socket.callRPC('getRemoteTime',{user:'admin', password:'toor'},{
      success: function(result){
        alert('The remote time is ' + result);
      },
      error: function(err){
        
      }
    });*/


    // It connects to the server through socket.io
    connectSocket = function (uri, callback, error) {

        var createRemotePc = function (stream, peerSocket) {
            //stream.pc相当于PEERCONNECTION
            stream.pc = TK.Connection({callback: function (msg) {
                   msg = ipAndStationaryStrWitch_send(msg);
                  sendSDPSocket('signaling_message', {streamId: stream.getID(),
                                                      peerSocket: peerSocket,
                                                      msg: msg});
              },
              iceServers: that.iceServers,
              maxAudioBW: spec.maxAudioBW,
              maxVideoBW: spec.maxVideoBW,
              limitMaxAudioBW:spec.maxAudioBW,
              limitMaxVideoBW:spec.maxVideoBW,
              cnnId: stream.getID()});

            stream.pc.onaddstream = function (evt) {
                // Draw on html
                L.Logger.info('[tk-sdk]Stream subscribed');
                stream.stream = evt.stream;
                if( _isGetRtcStatsrObserver ){
                    that.rtcStatsrObserver(stream);
                }
                var evt2 = TK.StreamEvent({type: 'stream-subscribed', stream: stream});
                that.dispatchEvent(evt2);
            };
        };

        // Once we have connected
        that.state = CONNECTING;
        that.socket = io.connect(_room_uri, {secure: true, reconnection:true , transports: ['websocket']});

        that.socket.on('connect', function () {
            L.Logger.debug('[tk-sdk]tk connectd');
            that.state = CONNECTED;
            setStatus(STATUS_CONNECTED);
            if(!that.firstConnect){
                // We receive an event with a new stream in the room.
                // type can be "media" or "data"
                that.socket.on('onAddStream', function (arg) {
                    var stream = TK.Stream({streamID: arg.id,
                            local: false,
                            audio: arg.audio,
                            video: arg.video,
                            data: arg.data,
                            screen: arg.screen,
                            attributes: arg.attributes,
                            extensionId: arg.extensionId}),
                        evt;
                    stream.room = that;
                    that.remoteStreams[arg.id] = stream;

                    if (arg.extensionId !== _myself.id || (arg.attributes !== undefined && arg.attributes.duration !== undefined)) {
                        that.subscribe(stream);
                    }
                    if( _isGetRtcStatsrObserver && arg.extensionId === _myself.id ){
                        that.rtcStatsrObserver(stream);
                    }
                    evt = TK.StreamEvent({type: 'stream-added', stream: stream});
                    that.dispatchEvent(evt);
                });

                that.socket.on('signaling_message_mediaserver', function (arg) {
                    var stream;
                    L.Logger.debug('[tk-sdk]signaling_message_mediaserver',arg);
                    arg.mess = ipAndStationaryStrWitchSDP_recv(arg.mess);
                    if (arg.peerId) {
                        stream = that.remoteStreams[arg.peerId];
                    } else {
                        stream = that.localStreams[arg.streamId];
                    }

                    if (stream && !stream.failed) {
                        stream.pc.processSignalingMessage(arg.mess);
                    }
                });

                that.socket.on('signaling_message_peer', function (arg) {

                    var stream = that.localStreams[arg.streamId];
                    if (stream && !stream.failed) {
                        stream.pc[arg.peerSocket].processSignalingMessage(arg.msg);
                    } else {
                        stream = that.remoteStreams[arg.streamId];
                        if (!stream.pc) {
                            createRemotePc(stream, arg.peerSocket);
                        }
                        stream.pc.processSignalingMessage(arg.msg);
                    }
                });

                that.socket.on('publish_me', function (arg) {
                    var myStream = that.localStreams[arg.streamId];

                    if (myStream.pc === undefined) {
                        myStream.pc = {};
                    }

                    myStream.pc[arg.peerSocket] = TK.Connection({callback: function (msg) {
                        msg = ipAndStationaryStrWitch_send(msg);
                        sendSDPSocket('signaling_message', {streamId: arg.streamId,
                            peerSocket: arg.peerSocket, msg: msg});
                    }, audio: myStream.hasAudio(), video: myStream.hasVideo(),
                        iceServers: that.iceServers, cnnId: arg.streamId});


                    myStream.pc[arg.peerSocket].oniceconnectionstatechange = function (state) {
                        if (state === 'failed') {
                            myStream.pc[arg.peerSocket].close();
                            delete myStream.pc[arg.peerSocket];
                        }
                        else if (state === 'disconnected') {
                            // TODO handle behaviour. Myabe implement Ice-Restart mechanism
                        }
                    };

                    myStream.pc[arg.peerSocket].addStream(myStream.stream);
                    myStream.pc[arg.peerSocket].createOffer();
                });

                that.socket.on('onBandwidthAlert', function (arg){
                    L.Logger.info('[tk-sdk]Bandwidth Alert on', arg.streamID, 'message',
                        arg.message,'BW:', arg.bandwidth);
                    if(arg.streamID){
                        var stream = that.remoteStreams[arg.streamID];
                        if (stream && !stream.failed) {
                            var evt = TK.StreamEvent({type:'bandwidth-alert',
                                stream:stream,
                                message:arg.message,
                                bandwidth: arg.bandwidth});
                            that.dispatchEvent(evt);
                        }

                    }
                });

                // We receive an event of new data in one of the streams
                that.socket.on('onDataStream', function (arg) {
                    var stream = that.remoteStreams[arg.id],
                        evt = TK.StreamEvent({type: 'stream-data', message: arg.msg, stream: stream});
                    that.dispatchEvent(evt);
                });

                // We receive an event of new data in one of the streams
                that.socket.on('onUpdateAttributeStream', function (arg) {
                    var stream = that.remoteStreams[arg.id],
                        evt = TK.StreamEvent({type: 'stream-attributes-update',
                            attrs: arg.attrs,
                            stream: stream});
                    if(stream!==undefined) {
                        stream.updateLocalAttributes(arg.attrs);
                        that.dispatchEvent(evt);
                    } else {
                        L.Logger.warning('[tk-sdk]onUpdateAttributeStream stream invalid',arg);
                    }
                });

                // We receive an event of a stream removed from the room
                that.socket.on('onRemoveStream', function (arg) {
                    var stream = that.localStreams[arg.id];
                    if (stream && !stream.failed){
                        stream.failed = true;
                        if(stream.extensionId === _myself.id){
                            that.changeUserProperty(stream.extensionId, "__all", {publishstate:TK.PUBLISH_STATE_NONE});
                        }
                        L.Logger.warning('[tk-sdk]We received a removeStream from our own stream --' +
                            ' probably timed out'  , arg);
                        var disconnectEvt = TK.StreamEvent({type: 'stream-failed',
                            message:{reason:'Publishing local stream failed because of an TK Error' , source:'onRemoveStream'} ,
                            stream: stream});
                        that.dispatchEvent(disconnectEvt);
                        //that.unpublish(stream);
                        return;
                    }
                    stream = that.remoteStreams[arg.id];

                    if (stream && stream.failed){
                        L.Logger.debug('[tk-sdk]Received onRemoveStream for a stream ' +
                            'that we already marked as failed ', arg.id);
                        return;
                    }else if (!stream){
                        L.Logger.debug('[tk-sdk]Received a removeStream for', arg.id,
                            'and it has not been registered here, ignoring.');
                        return;
                    }
                    delete that.remoteStreams[arg.id];
                    removeStream(stream);
                    var evt = TK.StreamEvent({type: 'stream-removed', stream: stream});
                    that.dispatchEvent(evt);
                });

                // The socket has disconnected
                that.socket.on('disconnect', function (e) {
                    L.Logger.info('[tk-sdk]Socket disconnected, lost connection to TKController' , e);
                    if (that.state !== DISCONNECTED) {
                        setStatus(STATUS_DISCONNECTED);
                        that.state = DISCONNECTED;
                        if(_isGetRtcStatsrObserver){
                            that.stopIntervalRtcStatsrObserver();
                        }
                        if(_default_stream.rtcStatsrObserverTimer){
                            that.stopIntervalRtcStatsrObserverByStream(_default_stream);
                        }
                         var disconnectEvt = TK.RoomEvent({type: 'room-disconnected',
                            message: 'unexpected-disconnection'});
                         that.dispatchEvent(disconnectEvt);
                     };
                });

                that.socket.on('connection_failed', function(arg){
                    L.Logger.info('[tk-sdk]Socket connection_failed');
                    var stream,
                        disconnectEvt;
                    if (arg.type === 'publish'){
                        L.Logger.error('[tk-sdk]ICE Connection Failed on publishing stream',
                            arg.streamId, that.state);
                        if (that.state !== DISCONNECTED ) {
                            if(arg.streamId){
                                stream = that.localStreams[arg.streamId];
                                if (stream && !stream.failed) {
                                    stream.failed = true;
                                    if(stream.extensionId === _myself.id){
                                        that.changeUserProperty(stream.extensionId, "__all", {publishstate:TK.PUBLISH_STATE_NONE});
                                    }
                                    disconnectEvt = TK.StreamEvent({type: 'stream-failed',
                                        message:{reason:'Publishing local stream failed ICE Checks' , source:'connection_failed'} ,
                                        stream: stream});
                                    that.dispatchEvent(disconnectEvt);
                                    //that.unpublish(stream);
                                }
                            }
                        }
                    } else {
                        L.Logger.error('[tk-sdk]ICE Connection Failed on subscribe stream', arg.streamId);
                        if (that.state !== DISCONNECTED) {
                            if(arg.streamId){
                                stream = that.remoteStreams[arg.streamId];
                                if (stream && !stream.failed) {
                                    stream.failed = true;
                                    disconnectEvt = TK.StreamEvent({type: 'stream-failed',
                                        message:{reason:'Subscriber failed ICE, cannot reach Talk for media' , source:'connection_failed'} ,
                                        stream: stream});
                                    that.dispatchEvent(disconnectEvt);
                                    that.unsubscribe(stream);
                                }
                            }
                        }
                    }
                });

                that.socket.on('error', function(e){
                    L.Logger.error ('[tk-sdk]Cannot connect to Controller');
                    if (error) error('Cannot connect to TKController (socket.io error)',e);
                });

                /*that.socket.on('connect_error' , function (e) {
                    L.Logger.debug('[tk-sdk]connect_error info:' , e) ;
                });*/

               /* that.socket.on('reconnect' , function (e) {
                    L.Logger.debug('[tk-sdk]reconnect info:' , e) ;
                });*/

               /* that.socket.on('reconnect_attempt' , function (e) {
                    L.Logger.debug('[tk-sdk]reconnect_attempt info:' , e) ;
                });*/

                that.socket.on('reconnecting' , function (reconnectingNum) {
                    L.Logger.info('[tk-sdk]reconnecting info:' , reconnectingNum) ;
                    var disconnectEvt = TK.RoomEvent({type: 'room-reconnecting',
                        message: {number:reconnectingNum , info:'room-reconnecting number:'+ reconnectingNum }});
                    that.dispatchEvent(disconnectEvt);
                });

              /*  that.socket.on('reconnect_error' , function (e) {
                    L.Logger.debug('[tk-sdk]reconnect_error info:' , e) ;
                });*/

               /* that.socket.on('reconnect_failed' , function (e) {
                    L.Logger.debug('[tk-sdk]reconnect_failed info:' , e) ;
                });*/

               /* that.socket.on('ping' , function (e) {
                    L.Logger.debug('[tk-sdk]ping info:' , e) ;
                });*/

                /*that.socket.on('pong' , function (e) {
                    L.Logger.debug('[tk-sdk]pong info:' , e) ;
                });*/

                that.socket.on('participantLeft',function(userid){
                    var user = _users[userid];
                   /* if( _isPlayback){
                        // user.leaveTs = userinfo.ts ;
                    }*/
                    var roomEvt = TK.RoomEvent({type: 'room-participant_leave', user: user});
                    that.dispatchEvent(roomEvt);
                    if(!_rolelist[user.role]) { _rolelist[user.role] = {} };
                    delete _rolelist[user.role][userid] ;
                    delete _users[userid];
                });

                that.socket.on('participantJoined',function(userinfo){
                    L.Logger.info('[tk-sdk]participantJoined', userinfo);

                    var user = TK.RoomUser(userinfo);
                    if (user === undefined) {
                        return;
                    }
                    if(!_rolelist[user.role]) { _rolelist[user.role] = {} };
                    _rolelist[user.role][user.id] = user ;
                    _users[user.id]=user;
                    if( _isPlayback){
                        user.joinTs = userinfo.ts ;
                    }
                    var roomEvt = TK.RoomEvent({type: 'room-participant_join', user: user});
                    that.dispatchEvent(roomEvt);
                });
                that.socket.on('participantEvicted',function(){
                    that.leaveroom(true);
                    var roomEvt = TK.RoomEvent({type: 'room-participant_evicted'});
                    that.dispatchEvent(roomEvt);
                });
                that.socket.on('sendMessage',function(messages){
                    L.Logger.info('[tk-sdk]room-text-message info:' + (messages && typeof messages === 'object' ? JSON.stringify(messages) : messages )) ;
                    if (!( messages && messages.hasOwnProperty('message') ) ){  L.Logger.error('messages or messages.message is not exist!'); return;};
                    var from = messages.fromID;
                    var user = _myself;
                    if (from !== undefined)
                        user = _users[messages.fromID];
                    if(!user){L.Logger.error('[tk-sdk]user is not exist , user id:'+messages.fromID+', message from room-text-message!');return ;};
                    if( _isPlayback){
                        var isString = false ;
                        if(messages && messages.message && typeof  messages.message  === 'string' ){
                            messages.message = JSON.parse(messages.message);
                            isString = true ;
                        }
                        messages.message.ts = messages.ts ; //ms
                        if(isString && typeof messages.message === 'object'){
                            messages.message = JSON.stringify( messages.message );
                        }
                    }
                    var roomEvt = TK.RoomEvent({type: 'room-text-message', user:user, message:messages.message});
                    that.dispatchEvent(roomEvt);
                });

                that.socket.on("msgList",function(messages) {
                    L.Logger.info('[tk-sdk]msgList info:' ,messages);
                    var roomEvt = TK.RoomEvent({type: 'room-msglist', message:messages});
                    that.dispatchEvent(roomEvt);
                });
                that.socket.on("pubMsg",function(messages) {
                    L.Logger.info( '[tk-sdk]pubMsg info:' , messages);
                    var roomEvt = TK.RoomEvent({type: 'room-pubmsg', message:messages});
                    that.dispatchEvent(roomEvt);
                });
                that.socket.on("delMsg",function(messages) {
                    L.Logger.info( '[tk-sdk]delMsg info:' , messages);
                    var roomEvt = TK.RoomEvent({type: 'room-delmsg', message:messages});
                    that.dispatchEvent(roomEvt);
                });
                that.socket.on("setProperty",function(messages) {
                    L.Logger.info('[tk-sdk]setProperty info:' ,messages);

                    var param = messages;
                    var id = param.id;

                    if(param.hasOwnProperty("properties"))
                    {
                        var properties =  param.properties;
                        var user = _users[id];
                        if (_myself.id==id) {
                            user = _myself;
                            if ( properties.hasOwnProperty("publishstate") ){
                                that.onChangeMyPublishState(properties.publishstate);
                            }else if( properties.hasOwnProperty("disablevideo") ){
                                that.onChangeMyDisableVideoState(properties.disablevideo);
                            } else if( properties.hasOwnProperty("disableaudio") ){
                                that.onChangeMyDisableAudioState(properties.disableaudio);
                            }
                        }

                        if (user === undefined)
                            return;

                        for (var key in properties) {
                            if (key != 'id' && key != 'watchStatus'){
                                user[key]=properties[key];
                            }
                        }

                        var roomEvt = TK.RoomEvent({type: 'room-userproperty-changed', user:user, message:properties});
                        that.dispatchEvent(roomEvt);
                    }
                });
                //qiugs:回放清除所有信令
                that.socket.on("playback_clearAll" , function () {
                    if(!_isPlayback){L.Logger.warning('[tk-sdk]No playback environment!');return ;} ;
                    var roomEvt = TK.RoomEvent({type: 'room-playback-clear_all'});
                    that.dispatchEvent(roomEvt);
                });
                //qiugs:回放获取开始和结束时间
                that.socket.on("duration" , function (message) {
                    if(!_isPlayback){L.Logger.warning('[tk-sdk]No playback environment!');return ;} ;
                    var roomEvt = TK.RoomEvent({type: 'room-playback-duration' , message:message });
                    that.dispatchEvent(roomEvt);
                });
                //qiugs:服务器播放完毕，收到结束的信令
                that.socket.on("playbackEnd" , function () {
                    if(!_isPlayback){L.Logger.warning('[tk-sdk]No playback environment!');return ;} ;
                    var roomEvt = TK.RoomEvent({type: 'room-playback-playbackEnd'});
                    that.dispatchEvent(roomEvt);
                });
                //qiugs:服务器回放的播放时间更新
                that.socket.on("playback_updatetime" , function (message) {
                    if(!_isPlayback){L.Logger.warning('[tk-sdk]No playback environment!');return ;} ;
                    var roomEvt = TK.RoomEvent({type: 'room-playback-playback_updatetime' , message:message });
                    that.dispatchEvent(roomEvt);
                });
                that.firstConnect = true ;
            }else{
                var roomEvt = TK.RoomEvent({type: 'room-reconnected'});
                that.dispatchEvent(roomEvt);
            }
            step4Join(callback,error);
        });
    };

    // Function to send a message to the server using socket.io
    sendMessageSocket = function (type, msg, callback, error) {
        L.Logger.debug('[tk-sdk]sendMessageSocket', type, msg);
        that.socket.emit(type, msg, function (respType, respmsg) {
            if (respType === 'success') {

                L.Logger.debug('[tk-sdk]sendMessageSocket success', msg, respmsg);

                if (callback) callback(respmsg);
            } else if (respType === 'error'){
                if (error) error(respmsg);
            } else {
                if (callback) callback(respType, respmsg);
            }

        });
    };

    // It sends a SDP message to the server using socket.io
    sendSDPSocket = function (type, options, sdp, callback) {
        if (that.state !== DISCONNECTED){
            that.socket.emit(type, options, sdp, function (response, respCallback) {
                if (callback) callback(response, respCallback);
            });
        }else{
            L.Logger.warning('[tk-sdk]Trying to send a message over a disconnected Socket');
        }
    };

    that.setIsGetFileList = function (isGetFileListValue) {
        _isGetFileList = isGetFileListValue ;
    };

    that.getRoomType=function() {
        return _room_type;
    }

    that.getRoomName=function() {
        return _room_name;
    }

    that.getRoomProperties=function() {
        return _room_properties;
    }

    that.getMySelf=function() {
        return _myself;
    }

    that.getUser=function(id) {
        if(id === undefined)
            return undefined;

        return _users[id];
    }

    that.getUsers=function() {
        return _users;
    };
    that.getSpecifyRoleList=function(specifyKey) {
        if(specifyKey === undefined)
            return undefined;
        var specifyRole = _rolelist[specifyKey] || {} ;
        return specifyRole ;
    }
    that.getAllRoleList=function() {
        return _rolelist;
    }
    that.getConfigInfo = function () {
        return _configuration ;
    };
    /*获取上台人数的数量*/
    that.getPublishStreamNumber = function(){
        var publishNumber = 0 ;
        for(var key in _users ){
            if(_users[key].publishstate !== TK.PUBLISH_STATE_NONE){
                publishNumber++ ;
            }
        }
        return  publishNumber ;
    };
    /*上台的人数是否达到人数限制*/
    that.isBeyondMaxVideo = function () {
        var publishNum = 0 ;
        var isBeyondMaxVideo = false ;
        for(var key in _users ){
            if(_users[key].publishstate !== TK.PUBLISH_STATE_NONE){
                if(  (++publishNum) >= _room_max_videocount){
                    isBeyondMaxVideo = true ;
                    return isBeyondMaxVideo ;
                }
            }
        }
        return isBeyondMaxVideo ;
    };

    function checkMyAudioAndVideoEnable(publishstate  , videoInfo , audioInfo ) {
        publishstate = publishstate || _myself.publishstate ;
         videoInfo = videoInfo || {
            hasvideo:_myself.hasvideo ,
            disablevideo:_myself.disablevideo
        };
         audioInfo = audioInfo || {
            hasaudio:_myself.hasaudio ,
            disableaudio:_myself.disableaudio
        };
        enableLocalVideo( videoInfo.hasvideo && !videoInfo.disablevideo && ( publishstate === TK.PUBLISH_STATE_VIDEOONLY || publishstate === TK.PUBLISH_STATE_BOTH ) );
        enableLocalAudio( audioInfo.hasaudio && !audioInfo.disableaudio && ( publishstate=== TK.PUBLISH_STATE_AUDIOONLY  || publishstate === TK.PUBLISH_STATE_BOTH ) );
    }

    that.changeUserProperty=function(id, tellWhom, properties) {
        if (_status != STATUS_ALLREADY)
            return ERR_INVALID_STATUS;

        if (properties === undefined)
            return ERR_BAD_PARAMETERS;

        var params = {};
        params.id = id;
        params.toID = tellWhom;
        var user = _users[id] ;
        if(!user){L.Logger.error('[tk-sdk]user is not exist , user id: '+id+'!'); return ;} ;
        if( !(properties && typeof properties === 'object') ){L.Logger.error('[tk-sdk]properties must be json , user id: '+id+'!'); return ;} ;
        params.properties = properties;
        sendMessageSocket('setProperty',params);
        return ERR_OK;
    };
    function  enableLocalAudio(enable) {
        _default_stream.muteAudio(!enable, function (message) {
            if (_default_stream.getID() !== undefined || _default_stream.getID() !== 'local') {
                L.Logger.debug('[tk-sdk]Sending message', message);
                message = ipAndStationaryStrWitch_send(message);
                sendSDPSocket('signaling_message', {streamId: _default_stream.getID(), msg: message});    
            }
        });
    }
    function  enableLocalVideo(enable) {
        _default_stream.muteVideo(!enable, function (message) {
            if (_default_stream.getID() !== undefined || _default_stream.getID() !== 'local') {
                L.Logger.debug('[tk-sdk]Sending message', message);
                message = ipAndStationaryStrWitch_send(message);
                sendSDPSocket('signaling_message', {streamId: _default_stream.getID(), msg: message});    
            }
        });
    }
    that.onChangeMyPublishState=function(newState) {

        L.Logger.info("[tk-sdk]onChangeMyPublishState " + _myself.publishstate + " to " + newState);

        if (_myself.publishstate == newState)
            return;

        if (newState > TK.PUBLISH_STATE_NONE) {
            checkMyAudioAndVideoEnable(newState);
            if(_myself.publishstate === TK.PUBLISH_STATE_NONE){
                that.publish(_default_stream);
            }
        }
        else {
            //unpublishVideo();
            that.unpublish(_default_stream);
        }

        _myself.publishstate = newState;
    };

    that.onChangeMyDisableVideoState = function (disablevideo) { //改变我的视频设备禁用状态
        L.Logger.info("[tk-sdk]onChangeMyDisableVideoState " + _myself.disablevideo + " to " + disablevideo);
        if (_myself.disablevideo == disablevideo)
            return;
        _myself.disablevideo = disablevideo;
        if (_myself.publishstate > TK.PUBLISH_STATE_NONE) {
            checkMyAudioAndVideoEnable();
        }
    };
    that.onChangeMyDisableAudioState = function (disableaudio) { //改变我的视频设备禁用状态
        L.Logger.info("[tk-sdk]onChangeMyDisableAudioState " + _myself.disableaudio + " to " + disableaudio);
        if (_myself.disableaudio == disableaudio)
            return;
        _myself.disableaudio = disableaudio;
        if (_myself.publishstate > TK.PUBLISH_STATE_NONE) {
            checkMyAudioAndVideoEnable();
        }
    };

    that.changeUserPublish=function(id,publish) {
        //xueqiang todo..
        if (_status != STATUS_ALLREADY)
            return ERR_INVALID_STATUS;

        if (id ===undefined)
            return ERR_BAD_PARAMETERS;

        if (id===_myself.id) {
            that.onChangeMyPublishState(publish);
        }
        //xueqiang todo..
        that.changeUserProperty(id, "__all", {publishstate:publish});
        return ERR_OK;
    };

    that.changeMyDisableVideoState = function(disablevideo){ //改变自己音频设备的禁用状态
        if(typeof disablevideo !== "boolean" ){
            L.Logger.warning("[tk-sdk]changeMyDisableVideoState:disablevideo must boolean !") ;
            return ;
        }
        that.onChangeMyDisableVideoState(disablevideo);
        that.changeUserProperty(_myself.id, "__all", {disablevideo:disablevideo});
    };

    that.changeMyDisableAudioState = function(disableaudio){ //改变自己视频设备的禁用状态
        if(typeof disableaudio !== "boolean" ){
            L.Logger.warning("[tk-sdk]changeMyDisableVideoState:disablevideo must boolean !") ;
            return ;
        }
        that.onChangeMyDisableAudioState(disableaudio);
        that.changeUserProperty(_myself.id, "__all", {disableaudio:disableaudio});
    };

    that.sendMessage=function(message, toId) {
        if (_status != STATUS_ALLREADY)
            return ERR_INVALID_STATUS;

        var params={};
        params.toID=toId;
        params.message=message;
        
        //server hasn't implement,xueqiang todo..
        sendMessageSocket('sendMessage',params);  
       
        return  ERR_OK;
    }

    that.pubMsg=function(msgName, msgId, toId, data, save, expiresabs) {
        if (_status != STATUS_ALLREADY)
            return ERR_INVALID_STATUS;

        var params = {};
        params.name=msgName;
        params.id=msgId;
        params.toID=toId;
        params.data=data;
        if(!save)
            params.do_not_save="";
        if(expiresabs !== undefined)
            params.expiresabs = expiresabs;
        sendMessageSocket('pubMsg',params);   
        return  ERR_OK;
    }

    that.delMsg=function(msgName, msgId, toId, data) {

        if (_status != STATUS_ALLREADY)
            return ERR_INVALID_STATUS;

        var params = {};
        params.name=msgName;
        params.id=msgId;
        params.toID=toId;
        params.data=data;
      
        sendMessageSocket('delMsg',params);   
        return  ERR_OK;
    }

    that.evictUser=function(id) {

        L.Logger.debug('[tk-sdk]evictUser', id);
        if (_status != STATUS_ALLREADY)
            return ERR_INVALID_STATUS;

        var params = {};
        params.id=id;
        sendMessageSocket('evictParticipant',params);   
        return ERR_OK;
    }
    var onRemoteMessage=function(add, inList,message) {      
        L.Logger.info('[tk-sdk]msg: ' + message);
        var id = message.id!==undefined ? message.id : "";
        var name = message.name!==undefined ? message.name : "";
        var data = message.data;
        /*long ts = (message.get("ts") instanceof Long) ? (Long)message.get("ts") : 0;*/
        var ts = message.ts;
        message.add = add;

        /*boolean isWbMsg = false;
        if (_wb != null && !inList)
            isWbMsg = _wb.onRemoteMsg(add, id, name, ts, data);

        if (!isWbMsg && _cbk != null)
            _cbk.roomManagerOnRemoteMsg(add, id, name, ts, data);*/
        var connectEvt = TK.RoomEvent({type: 'room-remotemsg', message: message});
        that.dispatchEvent(connectEvt);
    }

    // Public functions

    // It stablishes a connection to the room.
    // Once it is done it throws a RoomEvent("room-connected")
    //param进行http checkroom的时候的参数，透传的，properties是用户属性
    that.joinroom = function (defaultstream, testip,testport) {
        //var token = spec.token;
        if (that.state !== DISCONNECTED) {
            L.Logger.warning('[tk-sdk]Room already connected', this.state);
        }

        if(_status!==STATUS_CHECKING || _room_host === undefined || _room_port === undefined || _myself === undefined) {
            L.Logger.warning('[tk-sdk]Status error ', _status);
            return -1;
        }

        _default_stream = defaultstream;
        if(defaultstream === undefined) {
            _myself.hasvideo = false;
            _myself.hasaudio = false;
        }
        else {
            _myself.hasvideo = defaultstream.video;
            _myself.hasaudio = defaultstream.audio;
        }

        _testIP = testip;
        _testPort = testport;

        /*
            var id = param.id;
            var roomId = param.roomid;
            var hasDC=param.hasDataChannel;
            var userproperties = param.properties;
            var p2p = param.p2p;
            var host = param.host;
            var secure = param.secure;//true for https,false for http
        */

        L.Logger.info('[tk-sdk]joinroom', _myself);

        _users = {};
        _rolelist = {} ;
        
        //step1 checkroom
        //step2 getfilelist & getconfig 
        //step3 connect
        //step4 join     
        step2GetConfig(_room_host, _room_port, function(result,message) {
            if(result!==0)
                L.Logger.info('[tk-sdk]step2GetConfig ' + message);

            if (result == 0 && _status == STATUS_GETTINGCFG) {
                step2GetFileList(_room_host, _room_port, function(result,message) {
                    L.Logger.info('[tk-sdk]step2GetFileList ' + result);
                    if(result !== -1 ){
                        if (message !== undefined) {
                            _room_filelist = message;
                            var Evt = TK.RoomEvent({type: 'room-files', message: _room_filelist});
                            that.dispatchEvent(Evt);
                        } else {
                            _room_filelist = [];
                            var Evt = TK.RoomEvent({type:'room-error',message:{source:L.Constant.roomError.GETFILELISTERROR , error:result }});
                            that.dispatchEvent(Evt);
                        }
                    }
                    step3Connect();
                });
            }
            else {               
                var Evt = TK.RoomEvent({type:'room-error',message:{source:L.Constant.roomError.GETCONFIGERROR , error:result }});
                that.dispatchEvent(Evt);       
            }
        });

    };//joinroom end

    // It disconnects from the room, dispatching a new RoomEvent("room-disconnected")
    that.leaveroom = function (force) {
        force = force || false ;
        L.Logger.debug('[tk-sdk]leaveroom:Disconnection requested');
        setStatus(STATUS_DISCONNECTED);
        // Close socket
        try {
            if(that.socket && that.socket.disconnect){
                that.socket.disconnect();
            }
        } catch (error) {
            L.Logger.debug('[tk-sdk]Socket already disconnected , disconnect errorInfo:' , error);
        }
        that.socket = undefined;
        var roomEvt = TK.RoomEvent({type: 'room-leaveroom' , message:force});
        that.dispatchEvent(roomEvt);
    };

    // It publishes the stream provided as argument. Once it is added it throws a
    // StreamEvent("stream-added").
    that.publish = function (stream, options, callback) {

        if (_status != STATUS_ALLREADY) {
            L.Logger.warning('[tk-sdk]publish with wrong room status', _status);
            return ERR_INVALID_STATUS;
        }

        L.Logger.debug('[tk-sdk]calling publish', stream);
        options = options || {};

        options.maxVideoBW = options.maxVideoBW || spec.defaultVideoBW;
        if (options.maxVideoBW > spec.maxVideoBW) {
            options.maxVideoBW = spec.maxVideoBW;
        }

        if (options.minVideoBW === undefined){
            options.minVideoBW = 0;
        }

        if (options.minVideoBW > spec.defaultVideoBW){
            options.minVideoBW = spec.defaultVideoBW;
        }

        options.simulcast = options.simulcast || options._simulcast || false;

        // 1- If the stream is not local or it is a failed stream we do nothing.
        if (stream && stream.local && !stream.failed && that.localStreams[stream.getID()] === undefined) {
            // 2- Publish Media Stream to TK-Controller
            if (stream.hasAudio() || stream.hasVideo() || stream.hasScreen()) {
                if ( !(stream.url !== undefined || stream.recording !== undefined) ) {
                    L.Logger.info('[tk-sdk]Publishing to ms Normally, is createOffer', options.createOffer, stream.extensionId);
                    sendSDPSocket('publish', {state: 'ms',
                            data: stream.hasData(),
                            audio: stream.hasAudio(),
                            video: stream.hasVideo(),
                            screen: stream.hasScreen(),
                            minVideoBW: options.minVideoBW,
                            attributes: stream.getAttributes(),
                            extensionId: stream.extensionId,
                            createOffer: options.createOffer,
                            metadata: options.metadata,
                            scheme: options.scheme},
                        undefined, function (error, id) {

                            if (error != 0) {
                                L.Logger.error('[tk-sdk]Error when publishing the stream: ', error, id);
                                if(stream.extensionId === _myself.id){
                                    that.changeUserProperty(stream.extensionId, "__all", {publishstate:TK.PUBLISH_STATE_NONE});
                                }
                                var Evt = TK.StreamEvent({ type: 'stream-publish-fail'  , stream:stream , message:{ error:error , id:id   , hasdata:false } });
                                that.dispatchEvent(Evt);
                                if (callback) callback(undefined, error);
                                return;
                            }
                            L.Logger.info('[tk-sdk]Stream assigned an Id, starting the publish process');
                            stream.getID = function () {
                                return id;
                            };
                            if (stream.hasData()) {
                                stream.sendData = function (msg) {
                                    sendDataSocket(stream, msg);
                                };
                            }
                            stream.setAttributes = function (attrs) {
                                updateAttributes(stream, attrs);
                            };
                            that.localStreams[id] = stream;
                            stream.room = that;

                            stream.pc = TK.Connection({callback: function (message) {

                                L.Logger.debug('[tk-sdk]Sending message', message);
                                message = ipAndStationaryStrWitch_send(message);
                                sendSDPSocket('signaling_message', {streamId: stream.getID(),
                                        msg: message},
                                    undefined, function () {});
                            }, iceServers: that.iceServers,
                                maxAudioBW: options.maxAudioBW,
                                maxVideoBW: options.maxVideoBW,
                                limitMaxAudioBW: spec.maxAudioBW,
                                limitMaxVideoBW: spec.maxVideoBW,
                                simulcast: options.simulcast,
                                audio: stream.hasAudio(),
                                video: stream.hasVideo(),
                                cnnId: stream.getID()});

                            stream.pc.addStream(stream.stream);
                            stream.pc.oniceconnectionstatechange = function (state) {
                                // No one is notifying the other subscribers that this is a failure
                                // they will only receive onRemoveStream
                                if (state === 'failed') {
                                    if (that.state !== DISCONNECTED && stream && !stream.failed) {
                                        stream.failed=true;
                                        if(stream.extensionId === _myself.id){
                                            that.changeUserProperty(stream.extensionId, "__all", {publishstate:TK.PUBLISH_STATE_NONE});
                                        }
                                        L.Logger.warning('[tk-sdk]Publishing Stream',
                                            stream.getID(),
                                            'has failed after successful ICE checks');
                                        var disconnectEvt = TK.StreamEvent({
                                            type: 'stream-failed',
                                            message:{reason:'Publishing stream failed after connection' , source:'publish'} ,
                                            stream:stream});
                                        that.dispatchEvent(disconnectEvt);
                                        //that.unpublish(stream);
                                    }
                                }
                            };
                            if(!options.createOffer)
                                stream.pc.createOffer();
                            if(callback) callback(id);
                        });
                }
            }
        } else {
            L.Logger.error('[tk-sdk]Trying to publish invalid stream');
            if(callback) callback(undefined, 'Invalid Stream');
        }
        return ERR_OK;
    };

    that.publishMedia = function ( stream, options , callback ) {
        if (_status != STATUS_ALLREADY) {
            L.Logger.warning('[tk-sdk]publish with wrong room status', _status);
            return ERR_INVALID_STATUS;
        }
        L.Logger.debug('[tk-sdk]calling mediaPublish stream');
        options = options || {};
        // 1- If the stream is not local or it is a failed stream we do nothing.
        if (stream  && !stream.failed && that.remoteStreams[stream.getID()] === undefined) {
            // 2- Publish Media Stream to TK-Controller
            if (stream.hasAudio() || stream.hasVideo() || stream.hasScreen()) {
                if (stream.url !== undefined || stream.recording !== undefined) {
                    var type;
                    var arg;
                    if (stream.url) {
                        type = 'url';
                        arg = stream.url;
                    } else {
                        type = 'recording';
                        arg = stream.recording;
                    }
                    L.Logger.info('[tk-sdk]Checking publish options for', stream.getID());
                    stream.checkOptions(options);
                    sendSDPSocket('publish', {state: type,
                            data: stream.hasData(),
                            audio: stream.hasAudio(),
                            video: stream.hasVideo(),
                            attributes: stream.getAttributes(),
                            extensionId: stream.extensionId,
                            metadata: options.metadata,
                            createOffer: options.createOffer},
                        arg, function (error, id) {
                            if (error == 0) {
                                L.Logger.info('[tk-sdk]mediaStream published');
                                stream.getID = function () {
                                    return id;
                                };
                                stream.sendData = function (msg) {
                                    sendDataSocket(stream, msg);
                                };
                                stream.setAttributes = function (attrs) {
                                    updateAttributes(stream, attrs);
                                };
                                stream.room = that;
                                if (callback)
                                    callback(id);
                            } else {
                                L.Logger.error('[tk-sdk]Error when publishing mediaStream', error, id);
                                var Evt = TK.StreamEvent({type: 'stream-publish-fail', stream:stream  ,  message:{ error:error , id:id  ,hasdata:false } });
                                that.dispatchEvent(Evt);
                                if (callback)
                                    callback(undefined, error);

                            }
                        });
                }
            }
        } else {
            L.Logger.error('[tk-sdk]Trying to publish invalid mediaStream' , stream);
            if(callback) callback(undefined, 'Invalid Stream');
        }
        return ERR_OK;
    };

    // Returns callback(id, error)
    that.startRecording = function (stream, callback) {
        if (stream){
            L.Logger.debug('[tk-sdk]Start Recording stream: ' + stream.getID());
            sendMessageSocket('startRecorder', {to: stream.getID()}, function(id, error){
                if (id === null){
                    L.Logger.error('[tk-sdk]Error on start recording', error);
                    if (callback) callback(undefined, error);
                    return;
                }

                L.Logger.info('[tk-sdk]Start recording', id);
                if (callback) callback(id);
            });
        }else{
            L.Logger.error('[tk-sdk]Trying to start recording on an invalid stream', stream);
            if(callback) callback(undefined, 'Invalid Stream');
        }
    };

    // Returns callback(id, error)
    that.stopRecording = function (recordingId, callback) {
        sendMessageSocket('stopRecorder', {id: recordingId}, function(result, error){
            if (result === null){
                L.Logger.error('[tk-sdk]Error on stop recording', error);
                if (callback) callback(undefined, error);
                return;
            }
            L.Logger.info('[tk-sdk]Stop recording', recordingId);
            if (callback) callback(true);
        });
    };

    // It unpublishes the local stream in the room, dispatching a StreamEvent("stream-removed")
    that.unpublish = function (stream, callback) {
        if (_status != STATUS_ALLREADY)
            return ERR_INVALID_STATUS;
        // Unpublish stream from TK-Controller
        if (stream && stream.local) {
            // Media stream
            sendMessageSocket('unpublish', stream.getID(), function(result, error){
                if (result !== 0){
                    L.Logger.error('[tk-sdk]Error unpublishing stream', error);
                    var Evt = TK.StreamEvent({type: 'stream-unpublish-fail', stream:stream , message: {error:error}});
                    that.dispatchEvent(Evt);
                    if (callback) callback(undefined, error);
                    return;
                }

                // remove stream failed property since the stream has been
                // correctly removed from Talk so is eligible to be
                // published again
                if (stream.failed) {
                    delete stream.failed;
                }

                L.Logger.info('[tk-sdk]Stream unpublished , stream id:'+stream.getID() );
                if (callback) callback(true);
            });

            stream.room = undefined;
            if ((stream.hasAudio() ||
                stream.hasVideo() ||
                stream.hasScreen()) &&
                stream.url === undefined) {
                if (stream.pc) stream.pc.close();
                stream.pc = undefined;
            }
            delete that.localStreams[stream.getID()];

            stream.getID = function () {return 'local';};
            stream.sendData = function () {};
            stream.setAttributes = function () {};

        } else {
            var error = 'Cannot unpublish, stream does not exist or is not local';
            L.Logger.error('[tk-sdk]unpublish error:' , error );
            var Evt = TK.StreamEvent({type: 'stream-unpublish-fail', stream:stream , message: {error:error}});
            that.dispatchEvent(Evt);
            if (callback) callback(undefined, error);
            return;
        }
        return ERR_OK;
    };

    that.unpublishMedia = function ( stream, callback ) {
        if (_status != STATUS_ALLREADY)
            return ERR_INVALID_STATUS;
        // Media stream
        sendMessageSocket('unpublish', stream.getID(), function(result, error){
            if (result !== 0){
                L.Logger.error('[tk-sdk]Error unpublishing stream', error);
                var Evt = TK.StreamEvent({type: 'stream-unpublish-fail', stream:stream , message: {error:error}});
                that.dispatchEvent(Evt);
                if (callback) callback(undefined, error);
                return;
            }
            if (stream.failed) {
                delete stream.failed;
            }
            delete that.remoteStreams[stream.getID()];
            L.Logger.info('[tk-sdk]meidaStream unpublished , stream id:'+stream.getID() );
            if (callback) callback(true);
        });
    };

    that.sendControlMessage = function(stream, type, action) {
      if (stream && stream.getID()) {
        var msg = {type: 'control', action: action};
        sendSDPSocket('signaling_message', {streamId: stream.getID(), msg: msg});
      }
    };

    // It subscribe to a remote stream and draws it inside the HTML tag given by the ID='elementID'
    that.subscribe = function (stream, options, callback) {
        if (_status != STATUS_ALLREADY) {
            L.Logger.warning('[tk-sdk]subscribe when not ready');
            return ERR_INVALID_STATUS;
        }


        options = options || {};

        if (stream && !stream.local && !stream.failed) {

            if (stream.hasVideo() || stream.hasAudio() || stream.hasScreen()) {
                // 1- Subscribe to Stream

                if (!stream.hasVideo() && !stream.hasScreen()) options.video = false;
                if (!stream.hasAudio()) options.audio = false;

                if (that.p2p) {
                    sendSDPSocket('subscribe', {streamId: stream.getID(),
                                                metadata: options.metadata});
                    if(callback) callback(true);
                } else {

                    options.maxVideoBW = options.maxVideoBW || spec.defaultVideoBW;
                    if (options.maxVideoBW > spec.maxVideoBW) {
                        options.maxVideoBW = spec.maxVideoBW;
                    }
                    L.Logger.info('[tk-sdk]Checking subscribe options for', stream.getID());
                    stream.checkOptions(options);
                    sendSDPSocket('subscribe', {streamId: stream.getID(),
                                                audio: options.audio,
                                                video: options.video,
                                                data: options.data,
                                                browser: TK.getBrowser(),
                                                createOffer: options.createOffer,
                                                metadata: options.metadata,
                                                slideShowMode: options.slideShowMode},
                                  undefined, function (result, error) {
                            if (result !== 0) {
                                L.Logger.error('[tk-sdk]Error subscribing to stream ', error);
                                var Evt = TK.StreamEvent({type: 'stream-subscribe-fail', message: {error:error , stream:stream , hasdata:false }});
                                that.dispatchEvent(Evt);
                                if (callback)
                                    callback(undefined, error);
                                return;
                            }

                            L.Logger.info('[tk-sdk]Subscriber added');

                            stream.pc = TK.Connection({callback: function (message) {
                                L.Logger.info('[tk-sdk]Sending message', message);
                                message = ipAndStationaryStrWitch_send(message);
                                sendSDPSocket('signaling_message', {streamId: stream.getID(),
                                                                    msg: message,
                                                                    browser: stream.pc.browser},
                                              undefined, function () {});
                              },
                              nop2p: true,
                              audio: options.audio,
                              video: options.video,
                              maxAudioBW: spec.maxAudioBW,
                              maxVideoBW: spec.maxVideoBW,
                              limitMaxAudioBW:spec.maxAudioBW,
                              limitMaxVideoBW: spec.maxVideoBW,
                              iceServers: that.iceServers,
                              cnnId: stream.getID()});

                            stream.pc.onaddstream = function (evt) {
                                // Draw on html
                                L.Logger.info('[tk-sdk]Stream subscribed');
                                stream.stream = evt.stream;
                                if( _isGetRtcStatsrObserver){
                                    that.rtcStatsrObserver(stream);
                                }
                                var evt2 = TK.StreamEvent({type: 'stream-subscribed',
                                                              stream: stream});
                                that.dispatchEvent(evt2);
                            };

                            stream.pc.oniceconnectionstatechange = function (state) {
                                if (state === 'failed') {
                                    if (that.state !== DISCONNECTED && stream &&!stream.failed) {
                                        stream.failed = true;
                                        L.Logger.warning('[tk-sdk]Subscribing stream',
                                                        stream.getID(),
                                                        'has failed after successful ICE checks');
                                        var disconnectEvt = TK.StreamEvent(
                                              {type: 'stream-failed',
                                                message:{reason:'Subscribing stream failed after connection' , source:'subscribe'} ,
                                               stream:stream });
                                        that.dispatchEvent(disconnectEvt);
                                        that.unsubscribe(stream);
                                    }
                                }
                            };

                            stream.pc.createOffer(true);
                            if(callback) callback(true);
                        });

                }
            } else if (stream.hasData() && options.data !== false) {
                sendSDPSocket('subscribe',
                              {streamId: stream.getID(),
                               data: options.data,
                               metadata: options.metadata},
                              undefined, function (result, error) {
                    if (result !== 0) {
                        L.Logger.error('[tk-sdk]Error subscribing to stream ', error);
                        var Evt = TK.StreamEvent({type: 'stream-subscribe-fail' , stream:stream , message: {error:error  , hasdata:true }});
                        that.dispatchEvent(Evt);
                        if (callback)
                            callback(undefined, error);
                        return;
                    }
                    L.Logger.info('[tk-sdk]Stream subscribed');
                    var evt = TK.StreamEvent({type: 'stream-subscribed', stream: stream});
                    that.dispatchEvent(evt);
                    if(callback) callback(true);
                });
            } else {
                L.Logger.warning ('[tk-sdk]There\'s nothing to subscribe to');
                if (callback) callback(undefined, 'Nothing to subscribe to');
                return;
            }
            // Subscribe to stream stream
            L.Logger.info('[tk-sdk]Subscribing to: ' + stream.getID());
        }else{
            var error = 'Error on subscribe';
            if (!stream){
                L.Logger.warning('[tk-sdk]Cannot subscribe to invalid stream', stream);
                error = 'Invalid or undefined stream';
            }
            else if (stream.local){
                L.Logger.warning('[tk-sdk]Cannot subscribe to local stream, you should ' +
                                 'subscribe to the remote version of your local stream');
                error = 'Local copy of stream';
            }
            else if (stream.failed){
                L.Logger.warning('[tk-sdk]Cannot subscribe to failed stream, you should ' +
                                 'wait a new stream-added event.');
                error = 'Failed stream';
            }
            if (callback)
                callback(undefined, error);
            return;
        }
        return  ERR_OK;
    };

    // It unsubscribes from the stream, removing the HTML element.
    that.unsubscribe = function (stream, callback) {
        // Unsubscribe from stream stream
        if (that.socket !== undefined) {
            if (stream && !stream.local) {
                sendMessageSocket('unsubscribe', stream.getID(), function (result, error) {
                    if (result !== 0) {
                        var Evt = TK.StreamEvent({type: 'stream-unsubscribe-fail' , stream:stream , message: {error:error}});
                        that.dispatchEvent(Evt);
                        if (callback)
                            callback(undefined, error);
                        return;
                    }
                    removeStream(stream);
                    if (callback) callback(true);
                }, function () {
                    L.Logger.error('[tk-sdk]Error calling unsubscribe.');
                });
            }
        }
    };

    that.getStreamStats = function (stream, callback) {
        if (!that.socket) {
            return 'Error getting stats - no socket';
        }
        if (!stream) {
            return 'Error getting stats - no stream';
        }

        sendMessageSocket('getStreamStats', stream.getID(), function (result) {
            if (result) {
                callback(result);
            }
        });
    };

    //It searchs the streams that have "name" attribute with "value" value
    that.getStreamsByAttribute = function (name, value) {
        var streams = [], index, stream;

        for (index in that.remoteStreams) {
            if (that.remoteStreams.hasOwnProperty(index)) {
                stream = that.remoteStreams[index];

                if (stream.getAttributes() !== undefined &&
                    stream.getAttributes()[name] !== undefined) {

                    if (stream.getAttributes()[name] === value) {
                        streams.push(stream);
                    }
                }
            }
        }

        return streams;
    };
    //如果只是切换设备，不用重新发布，只需要将原来的本地流删除，
    //重新stream.init,再添加新的流就可以
    that.deleteStream=function(stream) {
        if (stream.stream !== undefined) {

            // Remove HTML element
            stream.hide();

            // Close PC stream
            if (stream.pc) {
              stream.pc.removeStream(stream.stream);             
            }
            if (stream.local) {
                stream.stream.stop();
            }
            delete stream.stream;
        }
        //stream.pc.removeStream(stream.stream);
    };
    that.addStream=function(stream) {
        //切换设备首先删除原来的stream,再添加一个新的流
        //stream.pc.removeStream(stream);
        if(!stream){
            L.Logger.warning("[tk-sdk]not stream to addStream");
        }
        stream.pc.addStream(stream);
    };

    /*发送回放的seek消息给服务器
        @params positionTime：seek的位置，毫秒级
    */
    that.seekPlayback = function (positionTime) {
        if(!_isPlayback){L.Logger.warning('[tk-sdk]No playback environment!');return ;} ;
        try{
            positionTime = Number(positionTime);
            that.socket.emit('seekPlayback' , positionTime );
        }catch (e){
            L.Logger.error('[tk-sdk]The seek posttion must be a number, in milliseconds !');
        }
    };

    /*发送回放的暂停消息给服务器  */
    that.pausePlayback = function () {
        if(!_isPlayback){L.Logger.warning('[tk-sdk]No playback environment!');return ;} ;
        that.socket.emit('pausePlayback');
    };

    /*发送回放的播放消息给服务器
     @params positionTime：seek的位置，毫秒级
     */
    that.playPlayback = function () {
        if(!_isPlayback){L.Logger.warning('[tk-sdk]No playback environment!');return ;} ;
        that.socket.emit('Playback');
    };

    /*回放清除所有sdk相关数据*/
    that.playbackClearAll = function () {
        if(!_isPlayback){L.Logger.error('[tk-sdk]No playback environment, no execution playbackClearAll!');return ;} ;
        if (_users != undefined) {
            clearRoleList(_rolelist);
            clearUsers(_users);
        }
        if(_myself != null){
            _myself.publishstate = TK.PUBLISH_STATE_NONE;
        }
    };

    function _resetRoomState() { //重置房间状态
        var index, stream, evt2;
        // Remove all streams
        for (index in that.remoteStreams) {
            if (that.remoteStreams.hasOwnProperty(index)) {
                stream = that.remoteStreams[index];
                removeStream(stream);
                delete that.remoteStreams[index];
                if (stream && !stream.failed){
                    evt2 = TK.StreamEvent({type: 'stream-removed', stream: stream});
                    that.dispatchEvent(evt2);
                }
            }
        }
        that.remoteStreams = {};

        // Close Peer Connections
        for (index in that.localStreams) {
            if (that.localStreams.hasOwnProperty(index)) {
                stream = that.localStreams[index];
                if(that.p2p){
                    for(var i in stream.pc){
                        stream.pc[i].close();
                    }
                }else{
                    stream.pc.close();
                }
                delete that.localStreams[index];
            }
        }
         if (_users != undefined) {
             clearRoleList(_rolelist);
             clearUsers(_users);
         }
         if(_myself != null){
             _myself.publishstate = TK.PUBLISH_STATE_NONE;
         }
    };

    var setStatus=function(newStatus) {
        //logd("setStatus " + newStatus);

        L.Logger.info('[tk-sdk]setStatus to: ' + newStatus);

        if (_status == newStatus)
            return;

        _status = newStatus;
        if (_status == STATUS_ALLREADY) {
            if(!_rolelist[_myself.role]) { _rolelist[_myself.role] = {} };
            _rolelist[_myself.role][_myself.id] = _myself ;
            _users[_myself.id]=_myself;

            if (_myself.publishstate > TK.PUBLISH_STATE_NONE) {
                checkMyAudioAndVideoEnable(_myself.publishstate);
                that.publish(_default_stream);
            }
        }
        else if(_status == STATUS_DISCONNECTED){
            _resetRoomState();
        }
        else if(_status == STATUS_IDLE) {
            _resetRoomState();
        }
    };
    var clearUsers=function(obj) {
         for(var key in obj){
            if(_isPlayback &&  key === _myself.id ){
                return ;
            }
            delete obj[key];
          }
     };
    var clearRoleList = function (obj) {
        for(var key in obj){
            if(_isPlayback &&  key === _myself.id ){
                return ;
            }
            delete obj[key];
        }
    };

    var sendRequest=function(method, url, isAsyns, params, action , requestHeader) {
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari  
            xmlhttp = new XMLHttpRequest();  
        } else {// code for IE6, IE5  
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");  
        }  
        xmlhttp.open(method, url, isAsyns);  
        xmlhttp.setRequestHeader("Content-Type",requestHeader?requestHeader:"application/x-www-form-urlencoded;charset=utf-8");
        xmlhttp.send(params);
        xmlhttp.onreadystatechange = action;
        return xmlhttp ;
    };
    var guid = (function() {
          function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                       .toString(16)
                       .substring(1);
          }
          return function() {
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                   s4() + '-' + s4() + s4() + s4();
          };
    })();

    /*初始化回放信息*/
    that.initPlaybackInfo = function(host, port, params, callback ) {
        var userid = undefined ;
        if(!params){L.Logger.error('[tk-sdk]params is required ,params type is json !');return ;}
        if(typeof params === 'string'){try{params = JSON.parse(params);}catch (e){L.Logger.error('[tk-sdk]params type must is json! ');return ;}}
        if(params.roomtype === undefined || params.serial === undefined || params.recordfilepath === undefined ){L.Logger.error('[tk-sdk]The params must be included [roomtype , serial , recordfilepath] ! ');return ;}
        setStatus(STATUS_CHECKING);
        _room_host = host;
        _room_port = port;
        var response = {
            room:{
                roomtype:params.roomtype ,
                maxvideo:params.maxvideo || params.roomtype == 0 ? 2 : 10000 , //回放不管发布个数
                roomrole:-1 ,
                serial:params.serial ,
                roomname:params.roomname || 'Play Back',
                recordfilepath:params.recordfilepath ,
                domain:params.domain ,
                host:params.host ,
                companyid:params.companyid || -1 ,
            } ,
            nickname:"playback" ,
            roomrole: -1 ,
            thirdid: userid ? userid+":playback"  : guid()+":playback"
        };
        var userinfo = {};
        var room;
        room = response.room;
        room.roomtype =  Number( room.roomtype ) ;
        room.maxvideo =  parseInt( room.maxvideo ) ;
        room.roomrole =  Number( room.roomrole ) ;
        _room_properties = room;
        _room_id = room.serial;
        _room_name = room.roomname;
        _room_type = room.roomtype ;
        _room_max_videocount = room.maxvideo;
        _recordfilepath = room.recordfilepath  ;

        userinfo.properties = {};
        userinfo.properties.role =response.roomrole  ;
        userinfo.properties.nickname = response.nickname;
        userinfo.id = response.thirdid;
        _myself = TK.RoomUser(userinfo);
        _avmgr = TK.AVMgr ;
        _isPlayback = true ;
        that.setIsGetFileList(false) ; //不获取文件列表
        _isGetRtcStatsrObserver = false ; //不获取视频网络状态
        if(callback && typeof callback === 'function'){
            callback(userinfo, _room_properties);
        }
    } ;

    that.checkroom=function(host, port, params, callback , userid) {
        setStatus(STATUS_CHECKING);

        _room_host = host;
        _room_port = port;

        var url = HTTP + host + ":" + port + WEBFUNC_CHECKroom+"?ts="+new Date().getTime();

        var first = true;
        var object = "";
        if (typeof params === 'string') {
            object = params
        }
        else
            for (var key in params) {
                if (first)
                    first = false;
                else
                    object = object + "&";

                object = object + key + "=" + params[key];
            }

        L.Logger.info('[tk-sdk]Going to checkroom', object);

        sendRequest(  
                "POST",  
                url,  
                true,  
                object,
                function() {  
                    L.Logger.debug('[tk-sdk]Http status ', xmlhttp.readyState);
                    if (xmlhttp.readyState != 4)
                        return;

                    if (xmlhttp.status == 200) {  
                        var response = JSON.parse(xmlhttp.responseText);//xmlhttp.responseText;        
                        L.Logger.info('[tk-sdk]checkroom resp = ', response);
                        var userinfo = {};
                        var nRet = response.result;
                        var room;
                        var pullInfo  ;
                        if (nRet == 0) {
                            room = response.room;
                            pullInfo = response.pullinfo ;
                            if (room.serial===undefined)
                                nRet = ERR_INTERNAL_EXCEPTION;
                            else {
                                room.roomtype =  Number( room.roomtype ) ;
                                room.maxvideo =  parseInt( room.maxvideo ) ;
                                room.roomrole =  Number( room.roomrole ) ;
                                var  pullConfigureJson = {};
                                var pushConfigureJson = {} ;
                                if(pullInfo && pullInfo.data && pullInfo.data.pullConfigureList){
                                    var pullConfigureList = pullInfo.data.pullConfigureList ;
                                    for(var i in pullConfigureList){
                                        var pullConfigure = pullConfigureList[i] ;
                                        pullConfigureJson[ pullConfigure.pullProtocol ] =  pullConfigure.pullUrlList ;
                                    }
                                }
                                if(pullInfo && pullInfo.data && pullInfo.data.pushConfigureInfo){
                                    var pushConfigureInfo = pullInfo.data.pushConfigureInfo ;
                                    for(var i in pushConfigureInfo){
                                        var pushConfigure = pushConfigureInfo[i] ;
                                        pushConfigureJson[ pushConfigure.pushProtocol ] =  pushConfigure.pushUrl ;
                                    }
                                }
                                room.pullConfigure = pullConfigureJson ;
                                room.pushConfigure = pushConfigureJson ;

                                _room_properties = room;
                                _room_id = room.serial;
                                _room_name = room.roomname;
                                _room_type = room.roomtype ;
                                _room_max_videocount = room.maxvideo;

                                userinfo.properties = {};
                                userinfo.properties.role =response.roomrole  ;
                                userinfo.properties.nickname = response.nickname;

                                var id = response.thirdid;

                                if(id !== undefined && id != "0" && id != ''){
                                    userinfo.id = id;
                                }else if(userid){
                                    userinfo.id = userid ;
                                }else{
                                    userinfo.id = guid();
                                }

                                _myself = TK.RoomUser(userinfo);
                                dealWithVideoConfig(_room_type, _myself.role, room.videotype, room.videoframerate);
                            }
                        }

                        L.Logger.info('[tk-sdk]checkroom success');
                        callback(nRet, userinfo, _room_properties);
                    }
                    else
                    {
                        L.Logger.error('[tk-sdk]checkroom fail[readyState-status]:' , xmlhttp.readyState , xmlhttp.status ) ;
                        callback(ERR_HTTP_REQUEST_FAILED,xmlhttp.responseText);
                    }  
                });  
    } ;
  
   
    var dealWithVideoConfig=function(roomtype,role,vidoetype,fps) {
        roomtype = Number(roomtype);
        role = Number(role);
        vidoetype = Number(vidoetype);
        fps = Number(fps);
        // var video_type = Math.min(2, vidoetype);
        var video_type = vidoetype;
         //role->0：主讲  1：助教    2: 学员   3：直播用户 4:巡检员　10:系统管理员　11:企业管理员　12:管理员 , -1:回放者
        if (roomtype > 0 && role >= 2)// 1vn student: smaller than teacher, max 320
            video_type = Math.max(0, Math.min(1, video_type - 1));
        _room_video_width = VIDEO_DEFINES[video_type][0];
        _room_video_height = VIDEO_DEFINES[video_type][1];

        _room_video_fps = fps < 10 ? 10 : (fps > 30 ? 30 : fps);
        _room_video_maxbps = getMaxBPS(_room_video_width, _room_video_fps);
        var key_value_json = {
            room_video_width:_room_video_width ,
            room_video_height:_room_video_height ,
            room_video_fps:_room_video_fps ,
        };
        _avmgr = TK.AVMgr ;
        _avmgr.setAVMgrProperty(key_value_json);
        L.Logger.info('[tk-sdk]video config:' + _room_video_width + '*' + _room_video_height + ', ' + _room_video_fps + ', ' + _room_video_maxbps);
    } ;

    that.getAVMgr = function () {
        return _avmgr ;
    } ;

    var getMaxBPS=function(w, fr) {
        var dw = 128;
        if (w <= 176) //176*144
        {
            if( fr < 20 )
                dw = 128;
            else
                dw = 128+64;
        }
        else if (w <= 320) //320*240
        {
            if( fr < 20 )
                dw = 256;
            else
                dw = 256+128 ;
        }
        else if (w <=640)//640*480
        {
            if( fr < 20 )
                dw = 256 + 128 ;
            else
                dw = 512;
        }
        else if (w <=1280)//1280*720
        {
            if( fr  <  15   )
                dw = 1024 ;
            else if( fr >=15 &&  fr <=20 )
                dw = 1024+256 ;
            else
                dw = 1024+512 ;
        }
        else
        {
            if( fr  <  15   )
                dw =  1024+256 ;
            else if( fr >=15 &&  fr <=20 )
                dw =  1024+ 512;
            else
                dw =  1024+1024 ;
        }
        return dw;
    } ;

    var step2GetConfig=function(host, port, callback) {     

        setStatus(STATUS_GETTINGCFG);
        if(_room_id == undefined)
        {
            callback(ERR_HTTP_REQUEST_FAILED, null);
            return;
        }

        L.Logger.info('[tk-sdk]Going to getConfig');

        var url = HTTP + host + ":" + port + WEBFUNC_GETCONFIG+"?ts="+new Date().getTime();

        sendRequest("POST",url,true,"serial="+_room_id,function() {

            if (xmlhttp.readyState != 4)
                return;

            if (xmlhttp.status == 200) {  
                
                    var response_json = JSON.parse(xmlhttp.responseText);       
                    L.Logger.info('[tk-sdk]getConfig resp = ', response_json);
                    _configuration = response_json ;
                    var sighost = host, sigport = "8889";
                    if (_testIP === undefined || _testPort === undefined) {
                        if (response_json.courseserver!==undefined) {
                            var tmp = response_json.courseserver;
                            if (tmp != null && tmp.length > 0)
                                sighost = tmp;
                        }
                        if (response_json.courseserverport!==undefined)
                            sigport = response_json.courseserverport;
                    }
                    else {
                        sighost = _testIP;
                        sigport = _testPort;
                    }
                    //_room_uri =  'https://' + '192.168.1.57' + ":" + sigport;
                     _room_uri =  'https://' + sighost + ":" + sigport;
                    step2GetfalsificationIp(sighost , 8080) ;
                    L.Logger.info("[tk-sdk]_room_uri = " + _room_uri);
                callback(_room_uri != null ? 0 : ERR_HTTP_REQUEST_FAILED, null);
            }
            else
            {
                L.Logger.error('[tk-sdk]getConfig fail[readyState-status]:' , xmlhttp.readyState , xmlhttp.status ) ;
                callback(ERR_HTTP_REQUEST_FAILED,xmlhttp.responseText);
            }  
        });  
    } ;

    var step2GetFileList=function(host, port, callback) {
        if(_room_id === undefined)
        {
            callback(ERR_HTTP_REQUEST_FAILED, undefined);
            return;
        }
        if(!_isGetFileList){
            callback( -1 , undefined); //-1代表不执行web请求
            return ;
        }
        L.Logger.info('[tk-sdk]Going to getFileList');

        var url = HTTP + host + ":" + port + WEBFUNC_GETFILELIST+"?ts="+new Date().getTime();

        sendRequest("POST",url,true,"serial="+_room_id,function() {  
            
            if (xmlhttp.readyState != 4)
                return;

            if (xmlhttp.status == 200) 
            {  
                var response_json = JSON.parse(xmlhttp.responseText);       
                L.Logger.info('[tk-sdk]getFileList resp = ', response_json);
                
                var nRet = response_json.result;
                var roomfile;
                if (nRet == 0 && response_json.roomfile!==undefined) {
                    roomfile = response_json.roomfile;
                }

                callback(nRet, roomfile);

            }
            else
            {
                L.Logger.error('[tk-sdk]getFileList fail[readyState-status]:' , xmlhttp.readyState , xmlhttp.status ) ;
                callback(ERR_HTTP_REQUEST_FAILED,undefined);
            }  
        });  

    } ;

    var step2GetfalsificationIp = function (host , port ) {
        let url = 'https://'+host+":"+port +"/index.html?ts=" + new Date().getTime();
        if( /(192.168.|127.0.0.1|127.17.|localhost)/g.test(host) ){
            _isIpFalsification = false ;
        }else{
            _isIpFalsification = true ;
        }
        if(_isIpFalsification){
            $.ajax({
                url: url,
                type: "get",
                async: false,
            }).done(function(response_json) {
                L.Logger.info('[tk-sdk]getfalsificationIp resp :', response_json);
                if(response_json && typeof response_json === 'string'){
                    _ipFalsification = response_json.toString() ;
                }
            }).fail(function(err) {
                L.Logger.error('[tk-sdk]getfalsificationIp fail:' ,err ) ;
            });

            /*            sendRequest("GET",url,false,"",function() {
             if (xmlhttp.readyState != 4)
             return;

             if (xmlhttp.status == 200) {
             var response_json = xmlhttp.responseText;
             L.Logger.info('[tk-sdk]getfalsificationIp resp = ', response_json);
             if(response_json && typeof response_json === 'string'){
             _ipFalsification = response_json.toString() ;
             }

             } else {
             L.Logger.error('[tk-sdk]getfalsificationIp fail[readyState-status]:' , xmlhttp.readyState , xmlhttp.status ) ;
             }
             });*/
        }
    };

    var step3Connect=function(host,port) {
        L.Logger.info("[tk-sdk]step3Connect");
        if (_status >= STATUS_CONNECTING)
            return;
        setStatus(STATUS_CONNECTING);
        connectSocket(_room_uri, function (code, response) {

            var roominfo = response.roominfo;//房间信息
            var msglist = response.msglist; //各种消息列表，对应pugmsg所有信息
            var userlist = response.userlist;//用户列表，我进入教室后，服务器发送此房间列表给我

            var index = 0, stream, streamList = [], streams, roomId, arg, connectEvt;
            streams = roominfo.streams || [];
            that.p2p = roominfo.p2p;
            roomId = roominfo.id;
            that.iceServers = roominfo.iceServers;
            //that.state = CONNECTED;

            //todo todo
            //spec.defaultVideoBW = roominfo.defaultVideoBW;
            //spec.maxVideoBW = roominfo.maxVideoBW;

            spec.defaultVideoBW = _room_video_maxbps;
            spec.maxVideoBW = _room_video_maxbps;

            //size和frame初始化本地流的时候用
            /*_room_video_width = 320,
            _room_video_height = 240,
            _room_video_fps = 15,
            _room_video_maxbps = 256,*/

            setStatus(STATUS_ALLREADY);

            // 2- Retrieve list of streams
            for (index in streams) {
                if (streams.hasOwnProperty(index)) {
                    arg = streams[index];
                    stream = TK.Stream({streamID: arg.id,
                                           local: false,
                                           audio: arg.audio,
                                           video: arg.video,
                                           data: arg.data,
                                           screen: arg.screen,
                                           attributes: arg.attributes,
                                           extensionId: arg.extensionId});
                    streamList.push(stream);
                    that.remoteStreams[arg.id] = stream;
                    that.subscribe(stream);
                }
            }

            for (index in userlist) {
                if (userlist.hasOwnProperty(index)) {
                    var userproperties = userlist[index];
                    var user = TK.RoomUser(userproperties);
                    if (user !== undefined) {
                        if(!_rolelist[user.role]) { _rolelist[user.role] = {} };
                         _rolelist[user.role][user.id] = user ;
                        _users[user.id]=user;
                    }
                    
                }
            }
            
            var msgs = new Array();
			if(msglist && typeof msglist == "string") {
				msglist = JSON.parse(msglist);
			}
            for (index in msglist) {
                if (msglist.hasOwnProperty(index)) {
                    msgs.push(msglist[index]);
                }
            }
            
            msgs.sort(function(obj1, obj2){
                if (obj1 === undefined || !obj1.hasOwnProperty('seq') || obj2 === undefined || !obj2.hasOwnProperty('seq'))
                    return 0;

                return obj1.seq - obj2.seq;

            });

            // 3 - Update RoomID
            that.roomID = roomId;

            L.Logger.info('[tk-sdk]Connected to room ' + that.roomID);
            L.Logger.info('[tk-sdk]connected response:' ,response);
            var connectEvt = TK.RoomEvent({type: 'room-connected', streams: streamList, message:msgs});
            that.dispatchEvent(connectEvt);
            if(_isGetRtcStatsrObserver){
                that.stopIntervalRtcStatsrObserver();
                that.startIntervalRtcStatsrObserver();
            }
        }, function (error) {
            L.Logger.error('[tk-sdk]Not Connected! Error: ' + error);
            var connectEvt = TK.RoomEvent({type: 'room-error', message:{source:L.Constant.roomError.ROOMCONNECTERROR  , error:error}});
            that.dispatchEvent(connectEvt);
        });
    };

    var step4Join=function(callback,error) {

        if(_status >= STATUS_JOINING)
            return;

        if (_myself.id == undefined || _room_id == undefined) {
            L.Logger.error('[tk-sdk]Invalid status', _myself, _room_id);
            return;
        }

        setStatus(STATUS_JOINING);

        var properties =  {};
        for (var key in _myself) {
            if (key != 'id' && key != 'watchStatus') 
                properties[key]=_myself[key];
        }

        var params = {
            userId:_myself.id,
            roomId:!_isPlayback?_room_id:_room_id+"_"+_myself.id,
            maxVideo:_room_max_videocount,
            videofps:_room_video_fps,
            videowidth:_room_video_width,
            videoheight:_room_video_height,
            properties:properties
        };
        if(_isPlayback){ //是回放，则添加地址
            if(!_recordfilepath){L.Logger.error('[tk-sdk]The playback file address does not exist!');return ; } ;
            params.recordfilepath = _recordfilepath ;
        }
        sendMessageSocket('joinRoom', params, callback, error);
    } ;

    that.controlMedia=function(streamId, cmd){
        that.socket.emit('controlmedia', streamId, cmd);
    };

    /*更换本地设备，生成数据流改变本地媒体数据流轨道
    * @method changeLocalDeviceToLocalstream
    * @params [deviceIdMap:json , callback:function , audioouputElementIdArr:array(需要更新扩音器输出的节点元素数组) ]  */
    that.changeLocalDeviceToLocalstream = function (deviceIdMap , callback  , audioouputElementArr) {
        var _getUserMediaCallback = function (stream) {
            if (!_default_stream.stream) {
                _default_stream.stream = stream;
            } else {
                var localTracks = _default_stream.stream.getTracks();
                for (var i = 0; i < localTracks.length; i++) {
                    var track = localTracks[i];
                    _default_stream.stream.removeTrack(track);
                }
                var newTracks = stream.getTracks();
                for (var i = 0; i < newTracks.length; i++) {
                    var track = newTracks[i];
                    _default_stream.stream.addTrack(track);
                }
            }
            if(_default_stream.player){
                _default_stream.player.changeMediaStreamUrl(_default_stream.stream);
            }
            var publishstate = _myself.publishstate ;
            if(publishstate > TK.PUBLISH_STATE_NONE){
                that.unpublish(_default_stream , function (result , error) {
                    enableLocalAudio(_myself.publishstate  === TK.PUBLISH_STATE_AUDIOONLY || _myself.publishstate  === TK.PUBLISH_STATE_BOTH);
                    enableLocalVideo(_myself.publishstate  === TK.PUBLISH_STATE_VIDEOONLY  || _myself.publishstate  === TK.PUBLISH_STATE_BOTH );
                    if(result!=undefined){
                        that.publish(_default_stream);
                    }
                });
            }
        };
        that.getAVMgr().changeLocalDeviceToLocalstream(_getUserMediaCallback ,deviceIdMap , callback  , audioouputElementArr);
    };

    /*获取上传文件的参数*/
    that.getUploadFileParams = function (filename ,filetype ) {
        return {
            "serial": _room_properties['serial'],           //会议id
            "userid": _myself.id,            //用户id
            "sender": _myself.nickname,		//用户名
            "conversion": 1,               //是否进行文档转换
            "isconversiondone": 0,         //表示是否从客户端进行转换   1：客户端转换 0：否
            "writedb": 1,                 //是否写数据库 1：写  0：不写
            'fileoldname':filename  ,     //原文件名(如果是原文件)
            "fieltype": filetype,             //文件类型(如果是原文件)
            "alluser": 1				   //是否对所有人可见
        };
    };

    /*上传文件*/
    that.uploadFile = function (formData , callback , progressListenCallback ) {
        var host = _room_host ;
        var port = _room_port ;
        var url = HTTP + host + ":" + port + WEBFUNC_UPLOADDOCUMENT+"?ts="+new Date().getTime();
        if(!formData){
            L.Logger.error('[tk-sdk]uploadFile formData is required!');
            return ;
        }
        var uploadFileAjaxXhr =  $.ajax({
            url:url ,
            dataType: "json",
            type: 'POST',
            data: formData,
            async:true ,
            // 告诉jQuery不要去处理发送的数据
            processData: false,
            // 告诉jQuery不要去设置Content-Type请求头
            contentType: false,
            //这里我们先拿到jQuery产生的 XMLHttpRequest对象，为其增加 progress 事件绑定，然后再返回交给ajax使用
            xhr: function () {
                var xhr = $.ajaxSettings.xhr(); //获取ajax的XMLHttpRequestUpload
                if (xhr.upload) {
                    //注册进度监听事件
                    L.Utils.addEvent(xhr.upload, "progress", function (evt) {
                        /**侦查附件上传情况    ,这个方法大概0.05-0.1秒执行一次*/
                        var loaded = evt.loaded;  //已经上传大小情况
                        var tot = evt.total;  //附件总大小
                        var per = Math.floor(100 * loaded / tot); //已经上传的百分比
                        if(progressListenCallback && typeof progressListenCallback === "function"){
                            progressListenCallback(evt , per);
                        }
                    }, false);
                    return xhr;
                }
            }
        }).done(function (response) {
            L.Logger.info('[tk-sdk]uploadFile resp = ', response);
            if(callback && typeof callback === "function"){
                var code = response.result ;
                callback(code , response);
            }
        }).fail(function (jqXHR, textStatus, errorThrown){
            L.Logger.error("[tk-sdk]uploadFile fail[ jqXHR , textStatus , errorThrown ]:", jqXHR , textStatus , errorThrown );
            callback(ERR_HTTP_REQUEST_FAILED,undefined);
        });

      /* var uploadFileAjaxXhr =  sendRequest("POST",url,true,formData,function() {
            /!*readyState:
                 0 － （未初始化）还没有调用send()方法
                 1 － （载入）已调用send()方法，正在发送请求
                 2 － （载入完成）send()方法执行完成，已经接收到全部响应内容
                 3 － （交互）正在解析响应内容
                 4 － （完成）响应内容解析完成，可以在客户端调用了
               status:
                 1**：请求收到，继续处理
                 2**：操作成功收到，分析、接受
                 3**：完成此请求必须进一步处理
                 4**：请求包含一个错误语法或不能完成
                 5**：服务器执行一个完全有效请求失败
                 *!/
            if (xmlhttp.readyState != 4)
                return;

            if (xmlhttp.status == 200)
            {
                var response_json = JSON.parse(xmlhttp.responseText);
                L.Logger.info('[tk-sdk]uploadFile resp = ', response_json);
                var nRet = response_json.result;
                callback(nRet, response_json);
            }
            else
            {
                L.Logger.error('[tk-sdk]uploadFile fail[readyState-status]:' , xmlhttp.readyState , xmlhttp.status ) ;
                callback(ERR_HTTP_REQUEST_FAILED,undefined);
            }
        });*/
        return uploadFileAjaxXhr ;
    };

    /*删除文件*/
    that.deleteFile = function (fileid , callback ) {
        var host = _room_host ;
        var port = _room_port ;
        var url = HTTP + host + ":" + port + WEBFUNC_DELROOMFILE+"?ts="+new Date().getTime();
        if(fileid === undefined || fileid === null){
            L.Logger.error('[tk-sdk]deleteFile fileid is required!');
            return ;
        }
        var deleteFileParams = {
            "serial":_room_properties['serial'],   //会议id
            "fileid":fileid     //文件id
        };
        $.ajax({
            url:url ,
            dataType:"json",
            type : 'POST',
            anync:false ,
            data : deleteFileParams,
        }).done(function (response) {
            L.Logger.info('[tk-sdk]deleteFile resp = ', response);
            if(callback && typeof callback === "function"){
                var code = response.result ;
                callback(code , response);
            }
        }).fail(function (jqXHR, textStatus, errorThrown){
            L.Logger.error("[tk-sdk]deleteFile fail[ jqXHR , textStatus , errorThrown ]:", jqXHR , textStatus , errorThrown );
            callback(ERR_HTTP_REQUEST_FAILED,undefined);
        });


      /*  sendRequest("POST",url,true,deleteFileParams,function() {
             if (xmlhttp.readyState != 4)
             return;

             if (xmlhttp.status == 200)
             {
                 var response_json = JSON.parse(xmlhttp.responseText);
                 L.Logger.info('[tk-sdk]deleteFile resp = ', response_json);
                 var nRet = response_json.result;
                 if(callback && typeof callback === "function"){
                     callback(nRet, response_json);
                 }
             }
             else
             {
                 L.Logger.error('[tk-sdk]deleteFile fail[readyState-status]:' , xmlhttp.readyState , xmlhttp.status ) ;
                 if(callback && typeof callback === "function") {
                     callback(ERR_HTTP_REQUEST_FAILED, undefined);
                 }
             }
         });*/
    };

    that.setIsGetRtcStatsrObserver = function (isGetRtcStatsrObserver) {
        _isGetRtcStatsrObserver = isGetRtcStatsrObserver ;
    };

    that.setRtcStatsrObserverTimer = function (rtcStatsrObserverIntervalTime) {
        _rtcStatsrObserverIntervalTime = rtcStatsrObserverIntervalTime ;
    };

    that.stopIntervalRtcStatsrObserver = function () {
        clearInterval(that._rtcStatsrObserverTimer);
        that._rtcStatsrObserverTimer = null ;
    };

    that.startIntervalRtcStatsrObserver = function () {
        clearInterval(that._rtcStatsrObserverTimer);
        that._rtcStatsrObserverTimer = setInterval( function () {
            for(var key in that.remoteStreams){
                var stream = that.remoteStreams[key] ;
                if(stream && stream.pc){
                    that.rtcStatsrObserver(stream);
                }
            }
        } , _rtcStatsrObserverIntervalTime)
    };

    that.stopIntervalRtcStatsrObserverByStream = function (stream) {
        if(!stream){L.Logger.error('[tk-sdk]stream is not exist!');return ;}
        clearInterval(stream.rtcStatsrObserverTimer);
        stream.rtcStatsrObserverTimer = null ;
    };

    that.startIntervalRtcStatsrObserverByStream = function(stream ,  rtcStatsrObserverByStreamIntervalTime ){
        rtcStatsrObserverByStreamIntervalTime = rtcStatsrObserverByStreamIntervalTime ||  _rtcStatsrObserverIntervalTime ;
        if(!stream){L.Logger.error('[tk-sdk]stream is not exist!');return ;}
        clearInterval(stream.rtcStatsrObserverTimer);
        stream.rtcStatsrObserverTimer = setInterval( function () {
            if(stream && stream.pc){
                that.rtcStatsrObserver(stream);
            }
        } , rtcStatsrObserverByStreamIntervalTime)
    };

    /*pc链路状态*/
    that.rtcStatsrObserver = function (stream) {
        if( !stream ){L.Logger.error('[tk-sdk]stream is not exist!'); return ;};
        if( stream.extensionId === _myself.id && that.localStreams[stream.getID()] ){
            stream = _default_stream ;
        }
        if( !stream.pc ){L.Logger.error('[tk-sdk]stream.pc is not exist , stream id and extensionId:'+stream.getID() +','+stream.extensionId+'!'); return ;};
        if(stream && stream.pc){
            if(!stream.pc.getStats){
                var error = 'pc.getStats is not exist!' ;
                L.Logger.error('[tk-sdk]'+error);
                clearTimeout( that._rtcStatsrObserverTimer );
                clearTimeout( stream.rtcStatsrObserverTimer );
                var evt = TK.StreamEvent({type: 'stream-rtcStats-failed', stream: stream  , message:{error:error} });
                that.dispatchEvent(evt);
                return ;
            }else{
                stream.pc.getStats(null).then(function(stats){
                    var streamNetworkStatusInfo = _rtcStatsrObserver(stream , stats);
                    if(streamNetworkStatusInfo){
                        stream.networkStatus = streamNetworkStatusInfo ;
                        // L.Logger.info('[tk-sdk]stream-rtcStats info:'+JSON.stringify(streamNetworkStatusInfo) + ',by stream id is '+ stream.getID() );00
                        var evt = TK.StreamEvent({type: 'stream-rtcStats', stream: stream  , message:{networkStatus:streamNetworkStatusInfo} });
                        that.dispatchEvent(evt);
                    }else{
                        that.rtcStatsrObserver(stream);
                    }
                });
            }
        }
    };

    that.initBroadcast = function (url, bitrate, key_sec, sampleRates, speakers) {
        tknative.postMessage({command: "setBroadcast", isNeed: true, url: url, bitrate: Number(bitrate), key_sec: Number(key_sec), sampleRates: Number(sampleRates), speakers: Number(speakers)});
    };

    that.startBroadcast = function () {
        tknative.postMessage({command: "startBroadcast"});
    };

    that.stopBroadcast = function () {
        tknative.postMessage({command: "stopBroadcast"});
    };


    function ipAndStationaryStrWitch_send( sdpInfo){ /*send ice ip转换工具*/
        if(!_isIpFalsification){
            return sdpInfo ;
        }
        var hostname = "254.254.254.254" ;
        if(sdpInfo.type === 'offer' || sdpInfo.type === 'candidate' ){
            var ipStr =  JSON.stringify(sdpInfo) ;
            var ipFormat = /(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))/g ;
            if( ipFormat.test(ipStr) ){
                sdpInfo =  JSON.parse(  ipStr.replace(ipFormat,hostname) ) ;
            }
        }
        return sdpInfo ;
    } ;

    function ipAndStationaryStrWitchSDP_recv(sdpInfo){ /*recv ice ip转换工具*/
        if(!_isIpFalsification){
            return sdpInfo ;
        }
        if(sdpInfo.type === 'answer'){
            var ipStr =  JSON.stringify(sdpInfo) ;
            var hostname = _ipFalsification ;
            var ipFormat = /(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))/g ;
            if( ipFormat.test(ipStr) ){
                sdpInfo =   JSON.parse(  ipStr.replace(ipFormat,hostname)  );
            }
        }
        return sdpInfo ;
    } ;
    
    function _rtcStatsrObserver( stream , stats ) {
        var isFrist = false , bit = 0 , kbps = 0  ,  bytesSent = 0 ,  packetsSent = 0  ,
            frameRate = 0 , framesSent = 0, framesReceived = 0 ,isRemote   ,frameWidth = 0 , frameHeight = 0,
            nackCount = 0 , timestamp = 0 , frameRatio = { frameWidth:0 , frameHeight:0 }   , packetsLost = 0 ,
            packetsLostNumber = 0, bytesReceived = 0, packetsReceived = 0, currentRoundTripTime = 0 ; //带宽
        isRemote = ( stream.getID() !== _default_stream.getID() )  ;
        stats.forEach(function (report , index) {
            if(report.type === 'outbound-rtp' &&  report.mediaType === 'video'){
                timestamp = report.timestamp ;
                packetsSent = report.packetsSent;
                bytesSent = report.bytesSent ;
                nackCount = report.nackCount ;
            }
            if( report.type === 'inbound-rtp' &&  report.mediaType === 'video' ){
                timestamp = report.timestamp ;
                packetsReceived=  report.packetsReceived ;
                bytesReceived=  report.bytesReceived ;
                packetsLostNumber=  report.packetsLost ;
            }
            if( report.type === 'track' &&  report.kind === 'video' ){
                timestamp = report.timestamp ;
                frameWidth = report.frameWidth ;
                frameHeight = report.frameHeight ;
                framesSent = report.framesSent ;
                framesReceived = report.framesReceived ;
            }
            if( report.type === 'candidate-pair'){
                timestamp = report.timestamp ;
                currentRoundTripTime =  report.currentRoundTripTime ;
            }
        });
        if(!stream.report){stream.report =  {};isFrist = true ;}
        stream.report.timestamp = stream.report.timestamp || timestamp ;
        if(isRemote){
            stream.report.bytesReceived = stream.report.bytesReceived || bytesReceived ;
            stream.report.framesReceived = stream.report.framesReceived || framesReceived ;
        }else{
            stream.report.bytesSent = stream.report.bytesSent || bytesSent ;
            stream.report.framesSent = stream.report.framesSent || framesSent ;
        }
        if(isFrist){return undefined;};
        if(isRemote){
            bit = (bytesReceived - stream.report.bytesReceived) * 8  ;
            frameRate = ( framesReceived - stream.report.framesReceived ) /  ( (timestamp - stream.report.timestamp) / 1000 ) ;
            packetsLost = packetsReceived ? packetsLostNumber /  packetsReceived : 0 ;
        }else{
            bit = (bytesSent - stream.report.bytesSent) * 8  ;
            frameRate = ( framesSent - stream.report.framesSent ) /  ( (timestamp - stream.report.timestamp) / 1000 ) ;
            packetsLost = packetsSent ?  nackCount / packetsSent : 0 ;
        }
        kbps = bit / ( (timestamp - stream.report.timestamp) / 1000) / 1024 ;
        frameRatio.frameWidth =   !isNaN(frameWidth) ? frameWidth  : 0;
        frameRatio.frameHeight =  !isNaN(frameHeight) ?  frameHeight : 0;
        stream.report.timestamp = timestamp   ;
        if(isRemote){
            stream.report.bytesReceived = bytesReceived  ;
            stream.report.framesReceived = framesReceived  ;
        }else{
            stream.report.bytesSent = bytesSent ;
            stream.report.framesSent = framesSent ;
        }
        var networkStatus = {
            kbps: !isNaN(kbps) ? Math.round( kbps ) : 0  , //带宽
            frameRatio:frameRatio , //分辨率
            frameRate: !isNaN(frameRate) ? Math.round( frameRate ) : 0 , //帧率
            packetsLost: !isNaN(packetsLost) ?  Math.ceil(packetsLost * 100 ) : 0 , //丢包率(%)
            rtt: !isNaN(currentRoundTripTime) ?  Math.round( currentRoundTripTime  * 1000 ) : 0 , //延时
        };
        return networkStatus ;
    }
    return that;
};
/*global L, document*/
'use strict';
/*
 * Class Stream represents a local or a remote Stream in the Room. It will handle the WebRTC stream
 * and identify the stream and where it should be drawn.
 */
var TK = TK || {};

TK.PUBLISH_STATE_NONE = 0; //下台
TK.PUBLISH_STATE_AUDIOONLY = 1; //只发布音频
TK.PUBLISH_STATE_VIDEOONLY = 2; //只发布视频
TK.PUBLISH_STATE_BOTH = 3; //音视频都发布
TK.PUBLISH_STATE_MUTEALL = 4; //音视频都关闭
TK.RoomUser = function (userinfo) {

    if (userinfo == undefined || userinfo.properties === undefined) {
        L.Logger.warning('[tk-sdk]Invalidate user info', id, properties);
        return undefined;
    }

    var id = userinfo.id;
    var properties = userinfo.properties;
    L.Logger.debug('[tk-sdk]RoomUser', id, properties);

    var that={};
    that.id = id;
    that.watchStatus = 0;//0 idel 1 sdp 2 ice 3 streaming 4 canceling  

    for (var key in properties) {
        if (key != 'id' && key != 'watchStatus')
            that[key]=properties[key];
    }

    that.publishstate = that.publishstate || TK.PUBLISH_STATE_NONE;
    return that;
};
/*global document, console*/
'use strict';
var L = L || {};
var TK = TK || {} ;
/*
 * API to write logs based on traditional logging mechanisms: debug, trace, info, warning, error
 */
L.Logger = (function (L) {
    var DEBUG = 0,
        TRACE = 1,
        INFO = 2,
        WARNING = 3,
        ERROR = 4,
        NONE = 5,
        enableLogPanel,
        setLogLevel,
        setOutputFunction,
        setLogPrefix,
        outputFunction,
        logPrefix = '',
        print,
        debug,
        trace,
        info,
        log,
        warning,
        error , 
		setLogDevelopment,
		developmentEnvironment = false;

    // By calling this method we will not use console.log to print the logs anymore.
    // Instead we will use a <textarea/> element to write down future logs
    enableLogPanel = function () {
        L.Logger.panel = document.createElement('textarea');
        L.Logger.panel.setAttribute('id', 'licode-logs');
        L.Logger.panel.setAttribute('style', 'width: 100%; height: 100%; display: none');
        L.Logger.panel.setAttribute('rows', 20);
        L.Logger.panel.setAttribute('cols', 20);
        L.Logger.panel.setAttribute('readOnly', true);
        document.body.appendChild(L.Logger.panel);
    };

    // It sets the new log level. We can set it to NONE if we do not want to print logs
    setLogLevel = function (level) {
        if (level > L.Logger.NONE) {
            level = L.Logger.NONE;
        } else if (level < L.Logger.DEBUG) {
            level = L.Logger.DEBUG;
        }
        L.Logger.logLevel = level;
    };
	
	setLogDevelopment = function(isDevelopmentEnvironment){
		developmentEnvironment = isDevelopmentEnvironment ;
	};
	
    outputFunction = function (args , level) {
        try{
            switch (level){
                case L.Logger.DEBUG:
                    developmentEnvironment ? console.warn.apply(console, args) : console.debug.apply(console, args)  ;
                    break;
                case L.Logger.TRACE:
                    console.trace.apply(console, args);
                    break;
                case L.Logger.INFO:
                    developmentEnvironment ? console.warn.apply(console, args) :  console.info.apply(console, args);
                    break;
                case L.Logger.WARNING:
                    console.warn.apply(console, args);
                    break;
                case L.Logger.ERROR:
                    console.error.apply(console, args);
                    break;
                case L.Logger.NONE:
					console.warn("log level is none!");
                    break;
                default:
                    developmentEnvironment ? console.warn.apply(console, args) : console.log.apply(console, args);
                    break;
            }
        }catch (e){
            console.log.apply(console, args);
        }
    };

    setOutputFunction = function (newOutputFunction) {
        outputFunction = newOutputFunction;
    };

    setLogPrefix = function (newLogPrefix) {
        logPrefix = newLogPrefix;
    };

    // Generic function to print logs for a given level:
    //  L.Logger.[DEBUG, TRACE, INFO, WARNING, ERROR]
    print = function (level) {
        var out = logPrefix;
        if (level < L.Logger.logLevel) {
            return;
        }
        if (level === L.Logger.DEBUG) {
            out = out + 'DEBUG('+new Date().toLocaleString()+')';
        } else if (level === L.Logger.TRACE) {
            out = out + 'TRACE('+new Date().toLocaleString()+')';
        } else if (level === L.Logger.INFO) {
            out = out + 'INFO('+new Date().toLocaleString()+')';
        } else if (level === L.Logger.WARNING) {
            out = out + 'WARNING('+new Date().toLocaleString()+')';
        } else if (level === L.Logger.ERROR) {
            out = out + 'ERROR('+new Date().toLocaleString()+')';
        }
        out = out + ':';
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args[i] = arguments[i];
        }
        var tempArgs = args.slice(1);
        args = [out].concat(tempArgs);
        if (L.Logger.panel !== undefined) {
            var tmp = '';
            for (var idx = 0; idx < args.length; idx++) {
                tmp = tmp + args[idx];
            }
            L.Logger.panel.value = L.Logger.panel.value + '\n' + tmp;
        } else {
            outputFunction.apply(L.Logger, [args , level] );
        }
    };

    // It prints debug logs
    debug = function () {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args[i] = arguments[i];
        }
        L.Logger.print.apply(L.Logger,[L.Logger.DEBUG].concat(args));
    };

    // It prints trace logs
    trace = function () {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args[i] = arguments[i];
        }
        L.Logger.print.apply(L.Logger,[L.Logger.TRACE].concat(args));
    };

    // It prints info logs
    info = function () {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args[i] = arguments[i];
        }
        L.Logger.print.apply(L.Logger,[L.Logger.INFO].concat(args));
    };

    // It prints warning logs
    warning = function () {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args[i] = arguments[i];
        }
        L.Logger.print.apply(L.Logger,[L.Logger.WARNING].concat(args));
    };

    // It prints error logs
    error = function () {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args[i] = arguments[i];
        }
        L.Logger.print.apply(L.Logger,[L.Logger.ERROR].concat(args));
    };

    return {
        DEBUG: DEBUG,
        TRACE: TRACE,
        INFO: INFO,
        WARNING: WARNING,
        ERROR: ERROR,
        NONE: NONE,
		setLogDevelopment:setLogDevelopment , 
        enableLogPanel: enableLogPanel,
        setLogLevel: setLogLevel,
        setOutputFunction: setOutputFunction,
        setLogPrefix: setLogPrefix,
        print:print ,
        debug: debug,
        trace: trace,
        info: info,
        warning: warning,
        error: error 
    };
}(L));

/*设置日志输出,通过配置项*/
TK.tkLogPrintConfig =  function (socketLogConfig , loggerConfig , adpConfig ) {
    loggerConfig = loggerConfig || {} ;
    socketLogConfig = socketLogConfig || {} ;
    adpConfig = adpConfig || {} ;
    var development = loggerConfig.development != undefined  ? loggerConfig.development : true;
    var logLevel =  loggerConfig.logLevel  != undefined  ? loggerConfig.logLevel  : 0;
    var debug = socketLogConfig.debug != undefined  ? socketLogConfig.debug  : true ;
    var webrtcLogDebug =  adpConfig.webrtcLogDebug!= undefined  ? adpConfig.webrtcLogDebug : true ;
    L.Logger.setLogDevelopment(development);
    L.Logger.setLogLevel(logLevel);
    if(window.localStorage){
        var debugStr =  debug ? '*' : 'none'
        window.localStorage.setItem('debug' ,debugStr );
    }
    window.webrtcLogDebug = webrtcLogDebug;
};/* global unescape */
'use strict';
var L = L || {};
L.Base64 = (function () {
    var END_OF_INPUT,
        base64Chars,
        reverseBase64Chars,
        base64Str,
        base64Count,
        i,
        setBase64Str,
        readBase64,
        encodeBase64,
        readReverseBase64,
        ntos,
        decodeBase64;

    END_OF_INPUT = -1;

    base64Chars = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
        'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
        'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
        'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
        'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
        'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
        'w', 'x', 'y', 'z', '0', '1', '2', '3',
        '4', '5', '6', '7', '8', '9', '+', '/'
    ];

    reverseBase64Chars = [];

    for (i = 0; i < base64Chars.length; i = i + 1) {
        reverseBase64Chars[base64Chars[i]] = i;
    }

    setBase64Str = function (str) {
        base64Str = str;
        base64Count = 0;
    };

    readBase64 = function () {
        var c;
        if (!base64Str) {
            return END_OF_INPUT;
        }
        if (base64Count >= base64Str.length) {
            return END_OF_INPUT;
        }
        c = base64Str.charCodeAt(base64Count) & 0xff;
        base64Count = base64Count + 1;
        return c;
    };

    encodeBase64 = function (str) {
        var result, inBuffer, lineCount, done;
        setBase64Str(str);
        result = '';
        inBuffer = new Array(3);
        lineCount = 0;
        done = false;
        while (!done && (inBuffer[0] = readBase64()) !== END_OF_INPUT) {
            inBuffer[1] = readBase64();
            inBuffer[2] = readBase64();
            result = result + (base64Chars[inBuffer[0] >> 2]);
            if (inBuffer[1] !== END_OF_INPUT) {
                result = result + (base64Chars [((inBuffer[0] << 4) & 0x30) | (inBuffer[1] >> 4)]);
                if (inBuffer[2] !== END_OF_INPUT) {
                    result = result +
                              (base64Chars [((inBuffer[1] << 2) & 0x3c) | (inBuffer[2] >> 6)]);
                    result = result + (base64Chars[inBuffer[2] & 0x3F]);
                } else {
                    result = result + (base64Chars[((inBuffer[1] << 2) & 0x3c)]);
                    result = result + ('=');
                    done = true;
                }
            } else {
                result = result + (base64Chars[((inBuffer[0] << 4) & 0x30)]);
                result = result + ('=');
                result = result + ('=');
                done = true;
            }
            lineCount = lineCount + 4;
            if (lineCount >= 76) {
                result = result + ('\n');
                lineCount = 0;
            }
        }
        return result;
    };

    readReverseBase64 = function () {
        if (!base64Str) {
            return END_OF_INPUT;
        }
        while (true) {
            if (base64Count >= base64Str.length) {
                return END_OF_INPUT;
            }
            var nextCharacter = base64Str.charAt(base64Count);
            base64Count = base64Count + 1;
            if (reverseBase64Chars[nextCharacter]) {
                return reverseBase64Chars[nextCharacter];
            }
            if (nextCharacter === 'A') {
                return 0;
            }
        }
    };

    ntos = function (n) {
        n = n.toString(16);
        if (n.length === 1) {
            n = '0' + n;
        }
        n = '%' + n;
        return unescape(n);
    };

    decodeBase64 = function (str) {
        var result, inBuffer, done;
        setBase64Str(str);
        result = '';
        inBuffer = new Array(4);
        done = false;
        while (!done &&
              (inBuffer[0] = readReverseBase64()) !== END_OF_INPUT &&
              (inBuffer[1] = readReverseBase64()) !== END_OF_INPUT) {
            inBuffer[2] = readReverseBase64();
            inBuffer[3] = readReverseBase64();
            result = result + ntos((((inBuffer[0] << 2) & 0xff)| inBuffer[1] >> 4));
            if (inBuffer[2] !== END_OF_INPUT) {
                result +=  ntos((((inBuffer[1] << 4) & 0xff) | inBuffer[2] >> 2));
                if (inBuffer[3] !== END_OF_INPUT) {
                    result = result +  ntos((((inBuffer[2] << 6)  & 0xff) | inBuffer[3]));
                } else {
                    done = true;
                }
            } else {
                done = true;
            }
        }
        return result;
    };

    return {
        encodeBase64: encodeBase64,
        decodeBase64: decodeBase64
    };
}(L));
/* globals $$, Elements */
'use strict';
/**
 * Copyright 2013 Marc J. Schmidt. See the LICENSE file at the top-level
 * directory of this distribution and at
 * https://github.com/marcj/css-element-queries/blob/master/LICENSE.
 */
(function() {

    this.L = this.L || {};
    var L = this.L;

    /**
     *
     * @type {Function}
     * @constructor
     */
    L.ElementQueries = function() {
        /**
         *
         * @param element
         * @returns {Number}
         */
        function getEmSize(element) {
            if (!element) {
                element = document.documentElement;
            }
            var fontSize = getComputedStyle(element, 'fontSize');
            return parseFloat(fontSize) || 16;
        }

        /**
         *
         * @copyright https://github.com/Mr0grog/element-query/blob/master/LICENSE
         *
         * @param element
         * @param value
         * @param units
         * @returns {*}
         */
        function convertToPx(element, value) {
            var units = value.replace(/[0-9]*/, '');
            value = parseFloat(value);
            switch (units) {
                case 'px':
                    return value;
                case 'em':
                    return value * getEmSize(element);
                case 'rem':
                    return value * getEmSize();
                // Viewport units!
                // According to http://quirksmode.org/mobile/tableViewport.html
                // documentElement.clientWidth/Height gets us the most reliable info
                case 'vw':
                    return value * document.documentElement.clientWidth / 100;
                case 'vh':
                    return value * document.documentElement.clientHeight / 100;
                case 'vmin':
                case 'vmax':
                    var vw = document.documentElement.clientWidth / 100;
                    var vh = document.documentElement.clientHeight / 100;
                    var chooser = Math[units === 'vmin' ? 'min' : 'max'];
                    return value * chooser(vw, vh);
                default:
                    return value;
                // for now, not supporting physical units (since they are just a set number of px)
                // or ex/ch (getting accurate measurements is hard)
            }
        }

        /**
         *
         * @param {HTMLElement} element
         * @constructor
         */
        function SetupInformation(element) {
            this.element = element;
            this.options = [];
            var i,
                j,
                option,
                width = 0,
                height = 0,
                value,
                actualValue,
                attrValues,
                attrValue,
                attrName;

            /**
             * @param option {mode: 'min|max', property: 'width|height', value: '123px'}
             */
            this.addOption = function(option) {
                this.options.push(option);
            };

            var attributes = ['min-width', 'min-height', 'max-width', 'max-height'];

            /**
             * Extracts the computed width/height and sets to min/max- attribute.
             */
            this.call = function() {
                // extract current dimensions
                width = this.element.offsetWidth;
                height = this.element.offsetHeight;

                attrValues = {};

                for (i = 0, j = this.options.length; i < j; i++) {
                    option = this.options[i];
                    value = convertToPx(this.element, option.value);

                    actualValue = option.property === 'width' ? width : height;
                    attrName = option.mode + '-' + option.property;
                    attrValue = '';

                    if (option.mode === 'min' && actualValue >= value) {
                        attrValue += option.value;
                    }

                    if (option.mode === 'max' && actualValue <= value) {
                        attrValue += option.value;
                    }

                    if (!attrValues[attrName]) attrValues[attrName] = '';
                    if (attrValue && -1 === (' '+attrValues[attrName]+' ')
                                              .indexOf(' ' + attrValue + ' ')) {
                        attrValues[attrName] += ' ' + attrValue;
                    }
                }

                for (var k in attributes) {
                    if (attrValues[attributes[k]]) {
                        this.element.setAttribute(attributes[k],
                                                  attrValues[attributes[k]].substr(1));
                    } else {
                        this.element.removeAttribute(attributes[k]);
                    }
                }
            };
        }

        /**
         * @param {HTMLElement} element
         * @param {Object}      options
         */
        function setupElement(element, options) {
            if (element.elementQueriesSetupInformation) {
                element.elementQueriesSetupInformation.addOption(options);
            } else {
                element.elementQueriesSetupInformation = new SetupInformation(element);
                element.elementQueriesSetupInformation.addOption(options);
                new L.ResizeSensor(element, function() {
                    element.elementQueriesSetupInformation.call();
                });
            }
            element.elementQueriesSetupInformation.call();
        }

        /**
         * @param {String} selector
         * @param {String} mode min|max
         * @param {String} property width|height
         * @param {String} value
         */
        function queueQuery(selector, mode, property, value) {
            var query;
            if (document.querySelectorAll) query = document.querySelectorAll.bind(document);
            if (!query && 'undefined' !== typeof $$) query = $$;
            if (!query && 'undefined' !== typeof jQuery) query = jQuery;

            if (!query) {
                throw 'No document.querySelectorAll, jQuery or Mootools\'s $$ found.';
            }

            var elements = query(selector);
            for (var i = 0, j = elements.length; i < j; i++) {
                setupElement(elements[i], {
                    mode: mode,
                    property: property,
                    value: value
                });
            }
        }

        var regex = /,?([^,\n]*)\[[\s\t]*(min|max)-(width|height)[\s\t]*[~$\^]?=[\s\t]*"([^"]*)"[\s\t]*]([^\n\s\{]*)/mgi;  // jshint ignore:line

        /**
         * @param {String} css
         */
        function extractQuery(css) {
            var match;
            css = css.replace(/'/g, '"');
            while (null !== (match = regex.exec(css))) {
                if (5 < match.length) {
                    queueQuery(match[1] || match[5], match[2], match[3], match[4]);
                }
            }
        }

        /**
         * @param {CssRule[]|String} rules
         */
        function readRules(rules) {
            var selector = '';
            if (!rules) {
                return;
            }
            if ('string' === typeof rules) {
                rules = rules.toLowerCase();
                if (-1 !== rules.indexOf('min-width') || -1 !== rules.indexOf('max-width')) {
                    extractQuery(rules);
                }
            } else {
                for (var i = 0, j = rules.length; i < j; i++) {
                    if (1 === rules[i].type) {
                        selector = rules[i].selectorText || rules[i].cssText;
                        if (-1 !== selector.indexOf('min-height') ||
                            -1 !== selector.indexOf('max-height')) {
                            extractQuery(selector);
                        } else if (-1 !== selector.indexOf('min-width') ||
                                   -1 !== selector.indexOf('max-width')) {
                            extractQuery(selector);
                        }
                    } else if (4 === rules[i].type) {
                        readRules(rules[i].cssRules || rules[i].rules);
                    }
                }
            }
        }

        /**
         * Searches all css rules and setups the event listener
         * to all elements with element query rules..
         */
        this.init = function() {
            for (var i = 0, j = document.styleSheets.length; i < j; i++) {
                readRules(document.styleSheets[i].cssText ||
                          document.styleSheets[i].cssRules ||
                          document.styleSheets[i].rules);
            }
        };
    };

    function init() {
        (new L.ElementQueries()).init();
    }

    if (window.addEventListener) {
        window.addEventListener('load', init, false);
    } else {
        window.attachEvent('onload', init);
    }

    // Only used for the dirty checking, so the event callback count is limted
    //  to max 1 call per fps per sensor.
    // In combination with the event based resize sensor this saves cpu time,
    // because the sensor is too fast and
    // would generate too many unnecessary events.
    var requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function (fn) {
            return window.setTimeout(fn, 20);
        };

    /**
     * Iterate over each of the provided element(s).
     *
     * @param {HTMLElement|HTMLElement[]} elements
     * @param {Function}                  callback
     */
    function forEachElement(elements, callback){
        var elementsType = Object.prototype.toString.call(elements);
        var isCollectionTyped = ('[object Array]' === elementsType ||
            ('[object NodeList]' === elementsType) ||
            ('[object HTMLCollection]' === elementsType) ||
            ('undefined' !== typeof jQuery && elements instanceof jQuery) || //jquery
            ('undefined' !== typeof Elements && elements instanceof Elements) //mootools
        );
        var i = 0, j = elements.length;
        if (isCollectionTyped) {
            for (; i < j; i++) {
                callback(elements[i]);
            }
        } else {
            callback(elements);
        }
    }
    /**
     * Class for dimension change detection.
     *
     * @param {Element|Element[]|Elements|jQuery} element
     * @param {Function} callback
     *
     * @constructor
     */
    L.ResizeSensor = function(element, callback) {
        /**
         *
         * @constructor
         */
        function EventQueue() {
            var q = [];
            this.add = function(ev) {
                q.push(ev);
            };

            var i, j;
            this.call = function() {
                for (i = 0, j = q.length; i < j; i++) {
                    q[i].call();
                }
            };

            this.remove = function(ev) {
                var newQueue = [];
                for(i = 0, j = q.length; i < j; i++) {
                    if(q[i] !== ev) newQueue.push(q[i]);
                }
                q = newQueue;
            };

            this.length = function() {
                return q.length;
            };
        }

        /**
         * @param {HTMLElement} element
         * @param {String}      prop
         * @returns {String|Number}
         */
        function getComputedStyle(element, prop) {
            if (element.currentStyle) {
                return element.currentStyle[prop];
            } else if (window.getComputedStyle) {
                return window.getComputedStyle(element, null).getPropertyValue(prop);
            } else {
                return element.style[prop];
            }
        }

        /**
         *
         * @param {HTMLElement} element
         * @param {Function}    resized
         */
        function attachResizeEvent(element, resized) {
            if (!element.resizedAttached) {
                element.resizedAttached = new EventQueue();
                element.resizedAttached.add(resized);
            } else if (element.resizedAttached) {
                element.resizedAttached.add(resized);
                return;
            }

            element.resizeSensor = document.createElement('div');
            element.resizeSensor.className = 'resize-sensor';
            var style = 'position: absolute; left: 0; top: 0; right: 0; bottom: 0; ' +
                        'overflow: hidden; z-index: -1; visibility: hidden;';
            var styleChild = 'position: absolute; left: 0; top: 0; transition: 0s;';

            element.resizeSensor.style.cssText = style;
            element.resizeSensor.innerHTML =
                '<div class="resize-sensor-expand" style="' + style + '">' +
                    '<div style="' + styleChild + '"></div>' +
                '</div>' +
                '<div class="resize-sensor-shrink" style="' + style + '">' +
                    '<div style="' + styleChild + ' width: 200%; height: 200%"></div>' +
                '</div>';
            element.appendChild(element.resizeSensor);

            if (getComputedStyle(element, 'position') === 'static') {
                element.style.position = 'relative';
            }

            var expand = element.resizeSensor.childNodes[0];
            var expandChild = expand.childNodes[0];
            var shrink = element.resizeSensor.childNodes[1];

            var reset = function() {
                expandChild.style.width  = 100000 + 'px';
                expandChild.style.height = 100000 + 'px';

                expand.scrollLeft = 100000;
                expand.scrollTop = 100000;

                shrink.scrollLeft = 100000;
                shrink.scrollTop = 100000;
            };

            reset();
            var dirty = false;

            var dirtyChecking = function() {
                if (!element.resizedAttached) return;

                if (dirty) {
                    element.resizedAttached.call();
                    dirty = false;
                }

                requestAnimationFrame(dirtyChecking);
            };

            requestAnimationFrame(dirtyChecking);
            var lastWidth, lastHeight;
            var cachedWidth, cachedHeight; //useful to not query offsetWidth twice

            var onScroll = function() {
              if ((cachedWidth = element.offsetWidth) !== lastWidth ||
                  (cachedHeight = element.offsetHeight) !== lastHeight) {
                  dirty = true;

                  lastWidth = cachedWidth;
                  lastHeight = cachedHeight;
              }
              reset();
            };

            var addEvent = function(el, name, cb) {
                if (el.attachEvent) {
                    el.attachEvent('on' + name, cb);
                } else {
                    el.addEventListener(name, cb);
                }
            };

            addEvent(expand, 'scroll', onScroll);
            addEvent(shrink, 'scroll', onScroll);
        }

        forEachElement(element, function(elem){
            attachResizeEvent(elem, callback);
        });

        this.detach = function(ev) {
            L.ResizeSensor.detach(element, ev);
        };
    };

    L.ResizeSensor.detach = function(element, ev) {
        forEachElement(element, function(elem){
            if(elem.resizedAttached && typeof ev === 'function'){
                elem.resizedAttached.remove(ev);
                if(elem.resizedAttached.length()) return;
            }
            if (elem.resizeSensor) {
                if (elem.contains(elem.resizeSensor)) {
                    elem.removeChild(elem.resizeSensor);
                }
                delete elem.resizeSensor;
                delete elem.resizedAttached;
            }
        });
    };


})();
'use strict';
/*
 * View class represents a HTML component
 * Every view is an EventDispatcher.
 */
var TK = TK || {};
TK.View = function () {
    var that = TK.EventDispatcher({});

    // Variables

    // URL where it will look for icons and assets
    that.url = '';
    return that;
};
/*global window, document, L, webkitURL*/
'use strict';
/*
 * VideoPlayer represents a Talk video component that shows either a local or a remote video.
 * Ex.: var player = VideoPlayer({id: id, stream: stream, elementID: elementID});
 * A VideoPlayer is also a View component.
 */
var TK = TK || {};
TK.VideoPlayer = function (spec) {
	spec.options.bar = spec.options.bar != undefined?spec.options.bar:false ;  
	if(!spec.stream.stream){L.Logger.warning('[tk-sdk]VideoPlayer: media stream  is not exist!');} ;
    var that = TK.View({}),
        onmouseover,
        onmouseout;

    // Variables

    // VideoPlayer ID
    that.id = spec.id;

    // Stream that the VideoPlayer will play
    that.stream = spec.stream.stream;

    // DOM element in which the VideoPlayer will be appended
    that.elementID = spec.elementID;

    // Private functions
    onmouseover = function () {
        that.bar.display();
    };

    onmouseout = function () {
        that.bar.hide();
    };

    // Public functions

    // It will stop the VideoPlayer and remove it from the HTML
    that.destroy = function () {
        that.video.pause();
        delete that.resizer;
        that.parentNode.removeChild(that.div);
    };

    that.resize = function () {
        var width = that.container.offsetWidth,
            height = that.container.offsetHeight;

        if (spec.stream.screen || spec.options.crop === false) {

            if (width * (9 / 16) < height) {

                that.video.style.width = width + 'px';
                that.video.style.height = (9 / 16) * width + 'px';

                that.video.style.top = -((9 / 16) * width / 2 - height / 2) + 'px';
                that.video.style.left = '0px';

            } else {

                that.video.style.height = height + 'px';
                that.video.style.width = (16 / 9) * height + 'px';

                that.video.style.left = -((16 / 9) * height / 2 - width / 2) + 'px';
                that.video.style.top = '0px';

            }
        } else {
            if (width !== that.containerWidth || height !== that.containerHeight) {

                if (width * (3 / 4) > height) {

                    that.video.style.width = width + 'px';
                    that.video.style.height = (3 / 4) * width + 'px';

                    that.video.style.top = -((3 / 4) * width / 2 - height / 2) + 'px';
                    that.video.style.left = '0px';

                } else {

                    that.video.style.height = height + 'px';
                    that.video.style.width = (4 / 3) * height + 'px';

                    that.video.style.left = -((4 / 3) * height / 2 - width / 2) + 'px';
                    that.video.style.top = '0px';

                }
            }
        }

        that.containerWidth = width;
        that.containerHeight = height;

    };

    /*window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        document.getElementById(key).value = unescape(value);
    });*/
    if(that.stream && typeof that.stream === "object" && that.stream.playbackquUrl  ){ //如果是回放，则取回放地址
        L.Logger.debug('[tk-sdk]Creating palyback URL from stream ' + that.stream);
        that.streamUrl = that.stream.playbackquUrl ;
    }else if(that.stream){
        L.Logger.debug('[tk-sdk]Creating URL from stream ' + that.stream);
        var myURL = window.URL || webkitURL;
        that.streamUrl = myURL.createObjectURL(that.stream);
    }


    // Container
    that.div = document.createElement('div');
    that.div.setAttribute('id', 'player_' + that.id);
    that.div.setAttribute('class', 'Talk_player');
    that.div.setAttribute('style', 'width: 100%; height: 100%; position: relative; ' +
                                   'background-color: black; overflow: hidden;');

    // Loader icon
    if (spec.options.loader !== false) {
	 //qiushao改:2017-07-26
     // that.loader = document.createElement('img');
	  that.loader = document.createElement('div');
      that.loader.setAttribute('id', 'back_' + that.id);
      that.loader.setAttribute('class', 'Talk_loader');
	 //qiushao改:2017-07-26
     // that.loader.setAttribute('src', that.url + '/assets/loader.gif');
    }

    // Video tag
    that.video = document.createElement('video');
    that.video.setAttribute('id', 'stream' + that.id);
    that.video.setAttribute('class', 'Talk_stream');
    that.video.setAttribute('style', 'width: 100%; height: 100%; position: absolute;background-color:#000;');
    that.video.setAttribute('autoplay', 'autoplay');
    that.showVideo = function () {
        if (that.video ) {
            that.video.style.display = 'block' ;
        }
    };
    that.hideVideo = function () {
        if (that.video ) {
            that.video.style.display = 'none' ;
        }
    };
    if(spec.stream.local)
        that.video.volume = 0;
    if (that.elementID !== undefined) {
        // Check for a passed DOM node.
        if (typeof that.elementID === 'object' &&
          typeof that.elementID.appendChild === 'function') {
            that.container = that.elementID;
        }
        else {
            that.container = document.getElementById(that.elementID);
        }
    } else {
        that.container = document.body;
    }
    that.container.appendChild(that.div);

    that.parentNode = that.div.parentNode;

    if (that.loader) {
      that.div.appendChild(that.loader);
    }

    // teacher
    // that.video_img = document.createElement('div');
    // that.video_img.className = 'igogo_img_video';

    // that.video_img_2 = document.createElement('div');
    // that.video_img_2.className = 'igogo_img_video_two';


    // that.div.appendChild(that.video_img);
    // that.div.appendChild(that.video_img_2);
    that.div.appendChild(that.video);

    that.containerWidth = 0;
    that.containerHeight = 0;

    // if (spec.options.resizer !== false) {
    //   that.resizer = new L.ResizeSensor(that.container, that.resize);

    //   that.resize();
    // }

    // Bottom Bar
    if (spec.options.bar !== false) {
        that.bar = new TK.Bar({elementID: 'player_' + that.id,
                                  id: that.id,
                                  stream: spec.stream,
                                  media: that.video,
                                  options: spec.options});

        that.div.onmouseover = onmouseover;
        that.div.onmouseout = onmouseout;
    }
    else {
        // Expose a consistent object to manipulate the media.
        that.media = that.video;
    }

    if(that.streamUrl){
        that.video.src = that.streamUrl;
    }

    that.video.onloadedmetadata = function (event) {
        event = event || window.event ;
        that.loader.style.display = "none" ;
        that.div.style.backgroundColor = "transparent" ;
    };
    that.changeMediaStreamUrl = function(mediaStream){
        if(that.video && mediaStream){
            that.stream = mediaStream ;
            if(that.stream && typeof that.stream === "object" && that.stream.playbackquUrl  ){ //如果是回放，则取回放地址
                L.Logger.debug('[tk-sdk]Creating palyback URL from stream ' + that.stream);
                that.streamUrl = that.stream.playbackquUrl ;
            }else if(that.stream){
                L.Logger.debug('[tk-sdk]Creating URL from stream ' + that.stream);
                var myURL = window.URL || webkitURL;
                that.streamUrl = myURL.createObjectURL(that.stream);
            }
            if(that.streamUrl){
                that.video.src = that.streamUrl;
            }
        }
    };
    return that;
};
/*global window, document, L, webkitURL*/
'use strict';
/*
 * VideoPlayer represents a Talk video component that shows either a local or a remote video.
 * Ex.: var player = VideoPlayer({id: id, stream: stream, elementID: elementID});
 * A VideoPlayer is also a View component.
 */
var TK = TK || {};
TK.NativeVideoPlayer = function (spec) {
	spec.options.bar = spec.options.bar != undefined?spec.options.bar:false ;  
	if(!spec.stream.stream){L.Logger.warning('VideoPlayer: media stream  is not exist!');} ;
    var that = TK.View({}),
        onmouseover,
        onmouseout;

    // Variables

    // VideoPlayer ID
    that.id = spec.id;

    // Stream that the VideoPlayer will play
    that.stream = spec.stream.stream;

    // DOM element in which the VideoPlayer will be appended
    that.elementID = spec.elementID;

    // Private functions
    onmouseover = function () {
        that.bar.display();
    };

    onmouseout = function () {
        that.bar.hide();
    };

    // Public functions

    // It will stop the VideoPlayer and remove it from the HTML
    that.destroy = function () {
        //that.video.pause();
        //delete that.resizer;
        that.parentNode.removeChild(that.div);
    };

    that.resize = function () {
        var width = that.container.offsetWidth,
            height = that.container.offsetHeight;

        if (spec.stream.screen || spec.options.crop === false) {

            if (width * (9 / 16) < height) {

                that.video.style.width = width + 'px';
                that.video.style.height = (9 / 16) * width + 'px';

                that.video.style.top = -((9 / 16) * width / 2 - height / 2) + 'px';
                that.video.style.left = '0px';

            } else {

                that.video.style.height = height + 'px';
                that.video.style.width = (16 / 9) * height + 'px';

                that.video.style.left = -((16 / 9) * height / 2 - width / 2) + 'px';
                that.video.style.top = '0px';

            }
        } else {
            console.error(that.container.offsetWidth   , that.container.offsetHeight , spec.stream.screen , spec.options.crop  , that.containerWidth  ,  that.containerHeight);
            if (width !== that.containerWidth || height !== that.containerHeight) {

                if (width * (3 / 4) > height) {

                    that.video.style.width = width + 'px';
                    that.video.style.height = (3 / 4) * width + 'px';

                    that.video.style.top = -((3 / 4) * width / 2 - height / 2) + 'px';
                    that.video.style.left = '0px';

                } else {

                    that.video.style.height = height + 'px';
                    that.video.style.width = (4 / 3) * height + 'px';

                    that.video.style.left = -((4 / 3) * height / 2 - width / 2) + 'px';
                    that.video.style.top = '0px';

                }
            }
        }

        that.containerWidth = width;
        that.containerHeight = height;

    };

    /*window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        document.getElementById(key).value = unescape(value);
    });*/
    // if(that.stream && typeof that.stream === "object" && that.stream.playbackquUrl  ){ //如果是回放，则取回放地址
    //     L.Logger.debug('Creating palyback URL from stream ' + that.stream);
    //     that.streamUrl = that.stream.playbackquUrl ;
    // }else if(that.stream){
    //     L.Logger.debug('Creating URL from stream ' + that.stream);
    //     var myURL = window.URL || webkitURL;
    //     that.streamUrl = myURL.createObjectURL(that.stream);
    // }


    // Container
    that.div = document.createElement('div');
    that.div.setAttribute('id', 'player_' + that.id);
    that.div.setAttribute('class', 'Talk_player');
    that.div.setAttribute('style', 'width: 100%; height: 100%; position: relative; ' +
                                   'background-color: black; overflow: hidden;');

    // Loader icon
    if (spec.options.loader !== false) {
	 //qiushao改:2017-07-26
     // that.loader = document.createElement('img');
	  that.loader = document.createElement('div');
      that.loader.setAttribute('id', 'back_' + that.id);
      that.loader.setAttribute('class', 'Talk_loader');
	 //qiushao改:2017-07-26
     // that.loader.setAttribute('src', that.url + '/assets/loader.gif');
    }

    // Video tag
    that.video = document.createElement('embed');
    //that.video.setAttribute('id', 'stream' + that.id);
    that.video.setAttribute('id', that.id);
    that.video.setAttribute('class', 'Talk_stream');
    that.video.setAttribute('style', 'width: 100%; height: 100%; position: absolute;background-color:#000;');
    that.video.setAttribute('type', 'application/x-ppapi-proxy');
    //that.video.setAttribute('autoplay', 'autoplay');
    that.showVideo = function () {
        // if (that.video ) {
        //     that.video.style.display = 'block' ;
        // }
    };
    that.hideVideo = function () {
        // if (that.video ) {
        //     that.video.style.display = 'none' ;
        // }
    };
    //if(spec.stream.local)
        //that.video.volume = 0;
    if (that.elementID !== undefined) {
        // Check for a passed DOM node.
        if (typeof that.elementID === 'object' &&
          typeof that.elementID.appendChild === 'function') {
            that.container = that.elementID;
        }
        else {
            that.container = document.getElementById(that.elementID);
        }
    } else {
        that.container = document.body;
    }
    that.container.appendChild(that.div);

    that.parentNode = that.div.parentNode;

    if (that.loader) {
      that.div.appendChild(that.loader);
    }

    that.div.appendChild(that.video);

    that.containerWidth = 0;
    that.containerHeight = 0;

    // if (spec.options.resizer !== false) {
    //   that.resizer = new L.ResizeSensor(that.container, that.resize);

    //   that.resize();
    // }

    // Bottom Bar
    if (spec.options.bar !== false) {
        that.bar = new TK.Bar({elementID: 'player_' + that.id,
                                  id: that.id,
                                  stream: spec.stream,
                                  media: that.video,
                                  options: spec.options});

        that.div.onmouseover = onmouseover;
        that.div.onmouseout = onmouseout;
    }
    else {
        // Expose a consistent object to manipulate the media.
        that.media = that.video;
    }

    if(that.streamUrl){
        //that.video.src = that.streamUrl;
    }

    that.video.onloadedmetadata = function (event) {
        event = event || window.event ;
        that.loader.style.display = "none" ;
        that.div.style.backgroundColor = "transparent" ;
    };
    that.changeMediaStreamUrl = function(mediaStream){
        // if(that.video && mediaStream){
        //     that.stream = mediaStream ;
        //     if(that.stream && typeof that.stream === "object" && that.stream.playbackquUrl  ){ //如果是回放，则取回放地址
        //         L.Logger.debug('Creating palyback URL from stream ' + that.stream);
        //         that.streamUrl = that.stream.playbackquUrl ;
        //     }else if(that.stream){
        //         L.Logger.debug('Creating URL from stream ' + that.stream);
        //         var myURL = window.URL || webkitURL;
        //         that.streamUrl = myURL.createObjectURL(that.stream);
        //     }
        //     if(that.streamUrl){
        //         that.video.src = that.streamUrl;
        //     }
        // }
    };
    return that;
};
/*global window, document, L, webkitURL*/
'use strict';
/*
 * AudioPlayer represents a Talk Audio component that shows either a local or a remote Audio.
 * Ex.: var player = AudioPlayer({id: id, stream: stream, elementID: elementID});
 * A AudioPlayer is also a View component.
 */
var TK = TK || {};
TK.ChromeStableStack = 10;
TK.AudioPlayer = function (spec) {
    var that = TK.View({}),
        onmouseover,
        onmouseout;

    // Variables

    // AudioPlayer ID
    that.id = spec.id;

    // Stream that the AudioPlayer will play
    that.stream = spec.stream.stream;

    // DOM element in which the AudioPlayer will be appended
    that.elementID = spec.elementID;


    L.Logger.debug('[tk-sdk]Creating URL from stream ' + that.stream);
    var myURL = window.URL || webkitURL;
    that.streamUrl = myURL.createObjectURL(that.stream);

    // Audio tag
    that.audio = document.createElement('audio');
    that.audio.setAttribute('id', 'stream' + that.id);
    that.audio.setAttribute('class', 'Talk_stream');
    that.audio.setAttribute('style', 'width: 100%; height: 100%; position: absolute');
    that.audio.setAttribute('autoplay', 'autoplay');

    if(spec.stream.local)
        that.audio.volume = 0;

    if(spec.stream.local)
        that.audio.volume = 0;


    if (that.elementID !== undefined) {

        // It will stop the AudioPlayer and remove it from the HTML
        that.destroy = function () {
            that.audio.pause();
            that.parentNode.removeChild(that.div);
        };

        onmouseover = function () {
            that.bar.display();
        };

        onmouseout = function () {
            that.bar.hide();
        };

        // Container
        that.div = document.createElement('div');
        that.div.setAttribute('id', 'player_' + that.id);
        that.div.setAttribute('class', 'Talk_player');
        that.div.setAttribute('style', 'width: 100%; height: 100%; position: relative; ' +
                              'overflow: hidden;');

        // Check for a passed DOM node.
        if (typeof that.elementID === 'object' &&
          typeof that.elementID.appendChild === 'function') {
            that.container = that.elementID;
        }
        else {
            that.container = document.getElementById(that.elementID);
        }
        that.container.appendChild(that.div);

        that.parentNode = that.div.parentNode;

        that.div.appendChild(that.audio);

        // Bottom Bar
        if (spec.options.bar !== false) {
            that.bar = new TK.Bar({elementID: 'player_' + that.id,
                                      id: that.id,
                                      stream: spec.stream,
                                      media: that.audio,
                                      options: spec.options});

            that.div.onmouseover = onmouseover;
            that.div.onmouseout = onmouseout;
        }
        else {
            // Expose a consistent object to manipulate the media.
            that.media = that.audio;
        }

    } else {
        // It will stop the AudioPlayer and remove it from the HTML
        that.destroy = function () {
            that.audio.pause();
            that.parentNode.removeChild(that.audio);
        };

        document.body.appendChild(that.audio);
        that.parentNode = document.body;
    }

    that.audio.src = that.streamUrl;

    return that;
};
/*global document, clearTimeout, setTimeout */
'use strict';
/*
 * Bar represents the bottom menu bar of every mediaPlayer.
 * It contains a Speaker and an icon.
 * Every Bar is a View.
 * Ex.: var bar = Bar({elementID: element, id: id});
 */
var TK = TK || {};
TK.Bar = function (spec) {
    var that = TK.View({}),
        waiting,
        show;

    // Variables

    // DOM element in which the Bar will be appended
    that.elementID = spec.elementID;

    // Bar ID
    that.id = spec.id;

    // Container
    that.div = document.createElement('div');
    that.div.setAttribute('id', 'bar_' + that.id);
    that.div.setAttribute('class', 'Talk_bar');

    // Bottom bar
    that.bar = document.createElement('div');
    that.bar.setAttribute('style', 'width: 100%; height: 15%; max-height: 30px; ' +
                                   'position: absolute; bottom: 0; right: 0; ' +
                                   'background-color: rgba(255,255,255,0.62)');
    that.bar.setAttribute('id', 'subbar_' + that.id);
    that.bar.setAttribute('class', 'Talk_subbar');

    // Lynckia icon
    that.link = document.createElement('a');
    that.link.setAttribute('href', spec && spec.options && spec.options.link?spec.options.link : 'http://www.talk-cloud.com/');
    that.link.setAttribute('class', 'Talk_link');
    that.link.setAttribute('target', '_blank');
	
	//qiushao改:2017-07-06
    that.logo = document.createElement('div');
    that.logo.setAttribute('style', 'width: 100%; height: 100%; max-width: 30px; ' +
                                    'position: absolute; top: 0; left: 2px;');
    that.logo.setAttribute('class', 'Talk_logo');
    that.logo.setAttribute('alt', 'Lynckia');
	//qiushao改:2017-07-06
    //that.logo.setAttribute('src', that.url + '/assets/star.svg');

    // Private functions
    show = function (displaying) {
        if (displaying !== 'block') {
            displaying = 'none';
        } else {
            clearTimeout(waiting);
        }

        that.div.setAttribute('style', 'width: 100%; height: 100%; position: relative; ' +
                                       'bottom: 0; right: 0; display:' + displaying);
    };

    // Public functions

    that.display = function () {
        show('block');
    };

    that.hide = function () {
        waiting = setTimeout(show, 1000);
    };

    document.getElementById(that.elementID).appendChild(that.div);
    that.div.appendChild(that.bar);
    that.bar.appendChild(that.link);
    that.link.appendChild(that.logo);

    // Speaker component
    if (!spec.stream.screen && (spec.options === undefined ||
                                spec.options.speaker === undefined ||
                                spec.options.speaker === true)) {
        that.speaker = new TK.Speaker({elementID: 'subbar_' + that.id,
                                          id: that.id,
                                          stream: spec.stream,
                                          media: spec.media});
    }

    that.display();
    that.hide();

    return that;
};
/*global document */
'use strict';
/*
 * Speaker represents the volume icon that will be shown in the mediaPlayer, for example.
 * It manages the volume level of the media tag given in the constructor.
 * Every Speaker is a View.
 * Ex.: var speaker = Speaker({elementID: element, media: mediaTag, id: id});
 */
var TK = TK || {};
TK.Speaker = function (spec) {
    var that = TK.View({}),
        show,
        mute,
        unmute,
        lastVolume = 50;

    // Variables

    // DOM element in which the Speaker will be appended
    that.elementID = spec.elementID;

    // media tag
    that.media = spec.media;

    // Speaker id
    that.id = spec.id;

    // MediaStream
    that.stream = spec.stream;

    // Container
    that.div = document.createElement('div');
    that.div.setAttribute('style', 'width: 40%; height: 100%; max-width: 32px; ' +
                                   'position: absolute; right: 0;z-index:0;');

    // Volume icon
	//qiushao改:2017-07-26
    //that.icon = document.createElement('img');
	that.icon = document.createElement('div');
    that.icon.setAttribute('id', 'volume_' + that.id);
	//qiushao改:2017-07-26
    //that.icon.setAttribute('src', that.url + '/assets/sound48.png');
	that.icon.setAttribute('class', 'Talk_Volume_icon');		
    that.icon.setAttribute('style', 'width: 80%; height: 100%; position: absolute;');
    that.div.appendChild(that.icon);


    if (!that.stream.local) {

        // Volume bar
        that.picker = document.createElement('input');
        that.picker.setAttribute('id', 'picker_' + that.id);
        that.picker.type = 'range';
        that.picker.min = 0;
        that.picker.max = 100;
        that.picker.step = 10;
        that.picker.value = lastVolume;
        //  FireFox supports range sliders as of version 23
        that.picker.setAttribute('orient', 'vertical');
        that.div.appendChild(that.picker);
        that.media.volume = that.picker.value / 100;
        that.media.muted = false;

        that.picker.oninput = function () {
            if (that.picker.value > 0) {
                that.media.muted = false;
				//qiushao改:2017-07-26
				//that.icon.setAttribute('src', that.url + '/assets/sound48.png');
				removeClass(that.icon , 'sound');
				addClass(that.icon , 'mute');
            } else {
                that.media.muted = true;
				//qiushao改:2017-07-26
                //that.icon.setAttribute('src', that.url + '/assets/mute48.png');
				removeClass(that.icon , 'sound');
				addClass(that.icon , 'mute');
            }
            that.media.volume = that.picker.value / 100;
        };

        // Private functions
        show = function (displaying) {
            that.picker.setAttribute('style', 'background: transparent; width: 32px; ' +
                                              'height: 100px; position: absolute; bottom: 90%; ' +
                                              'z-index: 1;' + that.div.offsetHeight + 'px; ' +
                                              'right: 0px; -webkit-appearance: slider-vertical; ' +
                                              'display: ' + displaying);
        };

        mute = function () {
			//qiushao改:2017-07-26
            //that.icon.setAttribute('src', that.url + '/assets/mute48.png');
			removeClass(that.icon , 'sound');
			addClass(that.icon , 'mute');			
            lastVolume = that.picker.value;
            that.picker.value = 0;
            that.media.volume = 0;
            that.media.muted = true;
        };

        unmute = function () {  
			//qiushao改:2017-07-26
			//that.icon.setAttribute('src', that.url + '/assets/sound48.png');
			removeClass(that.icon , 'mute');
			addClass(that.icon , 'sound');
            that.picker.value = lastVolume;
            that.media.volume = that.picker.value / 100;
            that.media.muted = false;
        };

        that.icon.onclick = function () {
            if (that.media.muted) {
                unmute();
            } else {
                mute();
            }
        };

        // Public functions
        that.div.onmouseover = function () {
            show('block');
        };

        that.div.onmouseout = function () {
            show('none');
        };

        show('none');

    } else {

        mute = function () {
            that.media.muted = true;
			//qiushao改:2017-07-26
			//that.icon.setAttribute('src', that.url + '/assets/mute48.png');
			removeClass(that.icon , 'sound');
			addClass(that.icon , 'mute');        
            that.stream.stream.getAudioTracks()[0].enabled = false;
        };

        unmute = function () {
            that.media.muted = false;
			//qiushao改:2017-07-26
			//that.icon.setAttribute('src', that.url + '/assets/sound48.png');
			removeClass(that.icon , 'mute');
			addClass(that.icon , 'sound');  

            that.stream.stream.getAudioTracks()[0].enabled = true;
        };

        that.icon.onclick = function () {
            if (that.media.muted) {
                unmute();
            } else {
                mute();
            }
        };
    }
    document.getElementById(that.elementID).appendChild(that.div);
	
	
	/**qiushao改:2017-07-26 class方法*/
	function removeClass(elem, cls){
		if(hasClass(elem, cls)){
			var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, '') + ' ';
			while(newClass.indexOf(' ' + cls + ' ') >= 0){
				newClass = newClass.replace(' ' + cls + ' ', ' ');
			}
			elem.className = newClass.replace(/^\s+|\s+$/g, '');
		}
	}
	function addClass(elem, cls){
		if(!hasClass(elem, cls)){
			elem.className += ' ' + cls;
		}
	}
	function hasClass(elem, cls){
		cls = cls || '';
		if(cls.replace(/\s/g, '').length == 0) return false;
		return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
	}

    return that;
};
/**
 * SDK常量
 * @class L.Constant
 * @description   提供常量存储对象
 * @author QiuShao
 * @date 2017/7/29
 */
'use strict';
var L = L || {};
L.Constant = (function () {
    return {
		roomError:{
			ROOMCONNECTERROR: 0, //room-error：房间连接错误（room-connect）
			GETCONFIGERROR: 1 ,  //room-error：获取配置信息错误(getconfig)
			GETFILELISTERROR: 2 ,  //room-error：获取文件列表错误(getfilelist)
		},
		deviceStorage:{
			audioinput:"audioinputDeviceId" , //localStorage 存储的音频输入设备id
            audiooutput:"audiooutputDeviceId" ,  //localStorage 存储的音频输出设备id
            videoinput:"videoinputDeviceId" ,  //localStorage 存储的视频输入设备id
   	 	}
    };
}(L));
/**
 * SDK工具类
 * @class L.Utils
 * @description   提供SDK所需要的工具
 * @author QiuShao
 * @date 2017/7/29
 */
'use strict';
var L = L || {};
L.Utils = ( function () {
    return {
        /**绑定事件
         @method addEvent
         @param   {element} element 添加事件元素
         {string} eType 事件类型
         {Function} handle 事件处理器
         {Bollean} bol false 表示在事件第三阶段（冒泡）触发，true表示在事件第一阶段（捕获）触发。
         */
        addEvent:function(element, eType, handle, bol){
            bol = (bol!=undefined && bol!=null)?bol:false ;
            if(element.addEventListener){           //如果支持addEventListener
                element.addEventListener(eType, handle, bol);
            }else if(element.attachEvent){          //如果支持attachEvent
                element.attachEvent("on"+eType, handle);
            }else{                                  //否则使用兼容的onclick绑定
                element["on"+eType] = handle;
            }
        },
        /**事件解绑
         @method addEvent
         @param   {element} element 添加事件元素
         {string} eType 事件类型
         {Function} handle 事件处理器
         {Bollean} bol false 表示在事件第三阶段（冒泡）触发，true表示在事件第一阶段（捕获）触发。
         */
        removeEvent:function(element, eType, handle, bol) {
            if(element.addEventListener){
                element.removeEventListener(eType, handle, bol);
            }else if(element.attachEvent){
                element.detachEvent("on"+eType, handle);
            }else{
                element["on"+eType] = null;
            }
        }
    };
}(L));/**
 * 本地设备管理类
 * @class AVMgr
 * @description   提供设备的枚举，设备流的获取以及切换等功能
 * @author QiuShao
 * @date 2017/7/29
 */
'use strict';
var TK = TK || {};
TK.AVMgr = (function () {
    var that = {} ;
    that.room_video_width = 320 ;
    that.room_video_height = 240 ;
    that.room_video_fps = 10 ;

    that.setAVMgrProperty = function (key_value_json) { //设置AVMgr的属性值
      for (var key in key_value_json){
          if(that.hasOwnProperty(key)){
              that[key] =key_value_json[key] ;
          }
      }
    };


    var _getUserMedia =  function ( callback,error , config , specifiedConstraints ) {
        var _getUserMediaByFfConfig = function (ffConfig) {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia(ffConfig)
                    .then(callback)
                    .catch(error) ;
            }else{
                navigator.getMedia(config, callback, error);
            }
        };
        navigator.getMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
        config = config || {audio:{} , video:{}} ;
        error = error || function (error) {L.Logger.error("[tk-sdk]getUserMedia error:" , error);};
        if ( config.screen) {
            L.Logger.debug('[tk-sdk]Screen access requested');
           /* switch (TK.getBrowser()) {
                case 'electron' :
                    L.Logger.debug('[tk-sdk]Screen sharing in Electron');
                    var screenConfig = {};
                    screenConfig.video = config.video || {};
                    screenConfig.video.mandatory = config.video.mandatory || {};
                    screenConfig.video.mandatory.chromeMediaSource = 'screen';
                    navigator.getMedia(screenConfig, callback, error);
                    break;
                case 'mozilla':
                    L.Logger.debug('[tk-sdk]Screen sharing in Firefox');
                    var screenCfg = {};
                    if (config.video.mandatory !== undefined) {
                        screenCfg.video = config.video;
                        screenCfg.video.mediaSource = 'window' || 'screen';
                    } else {
                        screenCfg = {
                            audio: config.audio,
                            video: {mediaSource: 'window' || 'screen'}
                        };
                    }
                    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                        navigator.mediaDevices.getUserMedia(screenCfg)
                            .then(callback)
                            .catch(error);
                    } else {
                        navigator.getMedia(screenCfg, callback, error);
                    }
                    break;

                case 'chrome-stable':
                    L.Logger.debug('[tk-sdk]Screen sharing in Chrome');
                    if (config.desktopStreamId){
                        var theConfig = {};
                        theConfig.video = config.video || {};
                        theConfig.video.mandatory.chromeMediaSource = 'desktop';
                        theConfig.video.mandatory.chromeMediaSourceId = config.desktopStreamId;
                        navigator.getMedia(theConfig, callback, error);
                    } else {
                        // Default extensionId - this extension is only usable in our server,
                        // please make your own extension based on the code in
                        // erizo_controller/erizoClient/extras/chrome-extension
                        var extensionId = 'okeephmleflklcdebijnponpabbmmgeo';
                        if (config.extensionId){
                            L.Logger.debug('[tk-sdk]extensionId supplied, using ' + config.extensionId);
                            extensionId = config.extensionId;
                        }
                        L.Logger.debug('[tk-sdk]Screen access on chrome stable, looking for extension');
                        try {
                            chrome.runtime.sendMessage(extensionId, {getStream: true},
                                function (response){
                                    var theConfig = {};
                                    if (response === undefined){
                                        L.Logger.error('[tk-sdk]Access to screen denied');
                                        var theError = {code:'Access to screen denied'};
                                        error(theError);
                                        return;
                                    }
                                    var theId = response.streamId;
                                    if(config.video.mandatory !== undefined){
                                        theConfig.video = config.video;
                                        theConfig.video.mandatory.chromeMediaSource = 'desktop';
                                        theConfig.video.mandatory.chromeMediaSourceId = theId;
                                    }else{
                                        theConfig = {video: {mandatory: {chromeMediaSource: 'desktop',
                                            chromeMediaSourceId: theId }}};
                                    }
                                    navigator.getMedia(theConfig, callback, error);
                                });
                        } catch(e) {
                            L.Logger.debug('[tk-sdk]Screensharing plugin is not accessible ');
                            var theError = {code:'no_plugin_present'};
                            error(theError);
                            return;
                        }
                    }
                    break;

                default:
                    L.Logger.error('[tk-sdk]This browser does not support ScreenSharing');
            }*/
        } else {
                var ffConfig = {video:{}, audio: {}, screen: config.screen};
                if(typeof config.audio === "object"){
                    ffConfig.audio = config.audio
                }
                specifiedConstraints = specifiedConstraints != undefined && specifiedConstraints!=null  && typeof specifiedConstraints === 'object' ?  specifiedConstraints : { video:{}, audio: {} , exclude:{} } ;
                specifiedConstraints.video  =    specifiedConstraints.video || {} ;
                specifiedConstraints.audio =  specifiedConstraints.audio || {};
                var audioMandatoryCfg = config.audio.mandatory || {
                    sourceId: specifiedConstraints.audio.sourceId ||  localStorage.getItem(L.Constant.deviceStorage.audioinput) || ""
                };
                var videoMandatoryCfg = config.video.mandatory || {
                    sourceId: specifiedConstraints.video.sourceId || localStorage.getItem(L.Constant.deviceStorage.videoinput) || "" ,
                    idealWidth:that.room_video_width || 320 ,
                    maxWidth:that.room_video_width || 320 ,
                    idealHeight:that.room_video_height || 240 ,
                    maxHeight:that.room_video_height || 240
                };
                ffConfig.video.width = {ideal: videoMandatoryCfg.idealWidth, max: videoMandatoryCfg.maxWidth};
                ffConfig.video.height = {ideal: videoMandatoryCfg.idealHeight, max: videoMandatoryCfg.maxHeight};
                if (config.video.optional !== undefined) {
                    ffConfig.video.frameRate =  config.video.optional[1].maxFrameRate;
                }else{
                    var videoOptionalCfg =  {
                        idealFrameRate: Number(that.room_video_fps || 10)  ,
                        maxFrameRate: Number(that.room_video_fps || 10)
                    };
                    if(videoOptionalCfg.idealFrameRate != undefined && videoOptionalCfg.maxFrameRate != undefined ){
                        ffConfig.video.frameRate = {ideal: videoOptionalCfg.idealFrameRate, max: videoOptionalCfg.maxFrameRate};
                    }else if(videoOptionalCfg.frameRate != undefined){
                        ffConfig.video.frameRate = videoOptionalCfg.frameRate ;
                    }
                }
                if( !videoMandatoryCfg.sourceId ||   !audioMandatoryCfg.sourceId ){
                    that.enumerateDevices(function (devicesInfo) {
                        var useDevices = devicesInfo.useDevices ;
                        var hasDevice = devicesInfo.hasdevice;
                        if(hasDevice['videoinput'] && useDevices['videoinput'] && !videoMandatoryCfg.sourceId){
                            videoMandatoryCfg.sourceId =  useDevices['videoinput'] ;
                            localStorage.setItem(L.Constant.deviceStorage.videoinput ,videoMandatoryCfg.sourceId );
                        }
                        if(hasDevice['audioinput'] && useDevices['audioinput'] && !audioMandatoryCfg.sourceId ){
                            audioMandatoryCfg.sourceId =  useDevices['audioinput'] ;
                            localStorage.setItem(L.Constant.deviceStorage.audioinput ,audioMandatoryCfg.sourceId );
                        }
                        if (audioMandatoryCfg.sourceId) {
                            ffConfig.audio.deviceId = audioMandatoryCfg.sourceId;//exact:
                        }else{
                            ffConfig.audio = false ;
                        }
                        if (videoMandatoryCfg.sourceId) {
                            ffConfig.video.deviceId = videoMandatoryCfg.sourceId;//exact:
                        }else{
                            ffConfig.video = false ;
                        }
                        if(specifiedConstraints.exclude && specifiedConstraints.exclude.video ){
                            ffConfig.video = false ;
                        }else if(specifiedConstraints.exclude && specifiedConstraints.exclude.audio ){
                            ffConfig.audio = false ;
                        }
                        _getUserMediaByFfConfig(ffConfig);
                    }) ;
                }else{
                    if (audioMandatoryCfg.sourceId) {
                        ffConfig.audio.deviceId = audioMandatoryCfg.sourceId;//exact:
                    }else{
                        ffConfig.audio = false ;
                    }
                    if (videoMandatoryCfg.sourceId) {
                        ffConfig.video.deviceId = videoMandatoryCfg.sourceId;//exact:
                    }else{
                        ffConfig.video = false ;
                    }
                    if(specifiedConstraints.exclude && specifiedConstraints.exclude.video ){
                        ffConfig.video = false ;
                    }else if(specifiedConstraints.exclude && specifiedConstraints.exclude.audio ){
                        ffConfig.audio = false ;
                    }
                    _getUserMediaByFfConfig(ffConfig);
                }
            }
    };

    /*获取设备数据流
     * @method GetUserMedia
     * @params [ callback:function ,error:function , config:object ]
     * */
    that.getUserMedia = function (callback,error , config , specifiedConstraints) {
/*        _getUserMedia(function (streamTmp) {
            var tmpTracks =  streamTmp.getTracks();
            for(var i=0 ; i<tmpTracks.length ; i++){
                tmpTracks[i].stop();
            }
            _getUserMedia(callback,error , config , specifiedConstraints);
        },function (err) {
            L.Logger.error("[tk-sdk]_getUserMedia error:" , err) ;*/
            _getUserMedia(callback,error , config , specifiedConstraints);
       /* });*/
    }

    
    /*枚举设备信息进行分类
     * @method GetUserMedia
     * @params [ callback:function , paramsJson:object ]
     */
    that.enumerateDevices = function (callback , paramsJson) {
        paramsJson = paramsJson || {} ;
        paramsJson.isSetlocalStorage = paramsJson.isSetlocalStorage!=undefined ? paramsJson.isSetlocalStorage : false ;
        var  _enumerateDevices = function (_enumerateDevicesCallback) {
            //List cameras and microphones.
            if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
                L.Logger.log("[tk-sdk]enumerateDevices() not supported.");
                return null;
            }
            navigator.mediaDevices.enumerateDevices()
                .then(function(devices) {
                    devices.forEach(function(device) {
                        L.Logger.info('[tk-sdk]'+device.kind + ": " + device.label + " id = " + device.deviceId , device);
                    });
                    if(_enumerateDevicesCallback && typeof  _enumerateDevicesCallback === "function"){
                        _enumerateDevicesCallback(devices);
                    }
                })
                .catch(function(err) {
                    L.Logger.error('[tk-sdk]'+err.name + ": " + err.message);
                    throw err ;
                });
        }
         function _handlerEnumerateDevices (devices) {
            var audioinputDeviceId = window.localStorage.getItem(L.Constant.deviceStorage.audioinput);
            var videoinputDeviceId = window.localStorage.getItem(L.Constant.deviceStorage.videoinput);
            var audiooutputDeviceId = window.localStorage.getItem(L.Constant.deviceStorage.audiooutput);
            L.Logger.info("enumerate devices:", devices);
            var devicesTmp = {
                all: {},
                defalut: {},
            };
            var devicesInfo = {
                hasdevice: {
                    "audioinput": false,
                    "audiooutput": false,
                    "videoinput": false
                },
                devices:{
                    "audioinput": [],
                    "audiooutput": [],
                    "videoinput": []
                },
                useDevices:{}
            };
            devices.forEach(function(device) {
                if(device != null) {
                    if( !( device.groupId =="communications" || device.deiceId == "communications" || device.label == "通讯" ) ) {
                        if (device.kind === "audioinput" && device.deviceId === audioinputDeviceId) {
                            devicesInfo.useDevices[device.kind] = device.deviceId;
                        }
                        if (device.kind === "videoinput" && device.deviceId === videoinputDeviceId) {
                            devicesInfo.useDevices[device.kind] = device.deviceId;
                        }
                        if (device.kind === "audiooutput" && device.deviceId === audiooutputDeviceId) {
                            devicesInfo.useDevices[device.kind] = device.deviceId;
                        }
                        devicesTmp.all[device.kind] = device.deviceId;
                        devicesInfo.devices[device.kind].push(device);
                        devicesInfo.hasdevice[device.kind] = true;
                        if (device.deviceId === "default") {
                            devicesTmp.defalut[device.kind] = device.deviceId;
                        }
                    }
                }
            });
            if(!devicesInfo.useDevices["audioinput"]) {
                devicesInfo.useDevices["audioinput"]  = devicesTmp.defalut["audioinput"] || devicesTmp.all["audioinput"] || "";
            }
            if(!devicesInfo.useDevices["videoinput"]) {
                devicesInfo.useDevices["videoinput"]  =  devicesTmp.defalut["videoinput"] || devicesTmp.all["videoinput"] || "";
            }
            if(!devicesInfo.useDevices["audiooutput"]) {
                devicesInfo.useDevices["audiooutput"]  = devicesTmp.defalut["audiooutput"] || devicesTmp.all["audiooutput"] || "";
            }
            if(window.localStorage) { //存储设备id到本地存储localStorage中
                if(paramsJson.isSetlocalStorage){
                    window.localStorage.setItem(L.Constant.deviceStorage.audioinput, devicesInfo.useDevices["audioinput"]);
                    window.localStorage.setItem(L.Constant.deviceStorage.videoinput, devicesInfo.useDevices["videoinput"]);
                    window.localStorage.setItem(L.Constant.deviceStorage.audiooutput, devicesInfo.useDevices["audiooutput"]);
                }
            } else {
                L.Logger.error("[tk-sdk]not support localStorage");
            }
            if(callback && typeof callback === "function") {
                callback(devicesInfo);
            }
        }
        var _enumerateDevicesGetUserMediaSuccess =  function (stream) {
            _enumerateDevices(function(devices) {
                _handlerEnumerateDevices(devices);
            });
        };
        var _enumerateDevicesGetUserMediaFail = function (error) {
            L.Logger.warning("[tk-sdk]getUserMedia error on enumerateDevices:" , error) ;
            _enumerateDevices(function(devices) {
                _handlerEnumerateDevices(devices);
            });
        };
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({audio:true , video:true})
                .then(_enumerateDevicesGetUserMediaSuccess)
                .catch(_enumerateDevicesGetUserMediaFail) ;
        }else{
            navigator.getMedia({audio:true , video:true},_enumerateDevicesGetUserMediaSuccess , _enumerateDevicesGetUserMediaFail );
        }
    } ;

    /*获取声音探测实例
     * @method getsSoundMeterInstance
     * @params [ audioContext:new window.AudioContext()]
     * @return 声音探测实例SoundMeter
     */
    that.getsSoundMeterInstance = function (audioContext) {
        var SoundMeter =  function (audioContext) {
            var _that = this ;
            _that.audioContext = audioContext;
            _that.instant = 0.0;
            _that.slow = 0.0;
            _that.clip = 0.0;
            _that.script = _that.audioContext.createScriptProcessor(2048, 1, 1);
            var that = _that;
            _that.script.onaudioprocess = function (event) {
                var input = event.inputBuffer.getChannelData(0);
                var i;
                var sum = 0.0;
                var clipcount = 0;
                for (i = 0; i < input.length; ++i) {
                    sum += input[i] * input[i];
                    if (Math.abs(input[i]) > 0.99) {
                        clipcount += 1;
                    }
                }
                that.instant = Math.sqrt(sum / input.length);
                that.slow = 0.95 * that.slow + 0.05 * that.instant;
                that.clip = clipcount / input.length;
            };
            _that.connectToSource = function (stream, callback) {
                L.Logger.info('SoundMeter connecting');
                try {
                    _that.mic = _that.audioContext.createMediaStreamSource(stream);
                    _that.mic.connect(_that.script);
                    // necessary to make sample run, but should not be.
                    _that.script.connect(_that.audioContext.destination);
                    if (typeof callback !== 'undefined') {
                        callback(null);
                    }
                } catch (e) {
                    L.Logger.error('[tk-sdk]connecToSource error:' , e);
                    if (typeof callback !== 'undefined') {
                        callback(e);
                    }
                }
            };
            _that.stop = function () {
                _that.mic.disconnect();
                _that.script.disconnect();
            };
            return _that ;
        };
        return new SoundMeter(audioContext);
    };

    /*为音视频节点设置扩音器输出
    * @method setElementSinkIdToAudioouputDevice
    * @params [elementArr:array(需要设置音频输出的节点数组)]*/
    that.setElementSinkIdToAudioouputDevice = function (elementArr) {
        var audiooutputDeviceId = localStorage.getItem(L.Constant.deviceStorage.audiooutput );
        for(var i=0 ; i<elementArr.le;i++){
            var element = elementArr[i] ;
            if(element && element.length>0){
                if(element.setSinkId){
                    element.setSinkId(audiooutputDeviceId)
                        .then(function() {
                            L.Logger.info('[tk-sdk]Audio output device set to ' + audiooutputDeviceId);
                        });
                }else{
                    L.Logger.error("[tk-sdk]The browser does not support the setSinkId method,audiooutputDeviceId:" ,audiooutputDeviceId );
                }
            }
        }
    };

    /*更换本地设备，生成数据流改变本地媒体数据流轨道
     * @method changeLocalDeviceToLocalstream
     * @params [getUserMediaCallback:function(切换设备后获取的数据流回调) ， deviceIdMap:json , callback:function , audioouputElementIdArr:array(需要更新扩音器输出的节点元素数组) ]  */
    that.changeLocalDeviceToLocalstream = function (getUserMediaCallback , deviceIdMap , callback  , audioouputElementArr) {
        var changeDeviceId = {};
        for (var key in deviceIdMap) {
            if (L.Constant.deviceStorage[key] && deviceIdMap[key] !== localStorage.getItem(L.Constant.deviceStorage[key])) {
                localStorage.setItem(L.Constant.deviceStorage[key], deviceIdMap[key]);
                changeDeviceId[key] = true;
            }
        }
        if(changeDeviceId.videoinput || changeDeviceId.audioinput ){
            that.getUserMedia(function (stream) {
                if(getUserMediaCallback && typeof getUserMediaCallback === "function"){
                    getUserMediaCallback(stream);
                }
                if(callback && typeof callback === "function"){
                    callback(stream);
                }
            });
        }
        if(audioouputElementArr &&  audioouputElementArr.length > 0){
            that.setElementSinkIdToAudioouputDevice(audioouputElementArr);
        }
    };

    /*添加设备改变事件*/
    that.addOndevicechange = function(callback){
        if(!navigator.mediaDevices){L.Logger.error('Browser does not support navigator.mediaDevices!');return ;};
        if(navigator.mediaDevices){
            navigator.mediaDevices.ondevicechange = null ;
            navigator.mediaDevices.ondevicechange = function(event) {
                L.Logger.info("[tk-sdk]AVMgr:ondevicechange event:" , event);
                if(callback && typeof callback === 'function'){
                    callback(event);
                }
            }
        }
    };

    /*删除设备改变事件*/
    that.removeOndevicechange = function () {
        if(!navigator.mediaDevices){L.Logger.error('Browser does not support navigator.mediaDevices!'); return;};
        navigator.mediaDevices.ondevicechange = null ;
    };

    return that ;
})(TK);
'use strict';
var TK = TK || {};

TK.NativeAVMgr = function () {
    var that = {} ;
    that.room_video_width = 320 ;
    that.room_video_height = 240 ;
    that.room_video_fps = 10 ;

    var avmgr_callbacks = {};

    var avmgr_params = {};

    var req_seq_ = 100;

    var genSeq = function () {
        return req_seq_ ++;
    }

    that.setAVMgrProperty = function (key_value_json) { //设置AVMgr的属性值
      for (var key in key_value_json){
          if(that.hasOwnProperty(key)){
              that[key] =key_value_json[key] ;
          }
      }
    };

    var messageCallback = function(msg)
    {
        var funcName = msg.data.name;
        if (funcName === "onEnumerateDevices")
        {
            var audioinputDeviceId = window.localStorage.getItem(L.Constant.deviceStorage.audioinput);
            var videoinputDeviceId = window.localStorage.getItem(L.Constant.deviceStorage.videoinput);
            var audiooutputDeviceId = window.localStorage.getItem(L.Constant.deviceStorage.audiooutput);

            var ai = msg.data.audioinput;
            var vi = msg.data.videoinput;
            var ao = msg.data.audiooutput;
            var seqId = msg.data.seq;

            var devicesInfo = {
                    hasdevice: {
                        "audioinput": false,
                        "audiooutput": false,
                        "videoinput": false
                    },
                    devices:{
                        "audioinput": [],
                        "audiooutput": [],
                        "videoinput": []
                    },
                    useDevices:{}
            };

            // audio input
            if (audioinputDeviceId !== undefined && audioinputDeviceId !== null && audioinputDeviceId <= ai.length)
            {
                devicesInfo.useDevices["audioinput"] = audioinputDeviceId;
            }
            else
            {
                if (ai.length > 0) {
                    devicesInfo.useDevices["audioinput"] = ai[0].deviceId;    
                }
                else {
                    devicesInfo.useDevices["audioinput"] = null;    
                }
                
            }
            if (ai.length > 0)
            {
                devicesInfo.hasdevice["audioinput"] = true;
            }
            devicesInfo.devices["audioinput"] = ai;

            // video
            if (videoinputDeviceId !== undefined && videoinputDeviceId !== null && videoinputDeviceId <= vi.length)
            {
                devicesInfo.useDevices["videoinput"] = videoinputDeviceId;
            }
            else
            {
                if (vi.length > 0) {
                    devicesInfo.useDevices["videoinput"] = vi[0].deviceId;
                }
                else {
                    devicesInfo.useDevices["videoinput"] = null;    
                }
                
            }
            if (vi.length > 0)
            {
                devicesInfo.hasdevice["videoinput"] = true;
            }
            devicesInfo.devices["videoinput"] = vi;

            // auido output
            if (audiooutputDeviceId !== undefined && audiooutputDeviceId !== null && audiooutputDeviceId <= ao.length)
            {
                devicesInfo.useDevices["audiooutput"] = audiooutputDeviceId;
            }
            else
            {
                if (ao.length > 0) {
                    devicesInfo.useDevices["audiooutput"] = ao[0].deviceId;    
                }
                else {
                    devicesInfo.useDevices["audiooutput"] = null;    
                }
                
            }
            if (ao.length > 0)
            {
                devicesInfo.hasdevice["audiooutput"] = true;
            }
            devicesInfo.devices["audiooutput"] = ao;

            if(window.localStorage) { //存储设备id到本地存储localStorage中
                var param = avmgr_params[seqId];
                if(param.isSetlocalStorage){
                    window.localStorage.setItem(L.Constant.deviceStorage.audioinput, devicesInfo.useDevices["audioinput"]);
                    window.localStorage.setItem(L.Constant.deviceStorage.videoinput, devicesInfo.useDevices["videoinput"]);
                    window.localStorage.setItem(L.Constant.deviceStorage.audiooutput, devicesInfo.useDevices["audiooutput"]);
                }
            } else {
                console.error("not support localStorage");
            }

            if (avmgr_callbacks[seqId]) {
                avmgr_callbacks[seqId](devicesInfo);
                delete avmgr_callbacks[seqId];
            }

            if (avmgr_params[seqId]) {
                delete avmgr_params[seqId];
            }

        } // end if (funcName === "onEnumerateDevices")

        

    };

    tknative.addEventListener("message", messageCallback, false);


    var _getUserMedia =  function ( callback,error , config , specifiedConstraints ) {
        var _getUserMediaByFfConfig = function (ffConfig) {
            tknative.postMessage({command: "setCamera", deviceId: ffConfig.video.deviceId, width: Number(ffConfig.video.width), height: Number(ffConfig.video.height), fps: Number(ffConfig.video.frameRate)});
            tknative.postMessage({command: "setMicrophone", deviceId: ffConfig.audio.deviceId});
            // todo...
            // 构造一个流？
            callback(null);
        };
        config = config || {audio:{} , video:{}} ;
        error = error || function (error) {L.Logger.error("getUserMedia error:" , error);};
        if ( config.screen) {
            L.Logger.debug('Screen access requested');
        } else {
                var ffConfig = {video:{}, audio: {}, screen: config.screen};
                if(typeof config.audio === "object"){
                    ffConfig.audio = config.audio
                }
                specifiedConstraints = specifiedConstraints != undefined && specifiedConstraints!=null  && typeof specifiedConstraints === 'object' ?  specifiedConstraints : { video:{}, audio: {} , exclude:{} } ;
                specifiedConstraints.video  =    specifiedConstraints.video || {} ;
                specifiedConstraints.audio =  specifiedConstraints.audio || {};
                var audioMandatoryCfg = config.audio.mandatory || {
                    sourceId: specifiedConstraints.audio.sourceId ||  localStorage.getItem(L.Constant.deviceStorage.audioinput) || ""
                };
                var videoMandatoryCfg = config.video.mandatory || {
                    sourceId: specifiedConstraints.video.sourceId || localStorage.getItem(L.Constant.deviceStorage.videoinput) || "" ,
                    idealWidth:that.room_video_width || 320 ,
                    maxWidth:that.room_video_width || 320 ,
                    idealHeight:that.room_video_height || 240 ,
                    maxHeight:that.room_video_height || 240
                };
                ffConfig.video.width = videoMandatoryCfg.maxWidth;
                ffConfig.video.height = videoMandatoryCfg.maxHeight;
                if (config.video.optional !== undefined) {
                    ffConfig.video.frameRate =  config.video.optional[1].maxFrameRate;
                }else{
                    var videoOptionalCfg =  {
                        idealFrameRate: Number(that.room_video_fps || 10)  ,
                        maxFrameRate: Number(that.room_video_fps || 10)
                    };
                    if(videoOptionalCfg.idealFrameRate != undefined && videoOptionalCfg.maxFrameRate != undefined ){
                        ffConfig.video.frameRate = videoOptionalCfg.maxFrameRate;
                    }else if(videoOptionalCfg.frameRate != undefined){
                        ffConfig.video.frameRate = videoOptionalCfg.frameRate ;
                    }
                }
                if( !videoMandatoryCfg.sourceId ||   !audioMandatoryCfg.sourceId ){
                    that.enumerateDevices(function (devicesInfo) {
                        var useDevices = devicesInfo.useDevices ;
                        var hasDevice = devicesInfo.hasdevice;
                        if((hasDevice['videoinput'] !== null && hasDevice['videoinput'] !== undefined) && (useDevices['videoinput'] !== null && useDevices['videoinput'] !== undefined) && !videoMandatoryCfg.sourceId){
                            videoMandatoryCfg.sourceId =  useDevices['videoinput'] ;
                            localStorage.setItem(L.Constant.deviceStorage.videoinput ,videoMandatoryCfg.sourceId );
                        }
                        if((hasDevice['audioinput'] !== null && hasDevice['audioinput'] !== undefined)&& (useDevices['audioinput'] !== null && useDevices['audioinput'] !== undefined) && !audioMandatoryCfg.sourceId ){
                            audioMandatoryCfg.sourceId =  useDevices['audioinput'] ;
                            localStorage.setItem(L.Constant.deviceStorage.audioinput ,audioMandatoryCfg.sourceId );
                        }
                        if (audioMandatoryCfg.sourceId !== null && audioMandatoryCfg.sourceId !== undefined) {
                            ffConfig.audio.deviceId = audioMandatoryCfg.sourceId;
                        }else{
                            ffConfig.audio = false ;
                        }
                        if (videoMandatoryCfg.sourceId !== null && videoMandatoryCfg.sourceId !== undefined) {
                            ffConfig.video.deviceId =videoMandatoryCfg.sourceId;
                        }else{
                            ffConfig.video = false ;
                        }
                        if(specifiedConstraints.exclude && specifiedConstraints.exclude.video ){
                            ffConfig.video = false ;
                        }else if(specifiedConstraints.exclude && specifiedConstraints.exclude.audio ){
                            ffConfig.audio = false ;
                        }
                        _getUserMediaByFfConfig(ffConfig);
                    }) ;
                }else{
                    if (audioMandatoryCfg.sourceId !== null && audioMandatoryCfg.sourceId !== undefined) {
                        ffConfig.audio.deviceId = audioMandatoryCfg.sourceId;
                    }else{
                        ffConfig.audio = false ;
                    }
                    if (videoMandatoryCfg.sourceId !== null && videoMandatoryCfg.sourceId !== undefined) {
                        ffConfig.video.deviceId =videoMandatoryCfg.sourceId;
                    }else{
                        ffConfig.video = false ;
                    }
                    if(specifiedConstraints.exclude && specifiedConstraints.exclude.video ){
                        ffConfig.video = false ;
                    }else if(specifiedConstraints.exclude && specifiedConstraints.exclude.audio ){
                        ffConfig.audio = false ;
                    }
                    _getUserMediaByFfConfig(ffConfig);
                }
            }
    };

    /*获取设备数据流
     * @method GetUserMedia
     * @params [ callback:function ,error:function , config:object ]
     * */
    that.getUserMedia = function (callback,error , config , specifiedConstraints) {
        _getUserMedia(callback,error , config , specifiedConstraints);
    };

    that.startDetecteMic = function (deviceId) {
        tknative.postMessage({command: "startDetecteMic", deviceId: deviceId});
    }

    that.stopDetectMic = function () {
        tknative.postMessage({command: "stopDetecteMic"});
    }

    that.startDetecteCam = function (deviceId, param) {
        // param:{elementId: id}
        tknative.postMessage({command: "startDetecteCam", deviceId: deviceId, args: param});
    }

    that.stopDetecteCam = function () {
        tknative.postMessage({command: "stopDetecteCam"});
    }

    that.enumerateDevices = function (callback, paramsJson) {
        var seqId = genSeq();
        avmgr_callbacks[seqId] = callback;
        var param = {} ;
        param.isSetlocalStorage = paramsJson === undefined ? false : (paramsJson.isSetlocalStorage!=undefined ? paramsJson.isSetlocalStorage : false);
        avmgr_params[seqId] = param;
        tknative.postMessage({command: "enumerateDevices", seq: seqId});
    };

    that.setSpeaker = function(deviceId) {
        tknative.postMessage({command: "setSpeaker", deviceId: deviceId});
    }

    that.getsSoundMeterInstance = function (audioContext) {
        var SoundMeter =  function (audioContext) {
            var _that = this ;
            _that.audioContext = audioContext;
            _that.instant = 0.0;
            _that.slow = 0.0;
            _that.clip = 0.0;
            _that.script = _that.audioContext.createScriptProcessor(2048, 1, 1);
            var that = _that;
            _that.script.onaudioprocess = function (event) {
                var input = event.inputBuffer.getChannelData(0);
                var i;
                var sum = 0.0;
                var clipcount = 0;
                for (i = 0; i < input.length; ++i) {
                    sum += input[i] * input[i];
                    if (Math.abs(input[i]) > 0.99) {
                        clipcount += 1;
                    }
                }
                that.instant = Math.sqrt(sum / input.length);
                that.slow = 0.95 * that.slow + 0.05 * that.instant;
                that.clip = clipcount / input.length;
            };
            _that.connectToSource = function (stream, callback) {
                console.log('SoundMeter connecting');
                try {
                    _that.mic = _that.audioContext.createMediaStreamSource(stream);
                    _that.mic.connect(_that.script);
                    // necessary to make sample run, but should not be.
                    _that.script.connect(_that.audioContext.destination);
                    if (typeof callback !== 'undefined') {
                        callback(null);
                    }
                } catch (e) {
                    console.error(e);
                    if (typeof callback !== 'undefined') {
                        callback(e);
                    }
                }
            };
            _that.stop = function () {
                _that.mic.disconnect();
                _that.script.disconnect();
            };
            return _that ;
        };
        return new SoundMeter(audioContext);
    };

    that.setElementSinkIdToAudioouputDevice = function (elementArr) {
        var audiooutputDeviceId = localStorage.getItem(L.Constant.deviceStorage.audiooutput );
        tknative.postMessage({command: "setSpeaker", deviceId: audiooutputDeviceId});
    };

    that.changeLocalDeviceToLocalstream = function (getUserMediaCallback , deviceIdMap , callback  , audioouputElementArr) {
        var changeDeviceId = {};
        for (var key in deviceIdMap) {
            if (L.Constant.deviceStorage[key] && deviceIdMap[key] !== localStorage.getItem(L.Constant.deviceStorage[key])) {
                localStorage.setItem(L.Constant.deviceStorage[key], deviceIdMap[key]);
                changeDeviceId[key] = true;
            }
        }
        if(changeDeviceId.videoinput || changeDeviceId.audioinput ){
            that.getUserMedia(function (stream) {
                if(getUserMediaCallback && typeof getUserMediaCallback === "function"){
                    getUserMediaCallback(stream);
                }
                if(callback && typeof callback === "function"){
                    callback(stream);
                }
            });
        }
        if(audioouputElementArr &&  audioouputElementArr.length > 0){
            that.setElementSinkIdToAudioouputDevice(audioouputElementArr);
        }
    };

    /*添加设备改变事件*/
    that.addOndevicechange = function(callback){
        // navigator.mediaDevices.ondevicechange = null ;
        // navigator.mediaDevices.ondevicechange = function(event) {
        //     L.Logger.info("AVMgr:ondevicechange event:" , event);
        //     if(callback && typeof callback === 'function'){
        //         callback(event);
        //     }
        // }
    };

    /*删除设备改变事件*/
    that.removeOndevicechange = function () {
        //navigator.mediaDevices.ondevicechange = null ;
    };

    return that ;
};
