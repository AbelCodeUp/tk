import React, { Component } from 'react';
import eventObjectDefine from 'eventObjectDefine';
import TkGlobal from 'TkGlobal';
import ServiceTooltip from 'ServiceTooltip';

class Video extends Component{
	constructor(props,context){
		super(props,context);
		this.state={
			pullUrl:''
		}
	}

    componentDidMount(){
        //this.video(this.props.pullUrl)
		let that = this;
		//Log.info("Video this.props.pullUrl = ",that.props.pullUrl);
    }

	render(){
		return(
			<div className="videoWrap clear-float video-participants-vessel">
				<textarea id="logComments" ></textarea>
				<div id="player"></div>
			</div>
		)
	}
	
	videoFlash(){
		function initSwf(){
            let swfVersionStr = "11.3.0"; // flash版本号
            let xiSwfUrlStr = "playerProductInstall.swf";
			
			// json对象，为flash传递一些初始化信息
	        let flashvars = {};
			
			// 设置flash的样式
            let params = {};
	        params.quality = "high";             // video开启平滑处理时要求设置为高品质
	        params.bgcolor = "#000000";          // swf容器的背景色，不影响网页背景色
			params.wmode = "transparent";        
	        params.allowfullscreen = "true";     // 是否允许全屏
			params.allowscriptaccess = "always"; // 是否允许跨域
			params.allowFullScreenInteractive = "true"; // 是否允许带键盘交互的全屏		
	        
			
			// 嵌入flash完成时的object标签的ID，name等属性
            let attributes = {};
	        attributes.id = "cloudvPlayer";
	        attributes.name = "cloudvPlayer";
	        attributes.align = "middle";
			
			//embedSWF 参数解释：
	        // 参数1：swf 文件地址
	        // 参数2：swf 文件容器
	        // 参数3：flash 的宽度
	        // 参数4：flash 的高度
	        // 参数5：正常播放该 flash 的最低版本
			// 可选参数信息：
	        // 参数6：版本低于当前要求时，执行该 swf 文件，跳转到官方下载最新版本的 flash 插件
			// 参数7：为flash传递一些参数信息
			// 参数8：设置flash的样式
			// 参数9：嵌入flash完成时的object标签的ID，name等属性
			// 参数10：定义一个在执行embedSWF方法后，嵌入flash成功或失败后都可以回调的 JS 函数
	        swfobject.embedSWF("cloudvPlayer.swf", "flashContent", "800", "450", swfVersionStr, xiSwfUrlStr, flashvars, params, attributes);
	        swfobject.createCSS("#flashContent", "display:block; text-align:left; background-color: #000000;");
		}
		// 网页准备就绪
		$(document).ready(readyLoadSwf);
		
	    // 网页加载完毕，开始加载播放器		
		function readyLoadSwf() {
			initSwf();
		}
			// 播放器加载完毕，播放器通知回调接口
		function loadWsPlayerComplete() {
			onPlayHandler();
			console.warn( "loadWsPlayerComplete!" );
		}
	
		//播放入口
		function onPlayHandler() {
		    let args = {
				url: "http://vodflv.haplat.net/static/trailer/flv/trailer_200000.flv",		
				isLive: false, videoType: "vod"
		    };	
			// cloudvPlayer为播放器初始化中的attributes.id值
		    thisMapMovie("cloudvPlayer").jsPlay(args);
		}
	
		// 获取播放器对象
		function thisMapMovie(movieName) {
		    if (window.document[movieName]) {
		        return window.document[movieName];
		    }
		    if (navigator.appName.indexOf("Microsoft Internet") == -1) {
		        if (document.embeds && document.embeds[movieName]) return document.embeds[movieName];
		    } else {
		        return document.getElementById(movieName);
		    }
		}
	
		function onCloseHandler() {
	    	thisMapMovie("cloudvPlayer").jsClose();
		}
		
		function wsPlayerLogHandler(log, obj) {
			console.log( log );
			if(obj) {
				for(let id in obj) {
					console.log( id + ":" + obj[id] );
				}
			}
		}
		
	}
	videoHls(pullurl){//视频直播  网宿代码   //拉流地址
		console.log(pullurl)	
		let logElem = document.getElementById("logComments");
		function logDebug(info) {
			logElem.value += info + "\n";
		}
		
		function getRequestArgs() {
            let url = location.search;
            let reqArgs = new Object();
			if(url.indexOf("?") != -1) {
                let turl = url.substr(1);
                let args = turl.split("&");
				for(let i=0; i<args.length; i++) {
					 reqArgs[args[i].split("=")[0]] = unescape(args[i].split("=")[1]);
				}
			}   
			return reqArgs; 
		}
		
		let videoType = "hls";
        let requestArgs = getRequestArgs();
		for(let idx in requestArgs) {
			switch(idx) {
				case "type": {
					videoType = requestArgs[idx];
				}; break;
			}		
		}
	
		if(Clappr.isSupportMSE()) {
			logDebug( "MSE is supported." );
		} else {
			logDebug( "MSE is unsupported." );
		}	
		logDebug("videoType=" + videoType);

        let h5player = null;
        let callbacks = {
			log: logDebug,
			video: videoCallBack,
			error: videoErrorCallback,
			progress: progressCallback,
			timeUpdate: timeupdateCallback,
		};
		switch(videoType) {
			case "vod": 
			case "vod1": 
			case "vod2": 
			case "vod3":
			case "vod4": {
                let vodParam = {
					parentId:"#player", disableVideoTagContextMenu:true, autoPlay:true,
					logoPos:"left", logoLinkUrl: "http://www.baidu.com",
					logo:"http://smep.s.wcsapi.biz.matocloud.com/linxj/sinar2/WS3.png",
					playerSkinType: 1, enableSetting: false, muted: false, 
					
					video: "http://192.168.15.34/lxj/mp4/test1/test1.mp4",
					
					//前贴/中贴/后贴广告
					//beforeAd:{ src:"http://vodflv.haplat.net/static/load/ad/advert1_mp4_10s.mp4", url:"http://www.baidu.com" },
					//afterAd: { src:"http://vodflv.haplat.net/static/load/ad/advert1_mp4_10s.mp4", url:"http://www.baidu.com" },
					//midAd:{ src:'http://www.roctoday.com.cn/portfolio/brand/images/chinanet-01.jpg',duration:10,start:0.2,url:"http://www.baidu.com"},
					
					/*list:{
						0:{ videoType:'vod', videoClaritySwitchID:2, title:"列表0", duration:10,
							url:"http://192.168.15.34/lxj/mp4/test1/test1.mp4",
							originalClarityUrl:"http://192.168.15.34/lxj/mp4/test1/test1_original.mp4",
							fluencyClarityUrl:"http://192.168.15.34/lxj/mp4/test1/test1_fluency.mp4",
							hdClarityUrl:"",
							superClarityUrl:"",
							cover:"http://tpic.home.news.cn/newsVideo/video/videoStore/videoPic/2016/8/d8c2eafd90c266e19ab9dcacc479f8af-b-1.png"
						},
						1:{ videoType:'vod', videoClaritySwitchID:3, title:"列表1", duration:10,
							url: "http://192.168.15.34/lxj/mp4/test2/test2.mp4",
							originalClarityUrl: "http://192.168.15.34/lxj/mp4/test2/test2_original.mp4",
							fluencyClarityUrl: "http://192.168.15.34/lxj/mp4/test2/test2_fluency.mp4",
							standardClarityUrl: "http://192.168.15.34/lxj/mp4/test2/test2_standard.mp4",
							hdClarityUrl:"",						
							cover:"http://tpic.home.news.cn/newsVideo/video/videoStore/videoPic/2016/1/82067a40efb614b52b09cfb62c45918c-b-1.png"
						},
						2:{ videoType:'vod', videoClaritySwitchID:2, title:"列表2", duration:10,
							url: "http://192.168.15.34/lxj/mp4/test3/test3.mp4",
							originalClarityUrl: "http://192.168.15.34/lxj/mp4/test3/test3_original.mp4",
							fluencyClarityUrl: "http://192.168.15.34/lxj/mp4/test3/test3_fluency.mp4",
							hdClarityUrl:"",
							superClarityUrl:"",
							cover:"http://tpic.home.news.cn/newsVideo/video/videoStore/videoPic/2016/8/d8c2eafd90c266e19ab9dcacc479f8af-b-1.png"
						}		
					}*/
				};
				if(videoType != "vod4") {
					/*vodParam.levelConfig = {
						labels: {
							//0: '默认',
							1: '原画',
							2: '流畅',
							3: '标清',
							//4: '高清',
							5: '超清'
						},
						urls:{
							//0: "http://192.168.15.34/lxj/mp4/test1/test1.mp4",
							1: "http://192.168.15.34/lxj/mp4/test1/test1_original.mp4",
							2: "http://192.168.15.34/lxj/mp4/test1/test1_fluency.mp4",
							3: "http://192.168.15.34/lxj/mp4/test1/test1_standard.mp4",
							//4: "http://192.168.15.34/lxj/mp4/test1/test1_high.mp4",
							5: "http://192.168.15.34/lxj/mp4/test1/test1_super.mp4",
						},
						currentLevel: 3
					};*/
				}			
				if(videoType == "vod1") {
					vodParam.beforeAd = { src:"http://vodflv.haplat.net/static/load/ad/advert1_mp4_10s.mp4", url:"http://www.baidu.com" };
				} else if(videoType == "vod2") {
					vodParam.afterAd = { src:"http://vodflv.haplat.net/static/load/ad/advert1_mp4_10s.mp4", url:"http://www.baidu.com" };
				} else if(videoType == "vod3") {
					vodParam.beforeAd = { src:"http://vodflv.haplat.net/static/load/ad/advert1_mp4_10s.mp4", url:"http://www.baidu.com" };
					vodParam.afterAd = { src:"http://vodflv.haplat.net/static/load/ad/advert1_mp4_10s.mp4", url:"http://www.baidu.com" };
				}			
				vodParam.callbacks = callbacks;			
				h5player = new Clappr.Player( vodParam );		
			}; break;
			case "hls": {
                let hlsparam = {
					parentId:"#player", disableVideoTagContextMenu:true, autoPlay:true,
					//logoPos:"right", logoLinkUrl: "http://www.baidu.com",
					logo:"http://smep.s.wcsapi.biz.matocloud.com/linxj/sinar2/WS3.png",
					playerSkinType: 1, enableSetting: false, muted: false,				
					enableErrorHint: false, errorHintInfo: "主播正在休息，请换个主播看看吧~",
					
					//liveCutFlag: false, liveCutPlayerUrl: "http://192.168.15.34/lxj/mp4/test1/test1.mp4",				
					video:pullurl//"http://ovplive.haplat.net/test1/2b0b0a8a042f419dbef98e1dfe42469d/playlist.m3u8"
				};		
				hlsparam.callbacks = callbacks;
				h5player = new Clappr.Player( hlsparam );
			}; break;
		    case "flv": {
				if(Clappr.isSupportMSE()) {
                    let flvparam = {
						parentId:"#player", disableVideoTagContextMenu:true, autoPlay:true,
						//logoPos:"right", logoLinkUrl: "http://www.baidu.com",
						logo:"http://smep.s.wcsapi.biz.matocloud.com/linxj/sinar2/WS3.png",
						playerSkinType: 1, enableSetting: false, muted: false, videoType: "flv", 
								
						//liveCutFlag: false, liveCutPlayerUrl: "http://vodflv.haplat.net/static/load/ad/advert1_mp4_10s.mp4",					
						video: "http://ovplive.haplat.net/test1/2b0b0a8a042f419dbef98e1dfe42469d.flv"
						//isLive: false, video: "http://192.168.15.34/h5Player/flv/KongFu.Panda.400kbps.flv"
					};
					flvparam.callbacks = callbacks;
					h5player = new Clappr.Player( flvparam );
				}		
			}; break;
			case "vr": {
                let video360param = {
					parentId:"#player", disableVideoTagContextMenu:true, autoPlay:true,
					playerSkinType: 1, enableSetting: false, muted: false,	
					//logoPos:"right", logoLinkUrl: "http://www.baidu.com",
					logo:"http://smep.s.wcsapi.biz.matocloud.com/linxj/sinar2/WS3.png",
					
					video: "cool.mp4",				
					plugins: {
						container: [Video360]
					}
				};
				video360param.callbacks = callbacks;
				h5player = new Clappr.Player( video360param );
			}; break;
		};
		
		// callback
		receivePlayerCallback();
		function receivePlayerCallback(player) {
			if(player) {
				h5player = player;
			}
		};
		function videoCallBack(event, data) {
			//console.log("trigger event: " + event);
			switch(event) {
				case "loadedmetadata": {
					//console.log(data.videoWidth);   // data is video element
					//console.log(data.videoHeight);  // you can get all attribution of video tag
					//console.log(data.duration);     // notice: suggest to get readonly attributions
				}; break;
				case "waiting": {
					// no data
				}; break;
				case "playing": {
					// no data
				}; break;
				case "pause": {
					// no data
				}; break;
				case "ended": {
					// no data
				}; break;
				case "error": {
					// data is {code: 1/2/3/4}
					console.log(data.code)
				}; break;
				case "seeking": {
					// data is current time of seek before
					//console.log("before seek time: " + data);
				}; break;
				case "seeked": {
					// data is current time of seek after
					//console.log("after seek time: " + data);
				}; break;
				case "fullscreen": {
					// data is isFullscreen(value of bool)
					//console.log("fullscreen: " + data);
				}; break;
			}
		}
		function videoErrorCallback(errCode, errMsg) {
			logDebug( "errCode=" + errCode + ", errMsg=" + errMsg);
		};
		function timeupdateCallback(tobj) {
			//console.log( tobj );
		}
		function progressCallback(pobj) {
			//console.log( pobj );
		}
			
	}
//	shouldComponentUpdate(nextProps, nextState){
//		return nextProps.pullUrl==this.props.pullUrl;
//	}
	componentWillReceiveProps(nextProps){
		const that=this;
		//上课后，播放视频，上课前提示信息
		if(TkGlobal.classBegin) {       //直播开始应该改变其状态
            console.log(nextProps.pullUrl);
            if (nextProps.pullUrl != this.props.pullUrl) {
                setTimeout(function () {//延时0.5秒
                    that.videoHls(nextProps.pullUrl);
                }, 500)
            }
        } else {
            ServiceTooltip.showPrompt(TkGlobal.language.languageData.alertWin.call.fun.audit.title.text);
		}

		
	}




//	shouldComponentUpdate(nextProps, nextState){

//		console.log('真假'+nextProps.pullUrl==this.props.pullUrl)
//		return nextProps.pullUrl==this.props.pullUrl;
//	}


//	componentDidUpdate(){
//		this.video(this.props.pullUrl)
//	}
	}
export default Video
