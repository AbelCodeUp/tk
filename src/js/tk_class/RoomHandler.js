/**
 * 房间相关处理类
 * @class RoomHandler
 * @description   提供 房间相关的处理功能
 * @author QiuShao
 * @date 2017/7/21
 */
'use strict';
import { hashHistory } from 'react-router'
import eventObjectDefine from 'eventObjectDefine';
import TkConstant from 'TkConstant' ;
import TkUtils from 'TkUtils' ;
import RoleHandler from 'RoleHandler' ;
import CoreController from 'CoreController' ;
import ServiceTooltip from 'ServiceTooltip' ;
import TkGlobal from "TkGlobal" ;
import WebAjaxInterface from "WebAjaxInterface" ;
import ServiceRoom from "ServiceRoom" ;
import ServiceSignalling from "ServiceSignalling" ;
import ServiceTools from "ServiceTools" ;
import TkAppPermissions from 'TkAppPermissions';

class RoomHandler{
    constructor(room){
        this.room = room ;
    } ;

    /*注册房间
    *@method registerRoom */
    registerRoom(roomInfo, roomConnectedSuccessCallback){
        let that = this;
        let userName = roomInfo.userName;
        let roomName = roomInfo.roomName;
        let userThirdid = roomInfo.userThirdid;
        //save tk & roomName & userName in service
        ServiceRoom.setRoomName(roomName);
        ServiceRoom.setUserName(userName);
        ServiceRoom.setUserThirdid(userThirdid);
        document.head.getElementsByTagName('title')[0].innerHTML = ServiceRoom.getRoomName(); //设置title为房间名字
        ServiceRoom.getTkRoom().getAVMgr().enumerateDevices( function (devicesInfo) {
            let hasDevice = devicesInfo.hasdevice;
            let audioPermissions = (TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleStudent || (TkConstant.hasRole.roleTeachingAssistant && TkConstant.joinRoomInfo.assistantOpenMyseftAV)) ? hasDevice["audioinput"] : false;   //xgd 17-09-15
            let vedioPermissions = (TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleStudent || (TkConstant.hasRole.roleTeachingAssistant && TkConstant.joinRoomInfo.assistantOpenMyseftAV)) ? hasDevice["videoinput"] : false;   //xgd 17-09-15
            ServiceRoom.setLocalStream( TK.Stream({ audio:audioPermissions, video: vedioPermissions , data: false , extensionId:ServiceRoom.getTkRoom().getMySelf().id , attributes:{ type:'video' }  }) );  //xgd 17-09-15
            that.registerEventToRoomAndLocalStream(roomConnectedSuccessCallback);
            if(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleStudent || (TkConstant.hasRole.roleTeachingAssistant && TkConstant.joinRoomInfo.assistantOpenMyseftAV) ){ //学生和老师才有初始化流的权限  //xgd 17-09-15
                ServiceRoom.getLocalStream().init();
            }else{
                that.joinRoom();
                eventObjectDefine.CoreController.dispatchEvent({type:'joinRoomLocalStreamNotInit'});
            }
        }  , {isSetlocalStorage:true} );
    };
    /*注册事件给room和localStream，与底层相关
    * @method  registerEventToRoom*/
    registerEventToRoomAndLocalStream(roomConnectedSuccessCallback){
        /**@description Room类-RoomEvent的相关事件**/
        for(let eventKey in TkConstant.EVENTTYPE.RoomEvent ){
            ServiceRoom.getTkRoom().addEventListener(TkConstant.EVENTTYPE.RoomEvent[eventKey], function(recvEventData) {
                L.Logger.info(TkConstant.EVENTTYPE.RoomEvent[eventKey]+" event:" , recvEventData );
                if(TkConstant.EVENTTYPE.RoomEvent[eventKey] === TkConstant.EVENTTYPE.RoomEvent.roomConnected && roomConnectedSuccessCallback && typeof roomConnectedSuccessCallback === "function") {
                    roomConnectedSuccessCallback();  //房间连接成功后的通知函数
                }
                eventObjectDefine.Room.dispatchEvent(recvEventData , false);
            });
        }

        /**@description Stream类-StreanEvent的相关事件**/
        for(let eventKey in TkConstant.EVENTTYPE.StreamEvent ){
            ServiceRoom.getLocalStream().addEventListener(TkConstant.EVENTTYPE.StreamEvent[eventKey], function(recvEventData) {
                L.Logger.info(TkConstant.EVENTTYPE.StreamEvent[eventKey]+" event:" , recvEventData );
                eventObjectDefine.Stream.dispatchEvent(recvEventData);
            });
        }
    };

    /*检测房间
    * method checkroom*/
    checkroom(checkroomServiceUrl, checkroomServicePort, checkroomAterCallback  , roomConnectedSuccessCallback){
        let that = this ;
        if(!TkGlobal.playback){
            checkroomServiceUrl = checkroomServiceUrl || TkConstant.SERVICEINFO.hostname ;
            checkroomServicePort = checkroomServicePort || TkConstant.SERVICEINFO.sdkPort ;
            let href =   TkUtils.decrypt( TkConstant.SERVICEINFO.joinUrl)  || window.location.href;
            let urlAdd = decodeURIComponent(href);
            let urlIndex = urlAdd.indexOf("?");
            let urlSearch = urlAdd.substring(urlIndex + 1);
            ServiceRoom.setTkRoom(TK.Room()) ;           
            let userid = TkUtils.getUrlParams('refresh_thirdid') ;
            ServiceRoom.getTkRoom().checkroom(checkroomServiceUrl, checkroomServicePort,urlSearch.toString(), function (ret, userinfo, roominfo) {
                if (ret != 0) {
                    L.Logger.warning('checkroom error', ret);
                    switch(ret) {
                        case -1:
                            ServiceTooltip.showError(TkGlobal.language.languageData.alertWin.login.func.checkMeeting.status_minus_1.text);
                            break;
                        case 3001:
                            ServiceTooltip.showError(TkGlobal.language.languageData.alertWin.login.func.checkMeeting.status_3001.text);
                            break;
                        case 3002:
                            ServiceTooltip.showError(TkGlobal.language.languageData.alertWin.login.func.checkMeeting.status_3002.text);
                            break;
                        case 3003:
                            ServiceTooltip.showError(TkGlobal.language.languageData.alertWin.login.func.checkMeeting.status_3003.text);
                            break;
                        case 4007:
                            ServiceTooltip.showError(TkGlobal.language.languageData.alertWin.login.func.checkMeeting.status_4007.text);
                            break;
                        case 4008:
                            ServiceTooltip.showError(TkGlobal.language.languageData.alertWin.login.func.checkMeeting.status_4008.text);
                            break;
                        case 4110:
                            ServiceTooltip.showError(TkGlobal.language.languageData.alertWin.login.func.checkMeeting.status_4110.text);
                            break;
                        case 4109:
                            ServiceTooltip.showError(TkGlobal.language.languageData.alertWin.login.func.checkMeeting.status_4109.text);
                            break;
                        case 4103:
                            ServiceTooltip.showError(TkGlobal.language.languageData.alertWin.login.func.checkMeeting.status_4103.text);
                            break;
                        case 4112:
                            ServiceTooltip.showError(TkGlobal.language.languageData.alertWin.login.func.checkMeeting.status_4112.text);
                            break;
                        default:
                            ServiceTooltip.showError(TkGlobal.language.languageData.alertWin.login.func.checkMeeting.status_defalut.text);
                            break;
                    }
                }
                else {
                    L.Logger.info('Trying to joinroom', userinfo , roominfo);
                    let chairmancontrol = ServiceRoom.getTkRoom().getRoomProperties().chairmancontrol ;
                    //ServiceRoom.getTkRoom().getRoomProperties().companyid = 10035;//测试数据!!!!!!
                    let joinRoomInfo = {
                        starttime : ServiceRoom.getTkRoom().getRoomProperties().starttime,
                        endtime : ServiceRoom.getTkRoom().getRoomProperties().endtime,
                        nickname:ServiceRoom.getTkRoom().getMySelf().nickname,
                        thirdid: ServiceRoom.getTkRoom().getMySelf().id ,
                        joinUrl: TkUtils.encrypt( href ) ,
                        serial: ServiceRoom.getTkRoom().getRoomProperties().serial,
                        roomrole: Number(ServiceRoom.getTkRoom().getMySelf().role),
                        roomtype: Number(ServiceRoom.getTkRoom().getRoomProperties().roomtype),
                        companyid:Number( ServiceRoom.getTkRoom().getRoomProperties().companyid ),
                        autoStartAV: (chairmancontrol? Number(chairmancontrol.substr(23, 1) ) === 1 : false) , //自动发布音视频
                        autoClassBegin:(chairmancontrol?  Number(chairmancontrol.substr(32, 1) ) == 1 : false) , //自动上课
                        studentCloseMyseftAV: (chairmancontrol? Number(chairmancontrol.substr(33, 1) ) == 1 :false), //学生能否关闭自己音视频
                        hiddenClassBegin: (chairmancontrol? Number(chairmancontrol.substr(34, 1) ) == 1 : false) , //隐藏上下课
                        isUploadH5Document: chairmancontrol? Number(chairmancontrol.substr(35, 1) ) == 1 : false , //是否上传H5课件           //xgd 17-09-14
                        assistantOpenMyseftAV: chairmancontrol? Number(chairmancontrol.substr(36, 1) ) == 1 : false , //助教是否开启音视频   //xgd 17-09-14
                        jumpurl:TkUtils.getUrlParams("jumpurl") ,
                        roomname:ServiceRoom.getTkRoom().getRoomProperties().roomname,
                        pullConfigure:ServiceRoom.getTkRoom().getRoomProperties().pullConfigure ,
                        pushConfigure:ServiceRoom.getTkRoom().getRoomProperties().pushConfigure, 
                        pushUrl:roominfo.pullid//目前为空
                    };
                    TkConstant.bindRoomInfoToTkConstant(joinRoomInfo); //绑定房间信息到TkConstant
                    TkConstant.bindParticipantHasRoleToTkConstant(); //绑定当前登录对象事是否拥有指定角色到TkConstant
                    if(TkGlobal.isBroadcastClient&&TkConstant.hasRole.roleChairman){//初始化直播
                    	let pushUrl=TkConstant.joinRoomInfo.pushConfigure.RTMP ;
                    	ServiceRoom.getTkRoom().initBroadcast(pushUrl,1024,1,48000,1);
//                  	ServiceRoom.getTkRoom().initBroadcast("rtmp://push-huantuo.8686c.com/live/017f5ec367f54cc6b23f6a4dd8635e57",1024,1,48000,1);
                    }
                    TkConstant.bindParticipantHasRoomtypeTkConstant(); //绑定当前登录对象事是否拥有指定教室到TkConstant
                    let roomInfo = {
                        userName: joinRoomInfo.nickname,
                        roomName: ServiceRoom.getTkRoom().getRoomProperties().roomname,
                        userThirdid: joinRoomInfo.thirdid,
                    };
                    if( checkroomAterCallback &&  typeof checkroomAterCallback === "function" ){
                        checkroomAterCallback();
                    }
                    /*跳转call*/
                    let timestamp = new Date().getTime() ;
                    that._saveAddressToSession(timestamp);/*保存登录地址到sessionStorage*/
                    hashHistory.push('/call?timestamp='+ timestamp);
                    that.registerRoom(roomInfo, roomConnectedSuccessCallback);
                }
            } , userid);
        }else{
            L.Logger.error('In the playback environment, cannot execute checkroom!');
            return;
        }
    };

    /*初始化回放参数，模拟checkroom
    * @method initPlaybackInfo */
    initPlaybackInfo(initPlaybackInfoServiceUrl, initPlaybackInfoServicePort, initPlaybackInfoAterCallback  , roomConnectedSuccessCallback){
        let that = this ;
        if(!TkGlobal.playback){
            L.Logger.error('No playback environment, no execution initPlaybackInfo!');
            return;
        }else{ //回放走的流程
            initPlaybackInfoServiceUrl = initPlaybackInfoServiceUrl || TkConstant.SERVICEINFO.hostname ;
            initPlaybackInfoServicePort = initPlaybackInfoServicePort || TkConstant.SERVICEINFO.sdkPort ;
            ServiceRoom.setTkRoom(TK.Room()) ;
            let playbackParams = {
                roomtype:TkUtils.getUrlParams('type'),
                serial:TkUtils.getUrlParams('serial'),
                recordfilepath:"http://"+TkUtils.getUrlParams('path'),
                domain:TkUtils.getUrlParams('domain'),
                host:TkUtils.getUrlParams('host'),
            };
            ServiceRoom.getTkRoom().initPlaybackInfo(initPlaybackInfoServiceUrl, initPlaybackInfoServicePort,playbackParams, function (userinfo, roominfo) {
                L.Logger.info('Trying to joinroom', userinfo , roominfo);
                let chairmancontrol = ServiceRoom.getTkRoom().getRoomProperties().chairmancontrol ;
                let href =   TkUtils.decrypt( TkConstant.SERVICEINFO.joinUrl)  || window.location.href;
                let joinRoomInfo = {
                    starttime : ServiceRoom.getTkRoom().getRoomProperties().starttime,
                    endtime : ServiceRoom.getTkRoom().getRoomProperties().endtime,
                    nickname:ServiceRoom.getTkRoom().getMySelf().nickname,
                    thirdid: ServiceRoom.getTkRoom().getMySelf().id ,
                    joinUrl: TkUtils.encrypt(href),
                    serial: ServiceRoom.getTkRoom().getRoomProperties().serial,
                    roomrole: Number(ServiceRoom.getTkRoom().getMySelf().role),
                    roomtype: Number(ServiceRoom.getTkRoom().getRoomProperties().roomtype),
                    companyid:Number( ServiceRoom.getTkRoom().getRoomProperties().companyid ),
                    autoStartAV: chairmancontrol? Number(chairmancontrol.substr(23, 1) ) === 1 : false , //自动发布音视频
                    autoClassBegin:chairmancontrol?  Number(chairmancontrol.substr(32, 1) ) == 1 : false , //自动上课
                    studentCloseMyseftAV: chairmancontrol? Number(chairmancontrol.substr(33, 1) ) == 1 :false, //学生能否关闭自己音视频
                    hiddenClassBegin: chairmancontrol? Number(chairmancontrol.substr(34, 1) ) == 1 : false , //隐藏上下课
                    jumpurl:TkUtils.getUrlParams("jumpurl") ,
                    roomname:ServiceRoom.getTkRoom().getRoomProperties().roomname ,
                    recordfilepath:ServiceRoom.getTkRoom().getRoomProperties().recordfilepath
                };
                TkConstant.bindRoomInfoToTkConstant(joinRoomInfo); //绑定房间信息到TkConstant
                TkConstant.bindParticipantHasRoleToTkConstant(); //绑定当前登录对象事是否拥有指定角色到TkConstant
                let roomInfo = {
                    userName: joinRoomInfo.nickname,
                    roomName: ServiceRoom.getTkRoom().getRoomProperties().roomname,
                    userThirdid: joinRoomInfo.thirdid,
                };
                if( initPlaybackInfoAterCallback &&  typeof initPlaybackInfoAterCallback === "function" ){
                    initPlaybackInfoAterCallback();
                }
                that.registerRoom(roomInfo, roomConnectedSuccessCallback);
            } );
        }
    };

    /*进入房间的方法*/
    joinRoom(){
        if(ServiceRoom.getTkRoom().getMySelf().role === TkConstant.role.roleStudent){
            WebAjaxInterface.getGiftInfo(ServiceRoom.getTkRoom().getMySelf().id); //获取教室礼物信息，当前登录者的礼物
        }
        ServiceRoom.getTkRoom().getMySelf().raisehand = false ; //是否举手-默认不举手
        ServiceRoom.getTkRoom().getMySelf().giftnumber = TkGlobal.participantGiftNumberJson[ServiceRoom.getTkRoom().getMySelf().id] || 0 ; //礼物的个数-默认0
        ServiceRoom.getTkRoom().getMySelf().candraw = CoreController.handler.getAppPermissions('canDraw')  || false; //是否可画-老师以及助教默认可画
        ServiceRoom.getTkRoom().getMySelf().disablevideo = false ; //视频设备是否禁用,默认不禁用
        ServiceRoom.getTkRoom().getMySelf().disableaudio = false ; //音频设备是否禁用
        ServiceRoom.getTkRoom().joinroom( ServiceRoom.getLocalStream() );
        //ServiceRoom.getTkRoom().joinroom( ServiceRoom.getLocalStream(),'192.168.1.57' ,'8889');
    };

    /*添加事件监听到Room*/
    addEventListenerToRoomHandler(){
        let that = this ;
        /**@description Room类-RoomEvent的相关事件**/
        for(let eventKey in TkConstant.EVENTTYPE.RoomEvent ){
            eventObjectDefine.Room.addEventListener(TkConstant.EVENTTYPE.RoomEvent[eventKey] , function (recvEventData) {
                if(that['handler'+TkUtils.replaceFirstUper(eventKey) ] && typeof  that['handler'+TkUtils.replaceFirstUper(eventKey) ]  === "function" ){
                    let isReturn =  that[ 'handler'+TkUtils.replaceFirstUper(eventKey) ](recvEventData);
                    if(isReturn){return;}; //是否直接return，不做后面的事件再次分发
                }
                eventObjectDefine.CoreController.dispatchEvent(recvEventData);
            });
        }

    };
    handlerRoomPubmsg(recvEventData){//处理room-pubmsg事件
        const that = this ;

        if(recvEventData.message && typeof recvEventData.message == "string") {
            recvEventData.message = JSON.parse(recvEventData.message);
        }
        if(recvEventData.message.data && typeof recvEventData.message.data == "string") {
            recvEventData.message.data = JSON.parse(recvEventData.message.data);
        }
        let pubmsgData = recvEventData.message ;
        if(!TkGlobal.serviceTime){
            TkGlobal.serviceTime = pubmsgData.ts * 1000;
            TkGlobal.remindServiceTime = pubmsgData.ts * 1000;
        }
        switch(pubmsgData.name) {
            case "ClassBegin": //上课
                TkGlobal.serviceTime = !TkUtils.isMillisecondClass( pubmsgData.ts ) ? pubmsgData.ts * 1000 :  pubmsgData.ts; //服务器时间
                TkGlobal.remindServiceTime = !TkUtils.isMillisecondClass( pubmsgData.ts )? pubmsgData.ts * 1000 :  pubmsgData.ts;//remind的服务器时间
                that._classBeginStartHandler(pubmsgData); //上课之后的处理函数
                break;
            case "UpdateTime": //更新服务器时间
                TkGlobal.serviceTime =  pubmsgData.ts * 1000; //服务器时间
                TkGlobal.remindServiceTime = pubmsgData.ts * 1000;//remind的服务器时间
                if(!TkGlobal.firstGetServiceTime && !TkGlobal.isHandleMsglist && TkGlobal.signallingMessageList  ){
                    TkGlobal.firstGetServiceTime = true;
                    eventObjectDefine.Room.dispatchEvent({type:TkConstant.EVENTTYPE.RoomEvent.roomMsglist, message:TkGlobal.signallingMessageList});
                    TkGlobal.signallingMessageList = null;
                    delete TkGlobal.signallingMessageList ;
                }
                break;
        }
    };
    handlerRoomDelmsg(recvEventData){//处理room-delmsg事件
        const that = this ;
        if(recvEventData.message && typeof recvEventData.message == "string") {
            recvEventData.message = JSON.parse(recvEventData.message);
        }
        if(recvEventData.message.data && typeof recvEventData.message.data == "string") {
            recvEventData.message.data = JSON.parse(recvEventData.message.data);
        }
        let delmsgData = recvEventData.message ;
        switch(delmsgData.name) {
            case "ClassBegin": //删除上课（也就是下课了）
                let isDispatchEvent_endClassbeginShowLocalStream = that._classBeginEndHandler(delmsgData); //下课之后的处理函数
                ServiceTooltip.showPrompt(TkGlobal.language.languageData.alertWin.login.register.eventListener.roomDelClassBegin.text , ()=>{
                    if(isDispatchEvent_endClassbeginShowLocalStream){
                        eventObjectDefine.CoreController.dispatchEvent({type:'endClassbeginShowLocalStream'}); //触发下课后显示本地视频
                    }
                });
                break;
        }
    };
    handlerRoomConnected(roomConnectedEventData){  //处理room-connected事件
        //获取角色默认权限
        const that = this ;
        TkGlobal.firstGetServiceTime = false;
        TkGlobal.isHandleMsglist = false;
        TkGlobal.appConnected = true ; //房间连接成功
        if(TkGlobal.isGetNetworkStatus){
            ServiceRoom.getTkRoom().startIntervalRtcStatsrObserverByStream( ServiceRoom.getLocalStream() ); //获取自己的网络状态，定时
        }
        if(ServiceRoom.getTkRoom().getMySelf().role === TkConstant.role.roleStudent){
            if(that.reconnectedNeedGetGiftInfo){
                WebAjaxInterface.getGiftInfo(ServiceRoom.getTkRoom().getMySelf().id); //获取教室礼物信息，当前登录者的礼物
                ServiceSignalling.setParticipantPropertyToAll(ServiceRoom.getTkRoom().getMySelf().id , {giftnumber:TkGlobal.participantGiftNumberJson[ServiceRoom.getTkRoom().getMySelf().id] || 0});
                that.reconnectedNeedGetGiftInfo = false ; //重连需要获取礼物
            }
        }
        let roleHasDefalutAppPermissionsJson =  RoleHandler.getRoleHasDefalutAppPermissions();
        TkAppPermissions.initAppPermissions(roleHasDefalutAppPermissionsJson);
        let signallingMessageList =  roomConnectedEventData.message ; //信令list数据
        TkGlobal.signallingMessageList = signallingMessageList ;
        let users = ServiceRoom.getTkRoom().getUsers() ;
        for(let key in users){
            let user = users[key];
           RoleHandler.checkRoleConflict(user , true) ;
        };
        if(!TkGlobal.firstGetServiceTime){ //没有获取第一次服务器时间
            ServiceSignalling.sendSignallingFromUpdateTime( ServiceRoom.getTkRoom().getMySelf().id );
        }
        if( ServiceRoom.getTkRoom().getMySelf().candraw !== CoreController.handler.getAppPermissions('canDraw') ){
            ServiceSignalling.setParticipantPropertyToAll( ServiceRoom.getTkRoom().getMySelf().id , {candraw:CoreController.handler.getAppPermissions('canDraw') } );
        }
    };
    handlerStreamRemoved(streamEventData){
        return this._againDispatchStreamEvent(streamEventData);
    };
    handlerStreamAdded(streamEventData){
        return  this._againDispatchStreamEvent(streamEventData);
    };
    handlerStreamSubscribed(streamEventData){
        return  this._againDispatchStreamEvent(streamEventData);
    };
    handlerStreamFailed(streamEventData){
        switch (streamEventData.stream.getAttributes().type){
            case 'video':
                let userid = streamEventData.stream.extensionId;
                ServiceSignalling.sendSignallingFromStreamFailure(userid);
                break;
        };
        return this._againDispatchStreamEvent(streamEventData);
    };
    handlerStreamData(streamEventData){
        return this._againDispatchStreamEvent(streamEventData);
    };
    handlerStreamAttributesUpdate(streamEventData){
        return this._againDispatchStreamEvent(streamEventData);
    };
    handlerStreamPublishFail(streamEventData){
        return this._againDispatchStreamEvent(streamEventData);
    };
    handlerStreamUnpublishFail(streamEventData){
        return this._againDispatchStreamEvent(streamEventData);
    };
    handlerRoomDisconnected(roomDisconnectedEventData){
        TkGlobal.appConnected = false;
        TkGlobal.classBegin = false;
        TkGlobal.serviceTime = undefined ;
        TkGlobal.remindServiceTime = undefined;
        //TkAppPermissions.resetDefaultAppPermissions(true); //恢复默认权限
    };
    handlerRoomParticipantJoin(roomParticipantJoinEventData){//处理room-participant_join 事件

    };
    handlerRoomUserpropertyChanged(roomUserpropertyChangedEventData){
        const changePropertyJson  = roomUserpropertyChangedEventData.message ;
        const user  = roomUserpropertyChangedEventData.user ;
        for( let [key , value] of Object.entries(changePropertyJson) ){
            if(user.id === ServiceRoom.getTkRoom().getMySelf().id){
                if( key === 'candraw' ){
                    TkAppPermissions.setAppPermissions('sendSignallingFromShowPage' , value);//发送ShowPage相关的信令权限
                    TkAppPermissions.setAppPermissions('sendSignallingFromH5ShowPage' , value);//发送H5文档的ShowPage相关数据权限
                    TkAppPermissions.setAppPermissions('sendSignallingFromDynamicPptShowPage' , value);//发送动态PPT的ShowPage相关数据权限
                    TkAppPermissions.setAppPermissions('sendSignallingFromGeneralShowPage' , value);//发送普通文档的ShowPage相关数据权限
                    TkAppPermissions.setAppPermissions('sendSignallingFromSharpsChange' , value);//发送白板数据相关的信令权限
                    TkAppPermissions.setAppPermissions('sendSignallingFromDynamicPptTriggerActionClick' , value);//发送动态PPT触发器NewPptTriggerActionClick相关的信令权限
                    TkAppPermissions.setAppPermissions('sendSignallingFromH5DocumentAction' , value);//发送h5文档相关动作的信令权限
                    TkAppPermissions.setAppPermissions('h5DocumentActionClick' , value);//h5课件点击动作的权限
                    TkAppPermissions.setAppPermissions('dynamicPptActionClick' , value);//动态PPT点击动作的权限
                    TkAppPermissions.setAppPermissions('publishDynamicPptMediaPermission_video' , value);//发布动态PPT视频的权限
                    TkAppPermissions.setAppPermissions('unpublishMediaStream' , value);//取消发布媒体文件流的权限
                    TkAppPermissions.setAppPermissions('publishMediaStream' , value);//发布媒体文件流的权限
                    TkAppPermissions.setAppPermissions('canDraw' , value);//画笔权限
                }
            }
            if(  key === 'giftnumber'){
                TkGlobal.participantGiftNumberJson[user.id] = 0 ;
            }
        }
    };
    handlerRoomFiles(roomFilesEventData){
        let filesArray = roomFilesEventData.message;
        let defaultFileInfo = undefined ;
        for(let fileInfo of filesArray){
            if(Number(fileInfo.type) === 1 &&   !(TkUtils.getFiletyeByFilesuffix(fileInfo.filetype) === 'mp4' ||   TkUtils.getFiletyeByFilesuffix(fileInfo.filetype) === 'mp3' )  ){
                defaultFileInfo = fileInfo ;
                break;
            }else if( !(TkUtils.getFiletyeByFilesuffix(fileInfo.filetype) === 'mp4' ||   TkUtils.getFiletyeByFilesuffix(fileInfo.filetype) === 'mp3' )  && !defaultFileInfo){
                defaultFileInfo = fileInfo ;
            }
        }
        TkGlobal.defaultFileInfo = defaultFileInfo || TkGlobal.defaultFileInfo;
    };
    handlerRoomMsglist(roomMsglistEventData){//处理room-msglist事件
        const that = this ;
        const _handlerRoomMsglist = (messageListData , ignoreSignallingJson) => { //room-msglist处理函数
            let tmpSignallingData =  {};
            for(let x in messageListData) {
                if(ignoreSignallingJson && ignoreSignallingJson[messageListData[x].name]){ //如果有忽略的信令，则跳出本次循环
                    continue;
                }
                if(messageListData[x].data && typeof messageListData[x].data == "string") {
                    messageListData[x].data = JSON.parse(messageListData[x].data);
                }
                if(messageListData[x].name == "SharpsChange") {
                    if(tmpSignallingData["SharpsChange"] == null || tmpSignallingData["SharpsChange"] == undefined) {
                        tmpSignallingData["SharpsChange"] = [];
                        tmpSignallingData["SharpsChange"].push(messageListData[x]);
                    } else {
                        tmpSignallingData["SharpsChange"].push(messageListData[x]);
                    }
                } else if(messageListData[x].name == "ShowPage") {
                    if(tmpSignallingData["ShowPage"] == null || tmpSignallingData["ShowPage"] == undefined) {
                        tmpSignallingData["ShowPage"] = [];
                        tmpSignallingData["ShowPage"].push(messageListData[x]);
                    } else {
                        tmpSignallingData["ShowPage"].push(messageListData[x]);
                    }
                }  else if(messageListData[x].name == "ClassBegin") {
                    if(tmpSignallingData["ClassBegin"] == null || tmpSignallingData["ClassBegin"] == undefined) {
                        tmpSignallingData["ClassBegin"] = [];
                        tmpSignallingData["ClassBegin"].push(messageListData[x]);
                    } else {
                        tmpSignallingData["ClassBegin"].push(messageListData[x]);
                    }
                }  else if(messageListData[x].name == "videoDraghandle") {
                    if(tmpSignallingData["videoDraghandle"] == null || tmpSignallingData["videoDraghandle"] == undefined) {
                        tmpSignallingData["videoDraghandle"] = [];
                        tmpSignallingData["videoDraghandle"].push(messageListData[x]);
                    } else {
                        tmpSignallingData["videoDraghandle"].push(messageListData[x]);
                    }
                }  else if(messageListData[x].name == "WBPageCount") {
                    if(tmpSignallingData["WBPageCount"] == null || tmpSignallingData["WBPageCount"] == undefined) {
                        tmpSignallingData["WBPageCount"] = [];
                        tmpSignallingData["WBPageCount"].push(messageListData[x]);
                    } else {
                        tmpSignallingData["WBPageCount"].push(messageListData[x]);
                    }
                } else if (/outIframe/.test(messageListData[x].name)) {
                    eventObjectDefine.CoreController.dispatchEvent({type:'outIframe-msglist' , message:{signallingData:messageListData[x]}}) ;
                }
            };

            /*上课数据*/
            let classBeginArr = tmpSignallingData["ClassBegin"];
            if(classBeginArr != null && classBeginArr != undefined && classBeginArr.length > 0) {
                if(classBeginArr[classBeginArr.length - 1].name == "ClassBegin") {
                    that._classBeginStartHandler(classBeginArr[classBeginArr.length - 1]);
                    eventObjectDefine.CoreController.dispatchEvent({
                        type:'receive-msglist-ClassBegin' ,
                        source:'room-msglist' ,
                        message:classBeginArr[classBeginArr.length - 1]
                    });
                }
            }else{
                eventObjectDefine.CoreController.dispatchEvent({
                    type:'receive-msglist-not-ClassBegin' ,
                    source:'room-msglist' ,
                    message:{}
                });
                if(TkConstant.joinRoomInfo.autoClassBegin && TkConstant.hasRole.roleChairman && TkAppPermissions.getAppPermissions('autoClassBegin') ){
                    if(!TkGlobal.classBegin){
                        if(TkConstant.joinRoomInfo.hiddenClassBegin){ //隐藏上下课按钮
                            if( !TkAppPermissions.getAppPermissions('hiddenClassBeginAutoClassBegin') ){ return ; } ;
                            WebAjaxInterface.roomStart(); //发送上课信令
                        }else{
                            if( !TkAppPermissions.getAppPermissions('startClassBegin') ){ return ; } ;
                            WebAjaxInterface.roomStart(); //发送上课信令
                        }
                    }
                }
            }
            tmpSignallingData["ClassBegin"] = null;

            /*拖拽的动作*/
            let videoDragArr = tmpSignallingData["videoDraghandle"];
            if(videoDragArr != null && videoDragArr != undefined && videoDragArr.length > 0) {
                TkGlobal.videoDragArray = videoDragArr;
                //eventObjectDefine.CoreController.dispatchEvent({type:'video-drag-data' , message:{ videoDragArray:videoDragArr } });
            }
            tmpSignallingData["videoDraghandle"] = null;


            /*画笔数据*/
            let sharpsChangeArr = tmpSignallingData["SharpsChange"];
            if(sharpsChangeArr != null && sharpsChangeArr != undefined && sharpsChangeArr.length > 0) {
                eventObjectDefine.CoreController.dispatchEvent({type:'save-lc-waiting-process-data' , message:{ sharpsChangeArray:sharpsChangeArr } });
            }
            tmpSignallingData["SharpsChange"] = null;

            /*加页数据*/
            let wBPageCountArr = tmpSignallingData["WBPageCount"];
            if(wBPageCountArr != null && wBPageCountArr != undefined && wBPageCountArr.length > 0) {
                if(wBPageCountArr[wBPageCountArr.length - 1].name == "WBPageCount") {
                    eventObjectDefine.CoreController.dispatchEvent({
                        type:'receive-msglist-WBPageCount' ,
                        source:'room-msglist' ,
                        message:wBPageCountArr[wBPageCountArr.length - 1]
                    });
                }
            }
            tmpSignallingData["WBPageCount"] = null;


            //最后打开的文档文件和媒体文件
            let lastDoucmentFileData = null,
                lastMediaFileData = null;
            let showPageArr = tmpSignallingData["ShowPage"];
            if(showPageArr != null && showPageArr != undefined && showPageArr.length > 0) {
                for(let i = 0; i < showPageArr.length; i++) {
                    if(!showPageArr[i].data.isMedia) {
                        lastDoucmentFileData = showPageArr[i];
                    }
                }
            };
            tmpSignallingData["ShowPage"] = null;


            //打开文件列表中的一个
            if(lastDoucmentFileData != undefined && lastDoucmentFileData != null) {
                L.Logger.info('receive-msglist-ShowPage-lastDocument info:' , lastDoucmentFileData );
                eventObjectDefine.CoreController.dispatchEvent({type:'receive-msglist-ShowPage-lastDocument' , message:{data:lastDoucmentFileData.data  , source:'room-msglist' } });
            } else {
                L.Logger.info('openDefaultDoucmentFile info:' , TkGlobal.defaultFileInfo );
                let fileid = TkGlobal.defaultFileInfo.fileid ;
                eventObjectDefine.CoreController.dispatchEvent({type:'openDefaultDoucmentFile' , message:{fileid:fileid} }); //打开缺省文档
            }

        };
        let messageListData = roomMsglistEventData.message ;
        let ignoreSignallingJson = {} ;
        _handlerRoomMsglist(messageListData , ignoreSignallingJson);
        TkGlobal.isHandleMsglist = true;
    } ;
    handlerRoomParticipantEvicted(roomParticipantEvictedEventData){
        TkAppPermissions.resetDefaultAppPermissions(true);
        ServiceTooltip.showPrompt(TkGlobal.language.languageData.alertWin.login.register.eventListener.participantEvicted.roleConflict.text);
    };
    handlerRoomTextMessage(roomTextMessageEventData){
        if( roomTextMessageEventData && roomTextMessageEventData.message && typeof roomTextMessageEventData.message === 'string' ){
            roomTextMessageEventData.message = JSON.parse(roomTextMessageEventData.message);
        }
    };
    handlerRroomLeaveroom(rroomLeaveroomEventData){

    };
    handlerRoomParticipantLeave(roomParticipantLeaveEventData){
        //todo 老师和学生进入课堂上课开始上课，然后老师退出课堂，如果5分钟之后老师还没有进来，这个课堂就结束；提示和老师点击下课的提示一样
    };
    handlerRoomReconnected(roomReconnectedEventData){
        const that = this ;
        if(ServiceRoom.getTkRoom().getMySelf().role === TkConstant.role.roleStudent){
            that.reconnectedNeedGetGiftInfo = true ; //重连需要获取礼物
        }
    };
    /*自动发布音视频*/
    _autoPublishAV(){
        if( (TkConstant.joinRoomInfo.autoStartAV || TkConstant.hasRole.roleChairman ) &&  TkAppPermissions.getAppPermissions('autoPublishAV')  ) {
            let localUser = ServiceRoom.getTkRoom().getMySelf() ;
            let publishstate = localUser.hasvideo ? (localUser.hasaudio ? TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH : TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY ): ( localUser.hasaudio ? TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY  : TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE   ) ;//自动发布
            ServiceSignalling.changeUserPublish(localUser.id , publishstate);
        }
    };
    /*保存登录地址到sessionStorage*/
    _saveAddressToSession(timestamp){
        if( TkConstant.joinRoomInfo &&  TkConstant.joinRoomInfo.thirdid  ){
            //将地址存入本地session,time为key值
            let time = timestamp ||  TkUtils.getUrlParams('timestamp' , window.location.href );
            let joinUrl = TkUtils.decrypt( TkConstant.joinRoomInfo.joinUrl ) ;
            let refresh_thirdid_index = joinUrl.indexOf('&refresh_thirdid') ;
            if( refresh_thirdid_index !== -1 ){
                joinUrl = joinUrl.substring(0 , refresh_thirdid_index);
            }
            joinUrl += ('&refresh_thirdid='+TkConstant.joinRoomInfo.thirdid) ;
            //window.sessionStorage.setItem("thirdid",TkConstant.joinRoomInfo.thirdid);
            window.sessionStorage.setItem(time, TkUtils.encrypt(joinUrl) );
        }
    };
    /*处理数据流再次细分分发，根据数据流type*/
    _againDispatchStreamEvent(streamEventData){
        let stream = streamEventData.stream ;
        if(!stream){ return ; } ;
        let changeEventData =  Object.assign( {} ,  streamEventData)  ;
        let attributes = stream.getAttributes() ;
        if(!attributes){L.Logger.error('_againDispatchStreamEvent:stream attributes is not exist!'); return ; } ;
        changeEventData.type = changeEventData.type + "_"+ attributes.type ;
        eventObjectDefine.CoreController.dispatchEvent( changeEventData  );
        let isReturn  = true ; //是否直接return
        return isReturn;
    };
    /*上课之后的处理函数*/
    _classBeginStartHandler(classbeginInfo){
        const that = this ;
        TkGlobal.classBeginTime = !TkUtils.isMillisecondClass( classbeginInfo.ts ) ? classbeginInfo.ts * 1000 : classbeginInfo.ts ; //上课的时间
        TkGlobal.classBegin = true ;//已经上课
        let roleHasDefalutAppPermissionsJson =  RoleHandler.getRoleHasDefalutAppPermissions();
        TkAppPermissions.initAppPermissions(roleHasDefalutAppPermissionsJson);
        if(TkGlobal.isBroadcastClient){
        	if(TkConstant.hasRole.roleChairman){    
        		ServiceRoom.getTkRoom().startBroadcast();
        	}
        }else{
        	that._autoPublishAV();  //自动发布音视频
        }

    };
    /*下课之后的处理函数*/
    _classBeginEndHandler(classbeginInfo){
        let isDispatchEvent_endClassbeginShowLocalStream = false ;
        if( TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleStudent   ){
            if( ServiceRoom.getTkRoom().getMySelf().publishstate !== TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE){
                ServiceSignalling.changeUserPublish(ServiceRoom.getTkRoom().getMySelf().id , TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE);
            }
        }
        TkGlobal.classBegin = false; //下课状态
        TkGlobal.endClassBegin = true ; //已经下课
        let roleHasDefalutAppPermissionsJson =  RoleHandler.getRoleHasDefalutAppPermissions();
        TkAppPermissions.initAppPermissions(roleHasDefalutAppPermissionsJson);
        if(TkGlobal.isBroadcastClient){
        	if(TkConstant.hasRole.roleChairman){
        		ServiceRoom.getTkRoom().stopBroadcast();
        	}
        }
        if(  TkConstant.joinRoomInfo.hiddenClassBegin ||  !TkConstant.hasRole.roleChairman ){ //隐藏上下课或者不是老师就离开教室，否则恢复页面能再次上课
            ServiceRoom.getTkRoom().leaveroom(true);
            isDispatchEvent_endClassbeginShowLocalStream = false ;
        }else{
            ServiceTools.unpublishAllMediaStream();
            ServiceSignalling.delmsgTo__AllAll();//清除所有信令消息
            eventObjectDefine.CoreController.dispatchEvent({type:'revertToStartupLayout'}); //触发恢复原始界面的事件
            isDispatchEvent_endClassbeginShowLocalStream = true ;
        }
        return isDispatchEvent_endClassbeginShowLocalStream ;
    };
};
const  RoomHandlerInstance = new RoomHandler() ;
RoomHandlerInstance.addEventListenerToRoomHandler();
export default RoomHandlerInstance ;