/**
 * 拓课工具类
 * @module serviceTools
 * @description   提供 系统所需要的工具
 * @author QiuShao
 * @date 2017/7/20
 */
'use strict';
import TkConstant from 'TkConstant' ;

let hex64Instance = undefined ;
;(function() {
    //
    // 密文字符集（size:65）。
    // [0-9A-Za-z$_~]
    //
    // let _hexCHS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$_~';
    let _hexCHS = 'JKijklmnoz$_01234ABCDEFGHI56789LMNOPQRpqrstuvwxySTUVWXYZabcdefgh~';

    if(_hexCHS.length !== 65){L.Logger.error('密文字符集长度必须是65位，当前长度为:'+_hexCHS.length );return ;}
    //
    // Base64 变形加密法
    // 算法与 Base64 类似，即将 8 位字节用 6 位表示。
    // 规则：
    // 1. 码值 <= 0xff 的用 1 个字节表示；
    // 2. 码值 > 0xff 的用 2 字节表示；
    // 3. 单/双字节序列间用 0x1d 进行分隔；
    // 4. 首字为双字节时即前置 0x1d 分隔符。
    //
    // @param array key  - [0-63] 互斥值数组，length == 64
    //
    const Hex64 = function( key )
    {
        this._key = [], this._tbl = {};

        for (let _i=0; _i<64; ++_i) {
            this._key[_i] = _hexCHS.charAt(key[_i]);
            this._tbl[this._key[_i]] = _i;
        }
        this._pad = _hexCHS.charAt(64);
    };

    // 加密
    Hex64.prototype.enc = function( s )
    {
        let _rs = '';
        let _c1, _c2, _c3, _n1, _n2, _n3, _n4;
        let _i = 0;
        let _a = Hex64._2to1(s);
        let _en = _a.length % 3, _sz = _a.length - _en;
        while (_i < _sz) {
            _c1 = _a[_i++];
            _c2 = _a[_i++];
            _c3 = _a[_i++];
            _n1 = _c1 >> 2;
            _n2 = ((_c1 & 3) << 4) | (_c2 >> 4);
            _n3 = ((_c2 & 15) << 2) | (_c3 >> 6);
            _n4 = _c3 & 63;
            _rs += this._key[_n1]
                + this._key[_n2]
                + this._key[_n3]
                + this._key[_n4];
        }
        if (_en > 0) {
            _c1 = _a[_i++];
            _c2 = _en > 1 ? _a[_i] : 0;
            _n1 = _c1 >> 2;
            _n2 = ((_c1 & 3) << 4) | (_c2 >> 4);
            _n3 = (_c2 & 15) << 2;
            _rs += this._key[_n1] + this._key[_n2]
                + (_n3 ? this._key[_n3] : this._pad)
                + this._pad;
        }
        return  _rs.replace(/.{76}/g, function(s) {
            return  s + '\n';
        });
    };

    // 解密
    Hex64.prototype.dec = function( s )
    {
        let _sa = [],
            _n1, _n2, _n3, _n4,
            _i = 0, _c = 0;
        s = s.replace(/[^0-9A-Za-z$_~]/g, '');
        while (_i < s.length) {
            _n1 = this._tbl[s.charAt(_i++)];
            _n2 = this._tbl[s.charAt(_i++)];
            _n3 = this._tbl[s.charAt(_i++)];
            _n4 = this._tbl[s.charAt(_i++)];
            _sa[_c++] = (_n1 << 2) | (_n2 >> 4);
            _sa[_c++] = ((_n2 & 15) << 4) | (_n3 >> 2);
            _sa[_c++] = ((_n3 & 3) << 6) | _n4;
        }
        let _e2 = s.slice(-2);
        if (_e2.charAt(0) == this._pad) {
            _sa.length = _sa.length - 2;
        } else if (_e2.charAt(1) == this._pad) {
            _sa.length = _sa.length - 1;
        }
        return  Hex64._1to2(_sa);
    };

    //
    // 辅助：
    // Unicode 字符串 -> 单字节码值数组
    // 注意：
    // 原串中值为 0x1d 的字节（非字符）会被删除。
    //
    // @param string s  - 字符串（UCS-16）
    // @return array  - 单字节码值数组
    //
    Hex64._2to1 = function( s )
    {
        let _2b = false, _n = 0, _sa = [];

        if (s.charCodeAt(0) > 0xff) {
            _2b = true;
            _sa[_n++] = 0x1d;
        }
        for (let _i=0; _i<s.length; ++_i) {
            let _c = s.charCodeAt(_i);
            if (_c == 0x1d) continue;
            if (_c <= 0xff) {
                if (_2b) {
                    _sa[_n++] = 0x1d;
                    _2b = false;
                }
                _sa[_n++] = _c;
            } else {
                if (! _2b) {
                    _sa[_n++] = 0x1d;
                    _2b = true;
                }
                _sa[_n++] = _c >> 8;
                _sa[_n++] = _c & 0xff;
            }
        }
        return  _sa;
    };

    //
    // 辅助：
    // 单字节码值数组 -> Unicode 字符串
    //
    // @param array a  - 单字节码值数组
    // @return string  - 还原后的字符串（UCS-16）
    //
    Hex64._1to2 = function( a )
    {
        let _2b = false, _rs = '';

        for (let _i=0; _i<a.length; ++_i) {
            let _c = a[_i];
            if (_c == 0x1d) {
                _2b = !_2b;
                continue;
            }
            if (_2b) {
                _rs += String.fromCharCode(_c * 256 + a[++_i]);
            } else {
                _rs += String.fromCharCode(_c);
            }
        }
        return  _rs;
    };
    // let _k3 = [38,48,18,11,26,19,55,58,10,33,34,49,14,25,44,52,61,16,2,56,23,29,45,9,3,12,39,30,42,47,22,21,60,1,54,28,57,17,27,15,40,46,43,13,0,51,35,63,36,50,6,32,4,31,62,5,24,8,53,59,41,20,7,37];
    let _k3 = [15,40,46,43,13,0,51,35,63,36,50,6,32,4,31,62,5,24,8,53,59,41,20,7,37,38,48,18,11,26,19,55,58,10,33,34,49,14,25,44,52,61,16,2,56,23,29,45,9,3,12,39,30,42,47,22,21,60,1,54,28,57,17,27];
    if(_k3.length !== 64){L.Logger.error('互斥值数组长度必须是65位，当前长度为:'+_k3.length );return ;}
    hex64Instance = new Hex64(_k3);
})();

const tkUtils  = {
    /*所需工具*/
    tool:{
        /**启动全屏
         @method launchFullscreen
         @param {element} element 全屏元素
         */
        launchFullscreen:(element) => {
            if(element.requestFullscreen) {
                element.requestFullscreen();
            } else if(element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if(element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if(element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        },
        /**退出全屏
         @method exitFullscreen
         */
        exitFullscreen:() => {
            if(document.exitFullScreen) {
                document.exitFullScreen();
            } else if(document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if(document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if(element.msExitFullscreen) {
                element.msExitFullscreen();
            }
        } ,
        /*是否处于全屏状态
         @method isFullScreenStatus
         * */
        isFullScreenStatus:(element) => {
            return document.fullscreen ||
                document.mozFullScreen ||
                document.webkitIsFullScreen ||
                document.webkitFullScreen ||
                document.msFullScreen ||
                false;
        },
        /**返回正处于全屏状态的Element节点，如果当前没有节点处于全屏状态，则返回null。
         @method getFullscreenElement
         */
        getFullscreenElement: () => {
            let fullscreenElement =
                document.fullscreenElement ||
                document.mozFullScreenElement ||
                document.webkitFullscreenElement;
            return fullscreenElement;
        },
        /**返回一个布尔值，表示当前文档是否可以切换到全屏状态
         @method isFullscreenEnabled
         */
        isFullscreenEnabled: () => {
            let fullscreenEnabled =
                document.fullscreenEnabled ||
                document.mozFullScreenEnabled ||
                document.webkitFullscreenEnabled ||
                document.msFullscreenEnabled;
            return fullscreenEnabled;
        },
        /*添加前缀---方法执行（如果是方法），又是属性判断（是否支持属性）
         @method runPrefixMethod
         TODO 暂时没有测试能否可用
         */
        runPrefixMethod:(element, method) => {
            let usablePrefixMethod;
            ["webkit", "moz", "ms", "o", ""].forEach((prefix) => {
                if (usablePrefixMethod) return;
                if (prefix === "") {
                    // 无前缀，方法首字母小写
                    method = method.slice(0,1).toLowerCase() + method.slice(1);

                }

                let typePrefixMethod = typeof element[prefix + method];

                if (typePrefixMethod + "" !== "undefined") {
                    if (typePrefixMethod === "function") {
                        usablePrefixMethod = element[prefix + method]();
                    } else {
                        usablePrefixMethod = element[prefix + method];
                    }
                }
            });

            return usablePrefixMethod;
        },
        /**为全屏添加全屏事件fullscreenchange
         @method addFullscreenchange
         @param   {Function} handle 事件处理器
         */
        addFullscreenchange:(handle) => {
            tkUtils.tool.addEvent(document,"fullscreenchange",handle,false);
            tkUtils.tool.addEvent(document,"webkitfullscreenchange",handle,false);
            tkUtils.tool.addEvent(document,"mozfullscreenchange",handle,false);
            tkUtils.tool.addEvent(document,"MSFullscreenChange",handle,false);
            tkUtils.tool.addEvent(document,"msfullscreenchange",handle,false);
            tkUtils.tool.addEvent(document,"fullscreeneventchange",handle,false);
        },
        /**移除全屏添加全屏事件fullscreenchange
         @method removeFullscreenchange
         @param   {Function} handle 事件处理器
         */
        removeFullscreenchange:(handle) => {
            tkUtils.tool.removeEvent(document,"fullscreenchange",handle,false);
            tkUtils.tool.removeEvent(document,"webkitfullscreenchange",handle,false);
            tkUtils.tool.removeEvent(document,"mozfullscreenchange",handle,false);
            tkUtils.tool.removeEvent(document,"MSFullscreenChange",handle,false);
            tkUtils.tool.removeEvent(document,"msfullscreenchange",handle,false);
            tkUtils.tool.removeEvent(document,"fullscreeneventchange",handle,false);
        },
        /**为全屏添加全屏事件fullscreenerror
         @method addFullscreenerror
         @param   {Function} handle 事件处理器
         */
        addFullscreenerror :(handle) => {
            tkUtils.tool.addEvent(document,"fullscreenerror",handle,false);
            tkUtils.tool.addEvent(document,"webkitfullscreenerror",handle,false);
            tkUtils.tool.addEvent(document,"mozfullscreenerror",handle,false);
            tkUtils.tool.addEvent(document,"MSFullscreenError",handle,false);
            tkUtils.tool.addEvent(document,"msfullscreenerror",handle,false);
            tkUtils.tool.addEvent(document,"fullscreenerroreventchange",handle,false);
        },
        /**移除全屏添加全屏事件fullscreenerror
         @method removeFullscreenerror
         @param   {Function} handle 事件处理器
         */
        removeFullscreenerror :(handle) => {
            tkUtils.tool.removeEvent(document,"fullscreenerror",handle,false);
            tkUtils.tool.removeEvent(document,"webkitfullscreenerror",handle,false);
            tkUtils.tool.removeEvent(document,"mozfullscreenerror",handle,false);
            tkUtils.tool.removeEvent(document,"MSFullscreenError",handle,false);
            tkUtils.tool.removeEvent(document,"msfullscreenerror",handle,false);
            tkUtils.tool.removeEvent(document,"fullscreenerroreventchange",handle,false);
        },
        /**绑定事件
         @method addEvent
         @param   {element} element 添加事件元素
         {string} eType 事件类型
         {Function} handle 事件处理器
         {Bollean} bol false 表示在事件第三阶段（冒泡）触发，true表示在事件第一阶段（捕获）触发。
         */
        addEvent:(element, eType, handle, bol) => {
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
        removeEvent:(element, eType, handle, bol) => {
            if(element.addEventListener){
                element.removeEventListener(eType, handle, bol);
            }else if(element.attachEvent){
                element.detachEvent("on"+eType, handle);
            }else{
                element["on"+eType] = null;
            }
        },
        /**自动元素定位--中间定位
         @method autoElementPositionCneter
         @param {element} $ele 定位元素
         */
        autoElementPositionCneter: ($ele) => {
            $ele.css({
                "margin-left":(-$ele.width()/2)+"px" ,
                "margin-top":(-$ele.height()/2)+"px"
            });
        } ,
        /**清除元素定位--中间定位
         @method clearElementPositionCneter
         @param {element} $ele 定位元素
         */
        clearElementPositionCneter: ($ele) => {
            $ele.css({
                "margin-left":"" ,
                "margin-top":""
            });
        }
    },
    getGUID:() => { //获取GUID
        function GUID(){
            this.date = new Date();   /* 判断是否初始化过，如果初始化过以下代码，则以下代码将不再执行，实际中只执行一次 */
            if (typeof this.newGUID != 'function') {   /* 生成GUID码 */
                GUID.prototype.newGUID = function () {
                    this.date = new Date();
                    let guidStr = '';
                    let sexadecimalDate = this.hexadecimal(this.getGUIDDate(), 16);
                    let sexadecimalTime = this.hexadecimal(this.getGUIDTime(), 16);
                    for (let i = 0; i < 9; i++) {
                        guidStr += Math.floor(Math.random() * 16).toString(16);
                    }
                    guidStr += sexadecimalDate;
                    guidStr += sexadecimalTime;
                    while (guidStr.length < 32) {
                        guidStr += Math.floor(Math.random() * 16).toString(16);
                    }
                    return this.formatGUID(guidStr);
                }
                /* * 功能：获取当前日期的GUID格式，即8位数的日期：19700101 * 返回值：返回GUID日期格式的字条串 */
                GUID.prototype.getGUIDDate = function () {
                    return this.date.getFullYear() + this.addZero(this.date.getMonth() + 1) + this.addZero(this.date.getDay());
                }
                /* * 功能：获取当前时间的GUID格式，即8位数的时间，包括毫秒，毫秒为2位数：12300933 * 返回值：返回GUID日期格式的字条串 */
                GUID.prototype.getGUIDTime = function () {
                    return this.addZero(this.date.getHours()) + this.addZero(this.date.getMinutes()) + this.addZero(this.date.getSeconds()) + this.addZero(parseInt(this.date.getMilliseconds() / 10));
                }
                /* * 功能: 为一位数的正整数前面添加0，如果是可以转成非NaN数字的字符串也可以实现 * 参数: 参数表示准备再前面添加0的数字或可以转换成数字的字符串 * 返回值: 如果符合条件，返回添加0后的字条串类型，否则返回自身的字符串 */
                GUID.prototype.addZero = function (num) {
                    if (Number(num).toString() != 'NaN' && num >= 0 && num < 10) {
                        return '0' + Math.floor(num);
                    } else {
                        return num.toString();
                    }
                }
                /*  * 功能：将y进制的数值，转换为x进制的数值 * 参数：第1个参数表示欲转换的数值；第2个参数表示欲转换的进制；第3个参数可选，表示当前的进制数，如不写则为10 * 返回值：返回转换后的字符串 */GUID.prototype.hexadecimal = function (num, x, y) {
                    if (y != undefined) { return parseInt(num.toString(), y).toString(x); }
                    else { return parseInt(num.toString()).toString(x); }
                }
                /* * 功能：格式化32位的字符串为GUID模式的字符串 * 参数：第1个参数表示32位的字符串 * 返回值：标准GUID格式的字符串 */
                GUID.prototype.formatGUID = function (guidStr) {
                    let str1 = guidStr.slice(0, 8) + '-', str2 = guidStr.slice(8, 12) + '-', str3 = guidStr.slice(12, 16) + '-', str4 = guidStr.slice(16, 20) + '-', str5 = guidStr.slice(20);
                    return str1 + str2 + str3 + str4 + str5;
                }
            }
        }
        return new GUID();
    } ,
    getNewGUID:() => { //获取初始化
        if(!tkUtils.guidObj){
            tkUtils.guidObj = new tkUtils.getGUID();
        }
        let guid = tkUtils.guidObj.newGUID();
        tkUtils.guidObj = null ;
        return guid ;
    } ,
    getBrowserInfo: () =>{  //获取浏览器基本信息
        //判断访问终端
        let browser={
            versions:function(){
                let u = navigator.userAgent, app = navigator.appVersion;
                return {
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                    iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
                };
            }(),
            language:(navigator.browserLanguage || navigator.language).toLowerCase() ,
            info:{
                appCodeName:navigator.appCodeName , //返回浏览器的代码名。
                appMinorVersion:navigator.appMinorVersion , //返回浏览器的次级版本。
                appName:navigator.appName , //返回浏览器的名称。
                appVersion:navigator.appVersion ,  //	返回浏览器的平台和版本信息。
                browserLanguage:navigator.browserLanguage , //	返回当前浏览器的语言。
                cookieEnabled: navigator.cookieEnabled , //	返回指明浏览器中是否启用 cookie 的布尔值。
                cpuClass:navigator.cpuClass , //	返回浏览器系统的 CPU 等级。
                onLine:navigator.onLine , //	返回指明系统是否处于脱机模式的布尔值。
                platform:navigator.platform , //	返回运行浏览器的操作系统平台。
                systemLanguage:navigator.systemLanguage ,  //返回 OS 使用的默认语言。
                userAgent:navigator.userAgent , //返回由客户机发送服务器的 user-agent 头部的值。
                userLanguage:navigator.userLanguage , //	返回 OS 的自然语言设置。

            }
        }
        return browser ;
    },
    isEmpty:(obj) => {
        let keys = Object.keys(obj) ;
        return keys.length === 0;
    } ,
    getUrlParams: (key , url) => {
        /*charCodeAt()：返回指定位置的字符的 Unicode 编码。这个返回值是 0 - 65535 之间的整数。
         fromCharCode()：接受一个指定的 Unicode 值，然后返回一个字符串。
         encodeURIComponent()：把字符串作为 URI 组件进行编码。
         decodeURIComponent()：对 encodeURIComponent() 函数编码的 URI 进行解码。*/
        let href = window.location.href ;
        if(TkConstant){
            href = tkUtils.decrypt( TkConstant.SERVICEINFO.joinUrl ) || window.location.href;
        }
        href = url || href;
        // let urlAdd = decodeURI(href);
        let urlAdd = decodeURIComponent(href);
        let urlIndex = urlAdd.indexOf("?");
        let urlSearch = urlAdd.substring(urlIndex + 1);
        let reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");   //reg表示匹配出:$+url传参数名字=值+$,并且$可以不存在，这样会返回一个数组
        let arr = urlSearch.match(reg);
        if(arr != null) {
            return arr[2];
        } else {
            return "";
        }
    } ,
    /*字符串第一个首字母转大写
    * @method replaceFirstUper
    * @params [str:string]*/
    replaceFirstUper: (str) => {
        if(str.length>0){
            let tmpChar = str.substring(0,1).toUpperCase();
            let postString = str.substring(1);
            let  tmpStr = tmpChar + postString;
            return tmpStr ;
        }else{
            str
        }
    } ,
    /*判断是否是数组
     * @method isArray
     * @params [object:any]*/
    isArray: (object) => {
        return Array && Array.isArray && typeof  Array.isArray === 'function' ?  Array.isArray(object) : ( object && typeof object==='object' &&
            typeof object.length==='number' &&
            typeof object.splice==='function' &&
            //判断length属性是否是可枚举的 对于数组 将得到false
            !(object.propertyIsEnumerable('length')) );
    } ,
    /*过滤包含以data-开头的属性
    * @method filterContainDataAttribute */
    filterContainDataAttribute:(attributeObj) => {
        const that = tkUtils ;
        if(attributeObj && !that.isArray(attributeObj) && typeof attributeObj === "object"){
            let tmpAttributeObj = {} ;
            for (let [key, value] of Object.entries(attributeObj)) {
                if(/^data-/g.test(key)){
                    tmpAttributeObj[key] = value ;
                }
            }
            return tmpAttributeObj ;
        }else{
            return attributeObj ;
        }
    } ,
    /*根据文件后缀名判断属于什么文件类型*/
    getFiletyeByFilesuffix:(filesuffix) => {

        let filetype = undefined;
        if (filesuffix == "jpg" || filesuffix == "jpeg" || filesuffix == "png" || filesuffix == "gif" || filesuffix == "ico" || filesuffix == "bmp") {
            filetype = "jpg"; //图片
        } else if (filesuffix == "doc" || filesuffix == "docx" || filesuffix == "rtf") {
            filetype = "doc"; //文档
        } else if (filesuffix == "pdf") {
            filetype = "pdf";  //pdf
        } else if (filesuffix == "ppt" || filesuffix == "pptx" || filesuffix == "pps") {
            filetype = "ppt"; //ppt
        } else if (filesuffix == "txt") {
            filetype = "txt"; //txt
        } else if (filesuffix == "xls" || filesuffix == "xlsx") {
            filetype = "xlsx"; //xlsx
        } else if (filesuffix == "mp4" || filesuffix == "webm") {
            //video:.mp4  , .webm
            filetype = "mp4";
        } else if (filesuffix == "mp3" || filesuffix == "wav") {
            //audio:.mp3 , .wav , .ogg
            filetype = "mp3";
        }else if (filesuffix == "zip" ) {
            //h5
            filetype = "h5";
        }else if(filesuffix === "whiteboard"){
            filetype = "whiteboard" ;
        } else {
            filetype = "other";
        }
        return filetype; //jpg、doc、pdf、ppt、txt、xlsx、mp4、mp3、other
    },
    /*是否是函数*/
    isFunction:( callback ) => {
        return  callback && typeof callback === 'function' ;
    },
    /*从用户中获取用户的自定义属性*/
    getCustomUserPropertyByUser:(user)=>{
        let  customUserproperty  = {
            disableaudio:user.disableaudio ,
            disablevideo:user.disablevideo ,
            giftnumber:user.giftnumber ,
            hasaudio:user.hasaudio ,
            hasvideo:user.hasvideo  ,
            publishstate:user.publishstate ,
            raisehand:user.raisehand
        }  ;
        return customUserproperty;
    } ,
    /*计算时间差，转为hh,mm,ss*/
    getTimeDifferenceToFormat: (start  , end) => {
        let difference = end - start  ;//时间差的毫秒数
        if(difference >= 0)	{
            //计算出相差天数
            let days = Math.floor(difference / (24 * 3600 * 1000));
            //计算出小时数
            let leave1 = difference % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
            let hours = Math.floor(leave1 / (3600 * 1000));
            //计算相差分钟数
            let leave2 = leave1 % (3600 * 1000);       //计算小时数后剩余的毫秒数
            let minutes = Math.floor(leave2 / (60 * 1000));
            //计算相差秒数
            let leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
            let seconds = Math.round(leave3 / 1000);
            let daysAddHour = hours + (days * 24);  //加上天数的小时数
            let clock = {};
            if(seconds >=60){
                seconds = 0 ;
                minutes += 1 ;
            }
            if(minutes >=60){
                minutes = 0 ;
                daysAddHour += 1 ;
            }
            clock.hh = daysAddHour > 9 ? daysAddHour : '0' + daysAddHour;
            clock.mm = minutes > 9 ? minutes : '0' + minutes;
            clock.ss = seconds > 9 ? seconds : '0' + seconds;
            return clock;
        }else{
            L.Logger.error('Start time is greater than end time [start:'+start+'  , end:'+end+']!' );
            return undefined ;
        }
    },
    /*判断时间是秒级还是毫秒级 ,true:毫秒级 ， false:秒级 , undefined:传入的时间不正确 */
    isMillisecondClass:(time) => {
        if(typeof time !== 'number'  ){L.Logger.error('time must is number!');return ;};
        time = String(time);
        let length = time.length ;
        if( length === 13  ){
            return true; //毫秒级
        }else if(  length === 10  ) {
            return false; //秒级
        }else{
            L.Logger.warning('The incoming time is incorrect and cannot be judged to be second or second!');
            return undefined ;
        }
    } ,
    /**
     * 加密函数
     * @param str 待加密字符串
     * @returns {string}
     */
    encrypt: (str , encryptRandom ) => {
        if(!str){return str;}
        if( TkConstant ){
            if( TkConstant.DEV || TkConstant.debugFromAddress ) { //开发模式
                return str;
            }
        }else{
            let DEV = false ;
            try{
                DEV = __DEV__ ;
            }catch (e){
                L.Logger.warning('There is no configuration dev mark[__DEV__]!');
            }
            if( DEV || tkUtils.getUrlParams('debug') ) { //开发模式
                return str;
            }
        }
        encryptRandom = encryptRandom != undefined ? encryptRandom : 'talk_2017_@beijing' ;
        let out = hex64Instance.enc(str);
        out = encryptRandom + out + encryptRandom ;
        return out
    },
    /**
     * 解密函数
     * @param str 待解密字符串
     * @returns {string}*/
    decrypt: (str , encryptRandom ) => {
        if(!str){return str;}
        if( TkConstant ){
            if( TkConstant.DEV || TkConstant.debugFromAddress ) { //开发模式
                return str;
            }
        }else{
            let DEV = false ;
            try{
                DEV = __DEV__ ;
            }catch (e){
                L.Logger.warning('There is no configuration dev mark[__DEV__]!');
            }
            DEV = false ;
            if( DEV || tkUtils.getUrlParams('debug') ) { //开发模式
                return str;
            }
        }
        encryptRandom = encryptRandom != undefined ? encryptRandom : 'talk_2017_@beijing' ;
        let regExp = new RegExp( encryptRandom , 'gm' ) ;
        str = str.replace( regExp , '' );
        let out = hex64Instance.dec(str);
        return out
    }
};
export default  tkUtils ;