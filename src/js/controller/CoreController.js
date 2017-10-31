/**
 * UI-总控制中心
 * @module CoreController
 * @description  用于控制页面组件的通信
 * @author QiuShao
 * @date 2017/7/5
 */
'use strict';
import eventObjectDefine from 'eventObjectDefine';
import $ from 'jquery';
import RoomHandler from 'RoomHandler';
import RoleHandler from 'RoleHandler';
import StreamHandler from 'StreamHandler';
import TkConstant from 'TkConstant';
import TkGlobal from 'TkGlobal';
import TkUtils from 'TkUtils';
import TkAppPermissions from 'TkAppPermissions';
import ServiceTools from  'ServiceTools' ;
import ServiceRoom from  'ServiceRoom' ;
import handlerCoreController from  './handlerCoreController' ;
import handlerIframeMessage from  './handlerIframeMessage' ;


const coreController = TK.EventDispatcher( {} ) ;
eventObjectDefine.CoreController = coreController ;
coreController.handler = {};
/*加载系统所需的信息
* @method loadSystemRequiredInfo*/
coreController.handler.loadSystemRequiredInfo = () => {
    /*禁止浏览器右键*/
    document.oncontextmenu = null ;
    document.oncontextmenu = function() {return false;};

    window.onbeforeunload = null ;
    window.onbeforeunload = function () { //onbeforeunload 事件在即将离开当前页面（刷新或关闭）时触发
        if(ServiceRoom.getTkRoom()){
            ServiceRoom.getTkRoom().leaveroom();
        }
    };

    /*禁止选中文字*/
    $(document).off("selectstart");
    $(document).bind("selectstart", function () { return true; });

    if(TK.tkLogPrintConfig){
        //DEBUG = 0, TRACE = 1, INFO = 2, WARNING = 3, ERROR = 4, NONE = 5,
        if( TkConstant.DEV || TkConstant.debugFromAddress ){ //开发模式
            let socketLogConfig = {
                debug:true ,
            } , loggerConfig = {
                development:true ,
                logLevel:TkConstant.LOGLEVEL.DEBUG ,
            }, adpConfig = {
                webrtcLogDebug:true
            };
            TK.tkLogPrintConfig( socketLogConfig , loggerConfig , adpConfig );
        }else{//发布模式
            let socketLogConfig = {
                debug:false ,
            } , loggerConfig = {
                development:false ,
                logLevel:TkConstant.LOGLEVEL.WARNING ,
            }, adpConfig = {
                webrtcLogDebug:false
            };
            TK.tkLogPrintConfig( socketLogConfig , loggerConfig , adpConfig );
        }
    }

    ServiceTools.getAppLanguageInfo(function (languageInfo) { //加载语言包
        TkGlobal.language = languageInfo ;
    });
    handlerCoreController.setPageStyleByDomain();//根据公司domain决定加载的页面样式布局*
    
     //初始化
    if( TK.Initialize ){
        TK.Initialize( TkGlobal.isBroadcastClient , TkGlobal.isBroadcastClient ? 1 : undefined);//xueln 添加
    }
};

/*执行checkroom*/
coreController.handler.checkRoom = () => {
    let checkroomEventData = {
        type:TkConstant.EVENTTYPE.OtherEvent.checkRoom ,
        message:{}
    };
    eventObjectDefine.CoreController.dispatchEvent(checkroomEventData);
};

/*执行initPlaybackInfo*/
coreController.handler.initPlaybackInfo = () => {
    if(!TkGlobal.playback){L.Logger.error('No playback environment!');return;} ;
    let initPlaybackInfoEventData = {
        type:TkConstant.EVENTTYPE.OtherEvent.initPlaybackInfo ,
        message:{}
    };
    eventObjectDefine.CoreController.dispatchEvent(initPlaybackInfoEventData);
};

/*核心控制器操控系统权限-更新和获取以及初始化权限*/
coreController.handler.setAppPermissions = ( appPermissionsKey ,appPermissionsValue )=> {
    TkAppPermissions.setAppPermissions(appPermissionsKey ,appPermissionsValue);
};
coreController.handler.getAppPermissions = ( appPermissionsKey  )=> {
   return TkAppPermissions.getAppPermissions(appPermissionsKey );
};
coreController.handler.initAppPermissions = ( initAppPermissionsJson)=> {
    TkAppPermissions.initAppPermissions(initAppPermissionsJson);
};
coreController.handler.checkRoleConflict = (user , isEvictUser) => {
    return RoleHandler.checkRoleConflict(user , isEvictUser);
};
coreController.handler.handlerOnMessage = (event) => {
    return handlerIframeMessage.handlerOnMessage(event);
};
coreController.handler.addEventListenerOnCoreController = () => {
    handlerIframeMessage.addEventListener();
    const rootElement = document.getElementById('all_root') ||  document.getElementsByTagName('html');
    $(window).off("resize");
    $(window).resize(function () { //窗口resize事件监听
        let defalutFontSize = window.innerWidth / TkConstant.STANDARDSIZE ;
        //5rem = defalutFontSize*'5px' ;
        if(rootElement){
            let rootEle = TkUtils.isArray(rootElement) ? rootElement[0] : rootElement ;
            if(rootEle){
                rootEle.style.fontSize = defalutFontSize+ 'px';
            }
        }
        eventObjectDefine.Window.dispatchEvent({ type:TkConstant.EVENTTYPE.WindowEvent.onResize , message:{defalutFontSize:defalutFontSize} });
    });

    /*接收IFrame框架的消息*/
    TkUtils.tool.removeEvent(window ,'message' ) ;
    $(window).off("message");
    TkUtils.tool.addEvent(window ,'message' , function(event){    //给当前window建立message监听函数
        if(coreController.handler.handlerOnMessage){
           let isReturn =  coreController.handler.handlerOnMessage(event);
           if(isReturn){
               return ;
           }
        }
        eventObjectDefine.Window.dispatchEvent({ type:TkConstant.EVENTTYPE.WindowEvent.onMessage , message:{event:event} });
    } , false  );


    $(document).off("keydown");
    $(document).keydown(function(event){
        event = event || window.event ;
        eventObjectDefine.Document.dispatchEvent({ type:TkConstant.EVENTTYPE.DocumentEvent.onKeydown , message:{keyCode:event.keyCode} });
    });

    TkUtils.tool.removeFullscreenchange();
    TkUtils.tool.addFullscreenchange( function (event) {
        eventObjectDefine.Document.dispatchEvent({ type:TkConstant.EVENTTYPE.DocumentEvent.onFullscreenchange , message:{event:event} });
    } ) ;
    
    /*checkroom事件*/
    eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.OtherEvent.checkRoom , function (checkRoomEventData) {
        let {checkroomServiceUrl, checkroomServicePort, checkMeetingAterCallback  , roomConnectedSuccessCallback} = checkRoomEventData.message ;
        RoomHandler.checkroom(checkroomServiceUrl, checkroomServicePort, checkMeetingAterCallback  , roomConnectedSuccessCallback);
    });

    /*checkroom事件*/
    eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.OtherEvent.initPlaybackInfo , function (initPlaybackInfoEventData) {
        if(!TkGlobal.playback){L.Logger.error('No playback environment!');return;} ;
        let {initPlaybackInfoServiceUrl, initPlaybackInfoServicePort, initPlaybackInfoAterCallback  , roomConnectedSuccessCallback} = initPlaybackInfoEventData.message ;
        RoomHandler.initPlaybackInfo(initPlaybackInfoServiceUrl, initPlaybackInfoServicePort, initPlaybackInfoAterCallback  , roomConnectedSuccessCallback);
    });

};
coreController.handler.addEventListenerOnCoreController();

export default coreController ;
